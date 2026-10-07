// main.js — the ECE 319H lab bench, per assets/bench-sketch.jpg.
//
// The emulator (dist/pentris.js) is used exactly as built; see signals.js for
// the one place the firmware is touched. Everything visible here is either
// real exported geometry (board.glb), procedural furniture, or an instrument
// driven by a real signal.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { STRIP_SILK_NAMES } from './board-data.js';
import { initSignals, stepSignals, ensureAudio } from './signals.js';
import { buildHandheld, buildBarePCB } from './handheld.js';
import { Scope, probeCable, Laptop, solderingStation, buildRoom, scatterResistors, stickyNote } from './instruments.js';

const overlay = document.getElementById('boot');
const setBoot = (t) => { overlay.querySelector('span').textContent = t; };
addEventListener('error', (e) => {
  overlay.style.display = 'flex';
  overlay.classList.add('err');
  setBoot('scene error: ' + (e.message || e.type));
});

// The laptop's editor window. The graded course source is not part of the public
// build, so the editor shows a notice instead of any code.
const LAPTOP_TEXT = `// Game.cpp
//
// Course source code is not included in this public build.
// What runs on this bench is the compiled firmware only.
`;

async function loadGameSource() {
  return LAPTOP_TEXT;
}

// ------------------------------------------------------------------ renderer
// antialias:false — every visible pixel goes through the composer (SMAA at the
// end), so a multisampled canvas would spend iGPU bandwidth on pixels nobody sees
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// nothing that casts a shadow moves except the stick and switch caps, so the
// 2048² map renders once and refreshes only on input — not 60 times a second
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = 0.96;
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.id = 'labels';
document.body.appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x241f19);

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.02, 20);
camera.position.set(0.0, 0.175, 0.56);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.095, 0.02);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 0.3;
controls.maxDistance = 1.7;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.minAzimuthAngle = -0.9;
controls.maxAzimuthAngle = 0.9;
controls.enablePan = false;

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.27;

// ------------------------------------------------------------------ lighting
// A photo-style setup: one big soft area light overhead-front (broad, soft
// speculars on glass and enclosures), a warm desk-lamp spot for shadows, and
// a faint cool rim so dark cases separate from the wall.
RectAreaLightUniformsLib.init();
scene.add(new THREE.HemisphereLight(0xfff2e2, 0x2c241c, 0.30));
const softbox = new THREE.RectAreaLight(0xfff3e4, 1.7, 0.9, 0.6);
softbox.position.set(0.12, 0.85, 0.55);
softbox.lookAt(0, 0, 0.05);
scene.add(softbox);
const key = new THREE.SpotLight(0xffe2bc, 2.3, 0, 0.46, 0.7, 1.4);
key.position.set(-0.55, 1.15, 0.75);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -0.00015;
key.shadow.normalBias = 0.015;
key.shadow.radius = 5;
key.target.position.set(0, 0, 0.1);
scene.add(key, key.target);
const rim = new THREE.DirectionalLight(0x9dbdff, 0.5);
rim.position.set(0.55, 0.45, -0.85);
scene.add(rim);
const fill = new THREE.PointLight(0xbfd2ff, 0.35, 0, 1.6);
fill.position.set(0.75, 0.55, 0.55);
scene.add(fill);

// ------------------------------------------------------------- LCD material
// The panel shader: firmware framebuffer sampled with no interpolation, plus a
// mild subpixel stripe, per-row scanline and backlight falloff. The pixels
// stay pixels; smoothing them away would misrepresent the hardware.
function makeScreenMaterial(tex, W, H) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uFB: { value: tex },
      uRes: { value: new THREE.Vector2(W, H) },
      uBoost: { value: 1.15 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform sampler2D uFB;
      uniform vec2 uRes;
      uniform float uBoost;
      varying vec2 vUv;
      void main() {
        vec2 uv = vec2(vUv.x, 1.0 - vUv.y);   // fb row 0 is the top of the panel
        vec3 col = texture2D(uFB, uv).rgb;
        vec2 pix = uv * uRes;
        float row = fract(pix.y);
        float scan = 0.90 + 0.10 * smoothstep(0.0, 0.3, row) * smoothstep(1.0, 0.7, row);
        float sub = abs(fract(pix.x) - 0.5) * 2.0;
        vec3 stripe = mix(vec3(1.03), vec3(0.93, 1.0, 1.05), sub);
        float vig = 1.0 - 0.22 * distance(uv, vec2(0.5, 0.45));
        col *= scan * vig;
        col = mix(col, col * stripe, 0.30);
        gl_FragColor = vec4(col * uBoost, 1.0);
      }`,
  });
}

// ------------------------------------------------------------------- the set
const room = buildRoom();
scene.add(room);

// Title corrected 2026-08-28: this said "R-2R DAC · probe on J1". The firmware
// drives the internal 12-bit DAC0 on PA15, not the ladder, and where that pin
// lands on the physical board has not been verified, so the title no longer
// claims a probe point. The probe cable in the scene still clips to J1, which
// is a scenery choice, not an assertion about the signal path.
const scope1 = new Scope({ traceColor: '#ff4a30', title: 'CH1 · internal DAC0 (PA15)' });
scope1.group.position.set(-0.255, 0, -0.215);
scope1.group.rotation.y = 0.18;
scene.add(scope1.group);

const scope2 = new Scope({ traceColor: '#3aff6a', title: 'CH1' });
scope2.group.position.set(0.27, 0, -0.215);
scope2.group.rotation.y = -0.18;
scene.add(scope2.group);
const scope2Baseline = new Float32Array(560).fill(0);   // unprobed input sits at ground

const station = solderingStation();
station.position.set(-0.30, 0, 0.175);
station.rotation.y = 0.6;
scene.add(station);

// taped to the wall between the scopes, like the sketch's annotation
const note = stickyNote('soldering demo', '→ 3 pm');
note.position.set(-0.115, 0.265, -0.436);
note.rotation.set(0, 0, 0.06);
scene.add(note);

// ------------------------------------------------------------------- boot it
setBoot('booting the real firmware…');
// board textures: the default files have the cohort's silkscreen name lines removed;
// the '.names' pair is the untouched plot. Flip STRIP_SILK_NAMES in board-data.js to swap.
const TEX_SUFFIX = STRIP_SILK_NAMES ? '' : '.names';
const signalsP = initSignals();

setBoot('decoding the real board…');
const draco = new DRACOLoader().setDecoderPath('./vendor/draco/');
const loader = new GLTFLoader().setDRACOLoader(draco);
const gltfP = loader.loadAsync('./assets/board.glb');
const codeP = loadGameSource();
// exact board-face textures composited from the KiCad file's own layer plots
// (assets/board/board-tex.json documents the mapping); optional — the scene
// still stands if they are absent
const texLoader = new THREE.TextureLoader();
const skinP = Promise.all([
  texLoader.loadAsync('./assets/board/board-top' + TEX_SUFFIX + '.png').catch(() => null),
  texLoader.loadAsync('./assets/board/board-bottom' + TEX_SUFFIX + '.png').catch(() => null),
]).then(([top, bottom]) => (top ? { top, bottom } : null));

const [signals, gltf, gameSource, skin] = await Promise.all([signalsP, gltfP, codeP, skinP]);

// LCD texture straight over the firmware's framebuffer memory copy
const screenTex = new THREE.DataTexture(signals.rgba, signals.W, signals.H, THREE.RGBAFormat);
screenTex.colorSpace = THREE.SRGBColorSpace;
screenTex.magFilter = THREE.NearestFilter;
screenTex.minFilter = THREE.NearestFilter;
screenTex.generateMipmaps = false;
screenTex.needsUpdate = true;

const dev = buildHandheld(gltf, makeScreenMaterial(screenTex, signals.W, signals.H), skin);
const TILT = 0.42;                       // leaned back on its stand
dev.root.rotation.x = Math.PI / 2 - TILT;
dev.root.position.set(0, 0, 0.19);
scene.add(dev.root);
// rest the lowest point on the mat
dev.root.updateMatrixWorld(true);
const bb = new THREE.Box3().setFromObject(dev.root);
dev.root.position.y -= bb.min.y - 0.006;
dev.root.updateMatrixWorld(true);

// acrylic easel wedges under the tilted board
// acrylic easel wedges tucked behind the leaning board
const wedgeShape = new THREE.Shape([
  new THREE.Vector2(0, 0), new THREE.Vector2(0.034, 0), new THREE.Vector2(0, 0.052),
]);
const wedgeGeo = new THREE.ExtrudeGeometry(wedgeShape, { depth: 0.008, bevelEnabled: false });
const wedgeMat = new THREE.MeshStandardMaterial({
  color: 0xdfe8ea, roughness: 0.12, metalness: 0, transparent: true, opacity: 0.18,
});
for (const x of [-0.036, 0.028]) {
  const w = new THREE.Mesh(wedgeGeo, wedgeMat);
  w.rotation.y = Math.PI / 2;     // hypotenuse faces the board's back
  w.position.set(x, 0.001, dev.root.position.z - 0.006);
  scene.add(w);
}

const bare = buildBarePCB(gltf, skin);
bare.position.set(-0.175, 0.008, 0.275);
bare.rotation.y = 0.5;
scene.add(bare);

scene.add(scatterResistors(dev.resistorMeshes, [
  [0.22, 0.30, 0.4], [0.245, 0.315, 2.3], [0.20, 0.335, 1.1],
]));

const laptop = new Laptop(gameSource, 'Game.cpp');
laptop.group.position.set(0.30, 0, 0.24);
laptop.group.rotation.y = -0.55;
scene.add(laptop.group);

// probe: scope 1 BNC -> J1, the testpoint under the ladder. Scenery. The trace
// on that scope comes from the firmware's DAC writes, not from this cable.
const bncWorld = scope1.bnc.getWorldPosition(new THREE.Vector3());
const j1World = dev.probeAnchor.getWorldPosition(new THREE.Vector3());
scene.add(probeCable(bncWorld, j1World));

// ------------------------------------------------------------- annotations
const LABELS = [
  [dev.anchors.speaker, 'speaker'],
  [dev.anchors.lcd, 'LCD · live 128×160 framebuffer'],
  [dev.anchors.sd, 'SD card'],
  [dev.anchors.leds, 'LEDs'],
  [dev.anchors.joystick, 'joystick'],
  [dev.anchors.dpad, 'SW1–SW5 · SW4 is dead (PA25/ADC)'],
  [dev.anchors.empty, '“empty space”: unpopulated ESP8266'],
  [scope1.group, 'scope: real DAC samples'],
  [scope2.group, 'no probe · nothing faked'],
  [bare, 'raw PCB: the cohort board, unsoldered'],
  [laptop.group, 'CCS · the real Lab9H project'],
  [station, 'soldering demonstration'],
];
const labelObjs = [];
for (const [target, text] of LABELS) {
  const div = document.createElement('div');
  div.className = 'anno';
  div.textContent = text;
  const o = new CSS2DObject(div);
  if (target.isObject3D && !target.parent) continue;
  (target.isObject3D ? target : target.group).add(o);
  if (target === scope1.group || target === scope2.group) o.position.set(0, 0.22, 0);
  if (target === laptop.group) o.position.set(0, 0.24, 0);
  if (target === station) o.position.set(0, 0.17, 0);
  if (target === bare) o.position.set(0, 0.05, 0);
  labelObjs.push(o);
}
let labelsOn = true;
function applyLabelVisibility() {
  labelRenderer.domElement.style.display = labelsOn ? '' : 'none';
}
addEventListener('keydown', (e) => {
  if (e.key === 'h' || e.key === 'H') {
    labelsOn = !labelsOn;
    applyLabelVisibility();
  }
});

// ------------------------------------------------------------- interactions
// Press the real switches / drag the real stick with the pointer. All this
// does is feed pentris_set_input — the firmware decides what it means.
const ray = new THREE.Raycaster();
const pt = new THREE.Vector2();
const bitByInstance = new Map();
for (const [bit, e] of dev.switchMap) bitByInstance.set(e.index, bit);
let stickDrag = null;

renderer.domElement.addEventListener('pointerdown', (e) => {
  ensureAudio(signals);
  pt.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(pt, camera);
  if (dev.switchMeshes.length) {
    const hit = ray.intersectObjects(dev.switchMeshes, false)[0];
    if (hit && bitByInstance.has(hit.instanceId)) {
      const bit = bitByInstance.get(hit.instanceId);
      signals._pointerSwitches |= 1 << bit;
      signals._userTouched = true;
      controls.enabled = false;
      const up = () => {
        signals._pointerSwitches &= ~(1 << bit);
        controls.enabled = true;
        removeEventListener('pointerup', up);
      };
      addEventListener('pointerup', up);
      return;
    }
  }
  const capHit = ray.intersectObject(dev.stickCap, false)[0];
  if (capHit) {
    stickDrag = { x0: e.clientX, y0: e.clientY };
    controls.enabled = false;
  }
});
addEventListener('pointermove', (e) => {
  if (!stickDrag) return;
  const dx = (e.clientX - stickDrag.x0) / 60;
  const dy = (e.clientY - stickDrag.y0) / 60;
  const clamp = (v) => Math.max(-1, Math.min(1, v));
  // drag left = JoyX HIGH, matching the real stick's wiring
  signals._pointerJoy = {
    x: 2048 - clamp(dx) * 1850,
    y: 2048 - clamp(dy) * 1850,
  };
  signals._userTouched = true;
});
addEventListener('pointerup', () => {
  if (stickDrag) { stickDrag = null; signals._pointerJoy = null; controls.enabled = true; }
});

// ------------------------------------------------------------------- views
// Camera presets: the whole bench, or fly in close on one subject. Close-up
// views loosen the orbit limits so the board can be inspected from any side;
// pressing a switch or dragging the stick still works up close.
scene.updateMatrixWorld(true);
const BENCH_LIMITS = { minD: 0.3, maxD: 1.7, minPolar: 0.5, maxPolar: 1.5, minAz: -0.9, maxAz: 0.9 };
const CLOSE_LIMITS = { minD: 0.045, maxD: 0.9, minPolar: 0.12, maxPolar: 1.55, minAz: -1.5, maxAz: 1.5 };

const devCenter = new THREE.Box3().setFromObject(dev.root).getCenter(new THREE.Vector3());
const bareCenter = new THREE.Box3().setFromObject(bare).getCenter(new THREE.Vector3());
const VIEWS = {
  bench: { pos: new THREE.Vector3(0, 0.175, 0.56), tgt: new THREE.Vector3(0, 0.095, 0.02), limits: BENCH_LIMITS },
  // straight down the tilted board's normal, close enough to read the silk
  board: { pos: devCenter.clone().add(new THREE.Vector3(0, 0.082, 0.175)), tgt: devCenter.clone(), limits: CLOSE_LIMITS },
  bare: { pos: bareCenter.clone().add(new THREE.Vector3(0.03, 0.155, 0.095)), tgt: bareCenter.clone(), limits: CLOSE_LIMITS },
  scope: {
    pos: scope1.group.localToWorld(new THREE.Vector3(-0.075, 0.145, 0.46)),
    tgt: scope1.group.localToWorld(new THREE.Vector3(-0.085, 0.085, 0.12)),
    limits: CLOSE_LIMITS,
  },
  laptop: {
    pos: laptop.group.localToWorld(new THREE.Vector3(0, 0.175, 0.34)),
    tgt: laptop.group.localToWorld(new THREE.Vector3(0, 0.10, -0.07)),
    limits: CLOSE_LIMITS,
  },
};

let currentView = 'bench';
let flight = null;
function flyTo(name) {
  const v = VIEWS[name];
  if (!v) return;
  currentView = name;
  flight = {
    p0: camera.position.clone(), t0: controls.target.clone(),
    p1: v.pos.clone(), t1: v.tgt.clone(),
    start: performance.now(), dur: 1100, limits: v.limits,
  };
  controls.enabled = false;
  labelsOn = name === 'bench';        // close views start clean; H re-toggles
  applyLabelVisibility();
  for (const b of document.querySelectorAll('#views button')) {
    b.classList.toggle('on', b.dataset.view === name);
  }
}
function stepFlight(now) {
  const t = Math.min(1, (now - flight.start) / flight.dur);
  const s = t * t * (3 - 2 * t);
  camera.position.lerpVectors(flight.p0, flight.p1, s);
  controls.target.lerpVectors(flight.t0, flight.t1, s);
  camera.lookAt(controls.target);
  if (t >= 1) {
    const L = flight.limits;
    controls.minDistance = L.minD; controls.maxDistance = L.maxD;
    controls.minPolarAngle = L.minPolar; controls.maxPolarAngle = L.maxPolar;
    controls.minAzimuthAngle = L.minAz; controls.maxAzimuthAngle = L.maxAz;
    controls.enabled = true;
    flight = null;
  }
}
for (const b of document.querySelectorAll('#views button')) {
  b.addEventListener('click', () => flyTo(b.dataset.view));
}
addEventListener('keydown', (e) => {
  const order = ['bench', 'board', 'bare', 'scope', 'laptop'];
  if (e.key >= '1' && e.key <= '5') flyTo(order[e.key.charCodeAt(0) - 49]);
  if (e.key === 'Escape') flyTo('bench');
});
// double-click any subject to fly to it
renderer.domElement.addEventListener('dblclick', (e) => {
  pt.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(pt, camera);
  let best = null;
  for (const [obj, view] of [[dev.root, 'board'], [bare, 'bare'], [scope1.group, 'scope'], [laptop.group, 'laptop']]) {
    const h = ray.intersectObject(obj, true)[0];
    if (h && (!best || h.distance < best.d)) best = { d: h.distance, view };
  }
  if (best) flyTo(best.view);
});

// The set is fully placed now and nothing but the camera moves — the two
// movers (joystick stick, switch caps) update their own matrices when poked.
// Freezing the graph spares three.js recomposing ~500 matrices every frame.
scene.updateMatrixWorld(true);
scene.traverse((o) => { o.matrixAutoUpdate = false; });

// ------------------------------------------------------------------ compose
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
// ground-truth ambient occlusion — this is most of "polished vs floaty"
const gtao = new GTAOPass(scene, camera, innerWidth, innerHeight);
// AO is low-frequency and gets Poisson-denoised anyway; computing it at half
// resolution reads the same and returns most of GTAO's ~10 ms on an iGPU
const AO_SCALE = 0.5;
const gtaoSize = gtao.setSize.bind(gtao);
gtao.setSize = (w, h) => gtaoSize(Math.max(1, Math.round(w * AO_SCALE)), Math.max(1, Math.round(h * AO_SCALE)));
gtao.updateGtaoMaterial({
  radius: 0.06, distanceExponent: 2.0, thickness: 0.02,
  scale: 3.4, samples: 10, distanceFallOff: 0.6, screenSpaceRadius: false,
});
gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2.5, normalPhi: 4, radius: 6, rings: 2, samples: 8 });
gtao.blendIntensity = 1.0;
composer.addPass(gtao);
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.20, 0.5, 0.88);
composer.addPass(bloom);
composer.addPass(new SMAAPass());
composer.addPass(new OutputPass());

// One flag gates all rendering: anything that changes what the screen should
// show calls invalidate(), and the loop repaints only then (plus a heartbeat).
let needRender = true;
const invalidate = () => { needRender = true; };

// --------------------------------------------------------- adaptive quality
// The bench has to stay smooth on whatever GPU opens it. Render scale steps
// down when sustained frame cost overruns the budget and climbs back only
// with clear headroom; if the floor still can't hold a frame, AO and then
// bloom switch off (twice bounced = locked off for the session). EMAs and
// cooldowns keep one GC hitch from flapping anything.
const quality = {
  steps: [1.5, 1.25, 1.0, 0.85, 0.7],
  idx: Math.min(devicePixelRatio, 1.25) >= 1.25 ? 1 : 2,
  auto: true,
  ema: 16, busy: 4,
  hot: 0, calm: 0,
  cooldownUntil: 0, lastUpAt: -1e9, upBlockUntil: 0,
  bounces: { gtao: 0, bloom: 0 },
};
function applyScale() {
  const s = quality.steps[quality.idx];
  renderer.setPixelRatio(s);
  composer.setPixelRatio(s);
  invalidate();
}
applyScale();
function stepDown() {
  if (quality.idx < quality.steps.length - 1) { quality.idx++; applyScale(); return; }
  if (gtao.enabled) { gtao.enabled = false; quality.bounces.gtao++; invalidate(); return; }
  if (bloom.enabled) { bloom.enabled = false; quality.bounces.bloom++; invalidate(); }
}
function adapt(now, frameMs, busyMs) {
  if (!quality.auto || now < quality.cooldownUntil) return;
  quality.ema += (frameMs - quality.ema) * 0.08;
  quality.busy += (busyMs - quality.busy) * 0.08;
  // busy < 8 ms catches "vsynced at 60 with the GPU mostly idle", where the
  // frame delta alone can't reveal headroom
  const hot = quality.ema > 19;
  const calm = quality.ema < 15 || (quality.ema < 17.6 && quality.busy < 8);
  quality.hot = hot ? quality.hot + 1 : 0;
  quality.calm = calm ? quality.calm + 1 : 0;
  if (quality.hot > 70) {                       // ~1.4 s of sustained overrun
    quality.hot = 0;
    if (now - quality.lastUpAt < 10000) quality.upBlockUntil = now + 120000;
    stepDown();
    quality.cooldownUntil = now + 2500;
  } else if (quality.calm > 400 && now > quality.upBlockUntil) {   // ~7 s of headroom
    quality.calm = 0;
    if (!bloom.enabled && quality.bounces.bloom < 2) bloom.enabled = true;
    else if (!gtao.enabled && quality.bounces.gtao < 2) gtao.enabled = true;
    else if (quality.idx > 0) { quality.idx--; applyScale(); }
    else return;
    invalidate();
    quality.lastUpAt = now;
    quality.cooldownUntil = now + 5000;
  }
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  labelRenderer.setSize(innerWidth, innerHeight);
  invalidate();
});

// -------------------------------------------------------------------- HUD
const hud = document.getElementById('status');
let fpsEma = 16.7;
function updateHUD() {
  const parts = [
    `score ${signals.score}`,
    `tick ${signals.hz.toFixed(1)} Hz (firmware's own)`,
    `LED 0x${signals.led.toString(16)}`,
    signals.measuredRate > 0 ? `DAC ${(signals.measuredRate / 1000).toFixed(2)} kSa/s` : 'DAC idle (sound source stubbed)',
    signals._audioReady ? 'audio live' : 'audio: press any key',
    `${Math.min(999, Math.round(1000 / fpsEma))} fps · ×${quality.steps[quality.idx]}`,
  ];
  if (signals.gameOver) parts.push('GAME OVER');
  const text = parts.join('  ·  ');
  if (text !== shown.hud) { shown.hud = text; hud.textContent = text; }
}

// -------------------------------------------------------------------- loop
// stepSignals runs every rAF so the firmware's clock never skips; the render
// itself happens only when something on screen actually changed. A parked
// bench settles to the ~2 repaints a second its own LED heartbeat asks for —
// the "still frame" the eye sees is simply the last real render, held.
controls.addEventListener('change', invalidate);
addEventListener('keydown', invalidate);
addEventListener('pointerdown', invalidate);

const shown = { led: -1, jx: -1, jy: -1, ck: -1, sw: -1, scopeLen: -1, rate: -1, note: null, hud: '' };
scope2.draw(scope2Baseline, 0, undefined, 'no probe connected');   // constant content: drawn once, held

const stats = { t0: performance.now(), raf: 0, renders: 0, busy: 0 };
const perf = { force: false };
let last = performance.now(), frames = 0;
let lastRenderAt = 0, prevRendered = false, prevT = performance.now();

function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  fpsEma += (Math.max(1, now - prevT) - fpsEma) * 0.05;

  stepSignals(signals, now);
  if (signals.fbDirtyForScene) {
    screenTex.needsUpdate = true;
    signals.fbDirtyForScene = false;
    invalidate();
  }
  if (signals.led !== shown.led) {
    dev.setLEDs(signals.led);
    shown.led = signals.led;
    invalidate();
  }
  if (signals.joyX !== shown.jx || signals.joyY !== shown.jy || signals.click !== shown.ck) {
    dev.setJoystick(signals.joyX, signals.joyY, signals.click);
    shown.jx = signals.joyX; shown.jy = signals.joyY; shown.ck = signals.click;
    renderer.shadowMap.needsUpdate = true;      // the stick's shadow follows its lean
    invalidate();
  }
  if (signals.switches !== shown.sw) {
    dev.setSwitches(signals.switches);
    shown.sw = signals.switches;
    renderer.shadowMap.needsUpdate = true;
    invalidate();
  }

  const note = signals.scopeLen === 0 ? 'sound source stubbed; the DAC path is real' : undefined;
  if (signals.scopeLen !== shown.scopeLen || signals.measuredRate !== shown.rate || note !== shown.note) {
    scope1.draw(signals.scope, signals.scopeLen, signals.measuredRate, note);
    shown.scopeLen = signals.scopeLen; shown.rate = signals.measuredRate; shown.note = note;
    invalidate();
  }

  if (laptop.tick(dt)) invalidate();
  if (frames % 15 === 0) updateHUD();

  if (flight) { stepFlight(now); invalidate(); }
  else controls.update();                       // fires 'change' → invalidate while moving

  if (perf.force) invalidate();
  if (now - lastRenderAt > 500) invalidate();   // heartbeat: belt-and-braces repaint

  stats.raf++;
  if (needRender) {
    needRender = false;
    const b0 = performance.now();
    composer.render();
    if (labelsOn) labelRenderer.render(scene, camera);
    const busyMs = performance.now() - b0;
    stats.renders++; stats.busy += busyMs;
    if (prevRendered) adapt(now, now - prevT, busyMs);
    prevRendered = true;
    lastRenderAt = now;
  } else {
    prevRendered = false;
  }
  prevT = now;
  frames++;
  requestAnimationFrame(frame);
}

overlay.style.opacity = '0';
setTimeout(() => overlay.remove(), 600);
requestAnimationFrame(frame);

// handles for automated verification
window.__bench = {
  scene, camera, renderer, signals, dev, controls, flyTo,
  post: { gtao, bloom }, lights: { softbox, key, rim, fill },
  quality, perf, composer,
  setScale(s) { quality.auto = false; renderer.setPixelRatio(s); composer.setPixelRatio(s); invalidate(); },
  stats() {
    const dt = (performance.now() - stats.t0) / 1000;
    const out = {
      rafHz: +(stats.raf / dt).toFixed(1),
      renderHz: +(stats.renders / dt).toFixed(1),
      busyAvgMs: stats.renders ? +(stats.busy / stats.renders).toFixed(2) : 0,
      scale: renderer.getPixelRatio(),
      gtao: gtao.enabled, bloom: bloom.enabled,
    };
    stats.t0 = performance.now(); stats.raf = stats.renders = stats.busy = 0;
    return out;
  },
  get view() { return currentView; },
  testPick(cx, cy) {
    pt.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
    ray.setFromCamera(pt, camera);
    const sw = ray.intersectObjects(dev.switchMeshes, false);
    const all = ray.intersectObjects(scene.children, true).slice(0, 4);
    return {
      sw: sw.slice(0, 2).map((h) => ({ inst: h.instanceId, d: +h.distance.toFixed(4) })),
      all: all.map((h) => ({ n: h.object.name || h.object.type, d: +h.distance.toFixed(4) })),
    };
  },
};
