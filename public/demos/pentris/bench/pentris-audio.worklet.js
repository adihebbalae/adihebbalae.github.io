// pentris-audio.worklet.js — the speaker end of the firmware's DAC.
//
// Corrected 2026-08-28: this file described itself as the speaker end of a 5-bit
// R-2R ladder. That ladder is on the board and the course lab uses it, but the
// shipped firmware does not. Sound.cpp writes the MSPM0's internal 12-bit DAC0
// on PA15.
//
// The main thread drains DAC_Out samples from the WASM ring buffer and posts
// them here. This processor plays them at the firmware's DAC rate (11025 Hz on
// the real board) against the AudioContext rate using zero-order hold: a DAC
// register holds its output between timer ticks, so ZOH is the honest
// reconstruction. No interpolation, no smoothing.
//
// Underrun policy matches the hardware too: a converter with no new write keeps
// its last output, so on empty queue the last sample is held (DC, inaudible
// through a speaker, exactly like the real thing at rest).

class PentrisDAC extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.srcRate = (options.processorOptions && options.processorOptions.srcRate) || 11025;
    this.queue = [];
    this.head = 0;        // index into queue[0]
    this.frac = 0;        // fractional source-sample position
    this.last = 0;        // ladder holds its last level
    this.port.onmessage = (e) => {
      if (e.data && e.data.samples && e.data.samples.length) this.queue.push(e.data.samples);
      if (e.data && e.data.srcRate) this.srcRate = e.data.srcRate;
    };
  }

  nextSource() {
    while (this.queue.length) {
      const buf = this.queue[0];
      if (this.head < buf.length) return buf[this.head++];
      this.queue.shift();
      this.head = 0;
    }
    return null;
  }

  process(_inputs, outputs) {
    const out = outputs[0][0];
    const step = this.srcRate / sampleRate;
    for (let i = 0; i < out.length; i++) {
      this.frac += step;
      while (this.frac >= 1) {
        this.frac -= 1;
        const s = this.nextSource();
        if (s !== null) this.last = s;
      }
      out[i] = this.last;
    }
    return true;
  }
}

registerProcessor('pentris-dac', PentrisDAC);
