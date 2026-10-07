// board-data.js — real component placement, extracted from the real board file.
//
// Every coordinate below was read out of the cohort board KiCad file (the cohort
// board this console is built on), not eyeballed from a photo. The GLB that
// kicad-cli exports uses the same coordinate frame: KiCad page millimetres,
// straight to metres — node J6 sits at (0.1531, y, 0.0710) in the GLB and at
// (153.08, 71) in the .kicad_pcb, which is how the mapping was verified.
//
// Frame: x = KiCad x (mm/1000), z = KiCad y (mm/1000), y = up off the board
// face. KiCad y grows toward the bottom edge of the board.
//
// The GLB itself carries real geometry for the substrate, copper, the five
// 6 mm switches, the axial resistors and the pin headers. Components whose
// footprints had no STEP model (LCD module, joystick breakout, LEDs, DIPs,
// jack, slide pot, IR parts, LaunchPad) are built procedurally in handheld.js
// at the positions listed here.

export const MM = 0.001;

// Edge.Cuts bounding box of the board outline.
export const BOARD = {
  minX: 50.8, minY: 38.1, maxX: 165.1, maxY: 127,
  get w() { return this.maxX - this.minX; },   // 114.3 mm
  get h() { return this.maxY - this.minY; },   //  88.9 mm
  get cx() { return (this.minX + this.maxX) / 2; },  // 107.95
  get cy() { return (this.minY + this.maxY) / 2; },  //  82.55
  thickness: 1.6,
};

// Footprint anchors (KiCad `at`), in board mm. rot in KiCad degrees.
export const PARTS = {
  // ST7735R LCD module (HiLetgo). Footprint outline is 45.7 x 53.4 mm around
  // the anchor; the 17 header pads run along the module's top edge (y ≈ -24).
  lcd: { x: 112.55, y: 66.5, rot: 0, w: 45.7, h: 53.4 },
  // Active area of the 1.8" panel, 128x160 portrait.
  lcdActive: { w: 28.03, h: 35.04, cx: 112.55, cy: 68.0 },

  // SparkFun thumb joystick breakout; stick body centred on the outline.
  joystick: { x: 68.5, y: 112.6, rot: 0, pcbW: 21.0, pcbH: 25.4, pcbCx: 68.54, pcbCy: 112.58 },

  // The five 6 mm tactile switches (already present in the GLB as instances —
  // these anchors map instance -> reference so input can animate the right one).
  // Switch.cpp: bit4=SW1 UP, bit3=SW2 LEFT, bit2=SW3 DOWN, bit1=SW4 RIGHT
  // (permanently masked: PA25 shares the pin with ADC0 ch2), bit0=SW5 BTN1.
  switches: [
    { ref: 'SW1', x: 94.75, y: 106.75, bit: 4, label: 'UP' },
    { ref: 'SW2', x: 83.0, y: 111.5, bit: 3, label: 'LEFT' },
    { ref: 'SW3', x: 94.75, y: 115.75, bit: 2, label: 'DOWN' },
    { ref: 'SW4', x: 105.75, y: 111.25, bit: 1, label: 'RIGHT (dead)' },
    { ref: 'SW5', x: 117.0, y: 111.5, bit: 0, label: 'BTN1' },
  ],

  // Three 5 mm indicator LEDs (D1..D3 behind the ULN2003 driver), top right.
  // LED_D5.0mm pads at rel (0,0) and (2.54,0); body centre offset by rotation.
  // D1 is a special case on the shipped unit: it was desoldered and its trace
  // cut so PA15 could be used as the internal DAC output. `populated: false`
  // records that. Nothing consumes the flag yet; the renderer still draws three
  // LEDs, which is one more than the physical device has. Open task for the
  // next render pass (2026-08-28).
  leds: [
    { ref: 'D1', x: 138.81, y: 53.81, color: 0xff2a1a, populated: false },
    { ref: 'D2', x: 146.25, y: 53.5, color: 0xffa020 },
    { ref: 'D3', x: 153.27, y: 53.69, color: 0x30ff40 },
  ],
  irLed: { x: 161.73, y: 64.5 },          // DIR1, IR emitter
  irReceiver: { x: 161.05, y: 57, rot: 180 },  // U_IRS1 TSOP31438

  // R-2R "binary DAC" ladder: the column of axial resistors the sketch calls
  // out, RC1..RC8 at x=77 — plus J1, the testpoint directly below it, which is
  // where the oscilloscope probe physically clips on.
  //
  // The ladder is populated and it is the path the cohort design and the course
  // lab intend. The shipped firmware does not drive it: Sound.cpp outputs
  // through the internal 12-bit DAC0 on PA15 instead. See hal/hal.cpp.
  // TODO: how PA15 reaches the amplifier on the physical unit is NOT verified.
  // D1 was desoldered and its trace cut to free the pin; whether a jumper then
  // lands on J1, on the amp input, or somewhere else has not been read off the
  // board. Do not draw a wire for it and do not claim one.
  r2r: { x: 77, yTop: 40.5, yBottom: 61.5 },
  probePoint: { x: 74.225, y: 67 },        // J1 Testpoint_1x02

  // Audio path, top-left: 3.5mm jack, LM386-class amp (DIP-8), speaker header.
  jack: { x: 66, y: 41.5, rot: 180, w: 12.7, h: 14.5 },
  amp: { x: 61.5, y: 56.5, rot: 0, pads: 8 },        // U_AMP1 DIP-8, body ~10x10
  speakerHeader: { x: 56, y: 62.225 },               // J5, where the speaker wires land
  // The speaker itself is off-board hardware wired to J5; the sketch mounts it
  // over the amp corner, so that is where it goes.
  speaker: { x: 64.5, y: 51.5, d: 20 },

  // ULN2003 LED driver, DIP-16 rotated 90 (body spans x 137..158, y 59..69).
  uln: { x: 138.46, y: 67.5, rot: 90, pads: 16 },

  // Slide pot, left edge, vertical strip in page space.
  slidePot: { x: 55.105, y: 86.25, rot: 0, len: 36.2, wid: 10 },

  // Tantalum + axial caps.
  capsRadial: [ { x: 80.46, y: 76 }, { x: 72.04, y: 76 } ],   // CA2 (rot180), CA1
  capsAxial: [
    { x: 162.06, y: 70.94, rot: 180 },   // C1
    { x: 60.94, y: 70.94, rot: -90 },    // CtA1
  ],

  // UT logo silkscreen footprint (G***) on the real board.
  logo: { x: 145.07, y: 79.82 },

  // Unpopulated ESP8266 (WEMOS D1 mini) footprint — the sketch's literal
  // "empty space", bottom-right: x 137..165, y 92..118. Nothing is built here.
  emptyFootprint: { x1: 137.3, y1: 92.4, x2: 165.1, y2: 118.5 },

  // LaunchPad LP-MSPM0G3507 on the BACK of the board (B.Cu), 104x56 mm.
  // Its STEP model is the one missing from the KiCad export; substituted
  // procedurally.
  launchpad: { x: 106.68, y: 81.28, w: 104.1, h: 55.9 },
};

// Real silkscreen text on the cohort board (F.SilkS). The cohort's name line is
// deliberately not listed here; see STRIP_SILK_NAMES below.
export const SILK = [
  { txt: 'ECE319K PCB camp\nSpring 2026', x: 132.5, y: 124.6, size: 1.7, anchor: 'center' },
];

// Public-build switch for the people named on the board. true (default): the board
// textures have the cohort's silkscreen name lines removed (board-top.png and
// board-bottom.png) and the credit decal names only Adi. false: the untouched
// plots (board-top.names.png, board-bottom.names.png) and the original two-name decal.
export const STRIP_SILK_NAMES = true;

// The device credit from Adi's bench sketch — the silkscreen the brief says to
// keep legible. Placed under the UT logo, above the empty ESP footprint.
export const CREDIT_SILK = {
  lines: STRIP_SILK_NAMES ? ['ADITHYA HEBBALAE'] : ['ADITHYA HEBBALAE', 'NEVIN K.'],
  x: 149.8, y: 87.5, size: 2.6,
};

// Firmware surface facts used by the instruments.
export const FIRMWARE = {
  // Internal DAC0 on PA15: 12-bit straight binary, 4096 levels, silence at
  // midscale 2048. Corrected 2026-08-28. This said 5 and named the R-2R ladder
  // on PB0..PB4, which the shipped Sound.cpp does not use. Everything that puts
  // a number on screen now reads it from here, so the readout cannot drift away
  // from the model a second time.
  dacBits: 12,
  dacLabel: 'internal DAC0 · PA15',
  dacRateHz: 11025,    // one sample per timer tick on the real board
  adcCentre: 2048,     // 12-bit joystick ADC, stick rests mid-scale
  adcLow: 200, adcHigh: 3900,
};
