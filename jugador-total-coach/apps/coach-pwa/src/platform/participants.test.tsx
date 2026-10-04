import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import fixture from '../../../../content/examples/mvp1-60min.workout.json';
import { App } from '../ui/App';
import { ParticipantContext } from '../ui/ParticipantContext';
import { validateParticipant } from './participant';
import { exportArchive, parseArchive, trainingStore, validateRecord } from './training-store';
import { parseParticipantBackup } from './participant-store';
import { prepareSession, shortTechnicalPlan } from '../composition/session';

const profile = validateParticipant({
  id: 'p-example-child',
  alias: 'Ejemplo infantil',
  kind: 'child',
  foot: 'left',
  modalities: ['5', '7'],
  goals: ['finishing', 'control'],
  createdAt: '2026-10-04T00:00:00Z',
});
function record() {
  const e = prepareSession(shortTechnicalPlan, 'profile-example', () => 0).engine;
  e.send({
    sessionId: e.sessionId,
    commandId: 'start',
    expectedControlRevision: e.project().controlRevision,
    action: { type: 'Start' },
  });
  return {
    id: e.sessionId,
    startedAt: profile.createdAt,
    updatedAt: profile.createdAt,
    contentStamp: 'example',
    journal: e.exportJournal(),
    test: true,
    feedback: null,
  };
}
describe('Perfiles y respaldos por persona', () => {
  it('conserva la lateralidad y descarta campos personales no solicitados', () => {
    const p = validateParticipant({
      ...profile,
      alias: '  Ejemplo  ',
      medicalNotes: 'dato de prueba no permitido',
    });
    expect(p.alias).toBe('Ejemplo');
    expect(p.foot).toBe('left');
    expect(p).not.toHaveProperty('medicalNotes');
  });
  it('rechaza tipos, objetivos, identidad y listas ambiguas', () => {
    for (const patch of [
      { id: 'active' },
      { alias: ' ' },
      { kind: 'professional' },
      { modalities: ['5', '5'] },
      { goals: ['__proto__'] },
      { foot: 'automatic' },
      { createdAt: 'never' },
    ])
      expect(() => validateParticipant({ ...profile, ...patch })).toThrow();
  });
  it('mantiene archivos legados sin asignar persona ni alterar eventos', () => {
    const original = record();
    expect(parseArchive(exportArchive([original]))).toEqual([original]);
    expect(JSON.parse(exportArchive([original])).formatVersion).toBe(1);
  });
  it('exporta un dueño explícito y rechaza mezclas o pérdida de identidad', () => {
    const a = { ...record(), participantId: 'p-example-adult' };
    expect(parseArchive(exportArchive([a]))).toEqual([a]);
    expect(JSON.parse(exportArchive([a])).formatVersion).toBe(2);
    expect(() => exportArchive([a, record()])).toThrow();
    expect(() => parseArchive(JSON.stringify({ formatVersion: 1, records: [a] }))).toThrow();
    expect(() =>
      parseArchive(
        JSON.stringify({ formatVersion: 2, participantId: profile.id, records: [a] }),
      ),
    ).toThrow();
    expect(() => validateRecord({ ...a, participantId: 'invalid' })).toThrow();
  });
  it('restaura perfil y registros solo si coinciden sus identidades', () => {
    const r = { ...record(), participantId: profile.id };
    const backup = {
      format: 'fut360-participant',
      version: 1,
      participant: profile,
      records: [r],
    };
    expect(parseParticipantBackup(JSON.stringify(backup))).toEqual(backup);
    expect(() =>
      parseParticipantBackup(JSON.stringify({ ...backup, records: [record()] })),
    ).toThrow();
    expect(() =>
      parseParticipantBackup(JSON.stringify({ ...backup, records: [r, r] })),
    ).toThrow();
    expect(() => parseParticipantBackup(JSON.stringify({ ...backup, version: 2 }))).toThrow();
  });
  it('no ofrece plantillas adultas ni un proveedor audiovisual al perfil infantil', () => {
    const html = renderToStaticMarkup(
      <ParticipantContext.Provider value={{ participant: profile, store: trainingStore }}>
        <App content={fixture} />
      </ParticipantContext.Provider>,
    );
    expect(html).toContain('El plan de');
    expect(html).toContain('Todavía no hay una rutina infantil');
    expect(html).not.toContain('Recorrer esta propuesta');
    expect(html).not.toContain('Ver video del ejercicio');
    expect(html).not.toContain('<iframe');
  });
});
