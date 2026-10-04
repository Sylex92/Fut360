import { compileWorkoutV2 } from '@fut360/exercise-catalog';
import type { WorkoutBlock, WorkoutItem } from '@fut360/exercise-catalog';
import type { SessionAction, SessionProjection } from '@fut360/domain';
import { SessionEngine } from '@fut360/session-engine';
import type { SessionJournal } from '@fut360/session-engine';
import { SessionClock } from '../platform/session-clock';
import { practiceClipTime, previewClipTime } from '@fut360/viewer-3d';
import input from '../../../../content/workouts/mvp1-60min-v2.json';
import catalog from '../../../../assets/phase06-catalog.json';
import { movements } from './movement-library';
import type { MovementPreview } from './movement-library';
import { prepareSession } from './session';

const manifests = import.meta.glob<{
  assetId: string;
  version: number;
  sha256: string;
  clipName: string;
}>('../../../../assets/manifests/*.json', { eager: true, import: 'default' });
const exercises = import.meta.glob<{ version: number; equipment: string[] }>(
  '../../../../content/exercises/*.json',
  { eager: true, import: 'default' },
);
export const hourReferences = movements.map((m) => {
  const entry = catalog.entries.find((e) => e.exerciseId === m.id);
  const manifest = entry ? manifests['../../../../' + entry.manifest] : undefined;
  const exercise = entry ? exercises['../../../../' + entry.exercise] : undefined;
  if (!entry || !manifest || !exercise || manifest.clipName !== m.clipName)
    throw new Error('Referencia sin resolver: ' + m.id);
  return {
    ...m,
    equipment: exercise.equipment,
    supportedSides: entry.supportedSides,
    exerciseVersion: exercise.version,
    assetId: manifest.assetId,
    assetVersion: manifest.version,
    sha256: manifest.sha256,
    sceneId: m.framing === 'floor' ? 'guided-floor-v1' : 'guided-standing-v1',
  };
});
export const hourWorkout = compileWorkoutV2(input, hourReferences);
const metadata = new Map<
  string,
  { item: WorkoutItem; block: WorkoutBlock; movement: MovementPreview }
>();
for (const block of hourWorkout.workout.blocks)
  for (const item of block.items) {
    const movement = movements.find((m) => m.id === item.exerciseId);
    if (!movement) throw new Error('Falta el movimiento ' + item.exerciseId);
    metadata.set(item.id, { item, block, movement });
  }
const firstId = hourWorkout.plan.occurrences[0]?.id;
if (!firstId) throw new Error('Sesión vacía.');

export interface HourSnapshot {
  session: SessionProjection;
  item: WorkoutItem;
  block: WorkoutBlock;
  movement: MovementPreview;
  poseMs: number;
  mode: 'preview' | 'practice' | 'rest' | 'inspection';
  resourcesReady: boolean;
  inspecting: boolean;
  inspectionPlaying: boolean;
  previewPlaying: boolean;
}
export class HourWorkout {
  private sampledNow: number;
  private lastSample: number;
  private readonly clock;
  private ready = false;
  private previewMs = 0;
  private inspecting = false;
  private inspectionPlaying = false;
  private inspectionMs = 0;
  private speed: 0.5 | 1 = 0.5;
  private previewPlaying = true;
  constructor(
    id: string,
    private readonly now: () => number,
    private visible = true,
    readonly testRate: 1 | 60 = 1,
    journal?: SessionJournal,
  ) {
    this.sampledNow = now();
    this.lastSample = this.sampledNow;
    this.clock = journal
      ? new SessionClock(
          SessionEngine.fromJournal(journal),
          () => this.sampledNow,
          visible,
          testRate,
        )
      : prepareSession(hourWorkout.plan, id, () => this.sampledNow, visible, testRate);
    this.clock.setResourcesReady(false);
  }
  exportJournal(): SessionJournal {
    return this.clock.engine.exportJournal();
  }
  events() {
    return this.clock.engine.getEvents();
  }
  snapshot(): HourSnapshot {
    const session = this.clock.engine.project();
    const target = session.phase === 'rest' && session.next ? session.next : session.current;
    const data = metadata.get(
      target?.sourceOccurrenceId ??
        (session.status === 'completed' ? hourWorkout.plan.occurrences.at(-1)!.id : firstId!),
    );
    if (!data) throw new Error('Ocurrencia sin indicaciones.');
    const clip = {
      durationMs: data.movement.durationMs,
      practiceRepetitions: data.item.exampleRepetitions,
      previewSeparationMs: 1500,
    };
    const finished = session.status === 'completed' || session.status === 'aborted';
    const mode = this.inspecting
      ? 'inspection'
      : finished
        ? 'rest'
        : session.phase === 'work'
          ? session.phaseElapsedMs < clip.durationMs * clip.practiceRepetitions
            ? 'practice'
            : 'rest'
          : session.phase === 'rest' && !session.next
            ? 'rest'
            : 'preview';
    const poseMs =
      mode === 'inspection'
        ? this.inspectionMs
        : mode === 'preview'
          ? previewClipTime(this.previewMs, clip)
          : mode === 'practice'
            ? practiceClipTime(session.phaseElapsedMs, clip)
            : clip.durationMs;
    return {
      session,
      ...data,
      poseMs,
      mode,
      resourcesReady: this.ready,
      inspecting: this.inspecting,
      inspectionPlaying: this.inspectionPlaying,
      previewPlaying: this.previewPlaying,
    };
  }
  sample(): HourSnapshot {
    const before = this.snapshot();
    this.sampledNow = this.now();
    const delta = Math.floor(this.sampledNow) - Math.floor(this.lastSample);
    this.lastSample = this.sampledNow;
    this.clock.sample();
    const after = this.snapshot();
    const reliable =
      Number.isFinite(delta) && delta >= 0 && delta <= 2000 && this.visible && this.ready;
    if (!reliable) this.inspectionPlaying = false;
    if (
      after.item.id !== before.item.id ||
      after.mode !== before.mode ||
      after.session.phase !== before.session.phase
    )
      this.previewMs = after.mode === 'preview' ? after.session.phaseElapsedMs : 0;
    else if (
      reliable &&
      after.mode === 'preview' &&
      (after.session.status === 'running' ||
        (after.session.status === 'ready' && this.previewPlaying))
    )
      this.previewMs += delta * this.testRate;
    if (reliable && this.inspecting && this.inspectionPlaying) {
      this.inspectionMs = Math.min(
        after.movement.durationMs,
        this.inspectionMs + delta * this.speed,
      );
      if (this.inspectionMs === after.movement.durationMs) this.inspectionPlaying = false;
    }
    return this.snapshot();
  }
  act(action: SessionAction, observed = this.snapshot().session): string {
    this.sample();
    const before = this.snapshot();
    const result = this.clock.dispatch(action, observed);
    if (result.accepted) {
      if (this.snapshot().item.id !== before.item.id) this.previewMs = 0;
      if (['Resume', 'Abort', 'SkipCurrentWork'].includes(action.type)) {
        this.inspecting = false;
        this.inspectionPlaying = false;
      }
      if (action.type === 'Pause') this.inspectionPlaying = false;
      if (action.type === 'Start') this.previewMs = 0;
      if (action.type === 'ExtendPreparation')
        this.previewMs = before.session.status === 'paused' ? before.poseMs : 0;
    }
    return result.accepted ? '' : (result.reason ?? 'Acción no disponible.');
  }
  setReady(ready: boolean): HourSnapshot {
    this.sample();
    this.ready = ready;
    this.clock.setResourcesReady(ready);
    if (!ready) this.inspectionPlaying = false;
    return this.snapshot();
  }
  setVisible(visible: boolean): HourSnapshot {
    this.sample();
    this.visible = visible;
    this.clock.setVisible(visible);
    if (!visible) this.inspectionPlaying = false;
    return this.snapshot();
  }
  togglePreview(): void {
    this.sample();
    if (this.snapshot().session.status === 'ready') this.previewPlaying = !this.previewPlaying;
  }
  openInspection(): void {
    this.sample();
    const s = this.snapshot();
    if (s.session.status !== 'paused' || !this.ready || !this.visible) return;
    this.inspectionMs = s.poseMs;
    this.inspecting = true;
    this.inspectionPlaying = false;
  }
  closeInspection(): void {
    this.sample();
    this.inspecting = false;
    this.inspectionPlaying = false;
  }
  seek(ms: number): void {
    this.sample();
    if (!this.inspecting || !Number.isFinite(ms)) return;
    this.inspectionMs = Math.max(0, Math.min(this.snapshot().movement.durationMs, ms));
    this.inspectionPlaying = false;
  }
  playInspection(speed: 0.5 | 1): void {
    this.sample();
    if (!this.inspecting || !this.ready || !this.visible) return;
    this.speed = speed;
    if (this.inspectionMs >= this.snapshot().movement.durationMs) this.inspectionMs = 0;
    this.inspectionPlaying = true;
  }
  pauseInspection(): void {
    this.sample();
    this.inspectionPlaying = false;
  }
}
