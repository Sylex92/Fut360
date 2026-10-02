/** User-gesture activation; no network, speech service or audio asset. */
export class FinalSignal {
  private context: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private played = new Set<string>();
  muted = false;
  async unlock(): Promise<boolean> {
    try {
      this.context ??= new AudioContext();
      await this.context.resume();
      return this.context.state === 'running';
    } catch {
      return false;
    }
  }
  finish(sessionId: string): boolean {
    if (this.played.has(sessionId)) return false;
    this.played.add(sessionId);
    if (this.muted || !this.context || this.context.state !== 'running') return false;
    const ctx = this.context;
    const tone = ctx.createOscillator();
    const volume = ctx.createGain();
    tone.frequency.value = 660;
    volume.gain.setValueAtTime(0, ctx.currentTime);
    volume.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    volume.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.45);
    tone.connect(volume);
    volume.connect(ctx.destination);
    tone.start();
    tone.stop(ctx.currentTime + 0.5);
    this.oscillator = tone;
    tone.onended = () => {
      tone.disconnect();
      volume.disconnect();
      if (this.oscillator === tone) this.oscillator = null;
    };
    return true;
  }
  stop(): void {
    this.oscillator?.stop();
    this.oscillator = null;
  }
  dispose(): void {
    this.stop();
    void this.context?.close().catch(() => undefined);
    this.context = null;
  }
}
