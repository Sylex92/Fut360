import { describe, expect, it } from 'vitest';
import {
  emptyPlanningContext,
  emptyWeek,
  validatePlanning,
  validatePlanningContext,
  weekSummary,
} from './planning';
import {
  proposalSlot,
  proposalUnchanged,
  sessionRequirements,
} from '../composition/session-eligibility';
import { parseParticipantBackup } from './participant-store';
import { validateParticipant } from './participant';

const context = { ...emptyPlanningContext(), participants: 1, places: ['home'] as const };
const home = { ...context, places: [...context.places] };
function planning() {
  const slots = emptyWeek();
  slots[0] = proposalSlot('control-30');
  slots[2] = { kind: 'external', label: 'Práctica sintética', minutes: 45 };
  slots[6] = { kind: 'rest', minutes: 0 };
  return {
    context: home,
    weeks: [{ version: 1, savedAt: '2020-01-01T00:00:00Z', context: home, slots }],
  };
}
describe('Agenda y contexto por persona', () => {
  it('distingue disponibilidad desconocida, cero y una agenda sin completar', () => {
    expect(validatePlanningContext(emptyPlanningContext()).availableMinutes).toEqual(
      Array(7).fill(null),
    );
    const slots = planning().weeks[0]!.slots;
    const summary = weekSummary(slots, {
      ...home,
      availableMinutes: [0, null, 40, null, null, null, null],
    });
    expect(summary).toEqual({
      minutes: 75,
      externalMinutes: 45,
      restDays: 1,
      unassignedDays: 4,
      overbooked: ['Lunes', 'Miércoles'],
    });
  });
  it('no convierte tareas con compañeros en individuales ni una pared de apoyo en pared de pases', () => {
    expect(sessionRequirements('control-30', home)).toEqual([]);
    for (const id of ['midfield-45', 'attack-50', 'defense-45'])
      expect(
        sessionRequirements(id, {
          ...home,
          places: ['court', 'pitch'],
          facilities: ['wall', 'goal'],
        }).join(),
      ).toContain('personas');
    expect(
      sessionRequirements('midfield-45', {
        ...home,
        participants: 3,
        places: ['court'],
      }).join(),
    ).toContain('pared');
    expect(sessionRequirements('strength-40', { ...home, places: ['gym'] }).join()).toContain(
      'remo',
    );
    expect(sessionRequirements('missing', home)).toEqual(['Propuesta no disponible.']);
  });
  it('guarda firma de contenido y detecta un cambio sin modificar lo adoptado', () => {
    const slot = proposalSlot('control-30');
    expect(proposalUnchanged(slot)).toBe(true);
    expect(proposalUnchanged({ ...slot, minutes: 99 })).toBe(false);
    if (slot.kind === 'session')
      expect(proposalUnchanged({ ...slot, contentStamp: '{}' })).toBe(false);
    expect(validatePlanning(planning(), 'adult')).toEqual(planning());
  });
  it('rechaza ambigüedad de unidades, duraciones imposibles y versiones mal formadas', () => {
    for (const patch of [
      { availableMinutes: [60] },
      { participants: 0 },
      { participants: 1.5 },
      { places: ['moon'] },
      { facilities: ['wall', 'wall'] },
      { availableMinutes: Array(7).fill(-1) },
    ])
      expect(() => validatePlanningContext({ ...home, ...patch })).toThrow();
    expect(() =>
      validatePlanning(
        { ...planning(), weeks: [{ ...planning().weeks[0], version: 2 }] },
        'adult',
      ),
    ).toThrow();
    const p = planning();
    p.weeks[0]!.slots[2] = { kind: 'external', label: '', minutes: 0 };
    expect(() => validatePlanning(p, 'adult')).toThrow();
  });
  it('acepta actividad externa infantil pero rechaza introducir una propuesta adulta', () => {
    expect(() => validatePlanning(planning(), 'child')).toThrow();
    const p = planning();
    p.weeks[0]!.slots[0] = { kind: 'unassigned', minutes: 0 };
    expect(validatePlanning(p, 'child')).toEqual(p);
  });
  it('respalda la agenda sin enviarla a archivos legados que perderían los campos', () => {
    const participant = validateParticipant({
      id: 'p-planning-synthetic',
      alias: 'Prueba',
      kind: 'adult',
      foot: 'unknown',
      modalities: [],
      goals: [],
      createdAt: '2020-01-01T00:00:00Z',
      planning: planning(),
    });
    const backup = { format: 'fut360-participant', version: 2, participant, records: [] };
    expect(parseParticipantBackup(JSON.stringify(backup))).toEqual(backup);
    expect(() => parseParticipantBackup(JSON.stringify({ ...backup, version: 1 }))).toThrow();
    expect(validateParticipant({ ...participant, alias: 'Otro alias' }).planning).toEqual(
      participant.planning,
    );
  });
});
