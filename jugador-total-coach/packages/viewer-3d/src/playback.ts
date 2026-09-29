/** Pose selection only: Three's AnimationMixer evaluates the actual skeletal clip. */
export interface ClipPlayback {
  readonly durationMs: number;
  readonly previewSeparationMs: number;
  readonly practiceRepetitions: number;
}

export function previewClipTime(elapsedMs: number, clip: ClipPlayback): number {
  const cycle = clip.durationMs + clip.previewSeparationMs;
  return Math.min(Math.max(0, elapsedMs) % cycle, clip.durationMs);
}

export function practiceClipTime(elapsedMs: number, clip: ClipPlayback): number {
  if (elapsedMs >= clip.durationMs * clip.practiceRepetitions) return clip.durationMs;
  return Math.max(0, elapsedMs) % clip.durationMs;
}
