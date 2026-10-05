import { coachingPlans, coachingSessions } from './development-plan';
import { taskById } from './coaching-catalog';
import type { PlanningContext, WeekSlot } from '../platform/planning';

// Requirements describe the actual proposals, never a silent solo substitution.
const requirements: Record<
  string,
  { places: PlanningContext['places']; facilities: PlanningContext['facilities'] }
> = {
  'control-30': { places: ['home', 'court', 'pitch'], facilities: [] },
  'midfield-45': { places: ['court', 'pitch'], facilities: ['wall'] },
  'attack-50': { places: ['pitch'], facilities: ['goal'] },
  'defense-45': { places: ['court', 'pitch'], facilities: [] },
  'strength-40': { places: ['gym'], facilities: ['row'] },
  'solo-control-20': { places: ['home', 'court', 'pitch'], facilities: [] },
  'solo-court-30': { places: ['court', 'pitch'], facilities: [] },
  'solo-court-40': { places: ['court', 'pitch'], facilities: [] },
  'solo-strength-24': { places: ['home', 'gym'], facilities: [] },
  'solo-strength-32': { places: ['home', 'gym'], facilities: [] },
  'youth-explore-15': { places: ['court', 'pitch'], facilities: [] },
  'youth-pass-15': { places: ['court', 'pitch'], facilities: [] },
  'youth-protect-15': { places: ['court', 'pitch'], facilities: [] },
  'youth-move-10': { places: ['home', 'court', 'pitch'], facilities: [] },
};
export function sessionRequirements(id: string, context: PlanningContext): string[] {
  const session = coachingSessions.find((s) => s.id === id);
  const required = requirements[id];
  if (!session || !required) return ['Propuesta no disponible.'];
  const people = Math.max(
    session.audience === 'child' ? 2 : 1,
    ...session.blocks.map((b) => taskById.get(b.taskId)!.participants),
  );
  const issues: string[] = [];
  if (context.participants === null)
    issues.push(`Confirma las personas disponibles: esta propuesta necesita ${people}.`);
  else if (context.participants < people)
    issues.push(`Necesita ${people} personas; has indicado ${context.participants}.`);
  if (!required.places.some((place) => context.places.includes(place)))
    issues.push('El lugar requerido no está entre tus lugares confirmados.');
  if (required.facilities.includes('wall') && !context.facilities.includes('wall'))
    issues.push('Falta confirmar una pared apta para pases o rebotador.');
  if (required.facilities.includes('goal') && !context.facilities.includes('goal'))
    issues.push('Falta confirmar portería y zona de tiro segura.');
  if (required.facilities.includes('row') && !context.facilities.includes('row'))
    issues.push('Falta confirmar el equipo de remo sentado del gimnasio.');
  return issues;
}
export function proposalSlot(id: string): Extract<WeekSlot, { kind: 'session' }> {
  const session = coachingSessions.find((s) => s.id === id);
  const plan = coachingPlans.get(id);
  if (!session || !plan) throw new Error('Propuesta no disponible.');
  return {
    kind: 'session',
    sessionId: id,
    label: session.name,
    minutes: plan.expectedDurationMs / 60000,
    contentStamp: JSON.stringify(plan),
  };
}
export function proposalUnchanged(slot: WeekSlot): boolean {
  if (slot.kind !== 'session') return true;
  const current = coachingPlans.get(slot.sessionId);
  return (
    !!current &&
    slot.contentStamp === JSON.stringify(current) &&
    slot.minutes === current.expectedDurationMs / 60000
  );
}
