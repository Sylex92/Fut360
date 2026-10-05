import { describe, expect, it } from 'vitest';
import {
  addDays,
  isDate,
  monday,
  emptyPersonalPlan,
  validatePersonalPlan,
  preservesPersonalPlan,
  observationComparison,
  parsePlanOffer,
} from './personal-plan';
import type { PersonalPlan, SkillObservation } from './personal-plan';
import { emptyPlanningContext, emptyWeek } from './planning';
import { validateParticipant } from './participant';
import { parseParticipantBackup } from './participant-store';
import { proposalSlot } from '../composition/session-eligibility';
import { childBallCycle, calendarSlots } from '../composition/calendar-cycle';
const base = (): PersonalPlan => ({
  ...emptyPersonalPlan(),
  versions: [
    {
      version: 1,
      savedAt: '2020-01-01T00:00:00Z',
      start: '2020-01-06',
      weeks: 8,
      stage: 'play',
      context: emptyPlanningContext(),
      slots: [proposalSlot('youth-pass-15'), ...emptyWeek().slice(1)],
      reason: 'Plan sintético para pruebas',
    },
  ],
});
describe('Calendario personal y observaciones', () => {
  it('alterna juegos equivalentes conservando club, descanso, dosis y respaldo', () => {
    const p = base();
    const v = p.versions[0]!;
    v.slots[1] = { kind: 'external', label: 'Club sintético', minutes: 45 };
    v.slots[3] = { kind: 'rest', minutes: 0 };
    v.cycle = childBallCycle(v.slots);
    const checked = validatePersonalPlan(p, 'child').versions[0]!;
    expect(calendarSlots(checked, 0)[0]).toEqual(proposalSlot('youth-pass-15'));
    expect(calendarSlots(checked, 1)[0]).toEqual(proposalSlot('youth-explore-15'));
    expect(calendarSlots(checked, 2)[0]).toEqual(proposalSlot('youth-protect-15'));
    expect(calendarSlots(checked, 4)).toEqual(checked.slots);
    expect(calendarSlots(checked, 1).slice(1)).toEqual(checked.slots.slice(1));
    expect(calendarSlots(checked, 1).reduce((n, s) => n + s.minutes, 0)).toBe(60);
    const corrupt = structuredClone(p);
    corrupt.versions[0]!.cycle = [[proposalSlot('solo-control-20'), ...v.slots.slice(1)]];
    expect(() => validatePersonalPlan(corrupt, 'child')).toThrow();
    v.cycle[0]![1]!.minutes = 1;
    expect(checked.cycle![0]![1]!.minutes).toBe(45);
  });
  it('fechas reales, lunes y proyección sin saltos al cambiar mes o año', () => {
    expect(isDate('2024-02-29')).toBe(true);
    expect(isDate('2023-02-29')).toBe(false);
    expect(isDate('2024-13-01')).toBe(false);
    expect(addDays('2024-02-28', 2)).toBe('2024-03-01');
    expect(addDays('2024-12-30', 7)).toBe('2025-01-06');
    expect(monday('2025-01-05')).toBe('2024-12-30');
    expect(() =>
      validatePersonalPlan(
        { ...base(), versions: [{ ...base().versions[0]!, start: '2020-01-07' }] },
        'child',
      ),
    ).toThrow();
  });
  it('rechaza audiencia equivocada, etapas adultas infantiles y resultados fuera del calendario', () => {
    expect(validatePersonalPlan(base(), 'child').versions).toHaveLength(1);
    expect(() => validatePersonalPlan(base(), 'adult')).toThrow();
    const p = base();
    p.versions[0]!.stage = 'transfer';
    expect(() => validatePersonalPlan(p, 'child')).toThrow();
    const r = base();
    r.reports = [
      {
        id: 'synthetic-report',
        recordedAt: '2020-01-07T00:00:00Z',
        date: '2020-01-05',
        planVersion: 1,
        outcome: 'done',
        minutes: 15,
        notes: '',
      },
    ];
    expect(() => validatePersonalPlan(r, 'child')).toThrow();
    r.reports[0]!.date = '2020-01-06';
    expect(validatePersonalPlan(r, 'child').reports).toHaveLength(1);
    r.reports[0]!.outcome = 'skipped';
    expect(() => validatePersonalPlan(r, 'child')).toThrow();
  });
  it('preserva cada versión y resultado; los cambios se agregan sin borrar lo anterior', () => {
    const p = base();
    const next = structuredClone(p);
    next.versions.push({
      ...next.versions[0]!,
      version: 2,
      start: '2020-01-20',
      reason: 'Revisión sintética',
    });
    expect(preservesPersonalPlan(p, next)).toBe(true);
    expect(preservesPersonalPlan(p, undefined)).toBe(false);
    next.versions[0]!.reason = 'Alterado';
    expect(preservesPersonalPlan(p, next)).toBe(false);
  });
  it('compara entre días solo tarea, lado y condiciones iguales', () => {
    const o: SkillObservation = {
      id: 'a',
      recordedAt: '2020-01-07T00:00:00Z',
      date: '2020-01-06',
      taskId: 'Y07',
      side: 'left',
      condition: 'Puerta sintética de 2 m a 3 m',
      attempts: 10,
      successes: 5,
      comfort: 'comfortable',
      notes: '',
    };
    const next = { ...o, id: 'b', date: '2020-01-08', successes: 7 };
    expect(observationComparison([o], next)?.change).toBe(20);
    expect(observationComparison([{ ...o, side: 'right' }], next)).toBeNull();
    expect(observationComparison([{ ...o, condition: 'Otra distancia' }], next)).toBeNull();
    expect(observationComparison([o], { ...next, date: o.date })).toBeNull();
    expect(() =>
      validatePersonalPlan({ ...base(), observations: [{ ...o, successes: 11 }] }, 'child'),
    ).toThrow();
    expect(() => validatePersonalPlan({ ...base(), observations: [o, o] }, 'child')).toThrow();
  });
  it('respaldo 3 conserva el plan y rechaza versiones antiguas que lo perderían', () => {
    const participant = validateParticipant({
      id: 'p-calendar-test',
      alias: 'Prueba ficticia',
      kind: 'child',
      foot: 'unknown',
      modalities: [],
      goals: [],
      createdAt: '2020-01-01T00:00:00Z',
      personalPlan: base(),
    });
    const backup = { format: 'fut360-participant', version: 3, participant, records: [] };
    expect(parseParticipantBackup(JSON.stringify(backup)).participant.personalPlan).toEqual(
      base(),
    );
    expect(() => parseParticipantBackup(JSON.stringify({ ...backup, version: 2 }))).toThrow();
  });
  it('recibe ofertas locales sin ejecutar ni confiar en URLs o tipos arbitrarios', () => {
    expect(parsePlanOffer('#otra-cosa')).toBeNull();
    const offer = {
      format: 'fut360-plan-offer',
      kind: 'child',
      context: emptyPlanningContext(),
      days: Array.from({ length: 7 }, () => ({ kind: 'rest' })),
    };
    expect(
      parsePlanOffer('#plan=' + encodeURIComponent(JSON.stringify(offer)))?.days,
    ).toHaveLength(7);
    expect(() =>
      parsePlanOffer(
        '#plan=' + encodeURIComponent(JSON.stringify({ ...offer, kind: 'script' })),
      ),
    ).toThrow();
    expect(() => parsePlanOffer('#plan=' + 'x'.repeat(16000))).toThrow();
    const personal = {
      ...offer,
      weeks: 8,
      stage: 'play',
      reason: 'Alternar sin acumular minutos.',
    };
    expect(
      parsePlanOffer('#plan=' + encodeURIComponent(JSON.stringify(personal)))?.weeks,
    ).toBe(8);
    expect(() =>
      parsePlanOffer(
        '#plan=' + encodeURIComponent(JSON.stringify({ ...personal, stage: 'transfer' })),
      ),
    ).toThrow();
    expect(() =>
      parsePlanOffer(
        '#plan=' + encodeURIComponent(JSON.stringify({ ...personal, weeks: 24 })),
      ),
    ).toThrow();
  });
});
