import type { MovementPreview } from './movement-library';

const normalize = (value: string) =>
  value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('es');

export function filterMovements(
  library: readonly MovementPreview[],
  filters: { query: string; category: string; equipment: string },
): readonly MovementPreview[] {
  const terms = normalize(filters.query).trim().split(/\s+/).filter(Boolean);
  return library.filter((movement) => {
    if (filters.category && movement.category !== filters.category) return false;
    if (filters.equipment && movement.equipmentKind !== filters.equipment) return false;
    const text = normalize([movement.name, movement.preparation, ...movement.cues].join(' '));
    return terms.every((term) => text.includes(term));
  });
}
