// instruments.js — the room around the device: scopes, laptop, iron, bench.
//
// Instrument READOUTS are governed by the no-mockup rule: scope 1 draws only
// samples that came out of _pentris_audio_pull, scope 2 is powered but has no
// probe connected (a flat baseline is what an unprobed channel truly shows),
// and the laptop renders the actual text of Game.cpp inside a CCS window whose
// project tree, target and linker numbers come from the real ECE319K_Lab9H
// build (Debug/ECE319K_Lab9H.map). The furniture itself is scenery and is
// allowed to just look right.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { FIRMWARE } from './board-data.js';

const CASE_GRAY = new THREE.MeshStandardMaterial({ color: 0xd2cfc6, roughness: 0.42, metalness: 0.05 });
const DARK = new THREE.MeshStandardMaterial({ color: 0x24262a, roughness: 0.55 });

function box(w, h, d, mat, cast = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
}
function rbox(w, h, d, r, mat, cast = true) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, r), mat);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
}
function cyl(r, h, mat, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
  m.castShadow = true;
  return m;
}
function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), c);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
// a plain (non-color) canvas texture, for roughness maps
function dataCanvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), c);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}
function glassOverlay(w, h) {
  // thin glossy pane that catches the softbox — used over every screen
  return new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshPhysicalMaterial({
      color: 0x000000, roughness: 0.05, metalness: 0.9,
      transparent: true, opacity: 0.13, envMapIntensity: 1.8, depthWrite: false,
    }),
  );
}

// ================================================================ oscilloscope
// Bench scope in the sketch's proportions: screen on the left, knob field on
// the right, a row of soft keys under the screen, BNCs at the bottom.
export class Scope {
  constructor({ traceColor = '#ff4a30', title = 'CH1' } = {}) {
    this.traceColor = traceColor;
    this.title = title;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 560; this.canvas.height = 400;
    this.g = this.canvas.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 8;

    const W = 0.36, H = 0.16, D = 0.24;
    const g = new THREE.Group();
    const body = rbox(W, H, D, 0.008, CASE_GRAY);
    body.position.y = H / 2 + 0.008;
    g.add(body);
    // rubber feet + carry handle
    for (const [x, z] of [[-W / 2 + 0.03, D / 2 - 0.02], [W / 2 - 0.03, D / 2 - 0.02], [-W / 2 + 0.03, -D / 2 + 0.02], [W / 2 - 0.03, -D / 2 + 0.02]]) {
      const f = cyl(0.009, 0.016, DARK, 14);
      f.position.set(x, 0.008, z);
      g.add(f);
    }
    const handle = rbox(W * 0.55, 0.014, 0.032, 0.005, CASE_GRAY);
    handle.position.set(0, H + 0.02, -0.02);
    const hL = rbox(0.014, 0.034, 0.032, 0.004, CASE_GRAY);
    hL.position.set(-W * 0.275, H + 0.004, -0.02);
    const hR = hL.clone(); hR.position.x = W * 0.275;
    g.add(handle, hL, hR);

    // front panel sits proud of the body, slightly darker than the case
    const face = rbox(W - 0.006, H - 0.010, 0.007, 0.003,
      new THREE.MeshStandardMaterial({ color: 0xbfbcb2, roughness: 0.5 }));
    face.position.set(0, H / 2 + 0.008, D / 2 + 0.003);
    g.add(face);

    // model strip over the knob field (furniture text, not a readout)
    const strip = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.012),
      new THREE.MeshBasicMaterial({
        map: canvasTexture(1024, 76, (c) => {
          c.fillStyle = '#a9a69c'; c.fillRect(0, 0, 1024, 76);
          c.fillStyle = '#3c3e42'; c.font = '600 34px "Segoe UI", sans-serif';
          c.fillText('DIGITAL STORAGE OSCILLOSCOPE', 14, 50);
          c.font = '600 30px "Segoe UI", sans-serif';
          c.textAlign = 'right';
          c.fillText('50 MHz · 1 GS/s', 1010, 49);
        }),
      }),
    );
    strip.position.set(W / 2 - 0.09, H - 0.0075, D / 2 + 0.0072);
    g.add(strip);

    // screen — emissive so the phosphor reads at bench distance
    this.screenMat = new THREE.MeshBasicMaterial({ map: this.tex });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.155, 0.11), this.screenMat);
    screen.position.set(-W / 2 + 0.095, H / 2 + 0.012, D / 2 + 0.0085);
    g.add(screen);
    const glass = glassOverlay(0.155, 0.11);
    glass.position.copy(screen.position);
    glass.position.z += 0.0004;
    glass.renderOrder = 4;
    g.add(glass);
    const bezel = rbox(0.172, 0.127, 0.005, 0.002, DARK);
    bezel.position.set(-W / 2 + 0.095, H / 2 + 0.012, D / 2 + 0.005);
    g.add(bezel);

    // soft keys under the screen
    for (let i = 0; i < 5; i++) {
      const k = rbox(0.02, 0.011, 0.007, 0.0025,
        new THREE.MeshStandardMaterial({ color: 0xb2afa6, roughness: 0.45 }));
      k.position.set(-W / 2 + 0.038 + i * 0.028, 0.028, D / 2 + 0.0075);
      g.add(k);
    }
    // knob field — knurled cylinders with pointer marks
    const knob = (r, x, y, dark = false) => {
      const body = cyl(r, 0.016, dark ? DARK : new THREE.MeshStandardMaterial({ color: 0x9e9a90, roughness: 0.35, metalness: 0.15 }), 28);
      body.rotation.x = Math.PI / 2;
      body.position.set(x, y, D / 2 + 0.011);
      const skirt = cyl(r * 1.22, 0.004, new THREE.MeshStandardMaterial({ color: 0x77746c, roughness: 0.5 }), 28);
      skirt.rotation.x = Math.PI / 2;
      skirt.position.set(x, y, D / 2 + 0.0055);
      const dot = box(0.0016, r * 1.05, 0.0018, new THREE.MeshStandardMaterial({ color: 0xf2f0ea }));
      dot.position.set(x, y + r * 0.45, D / 2 + 0.0195);
      g.add(body, skirt, dot);
    };
    knob(0.016, W / 2 - 0.055, H - 0.045);
    knob(0.016, W / 2 - 0.115, H - 0.045);
    knob(0.011, W / 2 - 0.055, H - 0.095, true);
    knob(0.011, W / 2 - 0.115, H - 0.095, true);
    knob(0.011, W / 2 - 0.085, 0.033, true);

    // BNC inputs, with the classic channel color rings (CH1 yellow, CH2 blue)
    this.bnc = new THREE.Object3D();
    this.bnc.position.set(-W / 2 + 0.045, 0.030, D / 2 + 0.012);
    const chColors = [0xd8b23a, 0x4a7fd4];
    [0, 0.032].forEach((dx, i) => {
      const ring = cyl(0.0085, 0.0022, new THREE.MeshStandardMaterial({ color: chColors[i], roughness: 0.6 }), 20);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(this.bnc.position.x + dx, 0.030, D / 2 + 0.006);
      const barrel = cyl(0.0065, 0.016, STEELISH(), 18);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(this.bnc.position.x + dx, 0.030, D / 2 + 0.012);
      const pin = cyl(0.0018, 0.019, new THREE.MeshStandardMaterial({ color: 0xd7c27a, roughness: 0.3, metalness: 0.9 }), 10);
      pin.rotation.x = Math.PI / 2;
      pin.position.set(this.bnc.position.x + dx, 0.030, D / 2 + 0.0125);
      g.add(ring, barrel, pin);
    });
    g.add(this.bnc);

    // power button with a lit dot — the instrument is on
    const pwr = cyl(0.005, 0.006, DARK, 14);
    pwr.rotation.x = Math.PI / 2;
    pwr.position.set(W / 2 - 0.028, 0.026, D / 2 + 0.0075);
    const pwrLed = new THREE.Mesh(
      new THREE.CircleGeometry(0.0016, 10),
      new THREE.MeshBasicMaterial({ color: 0x7dff9a }),
    );
    pwrLed.position.set(W / 2 - 0.028, 0.036, D / 2 + 0.0076);
    g.add(pwr, pwrLed);

    this.group = g;
  }

  // samples: Float32Array window of real DAC pulls, [-1,1], quantised to
  // FIRMWARE.dacBits by hal.cpp (12 bits: the internal DAC0 on PA15).
  draw(samples, totalSeen, measuredRate, extraNote) {
    const { g, canvas } = this;
    const w = canvas.width, h = canvas.height;
    g.fillStyle = '#061009';
    g.fillRect(0, 0, w, h);

    // graticule with center-axis tick marks, like a real DSO
    g.strokeStyle = 'rgba(90,160,110,0.20)';
    g.lineWidth = 1;
    for (let i = 1; i < 10; i++) {
      g.beginPath(); g.moveTo((w / 10) * i, 0); g.lineTo((w / 10) * i, h); g.stroke();
    }
    for (let i = 1; i < 8; i++) {
      g.beginPath(); g.moveTo(0, (h / 8) * i); g.lineTo(w, (h / 8) * i); g.stroke();
    }
    g.strokeStyle = 'rgba(90,160,110,0.45)';
    g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke();
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
    g.strokeStyle = 'rgba(120,190,140,0.5)';
    for (let i = 1; i < 50; i++) {
      const x = (w / 50) * i, y = (h / 40) * i;
      g.beginPath(); g.moveTo(x, h / 2 - 3); g.lineTo(x, h / 2 + 3); g.stroke();
      if (i < 40) { g.beginPath(); g.moveTo(w / 2 - 3, y); g.lineTo(w / 2 + 3, y); g.stroke(); }
    }

    const top = 26, bot = h - 30;
    const yOf = (v) => bot - ((v + 1) / 2) * (bot - top);

    if (samples) {
      // Staircase, because a DAC register holds its level between writes. At 12
      // bits the steps are far below one pixel, so this now reads as a smooth
      // trace and that is correct: the visible 32-level staircase this drew
      // before was the signature of a converter the firmware does not use.
      const N = 512;
      const win = samples.subarray(samples.length - N);
      const dx = w / N;
      const paint = (lw, alpha) => {
        g.strokeStyle = this.traceColor;
        g.globalAlpha = alpha;
        g.lineWidth = lw;
        g.beginPath();
        let y = yOf(win[0]);
        g.moveTo(0, y);
        for (let i = 1; i < N; i++) {
          const ny = yOf(win[i]);
          if (ny !== y) { g.lineTo(i * dx, y); g.lineTo(i * dx, ny); y = ny; }
        }
        g.lineTo(w, y);
        g.stroke();
        g.globalAlpha = 1;
      };
      paint(7, 0.16);   // phosphor bloom
      paint(2.2, 1);
    }

    // honest annotations only
    g.fillStyle = '#cfe8d4';
    g.font = '600 24px ui-monospace, Consolas, monospace';
    g.fillText(this.title, 14, 28);
    g.font = '18px ui-monospace, Consolas, monospace';
    g.fillStyle = 'rgba(200,230,205,0.8)';
    if (measuredRate !== undefined) {
      const rate = measuredRate >= 100 ? `${(measuredRate / 1000).toFixed(2)} kSa/s` : `${Math.round(measuredRate)} Sa/s`;
      const levels = 1 << FIRMWARE.dacBits;
      g.fillText(`${FIRMWARE.dacBits}-bit ${FIRMWARE.dacLabel} · ${levels} levels · ${rate}`, 14, h - 14);
    }
    if (extraNote) {
      g.fillStyle = 'rgba(255,220,150,0.9)';
      g.fillText(extraNote, 14, 54);
    }
    this.tex.needsUpdate = true;
  }
}

function STEELISH() {
  return new THREE.MeshStandardMaterial({ color: 0xb0b4ba, roughness: 0.3, metalness: 0.9 });
}

// =============================================================== probe cable
// A scope probe from the BNC to a point on the board, hanging like a cable.
export function probeCable(fromWorld, toWorld) {
  // sag onto the bench, swing wide left, and come at the board edge-on so the
  // cable never crosses the hero's face
  const mid1 = fromWorld.clone().lerp(toWorld, 0.3);
  mid1.y = Math.min(fromWorld.y, toWorld.y) - 0.05;
  const mid2 = toWorld.clone().add(new THREE.Vector3(-0.11, -0.045, 0.05));
  const lead = toWorld.clone().add(new THREE.Vector3(-0.028, -0.006, 0.010));
  const curve = new THREE.CatmullRomCurve3([fromWorld, mid1, mid2, lead, toWorld]);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 72, 0.0018, 10),
    new THREE.MeshStandardMaterial({ color: 0x2e3033, roughness: 0.7 }),
  );
  cable.castShadow = true;
  const g = new THREE.Group();
  g.add(cable);
  // probe body at the board end, pointing along the cable's final direction
  const dir = toWorld.clone().sub(curve.getPoint(0.9)).normalize();
  const probe = new THREE.Mesh(new THREE.CylinderGeometry(0.0032, 0.0022, 0.045, 12), new THREE.MeshStandardMaterial({ color: 0x1a1c1e, roughness: 0.5 }));
  probe.position.copy(toWorld.clone().sub(dir.clone().multiplyScalar(0.026)));
  probe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  probe.castShadow = true;
  g.add(probe);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.0006, 0.0006, 0.012, 6), STEELISH());
  tip.position.copy(toWorld.clone().sub(dir.clone().multiplyScalar(0.004)));
  tip.quaternion.copy(probe.quaternion);
  g.add(tip);
  return g;
}

// ==================================================================== laptop
// A dev laptop running Code Composer Studio with the real ECE319K_Lab9H
// project open. Everything listed in the window is real: the explorer tree is
// the project's actual directory listing, the editor scrolls the actual
// Game.cpp text, and the console memory numbers are from the real linker map
// (FLASH 0x183b0 of 0x20000, SRAM 0x55e6 of 0x8000).
const CCS_TREE = [
  ['▸ .settings/', 0], ['▸ Debug/', 0], ['▸ designdocuments/', 0],
  ['▸ files/', 0], ['▸ images/', 0], ['▸ sounds/', 0], ['▸ sounds_act/', 0],
  ['▸ targetConfigs/', 0], ['▸ ticlang/', 0],
  ['Game.cpp', 2], ['Game.h', 1], ['Joystick.cpp', 1], ['Joystick.h', 1],
  ['Lab9HMain.cpp', 1], ['LED.cpp', 1], ['LED.h', 1], ['mspm0g3507.cmd', 1],
  ['README.html', 1], ['SmallFont.cpp', 1], ['SmallFont.h', 1],
  ['Sound.cpp', 1], ['Sound.h', 1], ['Switch.cpp', 1], ['Switch.h', 1],
];
const CCS_CONSOLE = [
  ['**** Build of configuration Debug for project ECE319K_Lab9H ****', '#c8ccd4'],
  ['Building file: ../Game.cpp', '#8b93a2'],
  ['Finished building target: ECE319K_Lab9H.out', '#8b93a2'],
  ['', ''],
  ['Build Finished. 0 errors, 0 warnings.', '#7fd88f'],
  ['FLASH: 99248 / 131072 bytes (75.7%)   SRAM: 21990 / 32768 bytes (67.1%)', '#d8c26a'],
];

export class Laptop {
  constructor(codeText, fileName) {
    this.lines = codeText.split('\n');
    this.fileName = fileName;
    this.offset = 0;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 1280; this.canvas.height = 800;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 8;

    const g = new THREE.Group();
    const baseW = 0.31, baseD = 0.215;
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2b2e33, roughness: 0.4, metalness: 0.55 });
    const base = rbox(baseW, 0.012, baseD, 0.004, bodyMat);
    base.position.y = 0.006;
    g.add(base);
    for (const [x, z] of [[-baseW / 2 + 0.02, baseD / 2 - 0.015], [baseW / 2 - 0.02, baseD / 2 - 0.015], [-baseW / 2 + 0.02, -baseD / 2 + 0.015], [baseW / 2 - 0.02, -baseD / 2 + 0.015]]) {
      const f = cyl(0.004, 0.003, DARK, 10);
      f.position.set(x, 0.0015, z);
      g.add(f);
    }
    const kb = new THREE.Mesh(
      new THREE.PlaneGeometry(baseW - 0.02, baseD - 0.05),
      new THREE.MeshStandardMaterial({
        map: canvasTexture(1024, 680, (c, cv) => {
          c.fillStyle = '#25272b'; c.fillRect(0, 0, cv.width, cv.height);
          // keys with a subtle top-light gradient
          const kw = 62, kh = 60, gapx = 6, gapy = 8;
          for (let r = 0; r < 6; r++) {
            for (let k = 0; k < 15; k++) {
              const x = 8 + k * (kw + gapx), y = 8 + r * (kh + gapy);
              const grad = c.createLinearGradient(0, y, 0, y + kh);
              grad.addColorStop(0, '#1e2024');
              grad.addColorStop(1, '#16181b');
              c.fillStyle = grad;
              c.beginPath(); c.roundRect(x, y, kw, r === 0 ? kh * 0.6 : kh, 8); c.fill();
              c.strokeStyle = 'rgba(255,255,255,0.04)';
              c.lineWidth = 2;
              c.stroke();
            }
          }
          // trackpad
          c.fillStyle = '#202226';
          c.beginPath(); c.roundRect(cv.width / 2 - 160, 440, 320, 220, 12); c.fill();
          c.strokeStyle = 'rgba(255,255,255,0.05)'; c.stroke();
        }),
        roughness: 0.7,
      }),
    );
    kb.rotation.x = -Math.PI / 2;
    kb.position.set(0, 0.0125, 0.01);
    g.add(kb);

    // hinge barrels
    for (const x of [-baseW / 2 + 0.035, baseW / 2 - 0.035]) {
      const h = cyl(0.005, 0.05, bodyMat, 14);
      h.rotation.z = Math.PI / 2;
      h.position.set(x, 0.012, -baseD / 2 + 0.006);
      g.add(h);
    }

    const lid = new THREE.Group();
    lid.position.set(0, 0.012, -baseD / 2 + 0.004);
    const lidPanel = rbox(baseW, 0.206, 0.008, 0.004, bodyMat);
    lidPanel.position.set(0, 0.103, 0);
    lid.add(lidPanel);
    const bezel = new THREE.Mesh(
      new THREE.PlaneGeometry(baseW - 0.008, 0.198),
      new THREE.MeshStandardMaterial({ color: 0x0c0d10, roughness: 0.35 }),
    );
    bezel.position.set(0, 0.103, 0.0042);
    lid.add(bezel);
    const cam = new THREE.Mesh(new THREE.CircleGeometry(0.0012, 10), new THREE.MeshStandardMaterial({ color: 0x1c2f4a, roughness: 0.2 }));
    cam.position.set(0, 0.196, 0.0045);
    lid.add(cam);
    this.screenMat = new THREE.MeshBasicMaterial({ map: this.tex });
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(baseW - 0.022, 0.180), this.screenMat);
    scr.position.set(0, 0.101, 0.0048);
    lid.add(scr);
    const glass = glassOverlay(baseW - 0.022, 0.180);
    glass.position.set(0, 0.101, 0.0052);
    glass.renderOrder = 4;
    lid.add(glass);
    lid.rotation.x = 0.32;   // leaned back a little past vertical
    g.add(lid);
    this.screenMesh = scr;

    this.group = g;
    this.redraw();
  }

  redraw() {
    const g = this.canvas.getContext('2d');
    const w = this.canvas.width, h = this.canvas.height;

    // ---- window chrome (CCS Theia, dark) ----
    const TITLE = 30, ACT = 46, SIDE = 220, TABS = 34, CRUMB = 24, PANEL = 168, STATUS = 26;
    g.fillStyle = '#1e1e1e'; g.fillRect(0, 0, w, h);

    // title / menu bar
    g.fillStyle = '#3c3c3c'; g.fillRect(0, 0, w, TITLE);
    g.fillStyle = '#b8bcc4'; g.font = '14px "Segoe UI", sans-serif';
    let mx = 14;
    for (const item of ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help']) {
      g.fillText(item, mx, 20);
      mx += g.measureText(item).width + 18;
    }
    g.fillStyle = '#8f949c'; g.textAlign = 'center';
    g.fillText('ECE319K_Lab9H: Code Composer Studio', w / 2 + 80, 20);
    g.textAlign = 'left';

    // activity bar
    g.fillStyle = '#333333'; g.fillRect(0, TITLE, ACT, h - TITLE - STATUS);
    const icons = ['#d8dce4', '#6f747c', '#6f747c', '#6f747c', '#6f747c'];
    icons.forEach((col, i) => {
      g.strokeStyle = col; g.lineWidth = 2.4;
      g.strokeRect(12, TITLE + 16 + i * 52, 22, 22);
    });

    // explorer sidebar: the real project listing
    g.fillStyle = '#252526'; g.fillRect(ACT, TITLE, SIDE, h - TITLE - STATUS);
    g.fillStyle = '#7d828c'; g.font = '600 12px "Segoe UI", sans-serif';
    g.fillText('EXPLORER', ACT + 14, TITLE + 22);
    g.fillStyle = '#c8ccd4'; g.font = '600 13px "Segoe UI", sans-serif';
    g.fillText('▾ ECE319K_LAB9H  [Active - Debug]', ACT + 12, TITLE + 44);
    g.font = '13px "Segoe UI", sans-serif';
    CCS_TREE.forEach(([name, kind], i) => {
      const y = TITLE + 66 + i * 21;
      if (kind === 2) {   // the open file
        g.fillStyle = '#094771';
        g.fillRect(ACT, y - 14, SIDE, 20);
        g.fillStyle = '#e8ecf4';
      } else {
        g.fillStyle = kind ? '#b4b9c2' : '#8f949c';
      }
      g.fillText(name, ACT + (name.startsWith('▸') ? 18 : 30), y);
    });

    // editor tabs + breadcrumb
    const EX = ACT + SIDE;
    g.fillStyle = '#252526'; g.fillRect(EX, TITLE, w - EX, TABS);
    g.fillStyle = '#2d2d2d'; g.fillRect(EX, TITLE, 150, TABS);
    g.fillStyle = '#8f949c'; g.font = '13px "Segoe UI", sans-serif';
    g.fillText('Lab9HMain.cpp', EX + 16, TITLE + 22);
    g.fillStyle = '#1e1e1e'; g.fillRect(EX + 150, TITLE, 140, TABS);
    g.fillStyle = '#e8ecf4';
    g.fillText(this.fileName, EX + 166, TITLE + 22);
    g.fillStyle = '#4fc1ff';
    g.fillText('●', EX + 262, TITLE + 22);
    g.fillStyle = '#1e1e1e'; g.fillRect(EX, TITLE + TABS, w - EX, CRUMB);
    g.fillStyle = '#7d828c'; g.font = '12px "Segoe UI", sans-serif';
    g.fillText(`ECE319K_Lab9H  ›  ${this.fileName}`, EX + 16, TITLE + TABS + 16);

    // ---- code viewport: the real Game.cpp text, scrolling ----
    const codeTop = TITLE + TABS + CRUMB;
    const codeBot = h - STATUS - PANEL;
    const lineH = 20;
    const first = Math.floor(this.offset);
    const frac = (this.offset - first) * lineH;
    g.save();
    g.beginPath(); g.rect(EX, codeTop, w - EX, codeBot - codeTop); g.clip();
    g.font = '15px ui-monospace, Consolas, monospace';
    const KW = /\b(void|if|else|for|while|return|const|static|struct|break|case|switch|uint8_t|uint16_t|uint32_t|int8_t|int16_t|int32_t|char|extern|enum|include|define)\b/g;
    const MINI = 64;   // minimap width
    for (let i = 0; i < Math.ceil((codeBot - codeTop) / lineH) + 1; i++) {
      const idx = (first + i) % this.lines.length;
      const y = codeTop + 20 + i * lineH - frac;
      const raw = this.lines[idx] || '';
      g.fillStyle = '#3d4451';
      g.textAlign = 'right';
      g.fillText(String(idx + 1), EX + 50, y);
      g.textAlign = 'left';
      const text = raw.length > 88 ? raw.slice(0, 88) + '…' : raw;
      const comment = text.indexOf('//');
      const code = comment >= 0 ? text.slice(0, comment) : text;
      let x = EX + 66;
      let last = 0;
      KW.lastIndex = 0;
      let m;
      while ((m = KW.exec(code))) {
        const before = code.slice(last, m.index);
        g.fillStyle = '#ccd3e0'; g.fillText(before, x, y); x += g.measureText(before).width;
        g.fillStyle = '#7aa2f7'; g.fillText(m[0], x, y); x += g.measureText(m[0]).width;
        last = m.index + m[0].length;
      }
      g.fillStyle = '#ccd3e0';
      g.fillText(code.slice(last), x, y);
      if (comment >= 0) {
        const cx = EX + 66 + g.measureText(code).width;
        g.fillStyle = '#5c8f5e';
        g.fillText(text.slice(comment), cx, y);
      }
    }
    // minimap built from the same real lines
    g.fillStyle = '#232323';
    g.fillRect(w - MINI, codeTop, MINI, codeBot - codeTop);
    const miniLines = Math.floor((codeBot - codeTop) / 3);
    for (let i = 0; i < miniLines; i++) {
      const idx = (first + i - 30 + this.lines.length * 4) % this.lines.length;
      const len = Math.min(52, (this.lines[idx] || '').length * 0.62);
      if (len > 1) {
        g.fillStyle = (this.lines[idx] || '').trimStart().startsWith('//') ? 'rgba(92,143,94,0.45)' : 'rgba(160,170,190,0.35)';
        g.fillRect(w - MINI + 5, codeTop + i * 3, len, 1.6);
      }
    }
    g.fillStyle = 'rgba(120,140,180,0.12)';
    g.fillRect(w - MINI, codeTop + 90, MINI, 78);
    g.restore();

    // ---- terminal panel: the real build's names and linker numbers ----
    const py = codeBot;
    g.fillStyle = '#181818'; g.fillRect(EX, py, w - EX, PANEL);
    g.strokeStyle = '#2b2b2b'; g.beginPath(); g.moveTo(EX, py + 0.5); g.lineTo(w, py + 0.5); g.stroke();
    g.font = '12px "Segoe UI", sans-serif';
    let tx = EX + 16;
    for (const [tab, on] of [['PROBLEMS', 0], ['OUTPUT', 0], ['DEBUG CONSOLE', 0], ['TERMINAL', 1]]) {
      g.fillStyle = on ? '#e8ecf4' : '#7d828c';
      g.fillText(tab, tx, py + 20);
      if (on) { g.fillStyle = '#4fc1ff'; g.fillRect(tx, py + 26, g.measureText(tab).width, 2); }
      tx += g.measureText(tab).width + 22;
    }
    g.font = '13px ui-monospace, Consolas, monospace';
    CCS_CONSOLE.forEach(([line, col], i) => {
      if (!line) return;
      g.fillStyle = col;
      g.fillText(line, EX + 16, py + 46 + i * 18);
    });

    // ---- status bar ----
    g.fillStyle = '#0f4a78'; g.fillRect(0, h - STATUS, w, STATUS);
    g.fillStyle = '#d8e4f0'; g.font = '12px "Segoe UI", sans-serif';
    g.fillText('MSPM0G3507 (XDS110)   ·   Debug', 14, h - 8);
    g.textAlign = 'right';
    g.fillText(`Ln ${first + 1}, Col 1    UTF-8    C++    TI Arm Clang`, w - 14, h - 8);
    g.textAlign = 'left';
    this.tex.needsUpdate = true;
  }

  // Step-scroll one whole line at a time. The old smooth scroll repainted the
  // full 1280×800 window (and re-uploaded the 4 MB texture) every 120 ms —
  // one of the costliest things on the bench for a detail nobody could see.
  // Returns true when it repainted, so the caller knows to re-render.
  tick(dt) {
    this._t = (this._t || 0) + dt;
    if (this._t < 1.4) return false;
    this._t = 0;
    this.offset = (this.offset + 1) % this.lines.length;
    this.redraw();
    return true;
  }
}

// ============================================================= soldering iron
export function solderingStation() {
  const g = new THREE.Group();
  // weighted stand base with coil holder
  const base = rbox(0.09, 0.018, 0.13, 0.004, new THREE.MeshStandardMaterial({ color: 0x3a3c40, roughness: 0.45, metalness: 0.4 }));
  base.position.y = 0.009;
  g.add(base);
  const sponge = rbox(0.055, 0.009, 0.05, 0.003, new THREE.MeshStandardMaterial({ color: 0xd8c53e, roughness: 0.95 }));
  sponge.position.set(0.005, 0.023, 0.03);
  g.add(sponge);

  // coil: a helix leaned back, iron resting inside
  const coilPts = [];
  const turns = 7, len = 0.1, r0 = 0.016;
  for (let i = 0; i <= turns * 16; i++) {
    const t = i / (turns * 16);
    const a = t * turns * Math.PI * 2;
    const r = r0 * (1 - t * 0.45);
    coilPts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, t * len));
  }
  const coil = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coilPts), 160, 0.0016, 8),
    STEELISH(),
  );
  const coilG = new THREE.Group();
  coilG.add(coil);
  coilG.position.set(-0.015, 0.052, -0.028);
  coilG.rotation.x = Math.PI / 2 - 0.5;
  g.add(coilG);
  const arm = cyl(0.004, 0.045, STEELISH(), 10);
  arm.position.set(-0.015, 0.03, -0.033);
  g.add(arm);

  // the iron
  const iron = new THREE.Group();
  const handle = cyl(0.0085, 0.095, new THREE.MeshStandardMaterial({ color: 0x1f3f8f, roughness: 0.65 }), 16);
  const barrel = cyl(0.0038, 0.06, STEELISH(), 12);
  barrel.position.y = 0.075;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.0022, 0.018, 10), new THREE.MeshStandardMaterial({ color: 0x4a3c30, roughness: 0.4, metalness: 0.7 }));
  tip.position.y = 0.113;
  iron.add(handle, barrel, tip);
  iron.position.set(-0.015, 0.055, 0.012);
  iron.rotation.x = Math.PI / 2 - 0.48;
  iron.rotation.z = 0.06;
  g.add(iron);

  // silicone cable draping off the bench edge
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.015, 0.05, 0.062),
      new THREE.Vector3(-0.03, 0.02, 0.11),
      new THREE.Vector3(-0.06, 0.008, 0.16),
      new THREE.Vector3(-0.12, 0.004, 0.19),
    ]), 40, 0.0022, 8),
    new THREE.MeshStandardMaterial({ color: 0x35373b, roughness: 0.8 }),
  );
  g.add(cable);

  // solder spool beside the stand
  const spool = new THREE.Group();
  const flangeM = new THREE.MeshStandardMaterial({ color: 0x2c4a38, roughness: 0.55 });
  for (const y of [0.003, 0.028]) {
    const f = cyl(0.019, 0.003, flangeM, 24);
    f.position.y = y;
    spool.add(f);
  }
  const hub = cyl(0.009, 0.028, flangeM, 16);
  hub.position.y = 0.0155;
  spool.add(hub);
  const wind = cyl(0.0155, 0.021, STEELISH(), 24);
  wind.position.y = 0.0155;
  spool.add(wind);
  spool.position.set(0.075, 0, 0.07);
  g.add(spool);

  return g;
}

// ================================================================== the room
export function buildRoom() {
  const g = new THREE.Group();

  // plank-built benchtop with matching roughness variation
  const PLANK_H = 512 / 4;
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 1024; woodCanvas.height = 512;
  {
    const c = woodCanvas.getContext('2d');
    for (let p = 0; p < 4; p++) {
      const y0 = p * PLANK_H;
      const tone = 0.92 + ((p * 137) % 5) * 0.045;
      const grad = c.createLinearGradient(0, y0, 0, y0 + PLANK_H);
      grad.addColorStop(0, `rgb(${172 * tone | 0},${132 * tone | 0},${82 * tone | 0})`);
      grad.addColorStop(1, `rgb(${152 * tone | 0},${114 * tone | 0},${64 * tone | 0})`);
      c.fillStyle = grad;
      c.fillRect(0, y0, 1024, PLANK_H);
      // long grain
      for (let i = 0; i < 70; i++) {
        const y = y0 + Math.random() * PLANK_H;
        c.strokeStyle = `rgba(${60 + Math.random() * 46 | 0},${42 + Math.random() * 30 | 0},22,${0.05 + Math.random() * 0.10})`;
        c.lineWidth = 0.6 + Math.random() * 1.7;
        c.beginPath();
        c.moveTo(-20, y);
        for (let x = 0; x <= 1060; x += 56) {
          c.lineTo(x, y + Math.sin(x * 0.008 + i * 3 + p) * 2.5 + (Math.random() - 0.5) * 3);
        }
        c.stroke();
      }
      // occasional knot
      if (p % 2 === 0) {
        const kx = 180 + p * 310, ky = y0 + PLANK_H * 0.55;
        for (let r = 9; r > 1; r -= 2.2) {
          c.strokeStyle = `rgba(70,48,26,${0.16 + (9 - r) * 0.02})`;
          c.lineWidth = 1.4;
          c.beginPath(); c.ellipse(kx, ky, r * 2.1, r, 0.3, 0, 7); c.stroke();
        }
      }
      // plank seam
      c.strokeStyle = 'rgba(40,26,12,0.55)';
      c.lineWidth = 2;
      c.beginPath(); c.moveTo(0, y0 + PLANK_H - 1); c.lineTo(1024, y0 + PLANK_H - 1); c.stroke();
    }
  }
  const woodTex = new THREE.CanvasTexture(woodCanvas);
  woodTex.colorSpace = THREE.SRGBColorSpace;
  woodTex.anisotropy = 8;
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  woodTex.repeat.set(2, 1);
  // roughness follows the grain: darker grain lines read slightly glossier
  const woodRough = dataCanvasTexture(512, 256, (c) => {
    c.drawImage(woodCanvas, 0, 0, 512, 256);
    const d = c.getImageData(0, 0, 512, 256);
    for (let i = 0; i < d.data.length; i += 4) {
      const lum = (d.data[i] + d.data[i + 1] + d.data[i + 2]) / 3;
      const v = 165 + (lum - 128) * 0.45;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
    }
    c.putImageData(d, 0, 0);
  });
  woodRough.wrapS = woodRough.wrapT = THREE.RepeatWrapping;
  woodRough.repeat.set(2, 1);
  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughnessMap: woodRough, roughness: 1.0 });

  const benchTop = box(2.3, 0.045, 0.85, woodMat, false);
  benchTop.position.set(0, -0.0225, 0);
  benchTop.receiveShadow = true;
  g.add(benchTop);
  const apron = box(2.3, 0.09, 0.03, new THREE.MeshStandardMaterial({ color: 0x6d5432, roughness: 0.85 }), false);
  apron.position.set(0, -0.09, 0.41);
  g.add(apron);

  // ESD work mat under the hero, with its faint grid
  const matTex = canvasTexture(1024, 600, (c, cv) => {
    c.fillStyle = '#22363b'; c.fillRect(0, 0, cv.width, cv.height);
    c.strokeStyle = 'rgba(255,255,255,0.045)';
    c.lineWidth = 1;
    for (let x = 0; x < cv.width; x += 52) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, cv.height); c.stroke(); }
    for (let y = 0; y < cv.height; y += 52) { c.beginPath(); c.moveTo(0, y); c.lineTo(cv.width, y); c.stroke(); }
    c.strokeStyle = 'rgba(255,255,255,0.09)';
    c.lineWidth = 3;
    c.strokeRect(10, 10, cv.width - 20, cv.height - 20);
  });
  const mat = new THREE.Mesh(
    new RoundedBoxGeometry(0.98, 0.005, 0.56, 2, 0.002),
    new THREE.MeshStandardMaterial({ map: matTex, roughness: 0.93 }),
  );
  mat.position.set(0.02, 0.0025, 0.115);
  mat.receiveShadow = true;
  g.add(mat);

  // wall
  const wallTex = canvasTexture(512, 512, (c, cv) => {
    const grad = c.createLinearGradient(0, 0, 0, cv.height);
    grad.addColorStop(0, '#efe7d6');
    grad.addColorStop(0.75, '#e4dac6');
    grad.addColorStop(1, '#d9cdb6');
    c.fillStyle = grad;
    c.fillRect(0, 0, cv.width, cv.height);
  });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.5), new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95 }));
  wall.position.set(0, 0.65, -0.44);
  wall.receiveShadow = true;
  g.add(wall);

  // power strip along the wall base, behind the instruments
  const strip = rbox(0.55, 0.042, 0.042, 0.006, new THREE.MeshStandardMaterial({ color: 0xe8e4da, roughness: 0.55 }));
  strip.position.set(-0.05, 0.021, -0.415);
  const stripFace = new THREE.Mesh(
    new THREE.PlaneGeometry(0.52, 0.03),
    new THREE.MeshStandardMaterial({
      map: canvasTexture(1040, 60, (c) => {
        c.fillStyle = '#e2ddd2'; c.fillRect(0, 0, 1040, 60);
        for (let i = 0; i < 6; i++) {
          const x = 60 + i * 160;
          c.fillStyle = '#cfc9bc';
          c.beginPath(); c.roundRect(x - 34, 8, 68, 44, 8); c.fill();
          c.fillStyle = '#3a3c40';
          c.fillRect(x - 16, 16, 8, 18); c.fillRect(x + 8, 16, 8, 18);
        }
        // lit rocker switch on the end
        c.fillStyle = '#8f2318';
        c.beginPath(); c.roundRect(986, 12, 40, 36, 6); c.fill();
        c.fillStyle = '#ff7a4a';
        c.fillRect(994, 20, 24, 8);
      }),
      roughness: 0.6, emissive: 0x2a0d04, emissiveIntensity: 0.5,
    }),
  );
  stripFace.position.set(-0.05, 0.024, -0.393);
  g.add(strip, stripFace);

  // duplex wall outlet, sketch right side
  const outlet = new THREE.Mesh(
    new THREE.PlaneGeometry(0.07, 0.115),
    new THREE.MeshStandardMaterial({
      map: canvasTexture(140, 230, (c) => {
        c.fillStyle = '#f2efe8'; c.roundRect(0, 0, 140, 230, 10); c.fill();
        c.strokeStyle = '#c9c4b8'; c.lineWidth = 4; c.stroke();
        c.fillStyle = '#efece4';
        for (const y of [58, 168]) {
          c.beginPath(); c.ellipse(70, y, 34, 44, 0, 0, 7); c.fill();
          c.fillStyle = '#2c2e32';
          c.fillRect(52, y - 22, 7, 22); c.fillRect(82, y - 22, 7, 22);
          c.beginPath(); c.arc(70, y + 16, 5, 0, 7); c.fill();
          c.fillStyle = '#efece4';
        }
      }),
      roughness: 0.8,
    }),
  );
  outlet.position.set(0.56, 0.30, -0.437);
  g.add(outlet);

  return g;
}

// Loose axial resistors on the mat — cloned from the board's own real
// resistor geometry (all primitives of the footprint model) once loaded.
export function scatterResistors(resistorMeshes, positions) {
  const g = new THREE.Group();
  if (!resistorMeshes || !resistorMeshes.length) return g;
  for (const [x, z, rot] of positions) {
    const one = new THREE.Group();
    for (const src of resistorMeshes) {
      const m = new THREE.Mesh(src.geometry, src.material);
      m.castShadow = true;
      one.add(m);
    }
    one.position.set(x, 0.006, z);
    one.rotation.y = rot;
    one.rotation.z = Math.PI;   // legs up, the way loose parts actually lie
    g.add(one);
  }
  return g;
}

// A yellow sticky note with the sketch's annotation, taped to the wall.
export function stickyNote(text1, text2) {
  const note = new THREE.Mesh(
    new THREE.PlaneGeometry(0.076, 0.076),
    new THREE.MeshStandardMaterial({
      map: canvasTexture(256, 256, (c) => {
        c.fillStyle = '#f6e27a'; c.fillRect(0, 0, 256, 256);
        c.fillStyle = 'rgba(0,0,0,0.06)'; c.fillRect(0, 0, 256, 26);
        c.fillStyle = '#b23327';
        c.font = 'italic 34px "Segoe Script", "Comic Sans MS", cursive';
        c.textAlign = 'center';
        c.fillText(text1, 128, 120);
        c.fillText(text2, 128, 170);
      }),
      roughness: 0.9,
      side: THREE.DoubleSide,
    }),
  );
  note.rotation.x = -0.35;
  return note;
}
