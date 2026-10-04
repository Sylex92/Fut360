import { coachingPlans } from './development-plan';
import { proposalSlot, sessionRequirements } from './session-eligibility';
import type { PlanningContext, WeekSlot } from '../platform/planning';

/** Fill only explicitly unassigned days. Existing club, gym, rest and sessions survive. */
export function suggestProgramWeek(
  kind: 'adult' | 'child',
  slots: WeekSlot[],
  context: PlanningContext,
) {
  const next = structuredClone(slots);
  const options =
    kind === 'child'
      ? ['youth-explore-15', 'youth-pass-15', 'youth-move-10']
      : ['solo-control-20', 'solo-strength-24', 'solo-court-30'];
  const limit = kind === 'child' ? 1 : 3;
  const minRest = kind === 'child' ? 2 : 1;
  const added: string[] = [];
  if (kind === 'child' && next.some((s) => s.kind === 'session'))
    return { slots: next, added };
  for (const id of options) {
    if (added.length >= limit || sessionRequirements(id, context).length) continue;
    if (next.some((s) => s.kind === 'session' && s.sessionId === id)) continue;
    const occupied = next.filter((s) => s.kind === 'external' || s.kind === 'session').length;
    if (occupied >= 7 - minRest || (kind === 'adult' && occupied >= 3)) break;
    const duration = coachingPlans.get(id)!.expectedDurationMs / 60000;
    const day = next.findIndex(
      (s, i) =>
        s.kind === 'unassigned' &&
        context.availableMinutes[i] != null &&
        context.availableMinutes[i]! >= duration &&
        // A first cycle leaves a day between all structured activities, including the weekly wrap.
        [next[(i + 6) % 7], next[(i + 1) % 7]].every(
          (n) => n?.kind !== 'session' && n?.kind !== 'external',
        ),
    );
    if (day >= 0) {
      next[day] = proposalSlot(id);
      added.push(id);
    }
  }
  return { slots: next, added };
}
