import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { coachingPlans, coachingSessions, compileCoachingSession } from './development-plan';
import { personalSessions, sessionAudience } from './personal-programs';
import { findTasks, taskById } from './coaching-catalog';
import { suggestProgramWeek } from './program-week';
import { proposalSlot, sessionRequirements } from './session-eligibility';
import { emptyPlanningContext, emptyWeek, validatePlanning } from '../platform/planning';
import { sourcePages, visualCoverage } from './visual-coverage';
import { ReferenceVideo } from '../ui/ReferenceVideo';
import { TrainingHistory } from '../ui/TrainingHistory';
import { ParticipantContext } from '../ui/ParticipantContext';
import { trainingStore } from '../platform/training-store';
import type { Participant } from '../platform/participant';

describe('Programas individuales y complemento infantil', () => {
  const context = {
    ...emptyPlanningContext(),
    availableMinutes: Array(7).fill(60),
    participants: 1,
    places: ['home', 'court'] as ('home' | 'court')[],
  };
  it('cada sesión nueva cumple duración finita, audiencia y requisitos de compañía', () => {
    for (const s of personalSessions) {
      const child = sessionAudience(s) === 'child';
      expect(s.blocks.every((b) => b.taskId.startsWith('Y') === child)).toBe(true);
      expect(coachingPlans.get(s.id)!.expectedDurationMs / 60000).toBeLessThanOrEqual(
        child ? 15 : 40,
      );
      if (!child) expect(sessionRequirements(s.id, context)).toEqual([]);
      else {
        expect(sessionRequirements(s.id, context).join()).toContain('personas');
        expect(sessionRequirements(s.id, { ...context, participants: 2 })).toEqual([]);
      }
    }
  });
  it('rechaza mezclar infancia y adultos incluso antes de usar la interfaz', () => {
    const adult = coachingSessions.find((s) => s.id === 'solo-control-20')!;
    const child = coachingSessions.find((s) => s.id === 'youth-explore-15')!;
    expect(() => compileCoachingSession({ ...child, blocks: adult.blocks })).toThrow();
    expect(() => compileCoachingSession({ ...adult, blocks: child.blocks })).toThrow();
    for (const bad of [-1, NaN, 1.5, Infinity])
      expect(() =>
        compileCoachingSession({ ...adult, blocks: [{ ...adult.blocks[0]!, work: bad }] }),
      ).toThrow();
    const planning = {
      context,
      weeks: [
        {
          version: 1,
          savedAt: '2020-01-01T00:00:00Z',
          context,
          slots: [proposalSlot(child.id), ...emptyWeek().slice(1)],
        },
      ],
    };
    expect(validatePlanning(planning, 'child')).toEqual(planning);
    expect(() => validatePlanning(planning, 'adult')).toThrow();
  });
  it('no rellena disponibilidad infantil ni cambia club, gimnasio o descanso', () => {
    const week = emptyWeek();
    week[1] = { kind: 'external', label: 'Club sintético', minutes: 60 };
    week[3] = { kind: 'external', label: 'Otra práctica sintética', minutes: 60 };
    week[5] = { kind: 'external', label: 'Gimnasio sintético', minutes: 60 };
    week[6] = { kind: 'rest', minutes: 0 };
    const result = suggestProgramWeek('child', week, {
      ...context,
      participants: 2,
      availableMinutes: Array(7).fill(120),
    });
    // With these days there is no isolated free day; do not force the optional addition.
    expect(result.slots).toEqual(week);
    expect(result.added).toHaveLength(0);
    const empty = suggestProgramWeek('child', emptyWeek(), {
      ...context,
      participants: 2,
      availableMinutes: Array(7).fill(120),
    });
    expect(empty.added).toHaveLength(1);
    expect(empty.slots.reduce((n, s) => n + s.minutes, 0)).toBe(15);
    expect(
      suggestProgramWeek('child', empty.slots, { ...context, participants: 2 }).added,
    ).toHaveLength(0);
  });
  it('propuesta adulta no supera tiempo ni asume lugares y conserva actividad existente', () => {
    expect(suggestProgramWeek('adult', emptyWeek(), emptyPlanningContext()).added).toEqual([]);
    expect(
      suggestProgramWeek('adult', emptyWeek(), {
        ...context,
        availableMinutes: Array(7).fill(19),
      }).added,
    ).toEqual([]);
    const next = suggestProgramWeek('adult', emptyWeek(), context);
    expect(next.added).toHaveLength(3);
    for (let i = 0; i < 7; i++)
      if (next.slots[i]!.kind === 'session')
        expect(next.slots[(i + 1) % 7]!.kind).not.toBe('session');
    const existing = emptyWeek();
    existing[1] = { kind: 'external', label: 'Partido sintético', minutes: 45 };
    const result = suggestProgramWeek('adult', existing, context);
    expect(result.slots[1]).toEqual(existing[1]);
    expect(result.slots.filter((s) => s.kind === 'session').length).toBeLessThanOrEqual(2);
  });
  it('biblioteca infantil propia y referencias externas no se presentan como videos exactos', () => {
    expect(findTasks('', '', '', false, 'child')).toHaveLength(13);
    expect(findTasks('').every((t) => !t.id.startsWith('Y'))).toBe(true);
    expect(visualCoverage(taskById.get('Y01')!)).toBe('Ejemplo relacionado en la fuente');
    expect(visualCoverage(taskById.get('Y08')!)).toBe('Demostración pendiente');
    for (const ref of sourcePages) {
      expect(new URL(ref.url).protocol).toBe('https:');
      for (const id of ref.tasks) expect(taskById.has(id)).toBe(true);
      expect(ref.observation).toBeTruthy();
    }
  });
  it('bloquea YouTube dentro del perfil infantil aunque se le pase un segmento adulto', () => {
    const participant: Participant = {
      id: 'p-synthetic-child',
      alias: 'Prueba',
      kind: 'child',
      foot: 'unknown',
      goals: [],
      modalities: [],
      createdAt: '2020-01-01T00:00:00Z',
    };
    const html = renderToStaticMarkup(
      <ParticipantContext.Provider value={{ participant, store: trainingStore }}>
        <ReferenceVideo segment={taskById.get('F05')!.videos[0]!} />
      </ParticipantContext.Provider>,
    );
    expect(html).toContain('todavía no está habilitada');
    expect(html).not.toContain('iframe');
    expect(html).not.toContain('youtube.com');
    expect(html).not.toContain('Ver video');
    const history = renderToStaticMarkup(
      <ParticipantContext.Provider value={{ participant, store: trainingStore }}>
        <TrainingHistory
          records={[]}
          finished={true}
          active={false}
          onFeedback={async () => true}
          onChange={async () => undefined}
        />
      </ParticipantContext.Provider>,
    );
    expect(history).toContain('Qué observó el acompañante');
    expect(history).not.toContain('Esfuerzo percibido (0–10)');
    expect(history).not.toContain('Molestia de rodilla');
  });
});
