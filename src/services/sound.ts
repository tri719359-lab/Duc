/**
 * Procedural Web Audio API sound effects and background music for Tiệm Phở Vui Vẻ.
 * Generates 100% synthesis without external asset network dependencies.
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmPlaying: boolean = false;
  private bgmInterval: number | null = null;
  private bgmStep: number = 0;

  constructor() {
    // Automatically attach listeners to unlock audio context on the user's very first interaction (click, tap, keypress)
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlockAudio().catch(() => {});
      };
      window.addEventListener('pointerdown', unlock, { capture: true, once: true });
      window.addEventListener('touchstart', unlock, { capture: true, once: true });
      window.addEventListener('click', unlock, { capture: true, once: true });
      window.addEventListener('keydown', unlock, { capture: true, once: true });
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Unlock AudioContext immediately upon user gesture and start BGM if not muted
   */
  public async unlockAudio(): Promise<boolean> {
    this.initCtx();
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // User gesture may still be required
      }
    }
    const isRunning = this.ctx?.state === 'running';
    if (isRunning && !this.isMuted && !this.bgmPlaying) {
      this.startBGM();
    }
    return isRunning;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.bgmPlaying) {
      this.stopBGM();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.unlockAudio().then(() => {
        this.startBGM();
      });
    }
    return this.isMuted;
  }

  /* -------------------------------------------------------------------------- */
  /*                      BGM: COZY VIETNAMESE PHO LOFI THEME                   */
  /* -------------------------------------------------------------------------- */
  public startBGM() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // If context is still suspended, try resuming and then start
    if (this.ctx.state === 'suspended') {
      this.ctx
        .resume()
        .then(() => {
          if (!this.bgmPlaying && !this.isMuted) {
            this.startBGM();
          }
        })
        .catch(() => {});
      return;
    }

    if (this.bgmPlaying) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;

    // Pentatonic scale (C, D, E, G, A) typical of traditional folk melodies
    const pentatonicMelody = [
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      783.99, // G5
      659.25, // E5
      587.33, // D5
      523.25, // C5
      659.25, // E5
      783.99, // G5
      1046.50, // C6
      880.00, // A5
      783.99, // G5
      659.25, // E5
      523.25, // C5
    ];

    const bassNotes = [130.81, 164.81, 196.00, 220.00]; // C3, E3, G3, A3

    const playStep = () => {
      if (!this.bgmPlaying || !this.ctx || this.isMuted) return;

      const t = this.ctx.currentTime;
      const step = this.bgmStep % pentatonicMelody.length;

      // 1. Plucked melody note (marimba / đàn tranh timbre)
      if (Math.random() > 0.15) {
        const noteFreq = pentatonicMelody[step];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(noteFreq, t);

        gain.gain.setValueAtTime(0.045, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.5);
      }

      // 2. Soft acoustic bass note on every 4th step
      if (step % 4 === 0) {
        const bassFreq = bassNotes[(step / 4) % bassNotes.length];
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bassFreq, t);
        bGain.gain.setValueAtTime(0.06, t);
        bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);
        bOsc.start(t);
        bOsc.stop(t + 0.95);
      }

      // 3. Gentle kitchen shaker / woodblock beat on off-beats
      if (step % 2 === 1) {
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(1200, t);
        clickOsc.frequency.exponentialRampToValueAtTime(400, t + 0.03);
        clickGain.gain.setValueAtTime(0.015, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(t);
        clickOsc.stop(t + 0.04);
      }

      this.bgmStep++;
    };

    // 260ms per beat = ~115 bpm
    this.bgmInterval = window.setInterval(playStep, 260);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public isBGMOn(): boolean {
    return this.bgmPlaying;
  }

  /* -------------------------------------------------------------------------- */
  /*                            SOUND EFFECTS                                   */
  /* -------------------------------------------------------------------------- */

  // Chuông cửa "Kính Coong" khi có khách bước vào quán
  public playDoorChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [1046.5, 1318.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.12);
      gain.gain.setValueAtTime(0.18, t + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.12 + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.12);
      osc.stop(t + idx * 0.12 + 0.6);
    });
  }

  // Tiếng đập bàn rầm rầm khi khách giận dỗi bỏ đi!
  public playTableSlam() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Heavy resonant impact thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);

    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.45);

    // 2. High-impact wooden table snap/crack
    const bufferSize = this.ctx.sampleRate * 0.18;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + 0.22);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(1.0, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // 3. Shivering plates & tableware rattle
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const rattleTime = this.ctx.currentTime;
      const rOsc = this.ctx.createOscillator();
      const rGain = this.ctx.createGain();
      rOsc.type = 'sine';
      rOsc.frequency.setValueAtTime(1800, rattleTime);
      rOsc.frequency.setValueAtTime(2200, rattleTime + 0.05);
      rGain.gain.setValueAtTime(0.3, rattleTime);
      rGain.gain.exponentialRampToValueAtTime(0.001, rattleTime + 0.2);
      rOsc.connect(rGain);
      rGain.connect(this.ctx.destination);
      rOsc.start(rattleTime);
      rOsc.stop(rattleTime + 0.2);
    }, 60);
  }

  // Tiếng chan nước dùng thơm phức
  public playBrothPour() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, t);
    filter.frequency.linearRampToValueAtTime(950, t + 0.35);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  // Tiếng nhúng bánh phở
  public playDipNoodles() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.exponentialRampToValueAtTime(170, t + 0.18);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Tiếng thớt chặt thịt / gắp thịt
  public playChopMeat() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(290, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Tiếng rắc hành ngò thơm lừng
  public playSprinkleHerbs() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(2400, t + 0.07);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // Tiếng tiền vào túi tinh tinh!
  public playCoinChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [1046.5, 1318.5, 1567.98].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.06);
      gain.gain.setValueAtTime(0.2, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.25);
    });
  }

  // Tiếng phục vụ trà đá
  public playPourTea() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.15);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  // Tiếng ăn phở xì xụp vui vẻ
  public playHappySlurp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, t);
    osc.frequency.linearRampToValueAtTime(550, t + 0.12);
    osc.frequency.linearRampToValueAtTime(450, t + 0.22);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.24);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  // Click UI button
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Nâng cấp tiệm phở thành công
  public playUpgradeFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.25, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.35);
    });
  }
}

export const sound = new SoundEffectsService();
