import { describe, it, expect } from 'vitest';
import { Ajv2020 } from 'ajv/dist/2020.js';
import schema from '../../../content/schemas/coaching-catalog.schema.json';
import catalog from '../../../content/coaching/catalog.json';

describe('Contrato de fichas de enseñanza', () => {
  it('valida campos y procedencia, y rechaza referencias incompletas', () => {
    const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
    expect(validate(catalog), JSON.stringify(validate.errors)).toBe(true);
    const invalid = structuredClone(catalog);
    invalid.tasks[0]!.steps = [];
    expect(validate(invalid)).toBe(false);
  });
});
