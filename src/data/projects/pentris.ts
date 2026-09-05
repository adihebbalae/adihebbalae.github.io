import type { Project } from '../types';

/**
 * ECE 319H capstone. Facts sourced from the private experience corpus record
 * for this project; the flash and SRAM figures come from the build's linker
 * map (MEMORY CONFIGURATION block).
 */
const pentris: Project = {
  slug: 'pentris',
  title: 'Pentris',

  tagline: {
    recruiter:
      'A handheld game console running bare-metal C++ on a device with 160 KB of memory.',
    builder:
      'Every feature was checked against a linker map. Getting sound out meant desoldering an LED.',
  },

  summary: {
    recruiter:
      'Pentris is a pentomino falling-block game that runs on a hand-soldered handheld console with no operating system underneath it. Built with one teammate for ECE 319H at UT Austin, the firmware is roughly 2,850 lines of C++ on an MSPM0G3507. The shipped build uses 99,248 of 131,072 bytes of flash and 21,990 of 32,768 bytes of SRAM, verified against the linker map, and the soundtrack streams off an SD card because every loop is larger than the whole device.',
    builder:
      'Everything interesting about this project came from the same place: the device is small and the things we wanted to put on it were not. Audio became a streaming problem because 187 to 488 KB loops cannot live in 128 KB of flash. Sound output became a pin-budget problem, because the converter we wanted shares its pin with an indicator LED, and we ended up taking the LED off the board to get it. Two of us wrote it over about six weeks, reading the map file after every feature landed.',
  },

  role: 'Co-developer (2-person team)',
  period: 'Mar 2026 – Apr 2026',
  status: 'complete',
  depth: 'overview',
  category: ['Embedded'],

  tech: [
    'C++',
    'MSPM0G3507',
    'ARM Cortex-M0+',
    'Bare metal (no RTOS)',
    'Code Composer Studio',
    'Timer interrupts',
    'Internal 12-bit DAC',
    'SPI',
    'ADC',
    'ST7735R TFT',
    'SD card',
    'Hand soldering',
    'Git',
  ],

  metrics: [
    {
      value: '99,248 / 131,072',
      label: 'Bytes of flash used (75.7%), read from the linker map',
    },
    {
      value: '21,990 / 32,768',
      label: 'Bytes of SRAM used (67.1%)',
    },
    {
      value: '187–488 KB',
      label: 'Size of each soundtrack loop, on a device with 160 KB of ROM and RAM combined',
    },
    {
      value: '12-bit',
      label: 'Internal DAC0 on PA15, driven from a timer ISR at 11,025 Hz, after we freed the pin the board had spent on an LED',
    },
    {
      value: '~2,850',
      label: 'Lines of hand-written bare-metal C++',
      recruiterOnly: true,
    },
    {
      value: '44',
      label: 'Commits across a two-person team, March to April 2026',
      recruiterOnly: true,
    },
  ],

  links: {
    github: 'https://github.com/adihebbalae/319H_Lab',
  },

  sections: [
    {
      heading: 'We took an LED off the board to get better sound',
      body: `The console runs on a board the ECE 319H cohort designed together at a PCB camp in early 2026, and each student populated and soldered their own. That matters here, because the board is the reason the sound works the way it does.

The course's audio path is five GPIO pins, PB0 through PB4, feeding a binary-weighted R-2R resistor ladder that sums to one voltage driving the speaker. Five bits is 32 output levels, and how accurate those levels are depends on real resistor tolerances rather than on a spec sheet. That ladder is populated on our board and we started there.

The MSPM0G3507 also has an internal 12-bit DAC, which is 4,096 levels and no tolerance stack at all. Its output is PA15, and on this board PA15 is wired to indicator LED D1, so the pin was not ours to use. We desoldered D1 and cut its trace, which is a decision you cannot take back on a hand-soldered board with no spare. The remaining catch is that the LED driver's initialization sets PA15's pin mux back to GPIO, which silently kills the DAC, so LED_Init has to skip that pin: sound and the indicator LEDs cannot both exist here, and we chose sound.

A timer interrupt writes a new 12-bit sample every tick at 11,025 Hz. That still puts sound quality inside the scheduler. If the ISR runs late the pitch drifts, and there is no peripheral underneath to cover for you.`,
    },
    {
      heading: 'Music larger than the machine it plays on',
      body: `The soundtrack loops came out between 187 and 488 KB each. The device has 128 KB of flash and 32 KB of SRAM. Every track was several times the size of the whole console, so there was no version of this where the audio sits in flash and gets played back.

The loops went onto the SD card instead, streaming into a small RAM buffer that the same timer interrupt refills. That fixed the storage problem and created a timing one. The SD card shares its SPI clock and MOSI lines with the ST7735R display, so every buffer refill contends with screen writes while the game is running.

The alternative was compressing the music down until it fit, which would have meant not shipping the soundtrack we wrote.`,
    },
    {
      heading: 'Working against the linker map',
      body: `Source size tells you nothing about what a build costs. The generated sprite header alone is 176 KB of C++, larger than the flash it would have to fit inside, and most of it never shipped. The only number that means anything is in the MEMORY CONFIGURATION block of the map file, so we read it after every feature landed.

The final build sits at 99,248 of 131,072 bytes of flash and 21,990 of 32,768 bytes of SRAM. The headroom was deliberate. A build that fits at 99% is a build that cannot take one more sprite.

Sprite art ran through a generation script that converted artwork to 16-bit 5-6-5 color and emitted it as compiled headers. Four versions of the sprite set went in before the game played the way we wanted.`,
    },
  ],
};

export default pentris;
