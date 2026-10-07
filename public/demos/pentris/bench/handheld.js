// handheld.js — the console itself.
//
// The board substrate, copper, switches, resistors and headers come straight
// from board.glb — real geometry exported from the real KiCad file. Parts whose
// footprints shipped no STEP model (the ST7735 module, joystick breakout,
// LEDs, DIPs, jack, slide pot, IR parts, and the LaunchPad on the back) are
// modelled here, but placed at the exact footprint coordinates extracted from
// the cohort board KiCad file — see board-data.js. Nothing is placed by eye.

import * as THREE from 'three';
import { MM, BOARD, PARTS, SILK, CREDIT_SILK } from './board-data.js';

// GLB frame: x = KiCad x mm/1000, z = KiCad y mm/1000, y = height off board.
const P = (kx, up, ky) => new THREE.Vector3(kx * MM, up * MM, ky * MM);

const BLACK_PLASTIC = new THREE.MeshStandardMaterial({ color: 0x181a1c, roughness: 0.6, metalness: 0.1 });
const STEEL = new THREE.MeshStandardMaterial({ color: 0x989ea6, roughness: 0.45, metalness: 0.85 });
const SILK_WHITE = '#eceae2';

function box(w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w * MM, h * MM, d * MM), mat);
  m.castShadow = true;
  return m;
}
function cyl(r, h, mat, seg = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r * MM, r * MM, h * MM, seg), mat);
  m.castShadow = true;
  return m;
}

// Text rendered the way silkscreen is: flat white paint on the mask.
function silkDecal(lines, sizeMM, { anchor = 'center', rotZ = 0 } = {}) {
  const pad = 8, scale = 8; // canvas px per mm
  const font = `bold ${sizeMM * scale}px Arial, sans-serif`;
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  g.font = font;
  const wPx = Math.max(...lines.map((l) => g.measureText(l).width)) + pad * 2;
  const lineH = sizeMM * scale * 1.25;
  c.width = Math.ceil(wPx);
  c.height = Math.ceil(lineH * lines.length + pad * 2);
  g.clearRect(0, 0, c.width, c.height);
  g.font = font;
  g.fillStyle = SILK_WHITE;
  g.textBaseline = 'top';
  g.textAlign = anchor === 'left' ? 'left' : 'center';
  const tx = anchor === 'left' ? pad : c.width / 2;
  lines.forEach((l, i) => g.fillText(l, tx, pad + i * lineH));
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const geo = new THREE.PlaneGeometry((c.width / scale) * MM, (c.height / scale) * MM);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;   // lie on the board face
  mesh.rotation.z = rotZ;
  mesh.renderOrder = 3;
  return { mesh, wMM: c.width / scale, hMM: c.height / scale };
}

// ------------------------------------------------------------------ LCD module
function buildLCD(screenMaterial) {
  const g = new THREE.Group();
  const L = PARTS.lcd;

  // female header strip along the module's top edge (pads at y = -24.13)
  const hdr = box(41, 8.5, 2.6, BLACK_PLASTIC);
  hdr.position.copy(P(L.x, 1.6 + 4.25, L.y - 24.13));
  g.add(hdr);
  // two support posts at the bottom corners so the module doesn't cantilever
  for (const dx of [-20, 20]) {
    const post = box(3, 8.5, 3, BLACK_PLASTIC);
    post.position.copy(P(L.x + dx, 1.6 + 4.25, L.y + 24));
    g.add(post);
  }

  // module PCB — the classic red HiLetgo carrier
  const pcb = box(L.w, 1.6, L.h, new THREE.MeshStandardMaterial({ color: 0x8f1618, roughness: 0.55 }));
  pcb.position.copy(P(L.x, 10.1 + 0.8, L.y + 0.05));
  g.add(pcb);

  // glass stack
  const glass = box(34, 3.4, 45, new THREE.MeshPhysicalMaterial({ color: 0x101014, roughness: 0.15, metalness: 0.1, clearcoat: 0.7, clearcoatRoughness: 0.15 }));
  glass.position.copy(P(L.x, 11.7 + 1.7, L.y + 1.5));
  g.add(glass);

  // the live panel: 28.03 x 35.04 mm active area, firmware framebuffer
  const A = PARTS.lcdActive;
  const screenGeo = new THREE.PlaneGeometry(A.w * MM, A.h * MM);
  screenGeo.rotateX(-Math.PI / 2);
  const screen = new THREE.Mesh(screenGeo, screenMaterial);
  screen.position.copy(P(A.cx, 15.15, A.cy));
  g.add(screen);

  // thin glossy overlay so the glass catches the room
  const overlay = new THREE.Mesh(
    new THREE.PlaneGeometry(32 * MM, 43 * MM).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: 0x000000, roughness: 0.06, metalness: 1.0,
      transparent: true, opacity: 0.16, envMapIntensity: 1.6, depthWrite: false,
    }),
  );
  overlay.position.copy(P(L.x, 15.35, L.y + 1.5));
  overlay.renderOrder = 4;
  g.add(overlay);

  // SD socket on the module's back, card poking out of the right edge —
  // this is where PENTRIS1/2/3.BIN live on the real device
  const socket = box(26, 2.6, 28, STEEL);
  socket.position.copy(P(L.x + 8, 10.1 - 1.4, L.y + 4));
  g.add(socket);
  const card = box(30, 2.1, 24, new THREE.MeshStandardMaterial({ color: 0x1a2c58, roughness: 0.5 }));
  card.position.copy(P(L.x + 22.85 - 11, 10.1 - 1.3, L.y + 4)); // 4 mm proud of the edge
  g.add(card);
  const sdAnchor = new THREE.Object3D();
  sdAnchor.position.copy(P(L.x + 24, 10, L.y + 4));
  g.add(sdAnchor);

  return { group: g, screen, sdAnchor };
}

// ------------------------------------------------------------------- joystick
function buildJoystick() {
  const g = new THREE.Group();
  const J = PARTS.joystick;

  const hdr = box(16, 8.5, 2.6, BLACK_PLASTIC);
  hdr.position.copy(P(J.x - 8.9, 1.6 + 4.25, J.pcbCy));   // pin row at module left edge
  g.add(hdr);
  const post = box(3, 8.5, 3, BLACK_PLASTIC);
  post.position.copy(P(J.x + 9, 1.6 + 4.25, J.pcbCy + 8));
  g.add(post);

  const pcb = box(J.pcbW, 1.6, J.pcbH, new THREE.MeshStandardMaterial({ color: 0x9e1c20, roughness: 0.55 }));
  pcb.position.copy(P(J.pcbCx, 10.1 + 0.8, J.pcbCy));
  g.add(pcb);

  // stamped-steel gimbal housing
  const body = box(16, 11.5, 16, STEEL);
  body.position.copy(P(J.pcbCx, 11.7 + 5.75, J.pcbCy));
  g.add(body);

  // the stick pivots at the gimbal centre
  const stick = new THREE.Group();
  stick.position.copy(P(J.pcbCx, 17.5, J.pcbCy));
  const shaft = cyl(2, 12, BLACK_PLASTIC, 16);
  shaft.position.y = 11 * MM;
  stick.add(shaft);
  // rubber cap: squashed dome, PS2-thumbstick style — matte with a faint sheen
  const capMat = new THREE.MeshPhysicalMaterial({ color: 0x141416, roughness: 0.85, clearcoat: 0.35, clearcoatRoughness: 0.55 });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(9 * MM, 28, 18), capMat);
  cap.scale.y = 0.62;
  cap.position.y = 18.5 * MM;
  cap.castShadow = true;
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(6.5 * MM, 7.5 * MM, 1.6 * MM, 24), capMat);
  dish.position.y = 23.4 * MM;
  stick.add(cap, dish);
  g.add(stick);

  return { group: g, stick, cap };
}

// ------------------------------------------------------------------ small fry
function buildLED({ x, y, color }) {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({
    color, roughness: 0.15, transmission: 0, transparent: true, opacity: 0.88,
    emissive: color, emissiveIntensity: 0,
  });
  const body = cyl(2.5, 5.5, mat, 20);
  body.position.copy(P(x, 1.6 + 2.75, y));
  const dome = new THREE.Mesh(new THREE.SphereGeometry(2.5 * MM, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat);
  dome.position.copy(P(x, 1.6 + 5.5, y));
  const flange = cyl(2.9, 1, mat, 20);
  flange.position.copy(P(x, 1.6 + 0.5, y));
  g.add(body, dome, flange);
  return { group: g, mat };
}

function buildDIP(cx, cy, alongX, lenPads) {
  const g = new THREE.Group();
  const len = ((lenPads / 2 - 1) * 2.54) + 3.5;
  const body = box(alongX ? len : 6.6, 3.2, alongX ? 6.6 : len, BLACK_PLASTIC);
  body.position.copy(P(cx, 1.6 + 2.1, cy));
  g.add(body);
  const notch = cyl(1, 0.4, new THREE.MeshStandardMaterial({ color: 0x2c2e30, roughness: 0.5 }), 12);
  notch.position.copy(P(alongX ? cx - len / 2 + 1.2 : cx, 1.6 + 3.75, alongX ? cy : cy - len / 2 + 1.2));
  g.add(notch);
  for (const side of [-1, 1]) {
    const pins = box(alongX ? len - 2 : 1.2, 2.2, alongX ? 1.2 : len - 2, STEEL);
    pins.position.copy(P(cx + (alongX ? 0 : side * 3.6), 1.6 + 1.1, cy + (alongX ? side * 3.6 : 0)));
    g.add(pins);
  }
  return g;
}

function buildSpeaker() {
  const g = new THREE.Group();
  const S = PARTS.speaker;
  for (const [dx, dz] of [[-7, 6], [7, -6]]) {
    const standoff = cyl(1.2, 6.5, BLACK_PLASTIC, 10);
    standoff.position.copy(P(S.x + dx, 1.6 + 3.25, S.y + dz));
    g.add(standoff);
  }
  const frame = cyl(S.d / 2, 3.5, new THREE.MeshStandardMaterial({ color: 0x222426, roughness: 0.7 }), 32);
  frame.position.copy(P(S.x, 9.75, S.y));
  g.add(frame);
  // paper cone
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry((S.d / 2 - 1.6) * MM, 2.6 * MM, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x3a3428, roughness: 0.95, side: THREE.DoubleSide }),
  );
  cone.rotation.x = Math.PI;
  cone.position.copy(P(S.x, 10.6, S.y));
  g.add(cone);
  const dust = new THREE.Mesh(new THREE.SphereGeometry(2.6 * MM, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), BLACK_PLASTIC);
  dust.position.copy(P(S.x, 10.2, S.y));
  g.add(dust);

  // wires down to J5, the speaker header the board actually drives
  const H = PARTS.speakerHeader;
  for (const [c, off] of [[0xbb2222, 0.9], [0x222222, -0.9]]) {
    const curve = new THREE.CatmullRomCurve3([
      P(S.x - 8, 9.5, S.y + 3 + off),
      P(S.x - 12, 7, S.y + 6 + off),
      P(H.x + 1, 6, H.y - 3 + off),
      P(H.x, 4.5, H.y + off * 0.6),
    ]);
    const wire = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.55 * MM, 8), new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 }));
    g.add(wire);
  }
  return g;
}

function buildSlidePot() {
  // SPot1 measured from the file: body 54.10..89.10 × 83.50..92.50 mm —
  // 35 × 9, travel along X, centre (71.6, 88.0).
  const g = new THREE.Group();
  const cx = 71.6, cy = 88.0;
  const rail = box(35, 6, 9, new THREE.MeshStandardMaterial({ color: 0x5c6066, roughness: 0.45, metalness: 0.7 }));
  rail.position.copy(P(cx, 1.6 + 3, cy));
  g.add(rail);
  const slot = box(27, 0.8, 1.6, BLACK_PLASTIC);
  slot.position.copy(P(cx, 1.6 + 6.1, cy));
  g.add(slot);
  const knob = box(7, 9, 4, new THREE.MeshStandardMaterial({ color: 0x303236, roughness: 0.5 }));
  knob.position.copy(P(cx + 4, 1.6 + 7, cy));
  g.add(knob);
  return g;
}

function buildJack() {
  const g = new THREE.Group();
  const J = PARTS.jack;
  const body = box(11, 6, 12, BLACK_PLASTIC);
  body.position.copy(P(J.x, 1.6 + 3, 43.5));
  g.add(body);
  const barrel = cyl(3.2, 5, BLACK_PLASTIC, 20);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.copy(P(J.x, 1.6 + 3, 36.2));   // body reaches 2.9 mm past the top edge (file)
  g.add(barrel);
  return g;
}

function buildIR() {
  const g = new THREE.Group();
  const R = PARTS.irReceiver;
  // body 159.14..162.95 × 47.48..58.91 — tall and thin, and the silk arrows
  // aim the receiver eye at the board's RIGHT edge (+x)
  const can = box(3.4, 8, 10, BLACK_PLASTIC);
  can.position.copy(P(161.05, 1.6 + 6, 53.2));
  const eye = new THREE.Mesh(new THREE.SphereGeometry(2.0 * MM, 16, 10), new THREE.MeshStandardMaterial({ color: 0x1c1030, roughness: 0.2, metalness: 0.1 }));
  eye.position.copy(P(162.6, 1.6 + 7, 53.2));
  g.add(can, eye);
  const D = PARTS.irLed;
  const irLed = buildLED({ x: D.x, y: D.y, color: 0x4a2a68 });
  irLed.mat.opacity = 0.6;
  g.add(irLed.group);
  return g;
}

// ------------------------------------------------------------- LaunchPad back
function buildLaunchPad() {
  const g = new THREE.Group();
  const L = PARTS.launchpad;
  const cx = 105.41;   // true outline centre from the file (the anchor is 1.27 mm off)
  const pcb = box(L.w, 1.6, L.h, new THREE.MeshStandardMaterial({ color: 0x9e1f24, roughness: 0.5 }));
  pcb.position.copy(P(cx, -10.8, L.y));
  g.add(pcb);
  // stacking headers carrying the cohort board: four 10-pin rows along X on
  // the top and bottom edges (file: y 58.42/60.96 and 101.60/104.14, x 104..127)
  for (const ky of [59.7, 102.9]) {
    const h = box(25, 10, 6, BLACK_PLASTIC);
    h.position.copy(P(115.57, -5, ky));
    g.add(h);
  }
  const usb = box(8, 3, 6, STEEL);
  usb.position.copy(P(cx - L.w / 2 + 4, -12.9, 61.6));   // USB end faces the board's LEFT edge
  g.add(usb);
  const silk = silkDecal(['LP-MSPM0G3507'], 3.2);
  silk.mesh.rotation.x = Math.PI / 2;   // faces away (down in board space)
  silk.mesh.position.copy(P(cx + 26, -11.7, L.y + 18));
  g.add(silk.mesh);
  return g;
}

// ---------------------------------------------------------------- silkscreen
function buildSilk() {
  const g = new THREE.Group();
  // Every real silkscreen string (camp credits, refs, the UT shield) now
  // comes from the board texture — the file's own F.SilkS plot — so the
  // hand-drawn duplicates are gone. The one decal left is the credit from
  // Adi's bench sketch, which the real board doesn't carry; per the file
  // that spot is bare mask between the UT shield and the ESP footprint.
  const c = silkDecal(CREDIT_SILK.lines, CREDIT_SILK.size);
  c.mesh.position.copy(P(CREDIT_SILK.x, 1.72, CREDIT_SILK.y));
  g.add(c.mesh);
  return g;
}

// The real board faces, from the real file: kicad-cli layer plots composited
// into UV textures cropped exactly to Edge.Cuts (web/assets/board/*.png,
// 31.5 px/mm, drill holes punched to alpha — see board-tex.json). Overlaid a
// hair off the GLB substrate so every trace, pad ring and silk string on the
// board is the file's own, not hand-drawn.
function buildBoardSkin(texTop, texBottom) {
  const g = new THREE.Group();
  const W = 114.3 * MM, H = 88.9 * MM;   // verified Edge.Cuts extent
  const matOf = (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;   // 16 halves the frame rate on iGPUs; 4 reads fine
    return new THREE.MeshStandardMaterial({
      map: tex, alphaTest: 0.5, roughness: 0.55, envMapIntensity: 0.9,
      polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
    });
  };
  const top = new THREE.Mesh(new THREE.PlaneGeometry(W, H).rotateX(-Math.PI / 2), matOf(texTop));
  top.position.copy(P(BOARD.cx, 1.66, BOARD.cy));
  top.receiveShadow = true;
  g.add(top);
  if (texBottom) {
    // texture is as-seen-from-below; the extra Y-spin makes u run against +x
    const geo = new THREE.PlaneGeometry(W, H);
    geo.rotateX(Math.PI / 2);
    geo.rotateY(Math.PI);
    const bottom = new THREE.Mesh(geo, matOf(texBottom));
    bottom.position.copy(P(BOARD.cx, -0.06, BOARD.cy));
    g.add(bottom);
  }
  return g;
}

// The real U_WE1 (WEMOS D1 mini) footprint is UNPOPULATED on the real device —
// the sketch's "empty space" — but the KiCad export ships its 3D model anyway.
// Remove any small component mesh inside that footprint so the board matches
// the hardware, not the CAD library.
function stripUnpopulated(sceneRoot) {
  sceneRoot.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  const c = new THREE.Vector3();
  const E = PARTS.emptyFootprint;
  // the model's node anchors at the footprint corner, so test the geometry's
  // bounding-sphere centre as well as the node position
  const inRect = (p) => p.x / MM > E.x1 - 2 && p.x / MM < E.x2 + 2
                     && p.z / MM > E.y1 - 2 && p.z / MM < E.y2 + 2;
  const kill = [];
  sceneRoot.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh) return;
    // the module model is named by its reference designator
    if (o.name === 'J6') { kill.push(o); return; }
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    if (o.geometry.boundingSphere.radius > 0.03) return;   // never the board itself
    o.getWorldPosition(v);
    c.copy(o.geometry.boundingSphere.center).applyMatrix4(o.matrixWorld);
    if (inRect(v) || inRect(c)) kill.push(o);
  });
  for (const o of kill) o.parent && o.parent.remove(o);
}

// ============================================================== the assembly
export function buildHandheld(gltf, screenMaterial, skinTex) {
  const root = new THREE.Group();
  root.name = 'handheld';
  const inner = new THREE.Group();
  inner.position.set(-BOARD.cx * MM, -0.0008, -BOARD.cy * MM);
  root.add(inner);

  const boardScene = gltf.scene.clone(true);
  stripUnpopulated(boardScene);
  const instanced = [];
  const glbMats = new Set();
  boardScene.traverse((o) => {
    if (o.isInstancedMesh) instanced.push(o);
    if (o.isMesh) {
      o.castShadow = true; o.receiveShadow = o.count === undefined;
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) glbMats.add(m);
    }
  });
  // the KiCad export's materials are flat; let them catch the room + softbox
  for (const m of glbMats) {
    if ('envMapIntensity' in m) m.envMapIntensity = 0.9;
    if (m.map) m.map.anisotropy = 8;
  }
  inner.add(boardScene);
  if (skinTex) inner.add(buildBoardSkin(skinTex.top, skinTex.bottom));

  // The GLB splits each footprint model into many primitives, so one physical
  // switch is N InstancedMeshes sharing the same instance transforms. Group
  // them by instance count.
  const switchMeshes = instanced.filter((m) => m.count === 5);
  const resistorMeshes = instanced.filter((m) => m.count === 23);

  // map switch instance -> Switch.cpp bit by matching real footprint positions
  const switchMap = new Map();   // bit -> { index, rest: Matrix4 }
  if (switchMeshes.length) {
    const m = new THREE.Matrix4();
    for (let i = 0; i < switchMeshes[0].count; i++) {
      switchMeshes[0].getMatrixAt(i, m);
      const tx = m.elements[12] / MM, tz = m.elements[14] / MM;
      let best = null, bestD = 1e9;
      for (const sw of PARTS.switches) {
        const d = (sw.x - tx) ** 2 + (sw.y - tz) ** 2;
        if (d < bestD) { bestD = d; best = sw; }
      }
      if (best && bestD < 100) switchMap.set(best.bit, { index: i, rest: m.clone() });
    }
  }

  // procedural modules at real coordinates
  const lcd = buildLCD(screenMaterial);
  const joy = buildJoystick();
  inner.add(lcd.group, joy.group);
  inner.add(buildSpeaker(), buildSlidePot(), buildJack(), buildIR(), buildLaunchPad(), buildSilk());
  inner.add(buildDIP(65.31, 60.31, false, 8));           // U_AMP1
  inner.add(buildDIP(147.3, 63.7, true, 16));            // U_DT1 ULN2003

  // tantalum + axial caps
  for (const c of PARTS.capsRadial) {
    const blob = new THREE.Mesh(new THREE.SphereGeometry(2.4 * MM, 16, 12), new THREE.MeshStandardMaterial({ color: 0xd8b040, roughness: 0.8 }));
    blob.scale.y = 1.25;
    blob.castShadow = true;
    blob.position.copy(P(c.x, 1.6 + 2.6, c.y));
    inner.add(blob);
  }
  for (const c of PARTS.capsAxial) {
    const body = cyl(1.3, 5, new THREE.MeshStandardMaterial({ color: 0xcbb27e, roughness: 0.7 }), 12);
    body.rotation.z = Math.PI / 2;
    if (c.rot === -90) body.rotation.y = Math.PI / 2;
    const cx = c.rot === 180 ? c.x - 2.54 : c.x;
    const cyy = c.rot === -90 ? c.y + 2.54 : c.y;
    body.position.copy(P(cx, 2.9, cyy));
    inner.add(body);
  }

  // indicator LEDs
  const ledMats = [];
  for (const led of PARTS.leds) {
    if (led.populated === false) {   // D1 is desoldered on the real unit: draw nothing, keep the index
      ledMats.push({ emissiveIntensity: 0 });
      continue;
    }
    const b = buildLED(led);
    ledMats.push(b.mat);
    inner.add(b.group);
  }

  // probe target: J1, the testpoint under the ladder. Where the probe clips is
  // scenery; the shipped audio path is the internal DAC0 on PA15 (see hal.cpp).
  const probeAnchor = new THREE.Object3D();
  probeAnchor.position.copy(P(PARTS.probePoint.x, 4, PARTS.probePoint.y));
  inner.add(probeAnchor);

  // label anchors for the sketch-style annotations
  const anchors = {};
  const anchor = (name, kx, up, ky) => {
    const o = new THREE.Object3D();
    o.position.copy(P(kx, up, ky));
    inner.add(o);
    anchors[name] = o;
  };
  // annotation anchors ring the board edge, the way the sketch's callouts do
  anchor('speaker', 58, 6, 27);
  anchor('r2r', 86, 6, 19);
  anchor('lcd', 122, 6, 27);
  anchor('leds', 152, 6, 19);
  anchor('sd', 178, 6, 68);
  anchor('joystick', 34, 6, 128);
  anchor('dpad', 103, 6, 141);
  anchor('empty', 178, 6, 108);

  const api = {
    root,
    probeAnchor,
    anchors,
    screen: lcd.screen,
    stickCap: joy.cap,
    switchMeshes,
    switchMap,
    resistorMeshes,

    setLEDs(mask) {
      // pentris_led(): LaunchPad_LED bits live low; LED.cpp drives PA15..17.
      // Accept either encoding — both are real firmware state.
      for (let i = 0; i < 3; i++) {
        const on = (mask & (1 << i)) || (mask & (1 << (15 + i)));
        ledMats[i].emissiveIntensity = on ? 2.4 : 0;
      }
    },

    setJoystick(adcX, adcY, click) {
      // JoyX HIGH = stick pushed left (firmware wiring), so the visual lean
      // follows the same polarity the ISR reads
      const nx = (adcX - 2048) / 1852;
      const ny = (adcY - 2048) / 1852;
      joy.stick.rotation.z = 0.32 * nx;
      joy.stick.rotation.x = -0.32 * ny;
      joy.stick.position.copy(P(PARTS.joystick.pcbCx, 17.5 - (click === 0 ? 0.9 : 0), PARTS.joystick.pcbCy));
      joy.stick.updateMatrix();   // the scene graph is frozen; movers recompose themselves
    },

    setSwitches(mask) {
      const m = new THREE.Matrix4();
      for (const mesh of switchMeshes) {
        for (const [bit, entry] of switchMap) {
          m.copy(entry.rest);
          if (mask & (1 << bit)) m.elements[13] -= 0.0007;
          mesh.setMatrixAt(entry.index, m);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }
    },
  };
  return api;
}

// The same board with nothing soldered on it — for the bench, bottom-left.
export function buildBarePCB(gltf, skinTex) {
  const g = gltf.scene.clone(true);
  stripUnpopulated(g);
  if (skinTex) g.add(buildBoardSkin(skinTex.top, skinTex.bottom));
  const kill = [];
  g.traverse((o) => {
    if (o.isInstancedMesh || o.name === 'J6') kill.push(o);
    else if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });
  for (const o of kill) o.parent && o.parent.remove(o);
  const root = new THREE.Group();
  g.position.set(-BOARD.cx * MM, 0, -BOARD.cy * MM);
  root.add(g);
  return root;
}
