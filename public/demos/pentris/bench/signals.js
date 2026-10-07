// signals.js — the bridge between the real firmware and the instruments.
//
// One rule governs this file: nothing is synthesised. The LCD texture is the
// firmware's framebuffer, the scope samples are the firmware's DAC writes, the
// LED state is the firmware's GPIO, the tick rate is the period the firmware
// asked TIMG12 for. When the firmware is silent (the music streaming layer is
// still a stub) the instruments show silence, because that is what is true.
//
// The loop is the same accumulator scheme as index.html: video from rAF,
// audio never derived from frame timing — DAC samples go to an AudioWorklet
// that plays them at the DAC rate regardless of what rendering is doing.

import PentrisModule from '../dist/pentris.js';
import { FIRMWARE } from './board-data.js';

const AUDIO_PULL_MAX = 4096;   // floats per drain, matches hal ring headroom
const SCOPE_KEEP = 2048;       // rolling window the scope draws from

export async function initSignals() {
  const Module = await PentrisModule();

  const W = Module._pentris_fb_width();
  const H = Module._pentris_fb_height();

  const s = {
    Module, W, H,
    // firmware's own requested tick rate against its 80 MHz clock
    hz: 80e6 / Module._pentris_tick_period(),

    // -- input state (12-bit ADC counts; centre is where the stick rests) --
    joyX: FIRMWARE.adcCentre, joyY: FIRMWARE.adcCentre,
    click: 1,                  // active low
    switches: 0,               // bit4 UP, bit3 LEFT, bit2 DOWN, bit1 dead, bit0 BTN1
    _keyHeld: new Set(),
    _pointerSwitches: 0,
    _pointerJoy: null,         // {x, y} in ADC counts while dragging, else null

    // -- outputs the scene reads --
    rgba: new Uint8Array(W * H * 4),
    fbDirtyForScene: true,     // set when rgba changed this frame
    led: 0,
    score: 0,
    gameOver: false,

    // rolling DAC sample window + measured production rate
    scope: new Float32Array(SCOPE_KEEP).fill(-1), // code 0 = ladder at 0 V
    scopeLen: 0,               // total samples ever seen (0 -> "no signal yet")
    measuredRate: 0,
    _ratePulls: 0, _rateSamples: 0, _rateT0: performance.now(),

    // audio sink
    _ctx: null, _worklet: null, _audioReady: false,

    _acc: 0, _last: performance.now(),
    _bootT0: performance.now(),
    _userTouched: false, _autoStarted: false,
  };

  convertFB(s);      // present the boot frame the firmware already drew
  bindKeys(s);
  return s;
}

// ---------------------------------------------------------------- input

const KEYMAP = {
  ' ': { sw: 1 << 0 },        // SW5 BTN1
  w: { sw: 1 << 4 }, W: { sw: 1 << 4 },   // SW1 UP
  a: { sw: 1 << 3 }, A: { sw: 1 << 3 },   // SW2 LEFT
  s: { sw: 1 << 2 }, S: { sw: 1 << 2 },   // SW3 DOWN
  // SW4 RIGHT is real on the board and dead in the firmware (PA25/ADC conflict).
  // Pressing D animates the physical button; Switch.cpp masks the bit. Truth.
  d: { sw: 1 << 1 }, D: { sw: 1 << 1 },
};

function bindKeys(s) {
  const gameKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'z', 'Z', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D']);
  addEventListener('keydown', (e) => {
    if (e.repeat) { if (gameKeys.has(e.key)) e.preventDefault(); return; }
    if (gameKeys.has(e.key)) { s._keyHeld.add(e.key); s._userTouched = true; e.preventDefault(); }
    ensureAudio(s);
  });
  addEventListener('keyup', (e) => s._keyHeld.delete(e.key));
  addEventListener('blur', () => s._keyHeld.clear());
}

function currentInput(s) {
  const k = s._keyHeld;
  // Firmware truth (Joystick sampling in the TIMG12 ISR): pushing the stick
  // LEFT reads HIGH on JoyX — so ArrowLeft sends the high count.
  let x = k.has('ArrowLeft') ? FIRMWARE.adcHigh : k.has('ArrowRight') ? FIRMWARE.adcLow : FIRMWARE.adcCentre;
  let y = k.has('ArrowUp') ? FIRMWARE.adcHigh : k.has('ArrowDown') ? FIRMWARE.adcLow : FIRMWARE.adcCentre;
  if (s._pointerJoy) { x = s._pointerJoy.x; y = s._pointerJoy.y; }
  const click = (k.has('z') || k.has('Z')) ? 0 : 1;
  let sw = s._pointerSwitches;
  for (const key of k) { const m = KEYMAP[key]; if (m) sw |= m.sw; }
  return { x, y, click, sw };
}

// ---------------------------------------------------------------- audio sink

async function ensureAudio(s) {
  if (s._ctx) {
    // resume() only completes inside a user gesture; try again on each one
    if (s._ctx.state === 'suspended') s._ctx.resume().catch(() => {});
    return;
  }
  try {
    s._ctx = new AudioContext();
    await s._ctx.audioWorklet.addModule('./bench/pentris-audio.worklet.js');
    s._worklet = new AudioWorkletNode(s._ctx, 'pentris-dac', {
      numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [1],
      processorOptions: { srcRate: FIRMWARE.dacRateHz },
    });
    const gain = s._ctx.createGain();
    gain.gain.value = 0.5;
    s._worklet.connect(gain).connect(s._ctx.destination);
    s._audioReady = true;               // the sink exists; samples flow now
    if (s._ctx.state === 'suspended') s._ctx.resume().catch(() => {});
  } catch (err) {
    console.warn('audio sink unavailable:', err);
  }
}

// ---------------------------------------------------------------- framebuffer

function convertFB(s) {
  const { Module, W, H } = s;
  const fbPtr = Module._pentris_framebuffer();
  const fb = Module.HEAPU16.subarray(fbPtr >> 1, (fbPtr >> 1) + W * H);
  const d = s.rgba;
  for (let i = 0, j = 0; i < fb.length; i++, j += 4) {
    const c = fb[i];
    d[j] = ((c >> 11) & 0x1f) * 255 / 31;
    d[j + 1] = ((c >> 5) & 0x3f) * 255 / 63;
    d[j + 2] = (c & 0x1f) * 255 / 31;
    d[j + 3] = 255;
  }
  s.fbDirtyForScene = true;
}

// ---------------------------------------------------------------- per-frame

export function stepSignals(s, now) {
  const { Module } = s;

  // -- input registers refresh every frame; the firmware's own ISR samples
  //    them at its own cadence. The tick call is a dueness-gated service pass
  //    (the self-running loop paces itself; extra calls never double-step). --
  const inp = currentInput(s);
  Module._pentris_set_input(inp.x, inp.y, inp.click, inp.sw);
  s._acc += now - s._last;
  s._last = now;
  const step = 1000 / s.hz;
  let guard = 0;
  while (s._acc >= step && guard++ < 8) {
    Module._pentris_tick();
    s._acc -= step;
  }
  if (guard >= 8) s._acc = 0;   // tab was backgrounded; drop time, don't spiral

  if (Module._pentris_fb_dirty()) convertFB(s);

  // -- drain the DAC ring: scope window + audio sink get the same samples --
  const audioPtr = s._audioPtr || (s._audioPtr = Module._malloc(AUDIO_PULL_MAX * 4));
  const got = Module._pentris_audio_pull(audioPtr, AUDIO_PULL_MAX);
  if (got > 0) {
    const samples = Module.HEAPF32.subarray(audioPtr >> 2, (audioPtr >> 2) + got);
    if (got >= s.scope.length) {
      s.scope.set(samples.subarray(got - s.scope.length));
    } else {
      s.scope.copyWithin(0, got);
      s.scope.set(samples, s.scope.length - got);
    }
    s.scopeLen += got;
    if (s._audioReady) s._worklet.port.postMessage(
      { samples: Float32Array.from(samples) },
    );
    s._rateSamples += got;
  }
  // measured production rate, updated every ~2 s; no rate is invented
  if (now - s._rateT0 > 2000) {
    s.measuredRate = s._rateSamples / ((now - s._rateT0) / 1000);
    s._rateSamples = 0;
    s._rateT0 = now;
  }

  s.led = Module._pentris_led();
  s.score = Module._pentris_score();
  s.gameOver = !!Module._pentris_gameover();

  // The real Lab9HMain loop self-runs and parks on its title screen. When
  // nobody is at the bench, press the real buttons for it — _pentris_boot()
  // scripts SW3×4 · stick-down ×2 · BTN1 through the same ISR input path a
  // finger would hit. Once at idle to start a game, and again a few seconds
  // after each GAME OVER overlay (the firmware itself waits for a switch).
  if (!s._userTouched && !s._autoStarted && now - s._bootT0 > 6000) {
    Module._pentris_boot();
    s._autoStarted = true;
  }
  if (s.gameOver) {
    if (!s._overSince) s._overSince = now;
    if (now - s._overSince > 4000) {
      Module._pentris_boot();
      s._overSince = 0;
    }
  } else {
    s._overSince = 0;
  }

  s.joyX = inp.x; s.joyY = inp.y; s.click = inp.click; s.switches = inp.sw;
}

export { ensureAudio };
