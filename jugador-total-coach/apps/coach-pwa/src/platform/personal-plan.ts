import { validatePlanning, validatePlanningContext } from './planning';
import type { PlanningContext, WeekSlot } from './planning';

export const planStages = {
  entry: 'Retomar con margen',
  build: 'Construir consistencia',
  transfer: 'Aplicar al juego',
  play: 'Juego breve y disfrute',
  vary: 'Variar decisiones y situaciones',
} as const;
export type PlanStage = keyof typeof planStages;
export interface PersonalPlanVersion {
  version: number;
  savedAt: string;
  start: string;
  weeks: number;
  stage: PlanStage;
  context: PlanningContext;
  slots: WeekSlot[];
  cycle?: WeekSlot[][];
  reason: string;
}
export interface DayReport {
  id: string;
  recordedAt: string;
  date: string;
  planVersion: number;
  outcome: 'done' | 'partial' | 'skipped';
  minutes: number;
  notes: string;
}
export interface SkillObservation {
  id: string;
  recordedAt: string;
  date: string;
  taskId: string;
  side: 'left' | 'right' | 'both';
  condition: string;
  attempts: number;
  successes: number;
  comfort: 'comfortable' | 'difficult' | 'stop';
  notes: string;
}
export interface PersonalPlan {
  versions: PersonalPlanVersion[];
  reports: DayReport[];
  observations: SkillObservation[];
}
export const emptyPersonalPlan = (): PersonalPlan => ({
  versions: [],
  reports: [],
  observations: [],
});
export function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^20\d{2}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T12:00:00Z');
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
export function addDays(date: string, days: number) {
  if (!isDate(date) || !Number.isInteger(days)) throw new Error('Fecha inválida.');
  const d = new Date(date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function monday(date: string) {
  const weekday = new Date(date + 'T12:00:00Z').getUTCDay();
  return addDays(date, -((weekday + 6) % 7));
}
const text = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.length <= max;
const stamp = (v: unknown): v is string =>
  typeof v === 'string' && v.length <= 40 && Number.isFinite(Date.parse(v));
const integer = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export function stageForAudience(stage: string, kind: 'adult' | 'child') {
  return (kind === 'child' ? ['play', 'vary'] : ['entry', 'build', 'transfer']).includes(
    stage,
  );
}
export function validatePersonalPlan(value: unknown, kind: 'adult' | 'child'): PersonalPlan {
  const p = value as PersonalPlan | null;
  if (
    !p ||
    !Array.isArray(p.versions) ||
    p.versions.length > 104 ||
    !Array.isArray(p.reports) ||
    p.reports.length > 2000 ||
    !Array.isArray(p.observations) ||
    p.observations.length > 2000
  )
    throw new Error('Plan o cantidad de registros inválidos.');
  const versions = p.versions.map((v, i): PersonalPlanVersion => {
    if (
      !v ||
      v.version !== i + 1 ||
      !stamp(v.savedAt) ||
      !isDate(v.start) ||
      monday(v.start) !== v.start ||
      !integer(v.weeks, 1, kind === 'child' ? 8 : 24) ||
      !stageForAudience(v.stage, kind) ||
      !text(v.reason, 600) ||
      !v.reason.trim()
    )
      throw new Error('Revisa fecha, etapa y motivo del plan.');
    const week = validatePlanning(
      {
        context: v.context,
        weeks: [{ version: 1, savedAt: v.savedAt, context: v.context, slots: v.slots }],
      },
      kind,
    ).weeks[0]!;
    const cycle =
      v.cycle === undefined
        ? undefined
        : (() => {
            if (!Array.isArray(v.cycle) || v.cycle.length < 1 || v.cycle.length > 4)
              throw new Error('Rotación semanal inválida.');
            return v.cycle.map(
              (slots) =>
                validatePlanning(
                  {
                    context: week.context,
                    weeks: [{ version: 1, savedAt: v.savedAt, context: week.context, slots }],
                  },
                  kind,
                ).weeks[0]!.slots,
            );
          })();
    return {
      version: v.version,
      savedAt: v.savedAt,
      start: v.start,
      weeks: v.weeks,
      stage: v.stage,
      context: week.context,
      slots: week.slots,
      ...(cycle ? { cycle } : {}),
      reason: v.reason.trim(),
    };
  });
  const reports = p.reports.map((r): DayReport => {
    const v = versions[r?.planVersion - 1];
    if (
      !r ||
      !text(r.id, 80) ||
      !r.id ||
      !stamp(r.recordedAt) ||
      !isDate(r.date) ||
      !v ||
      r.date < v.start ||
      r.date >= addDays(v.start, v.weeks * 7) ||
      !['done', 'partial', 'skipped'].includes(r.outcome) ||
      !integer(r.minutes, 0, 1440) ||
      (r.outcome === 'skipped' && r.minutes !== 0) ||
      !text(r.notes, 600)
    )
      throw new Error('Resultado diario inválido.');
    return {
      id: r.id,
      recordedAt: r.recordedAt,
      date: r.date,
      planVersion: r.planVersion,
      outcome: r.outcome,
      minutes: r.minutes,
      notes: r.notes,
    };
  });
  const observations = p.observations.map((o): SkillObservation => {
    if (
      !o ||
      !text(o.id, 80) ||
      !o.id ||
      !stamp(o.recordedAt) ||
      !isDate(o.date) ||
      typeof o.taskId !== 'string' ||
      !/^[TMFBWCSY][0-9]{2}$/.test(o.taskId) ||
      o.taskId.startsWith('Y') !== (kind === 'child') ||
      !['left', 'right', 'both'].includes(o.side) ||
      !text(o.condition, 200) ||
      !o.condition.trim() ||
      !integer(o.attempts, 1, 100) ||
      !integer(o.successes, 0, o.attempts) ||
      !['comfortable', 'difficult', 'stop'].includes(o.comfort) ||
      !text(o.notes, 600)
    )
      throw new Error('Revisa intentos, aciertos, lado y condiciones de la observación.');
    return {
      id: o.id,
      recordedAt: o.recordedAt,
      date: o.date,
      taskId: o.taskId,
      side: o.side,
      condition: o.condition.trim(),
      attempts: o.attempts,
      successes: o.successes,
      comfort: o.comfort,
      notes: o.notes,
    };
  });
  if (
    new Set(reports.map((r) => r.id)).size !== reports.length ||
    new Set(observations.map((o) => o.id)).size !== observations.length
  )
    throw new Error('Hay registros duplicados.');
  return { versions, reports, observations };
}
export function preservesPersonalPlan(
  prior: PersonalPlan | undefined,
  next: PersonalPlan | undefined,
) {
  if (!prior) return true;
  if (!next) return false;
  return (['versions', 'reports', 'observations'] as const).every(
    (key) =>
      prior[key].length <= next[key].length &&
      prior[key].every((row, i) => JSON.stringify(row) === JSON.stringify(next[key][i])),
  );
}
export function observationComparison(items: SkillObservation[], current: SkillObservation) {
  const previous = items
    .filter(
      (o) =>
        o.id !== current.id &&
        o.taskId === current.taskId &&
        o.side === current.side &&
        o.condition === current.condition &&
        o.date < current.date,
    )
    .sort(
      (a, b) => b.date.localeCompare(a.date) || b.recordedAt.localeCompare(a.recordedAt),
    )[0];
  return previous
    ? {
        previous,
        change: Math.round(
          100 *
            (current.successes / current.attempts - previous.successes / previous.attempts),
        ),
      }
    : null;
}
export interface PlanOffer {
  format: 'fut360-plan-offer';
  kind: 'adult' | 'child';
  context: PlanningContext;
  weeks?: number;
  stage?: PlanStage;
  reason?: string;
  days: (
    | { kind: 'rest' }
    | { kind: 'external'; label: string; minutes: number }
    | { kind: 'session'; sessionId: string }
  )[];
}
export function parsePlanOffer(hash: string): PlanOffer | null {
  if (!hash.startsWith('#plan=')) return null;
  if (hash.length > 16000) throw new Error('La propuesta es demasiado grande.');
  const value = JSON.parse(decodeURIComponent(hash.slice(6))) as PlanOffer;
  if (
    !value ||
    value.format !== 'fut360-plan-offer' ||
    !['adult', 'child'].includes(value.kind) ||
    !Array.isArray(value.days) ||
    value.days.length !== 7 ||
    (value.weeks !== undefined && !integer(value.weeks, 1, value.kind === 'child' ? 8 : 24)) ||
    (value.stage !== undefined && !stageForAudience(value.stage, value.kind)) ||
    (value.reason !== undefined && (!text(value.reason, 600) || !value.reason.trim()))
  )
    throw new Error('Propuesta inválida.');
  const days = value.days.map((d) => {
    if (d?.kind === 'rest') return { kind: 'rest' } as const;
    if (
      d?.kind === 'external' &&
      text(d.label, 80) &&
      d.label.trim() &&
      integer(d.minutes, 1, 1440)
    )
      return { kind: 'external', label: d.label.trim(), minutes: d.minutes } as const;
    if (d?.kind === 'session' && text(d.sessionId, 80) && d.sessionId)
      return { kind: 'session', sessionId: d.sessionId } as const;
    throw new Error('Actividad no válida en la propuesta.');
  });
  return {
    format: 'fut360-plan-offer',
    kind: value.kind,
    context: validatePlanningContext(value.context),
    days,
    ...(value.weeks !== undefined ? { weeks: value.weeks } : {}),
    ...(value.stage !== undefined ? { stage: value.stage } : {}),
    ...(value.reason !== undefined ? { reason: value.reason.trim() } : {}),
  };
}
