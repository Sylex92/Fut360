import { expect, it } from 'vitest';
import { movements } from './movement-library';
import { filterMovements } from './movement-search';

it('busca sin acentos ni distinción de mayúsculas y combina palabras en cualquier orden', () => {
  const find = (query: string) =>
    filterMovements(movements, { query, category: '', equipment: '' });
  expect(find('FLEXION PARED').map((m) => m.id)).toEqual(['wall-push-up']);
  expect(find('pared flexión')).toEqual(find('FLEXION PARED'));
  expect(find('  ')).toEqual(movements);
});
it('combina objetivo y material; los resultados vacíos no recuperan elementos excluidos', () => {
  expect(
    filterMovements(movements, { query: '', category: 'ball', equipment: 'wall' }),
  ).toEqual([]);
  const found = filterMovements(movements, {
    query: '',
    category: 'strength',
    equipment: 'mat',
  });
  expect(found.map((m) => m.id)).toEqual(['glute-bridge', 'dead-bug']);
  expect(
    filterMovements(movements, { query: 'inexistente', category: '', equipment: '' }),
  ).toEqual([]);
});
