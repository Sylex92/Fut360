import { snapshotPlan } from '@fut360/domain';
import type { ExecutionPlan, SessionAction, SessionProjection } from '@fut360/domain';
import { practiceClipTime, previewClipTime } from '@fut360/viewer-3d';
import type { ClipPlayback } from '@fut360/viewer-3d';
import exercise from '../../../../content/exercises/hip-hinge.json';
import manifest from '../../../../assets/manifests/hip-hinge-v1.json';
import { prepareSession } from './session';

export { exercise as hingeExercise };
export const hingeClip: ClipPlayback = Object.freeze({
  durationMs: manifest.durationMs,
  previewSeparationMs: manifest.previewSeparationMs,
  practiceRepetitions: manifest.practiceRepetitions,
});
export const hingeClipName = exercise.animation.clipName;

export function hingePlan(minutes: 1 | 5): ExecutionPlan {
  return snapshotPlan({
    id: 'hip-hinge-technical-' + minutes,
    version: 1,
    title: 'Demostración técnica · ' + minutes + ' min',
    purpose: 'technical-test',
    expectedDurationMs: minutes * 60000,
    occurrences: Array.from({ length: minutes }, (_, i) => ({
      id: 'hinge-' + (i + 1),
      exerciseId: exercise.id,
      title: exercise.displayName,
      side: 'none',
      demonstrationMs: 10000,
      workMs: 30000,
      restMs: 20000,
    })),
  });
}

export type PoseMode = 'preview' | 'practice' | 'rest' | 'inspection';
export interface DemoSnapshot {
  readonly session: SessionProjection;
  readonly poseMs: number;
  readonly mode: PoseMode;
  readonly resourcesReady: boolean;
  readonly inspecting: boolean;
  readonly inspectionPlaying: boolean;
  readonly inspectionSpeed: 0.5 | 1;
  readonly previewPlaying: boolean;
}

/** App composition owns visual cursors. Only SessionClock can advance the program. */
export class HingeDemo {
  private sampledNow: number;
  private readonly clock;
  private lastSample: number;
  private previewMs = 0;
  private ready = false;
  private visible: boolean;
  private inspecting = false;
  private inspectionPlaying = false;
  private inspectionMs = 0;
  private speed: 0.5 | 1 = 0.5;
  private previewPlaying = true;

  constructor(
    plan: ExecutionPlan,
    id: string,
    private readonly now: () => number,
    visible = true,
  ) {
    this.sampledNow = now();
    this.lastSample = this.sampledNow;
    this.visible = visible;
    this.clock = prepareSession(plan, id, () => this.sampledNow, visible);
    this.clock.setResourcesReady(false);
  }

  private mode(state: SessionProjection): PoseMode {
    if (this.inspecting) return 'inspection';
    if (state.status === 'ready') return 'preview';
    if (state.status === 'completed' || state.status === 'aborted') return 'rest';
    if (state.phase === 'work')
      return state.phaseElapsedMs >= hingeClip.durationMs * hingeClip.practiceRepetitions
        ? 'rest'
        : 'practice';
    if (state.phase === 'rest' && !state.next) return 'rest';
    return 'preview';
  }

  snapshot(): DemoSnapshot {
    const session = this.clock.engine.project();
    const mode = this.mode(session);
    const poseMs =
      mode === 'inspection'
        ? this.inspectionMs
        : mode === 'preview'
          ? previewClipTime(this.previewMs, hingeClip)
          : mode === 'practice'
            ? practiceClipTime(session.phaseElapsedMs, hingeClip)
            : hingeClip.durationMs;
    return {
      session,
      mode,
      poseMs,
      resourcesReady: this.ready,
      inspecting: this.inspecting,
      inspectionPlaying: this.inspectionPlaying,
      inspectionSpeed: this.speed,
      previewPlaying: this.previewPlaying,
    };
  }

  sample(): DemoSnapshot {
    const before = this.clock.engine.project();
    const beforeMode = this.mode(before);
    this.sampledNow = this.now();
    const delta = Math.floor(this.sampledNow) - Math.floor(this.lastSample);
    this.lastSample = this.sampledNow;
    const after = this.clock.sample();
    const mode = this.mode(after);
    const reliable =
      Number.isFinite(delta) && delta >= 0 && delta <= 2000 && this.visible && this.ready;
    if (!reliable) this.inspectionPlaying = false;
    if (
      mode !== beforeMode ||
      after.current?.id !== before.current?.id ||
      after.phase !== before.phase
    )
      this.previewMs = mode === 'preview' ? after.phaseElapsedMs : 0;
    else if (
      reliable &&
      mode === 'preview' &&
      (after.status === 'running' || (after.status === 'ready' && this.previewPlaying))
    )
      this.previewMs += delta;
    if (reliable && this.inspecting && this.inspectionPlaying) {
      this.inspectionMs = Math.min(
        hingeClip.durationMs,
        this.inspectionMs + delta * this.speed,
      );
      if (this.inspectionMs === hingeClip.durationMs) this.inspectionPlaying = false;
    }
    return this.snapshot();
  }

  act(action: SessionAction, observed = this.snapshot().session): string {
    this.sample();
    const before = this.snapshot();
    const result = this.clock.dispatch(action, observed);
    if (result.accepted) {
      if (
        action.type === 'Resume' ||
        action.type === 'Abort' ||
        action.type === 'SkipCurrentWork'
      ) {
        this.inspecting = false;
        this.inspectionPlaying = false;
      }
      if (action.type === 'ExtendPreparation')
        this.previewMs = before.session.status === 'paused' ? before.poseMs : 0;
      if (action.type === 'Start') this.previewMs = 0;
      if (action.type === 'Pause') this.inspectionPlaying = false;
    }
    return result.accepted ? '' : (result.reason ?? 'Acción no disponible.');
  }

  setReady(ready: boolean): DemoSnapshot {
    this.sample();
    this.ready = ready;
    this.clock.setResourcesReady(ready);
    if (!ready) this.inspectionPlaying = false;
    return this.snapshot();
  }
  setVisible(visible: boolean): DemoSnapshot {
    this.sample();
    this.visible = visible;
    this.clock.setVisible(visible);
    if (!visible) this.inspectionPlaying = false;
    return this.snapshot();
  }
  openInspection(): string {
    this.sample();
    const state = this.snapshot();
    if (!this.ready || !this.visible || state.session.status !== 'paused')
      return 'Pausa la prueba antes de revisar el movimiento.';
    this.inspectionMs = state.poseMs;
    this.inspecting = true;
    this.inspectionPlaying = false;
    return '';
  }
  closeInspection(): void {
    this.sample();
    this.inspecting = false;
    this.inspectionPlaying = false;
  }
  seekInspection(ms: number): void {
    this.sample();
    if (!this.inspecting || !Number.isFinite(ms)) return;
    this.inspectionMs = Math.max(0, Math.min(hingeClip.durationMs, ms));
    this.inspectionPlaying = false;
  }
  playInspection(speed: 0.5 | 1): void {
    this.sample();
    if (!this.inspecting || !this.ready || !this.visible) return;
    this.speed = speed;
    if (this.inspectionMs >= hingeClip.durationMs) this.inspectionMs = 0;
    this.inspectionPlaying = true;
  }
  pauseInspection(): void {
    this.sample();
    this.inspectionPlaying = false;
  }
  toggleReadyPreview(): void {
    this.sample();
    if (this.clock.engine.project().status === 'ready')
      this.previewPlaying = !this.previewPlaying;
  }
}
