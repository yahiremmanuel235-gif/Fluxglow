// Audio synthesizer utilizing Web Audio API for mindfulness, breathing pacers, and soothing ambient tones

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentOscillators: OscillatorNode[] = [];
  private currentGains: GainNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private isPlayingAmbient: boolean = false;
  private activeSoundName: string | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play bell chime
  playChime(type: 'bell' | 'soft' = 'bell') {
    this.playBell(type === 'bell' ? 528 : 432, 2.5);
  }

  // Voice speech synthesis fallback
  speak(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error', e);
      }
    }
  }

  // Play a gentle meditation bell / singing bowl chime
  playBell(freq = 528, duration = 3.5) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Harmonic overtone
      const overtone = this.ctx.createOscillator();
      const overtoneGain = this.ctx.createGain();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      overtoneGain.gain.setValueAtTime(0.001, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      osc.connect(gain);
      overtone.connect(overtoneGain);

      gain.connect(this.ctx.destination);
      overtoneGain.connect(this.ctx.destination);

      osc.start(now);
      overtone.start(now);

      osc.stop(now + duration);
      overtone.stop(now + duration);
    } catch (e) {
      console.warn("Audio Context playback error:", e);
    }
  }

  // Play breathing cue tone (low harmonic for inhale, gentle soft chime for exhale)
  playBreathingCue(type: 'inhale' | 'hold' | 'exhale') {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      if (type === 'inhale') {
        osc.frequency.setValueAtTime(396, now); // Solfeggio Root Liberating
        osc.frequency.exponentialRampToValueAtTime(528, now + 1.5);
      } else if (type === 'hold') {
        osc.frequency.setValueAtTime(528, now);
      } else {
        osc.frequency.setValueAtTime(528, now);
        osc.frequency.exponentialRampToValueAtTime(396, now + 2.0);
      }

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.3);
    } catch (e) {
      // ignore
    }
  }

  // Toggle ambient peaceful background waves
  toggleAmbient(soundType: 'ocean' | 'rain' | 'zen' = 'zen'): boolean {
    if (this.isPlayingAmbient && this.activeSoundName === soundType) {
      this.stopAmbient();
      return false;
    }

    this.stopAmbient();
    this.initContext();
    if (!this.ctx) return false;

    this.isPlayingAmbient = true;
    this.activeSoundName = soundType;

    const now = this.ctx.currentTime;

    if (soundType === 'zen') {
      // Warm chord drone (F major 9: F, A, C, E, G)
      const freqs = [174.61, 220.00, 261.63, 329.63];
      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        // Gentle LFO for warmth
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + idx * 0.05, now);
        lfoGain.gain.setValueAtTime(2.0, now);
        lfo.connect(osc.frequency);
        lfo.start(now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04 / freqs.length, now + 1.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        this.currentOscillators.push(osc, lfo);
        this.currentGains.push(gain, lfoGain);
      });
    } else {
      // Pink/White noise generator for rain / ocean
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for gentle rain or ocean
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(soundType === 'ocean' ? 450 : 800, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 1.0);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      this.noiseNode = whiteNoise;
      this.currentGains.push(gain);
    }

    return true;
  }

  stopAmbient() {
    this.currentOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    this.currentGains.forEach(gain => {
      try { gain.disconnect(); } catch (e) {}
    });
    if (this.noiseNode) {
      try { this.noiseNode.stop(); this.noiseNode.disconnect(); } catch (e) {}
      this.noiseNode = null;
    }
    this.currentOscillators = [];
    this.currentGains = [];
    this.isPlayingAmbient = false;
    this.activeSoundName = null;
  }

  isPlaying() {
    return this.isPlayingAmbient;
  }

  getActiveSound() {
    return this.activeSoundName;
  }
}

export const soundEngine = new AmbientSoundEngine();
