import type { Project } from '../types';

/**
 * ECE 302 design labs, Fall 2025. Facts sourced from the private experience
 * corpus record for this project. Coursework with a prescribed
 * spec: the circuits were given, the layouts were not. No efficiency or load
 * current was ever measured, so nothing here implies one.
 */
const ece302Pcb: Project = {
  slug: 'ece302-pcb',
  title: 'PCB design in KiCad',

  tagline: {
    recruiter:
      'Two two-layer boards drawn in KiCad, sent to a manufacturer, then built and probed.',
    builder:
      'Coursework with a fixed spec. The boards still came back from a fab house and had to work.',
  },

  summary: {
    recruiter:
      'Two ECE 302 lab boards designed in KiCad in Fall 2025: a dual-rail TLV2372 op-amp gain stage and a synchronous buck converter. Both went from schematic capture through layout to a complete Gerber and Excellon drill package, were ordered from a manufacturer, and came back to be populated and tested in lab. On the bench the converter read 960 mV of peak-to-peak output ripple with its switching node at 50.00 kHz. Each board was a two-person lab, with a different partner on each.',
    builder:
      'The circuits were specified by the course. The layout was not, and neither were the footprints. Drawing a symbol and a footprint for a Würth power inductor out of its datasheet, and deciding where the switch node and its return current would run, were the parts that were mine to get wrong. I did get one wrong: the buck layout lost points because the BNC connector sat with too little board overhang to connect easily.',
  },

  role: 'Co-designer (2-person lab pairs)',
  period: 'Sep 2025 – Nov 2025',
  status: 'complete',
  depth: 'overview',
  category: ['Embedded'],

  tech: [
    'KiCad',
    'Schematic capture',
    'PCB layout',
    'Gerber / Excellon',
    'TLV2372 op-amp',
    'CSD18534KCS NexFET',
    'TPS2832 gate driver',
    'Würth 7447231101 inductor',
    'Oscilloscope measurement',
    'Hand soldering',
  ],

  metrics: [
    {
      value: '2 boards',
      label: 'Two-layer, designed in KiCad, ordered from a manufacturer, and used in lab',
    },
    {
      value: '960 mV',
      label: 'Peak-to-peak output ripple measured on the buck board, switching node at 50.00 kHz',
    },
    {
      value: '101',
      label: 'Nets on the buck layout, across 38 footprints, 143 track segments and 14 vias',
    },
    {
      value: '16',
      label: 'Test points on the buck board: 8 measurement nodes, each with its own adjacent ground',
    },
    {
      value: '2 libraries',
      label: 'KiCad symbol and footprint sets drawn by hand from datasheets, including the Würth inductor',
    },
    {
      value: 'PTH + NPTH',
      label: 'Separate plated and non-plated drill files in each fabrication package',
    },
  ],

  links: {},

  sections: [
    {
      heading: 'What the course gave us, and what it did not',
      body: `Both boards came out of an ECE 302 lab handout. The topology, the part list and the test conditions were given: a dual-rail TLV2372 gain stage with a trim potentiometer for the first, and a synchronous buck converter for the second, with a complementary CSD18534KCS NexFET pair on 100 Ω gate drive, a TPS2832 gate driver, a Würth power inductor and a 0.5 Ω sense resistor in the return leg. Nobody was choosing a problem here.

What was left over is still most of a board. Placement, routing, the copper pour, where the return current actually flows, and which parts needed symbols and footprints that did not exist yet. The buck design ended up at 38 footprints across 101 nets, 143 track segments and 14 vias on two layers, and none of that comes out of a handout.

Both boards then went out as a fabrication package rather than as drawings: top and bottom copper, both solder masks, both silkscreens, the outline on Edge.Cuts, a job file, and separate plated and non-plated Excellon drill files. Plated and non-plated holes are different operations at the fab house. Nothing in the design tells you when you have got that wrong, which is the part of the flow I had no idea existed before doing it.`,
    },
    {
      heading: 'Drawing parts that were not in the library',
      body: `The buck components were not in the stock KiCad libraries, so the project carries its own: a BuckParts symbol library and a matching footprint library holding a hand-made footprint for the Würth 7447231101 power inductor. Pad geometry, courtyard and silkscreen outline, all read off a datasheet.

This is the part of board design with no shortcut. A symbol that is wrong gives you a netlist that is wrong, and a footprint that is wrong gives you a board that comes back with pads in the wrong places. Both errors survive every check the software runs, because the software has no idea what the real part looks like.

The same skill went into something much less serious. The Texas Instruments and Würth logos on the silkscreens are purpose-built footprints too.`,
    },
    {
      heading: 'Bring-up, and my own solder bridge',
      body: `The op-amp board came back from the manufacturer and I hand-soldered it in lab, SOIC-8 op-amp included. The test readings were plainly wrong, so instead of guessing at the circuit I went through it piece by piece and traced the fault to a short across two op-amp pins. The session ran out before I could act on it, so I submitted the board in its known-broken state and the rubric records the fault verbatim. In the next session I desoldered the short and repaired it locally, without reflowing the joints around it.

The buck board is where the measurement planning paid off. It carries 16 test points: eight measurement nodes, each with its own ground point sitting right next to it. Probing a fast switching edge against a ground clip on the far side of the board gives you ringing that belongs to the probe loop rather than to the circuit, and a local ground has to go in during layout, before there is anything to measure.

With the board built and on the bench, running from a 5 V input at 50 kHz and 50% duty, the output showed 960 mV of peak-to-peak ripple. Load current never got recorded, which is also what I lost points for, so there is no efficiency figure to go with it.`,
    },
  ],
};

export default ece302Pcb;
