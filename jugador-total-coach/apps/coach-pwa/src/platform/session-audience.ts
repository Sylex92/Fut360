// Fixed identifiers keep imported agendas from assigning adult proposals to a child.
export const youthSessionIds = ['youth-explore-15', 'youth-pass-15', 'youth-move-10'] as const;
export function allowedSessionAudience(id: string, kind: 'adult' | 'child') {
  const youth = youthSessionIds.some((known) => known === id);
  return kind === 'child' ? youth : !id.startsWith('youth-');
}
