/**
 * audio.js
 * Generates calm, procedural ocean wave sounds using Web Audio API.
 * No external audio files or network requests required.
 */

class OceanAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.noiseSource = null;
    this.lfo = null;
    this.filter = null;
    this.listeners = [];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      console.warn("Web Audio API not supported in this browser.");
      return;
    }

    this.ctx = new AudioContext();

    // Master volume control with gentle ceiling
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Create 5 seconds of pink noise buffer (Paul Kellet's filter method)
    const bufferSize = this.ctx.sampleRate * 6;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const output = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }
    }

    // Noise source node looping continuously
    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;

    // Resonant lowpass filter to mimic rolling underwater swell
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

    // LFO (Low Frequency Oscillator) to modulate wave swell frequency (approx 8-9 sec cycles)
    this.lfo = this.ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8.3 sec per wave

    // Modulate filter cutoff between ~180 Hz and ~580 Hz
    const lfoFilterGain = this.ctx.createGain();
    lfoFilterGain.gain.setValueAtTime(220, this.ctx.currentTime);
    this.lfo.connect(lfoFilterGain);
    lfoFilterGain.connect(this.filter.frequency);

    // Secondary subtle stereo foam layer
    const foamFilter = this.ctx.createBiquadFilter();
    foamFilter.type = "bandpass";
    foamFilter.frequency.setValueAtTime(750, this.ctx.currentTime);
    foamFilter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const foamGain = this.ctx.createGain();
    foamGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    // Connect audio graph
    this.noiseSource.connect(this.filter);
    this.filter.connect(this.masterGain);

    this.noiseSource.connect(foamFilter);
    foamFilter.connect(foamGain);
    foamGain.connect(this.masterGain);

    this.noiseSource.start();
    this.lfo.start();
  }

  async toggle() {
    if (!this.ctx) {
      this.init();
    }

    if (!this.ctx) return false;

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    if (!this.isPlaying) {
      // Fade in smoothly over 1.8 seconds to soft volume
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.18, now + 1.8);
      this.isPlaying = true;
    } else {
      // Fade out smoothly over 1.2 seconds
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
      this.isPlaying = false;
    }

    this.notify();
    return this.isPlaying;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.isPlaying);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.isPlaying));
  }

  getState() {
    return this.isPlaying;
  }
}

export const oceanAudio = new OceanAudio();
