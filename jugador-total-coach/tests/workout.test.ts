import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { validateWorkoutV1 } from '../packages/exercise-catalog/src/index';
import fixture from '../content/examples/mvp1-60min.workout.json';

const firstBlock = (copy: typeof fixture) => copy.blocks[0]!;
const firstItem = (copy: typeof fixture) => firstBlock(copy).items[0]!;

describe('fixture histórico v1', () => {
  it('conserva el archivo original y calcula las rondas hasta 3600 segundos', () => {
    const original = readFileSync(
      new URL('../content/examples/mvp1-60min.workout.json', import.meta.url),
    );
    expect(createHash('sha256').update(original).digest('hex')).toBe(
      '0967293497539f57f71d201e019d7203b9707ab4152b7a6be0ecb9b4021fc40e',
    );
    const result = validateWorkoutV1(fixture);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('El fixture no valida');
    expect(result.summary).toMatchObject({
      totalSeconds: 3600,
      workSeconds: 2475,
      restSeconds: 1125,
      occurrences: 60,
      uniqueExercises: 31,
    });
    expect(result.summary.blocks.map((block) => block.totalSeconds)).toEqual([
      300, 720, 720, 960, 480, 420,
    ]);
    expect(result.workout.reviewStatus).toBe('draft');
  });
  it('no modifica el documento ni acredita una revisión deportiva', () => {
    const copy = structuredClone(fixture);
    const before = JSON.stringify(copy);
    validateWorkoutV1(copy);
    expect(JSON.stringify(copy)).toBe(before);
  });
  it.each([
    null,
    [],
    {},
    { ...fixture, unknown: true },
    { ...fixture, version: '1' },
    { ...fixture, reviewStatus: 'approved' },
  ])('rechaza estructura inválida: %j', (input) => {
    const result = validateWorkoutV1(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues.length).toBeGreaterThan(0);
  });
  it('rechaza una suma distinta aunque el esquema sea válido', () => {
    const copy = structuredClone(fixture);
    firstItem(copy).workSeconds += 1;
    expect(validateWorkoutV1(copy)).toMatchObject({
      ok: false,
      issues: [
        {
          path: '/expectedDurationSeconds',
          message: 'Se declaran 3600 s, pero los bloques suman 3601 s.',
        },
      ],
    });
  });
  it.each([0, -1, 0.5, Number.MAX_SAFE_INTEGER + 1])(
    'rechaza rondas inválidas: %s',
    (rounds) => {
      const copy = structuredClone(fixture);
      firstBlock(copy).rounds = rounds;
      expect(validateWorkoutV1(copy).ok).toBe(false);
    },
  );
  it('detecta desbordamiento sin expandir rondas enormes', () => {
    const copy = structuredClone(fixture);
    firstBlock(copy).rounds = Number.MAX_SAFE_INTEGER;
    expect(validateWorkoutV1(copy)).toMatchObject({
      ok: false,
      issues: [{ path: '/blocks' }],
    });
  });
  it('permite descanso cero y distingue una ocurrencia de una repetición física', () => {
    const copy = structuredClone(fixture);
    copy.blocks = [
      {
        id: 'test',
        displayName: 'Prueba',
        rounds: 2,
        items: [{ exerciseId: 'gesture', side: 'none', workSeconds: 5, restSeconds: 0 }],
      },
    ];
    copy.expectedDurationSeconds = 10;
    expect(validateWorkoutV1(copy)).toMatchObject({
      ok: true,
      summary: { totalSeconds: 10, occurrences: 2, restSeconds: 0 },
    });
  });
  it.each([
    'version',
    'space',
    'duplicate',
    'empty-id',
    'empty-name',
    'negative-rest',
    'unknown-side',
  ])('rechaza semántica inválida: %s', (caseName) => {
    const copy = structuredClone(fixture);
    if (caseName === 'version') copy.version = 2;
    if (caseName === 'space') copy.space.widthM = 0;
    if (caseName === 'duplicate') copy.blocks[1]!.id = firstBlock(copy).id;
    if (caseName === 'empty-id') firstItem(copy).exerciseId = ' ';
    if (caseName === 'empty-name') firstBlock(copy).displayName = '';
    if (caseName === 'negative-rest') firstItem(copy).restSeconds = -1;
    if (caseName === 'unknown-side') firstItem(copy).side = 'both';
    expect(validateWorkoutV1(copy).ok).toBe(false);
  });
});
