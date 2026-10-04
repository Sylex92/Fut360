import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  coachingTasks,
  findTasks,
  taskById,
  validateCoachingCatalog,
} from './coaching-catalog';
import {
  coachingPlans,
  coachingSessions,
  compileCoachingSession,
  developmentStages,
} from './development-plan';
import { GuidedSession } from './guided-session';
import { segmentRequest, validateSegment, videoFailure, videoLink } from '../platform/youtube';
import { CoachingTaskCard } from '../ui/CoachingTask';

describe('Catálogo de enseñanza', () => {
  it('incluye las 32 familias, con tareas explicadas y sin llamar video a un pendiente', () => {
    validateCoachingCatalog();
    for (let n = 1; n <= 32; n++)
      expect(taskById.has('T' + String(n).padStart(2, '0'))).toBe(true);
    expect(new Set(coachingTasks.map((t) => t.familyId)).size).toBe(32);
    expect(coachingTasks.every((t) => t.review === 'documentary-draft')).toBe(true);
    const html = renderToStaticMarkup(<CoachingTaskCard task={taskById.get('T25')!} />);
    expect(html).toContain('demostración en video de esta variante sigue pendiente');
    expect(html).not.toContain('<iframe');
  });
  it('filtra por objetivo, texto sin acentos, lugar y cobertura real', () => {
    expect(findTasks('recepcion').length).toBeGreaterThan(1);
    expect(findTasks('', 'Defensa').map((t) => t.id)).toEqual(['T17', 'T18', 'T19']);
    expect(findTasks('', '', 'home').some((t) => ['T21', 'T25', 'T13'].includes(t.id))).toBe(
      false,
    );
    expect(findTasks('', '', '', true).every((t) => t.videos.length)).toBe(true);
    expect(findTasks('noexisteestaTarea')).toHaveLength(0);
  });
  it('no conecta a terceros antes de que el usuario abra el video', () => {
    const html = renderToStaticMarkup(<CoachingTaskCard task={taskById.get('M09')!} />);
    expect(html).toContain('Ver video del ejercicio');
    expect(html).not.toContain('<iframe');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<img');
  });
});
describe('Referencias delimitadas', () => {
  it('cada segmento declara límites absolutos y enlace temporal válido', () => {
    for (const t of coachingTasks)
      for (const v of t.videos) {
        expect(segmentRequest(v)).toEqual({
          videoId: v.videoId,
          startSeconds: v.start,
          endSeconds: v.end,
        });
        expect(videoLink(v)).toContain('&t=' + v.start + 's');
        expect(v.end).toBeGreaterThan(v.start);
      }
  });
  it('rechaza enlaces inyectados, tiempos imposibles y tramos excesivos', () => {
    const base = taskById.get('M01')!.videos[0]!;
    for (const patch of [
      { videoId: '<script>' },
      { start: -1 },
      { end: base.start },
      { end: Infinity },
      { start: NaN },
      { end: 999999 },
    ])
      expect(() => validateSegment({ ...base, ...patch })).toThrow();
    expect(videoFailure(153)).toContain('identificar');
    expect(videoFailure(101)).toContain('autor');
  });
});
describe('Plan de varias duraciones', () => {
  it('conserva calentamiento, cierre, dosis finitas y suma preparación/trabajo/descanso', () => {
    expect(
      coachingSessions.map((s) => coachingPlans.get(s.id)!.expectedDurationMs / 60000),
    ).toEqual([30, 45, 50, 45, 40]);
    for (const s of coachingSessions) {
      expect(s.blocks[0]!.taskId).toBe('W01');
      expect(s.blocks.at(-1)!.taskId).toBe('C01');
      expect(s.blocks.every((b) => b.dose.length > 0 && taskById.has(b.taskId))).toBe(true);
      expect(compileCoachingSession(s).purpose).toBe('training-draft');
    }
    expect(developmentStages.map((s) => s.id)).toContain('prepare');
  });
  it('rechaza tareas desconocidas y rondas desproporcionadas', () => {
    const s = coachingSessions[0]!;
    expect(() =>
      compileCoachingSession({ ...s, blocks: [{ ...s.blocks[0]!, taskId: 'missing' }] }),
    ).toThrow();
    expect(() =>
      compileCoachingSession({ ...s, blocks: [{ ...s.blocks[0]!, rounds: 21 }] }),
    ).toThrow();
  });
  it('añadir preparación no pausa ni consume trabajo; ocultación conserva el punto', () => {
    let now = 0;
    const c = new GuidedSession(coachingPlans.get('control-30')!, () => now);
    expect(c.act({ type: 'Start' }).accepted).toBe(true);
    const before = c.snapshot().session;
    c.act({
      type: 'ExtendPreparation',
      targetOccurrenceId: before.preparationTarget!.id,
      amountMs: 30000,
    });
    expect(c.snapshot().session.status).toBe('running');
    now = 1000;
    c.sample();
    const prior = c.snapshot().session.baseRemainingMs;
    c.setVisible(false);
    now = 61000;
    c.sample();
    expect(c.snapshot().session.baseRemainingMs).toBe(prior);
    c.setVisible(true);
    expect(c.snapshot().session.status).toBe('running');
  });
  it('recupera el mismo plan en pausa y no acredita video como ejercicio físico', () => {
    let now = 0;
    const plan = coachingPlans.get('attack-50')!;
    const c = new GuidedSession(plan, () => now);
    c.act({ type: 'Start' });
    now = 1000;
    c.sample();
    const log = c.exportJournal();
    const recovered = new GuidedSession(plan, () => now, true, 1, log);
    expect(recovered.snapshot().session.status).toBe('paused');
    expect(recovered.snapshot().session.baseRemainingMs).toBe(
      c.snapshot().session.baseRemainingMs,
    );
    expect(
      () => new GuidedSession(coachingPlans.get('control-30')!, () => now, true, 1, log),
    ).toThrow('otra propuesta');
  });
});
