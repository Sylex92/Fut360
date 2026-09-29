import { expect, it } from 'vitest';
import { Ajv2020 } from 'ajv/dist/2020.js';
import schema from '../../../content/schemas/exercise.schema.json';
import exercise from '../../../content/exercises/hip-hinge.json';
import animationSchema from '../../../content/schemas/animation.schema.json';
import manifest from '../../../assets/manifests/hip-hinge-v1.json';

it('la primera ficha cumple el esquema existente y conserva su revisión pendiente', () => {
  const validate = new Ajv2020({ strict: true, allErrors: true }).compile(schema);
  expect(validate(exercise), JSON.stringify(validate.errors)).toBe(true);
  expect(exercise.reviewStatus).toBe('draft');
  expect(exercise.animation.loopable).toBe(false);
  expect(exercise.equipment).toEqual([]);
});
it('el manifiesto y la ficha señalan el mismo clip finito y están dentro del área declarada', () => {
  const validate = new Ajv2020({ strict: true, allErrors: true }).compile(animationSchema);
  expect(validate(manifest), JSON.stringify(validate.errors)).toBe(true);
  expect(manifest.assetId).toBe(exercise.animation.assetId);
  expect(manifest.clipName).toBe(exercise.animation.clipName);
  expect(manifest.loopable).toBe(exercise.animation.loopable);
  expect(manifest.practiceRepetitions * manifest.durationMs).toBeLessThan(30000);
  expect(manifest.startPose).toBe(manifest.endPose);
  expect(manifest.boundingBoxMeters.min[0]).toBeGreaterThan(-1);
  expect(manifest.boundingBoxMeters.min[2]).toBeGreaterThan(-1);
  expect(manifest.boundingBoxMeters.max[0]).toBeLessThan(1);
  expect(manifest.boundingBoxMeters.max[2]).toBeLessThan(1);
});
