// Procedural sound — synthesised with the Web Audio API so the game needs no
// audio files. Framework-agnostic singleton, shared by React and Phaser.

class SoundManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.noiseBuffer = null;
    this.muted = false;
    this.musicMode = null;
    this.music = null;
  }

  _ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.55;
      this.master.connect(this.ctx.destination);
      const len = Math.floor(this.ctx.sampleRate * 0.6);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buf;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  // Called from a user gesture so the AudioContext is allowed to start.
  unlock() {
    const ctx = this._ensure();
    if (ctx && this.musicMode) this._startMusic();
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.55;
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // --- synthesis primitives ----------------------------------------------

  _tone(freq, dur, opts = {}) {
    const ctx = this._ensure();
    if (!ctx) return;
    const { type = 'sine', gain = 0.3, attack = 0.005, end = freq, delay = 0 } =
      opts;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (end !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, end), t + dur);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }

  _noise(dur, opts = {}) {
    const ctx = this._ensure();
    if (!ctx) return;
    const { type = 'bandpass', freq = 1000, q = 1, gain = 0.3, delay = 0 } =
      opts;
    const t = ctx.currentTime + delay;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.03);
  }

  // --- sound effects ------------------------------------------------------

  hit(crit = false) {
    this._noise(crit ? 0.22 : 0.13, {
      type: 'bandpass',
      freq: 1500,
      q: 0.8,
      gain: crit ? 0.5 : 0.32,
    });
    this._tone(crit ? 150 : 110, crit ? 0.2 : 0.13, {
      end: crit ? 50 : 45,
      gain: 0.4,
    });
    if (crit) this._tone(880, 0.25, { type: 'square', gain: 0.12, delay: 0.02 });
  }

  monsterHit() {
    this._noise(0.14, { type: 'lowpass', freq: 700, gain: 0.3 });
    this._tone(80, 0.16, { end: 40, gain: 0.35 });
  }

  cast(element = 'default') {
    if (element === 'fire') {
      this._tone(620, 0.4, { type: 'sawtooth', end: 120, gain: 0.22 });
    } else if (element === 'ice') {
      this._tone(1200, 0.5, { type: 'triangle', gain: 0.16 });
      this._tone(1800, 0.5, { type: 'sine', gain: 0.1, delay: 0.05 });
    } else if (element === 'lightning') {
      this._noise(0.18, { type: 'highpass', freq: 2600, gain: 0.3 });
      this._tone(140, 0.12, { type: 'square', end: 60, gain: 0.25 });
    } else {
      this._tone(300, 0.35, { type: 'triangle', end: 760, gain: 0.2 });
    }
  }

  heal() {
    [523, 659, 784].forEach((f, i) =>
      this._tone(f, 0.5, { gain: 0.16, delay: i * 0.09 }),
    );
  }

  treasure() {
    [988, 1319].forEach((f, i) =>
      this._tone(f, 0.7, { gain: 0.2, delay: i * 0.08 }),
    );
  }

  levelUp() {
    [523, 659, 784, 1047].forEach((f, i) =>
      this._tone(f, 0.5, { type: 'triangle', gain: 0.2, delay: i * 0.1 }),
    );
  }

  step() {
    this._noise(0.06, { type: 'lowpass', freq: 420, gain: 0.12 });
  }

  bump() {
    this._noise(0.1, { type: 'lowpass', freq: 240, gain: 0.22 });
  }

  descend() {
    this._tone(220, 0.6, { end: 90, gain: 0.25 });
  }

  victory() {
    [523, 659, 784].forEach((f) =>
      this._tone(f, 1.1, { type: 'triangle', gain: 0.18 }),
    );
    [1047, 1319].forEach((f, i) =>
      this._tone(f, 0.9, { gain: 0.13, delay: 0.25 + i * 0.12 }),
    );
  }

  defeat() {
    this._tone(330, 1.2, { end: 120, gain: 0.3 });
    this._tone(165, 1.4, { type: 'triangle', end: 70, gain: 0.2, delay: 0.1 });
  }

  // --- ambient music ------------------------------------------------------

  playMusic(mode) {
    this.musicMode = mode;
    if (this.ctx && this.ctx.state === 'running') this._startMusic();
  }

  _startMusic() {
    const ctx = this.ctx;
    if (!this.music) {
      const g = ctx.createGain();
      g.gain.value = 0;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      const o1 = ctx.createOscillator();
      o1.type = 'triangle';
      const o2 = ctx.createOscillator();
      o2.type = 'sine';
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.035;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      o1.connect(lp);
      o2.connect(lp);
      lp.connect(g);
      g.connect(this.master);
      o1.start();
      o2.start();
      lfo.start();
      this.music = { g, lp, o1, o2, lfo };
    }
    const m = this.music;
    const t = ctx.currentTime;
    if (this.musicMode === 'combat') {
      m.o1.frequency.setValueAtTime(73.42, t);
      m.o2.frequency.setValueAtTime(110, t);
      m.lp.frequency.setValueAtTime(520, t);
      m.lfo.frequency.setValueAtTime(2.4, t);
    } else {
      m.o1.frequency.setValueAtTime(55, t);
      m.o2.frequency.setValueAtTime(82.41, t);
      m.lp.frequency.setValueAtTime(360, t);
      m.lfo.frequency.setValueAtTime(0.13, t);
    }
    m.g.gain.cancelScheduledValues(t);
    m.g.gain.linearRampToValueAtTime(0.09, t + 1.5);
  }

  stopMusic() {
    this.musicMode = null;
    if (this.music && this.ctx) {
      const t = this.ctx.currentTime;
      this.music.g.gain.cancelScheduledValues(t);
      this.music.g.gain.linearRampToValueAtTime(0, t + 0.6);
    }
  }
}

export const audio = new SoundManager();
