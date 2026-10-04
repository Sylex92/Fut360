export const weekdays = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];
export const places = {
  home: 'Casa · 2×2 libres',
  court: 'Cancha',
  pitch: 'Campo',
  gym: 'Gimnasio',
} as const;
export const facilities = {
  wall: 'Pared apta para pases o rebotador',
  goal: 'Portería y zona de tiro segura',
  row: 'Equipo de remo sentado revisado',
} as const;
export interface PlanningContext {
  availableMinutes: (number | null)[];
  participants: number | null;
  places: (keyof typeof places)[];
  facilities: (keyof typeof facilities)[];
}
export type WeekSlot =
  | { kind: 'unassigned'; minutes: 0 }
  | { kind: 'rest'; minutes: 0 }
  | { kind: 'external'; label: string; minutes: number }
  | {
      kind: 'session';
      label: string;
      minutes: number;
      sessionId: string;
      contentStamp: string;
    };
export interface WeekVersion {
  version: number;
  savedAt: string;
  context: PlanningContext;
  slots: WeekSlot[];
}
export interface ParticipantPlanning {
  context: PlanningContext;
  weeks: WeekVersion[];
}
export const emptyPlanningContext = (): PlanningContext => ({
  availableMinutes: weekdays.map(() => null),
  participants: null,
  places: [],
  facilities: [],
});
export const emptyWeek = (): WeekSlot[] =>
  weekdays.map(() => ({ kind: 'unassigned', minutes: 0 }));
const minutes = (n: unknown): n is number =>
  typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 1440;
const text = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.trim().length > 0 && v.length <= max;
function keys<T extends string>(v: unknown, options: Record<T, string>): T[] {
  if (
    !Array.isArray(v) ||
    v.length > Object.keys(options).length ||
    new Set(v).size !== v.length ||
    !v.every((k) => typeof k === 'string' && Object.hasOwn(options, k))
  )
    throw new Error('Lugares o material inválidos.');
  return [...v] as T[];
}
export function validatePlanningContext(value: unknown): PlanningContext {
  const c = value as PlanningContext | null;
  if (
    !c ||
    !Array.isArray(c.availableMinutes) ||
    c.availableMinutes.length !== 7 ||
    !c.availableMinutes.every((v) => v === null || minutes(v)) ||
    !(
      c.participants === null ||
      (Number.isInteger(c.participants) && c.participants >= 1 && c.participants <= 22)
    )
  )
    throw new Error('Revisa disponibilidad y número de personas.');
  return {
    availableMinutes: [...c.availableMinutes],
    participants: c.participants,
    places: keys(c.places, places),
    facilities: keys(c.facilities, facilities),
  };
}
export function validatePlanning(
  value: unknown,
  kind: 'adult' | 'child',
): ParticipantPlanning {
  const p = value as ParticipantPlanning | null;
  if (!p || !Array.isArray(p.weeks) || p.weeks.length > 104)
    throw new Error('Agenda inválida o límite de 104 versiones alcanzado.');
  const weeks = p.weeks.map((w, i): WeekVersion => {
    if (
      !w ||
      w.version !== i + 1 ||
      !text(w.savedAt, 40) ||
      !Number.isFinite(Date.parse(w.savedAt)) ||
      !Array.isArray(w.slots) ||
      w.slots.length !== 7
    )
      throw new Error('Versión semanal inválida.');
    const slots = w.slots.map((s): WeekSlot => {
      if (!s || !minutes(s.minutes)) throw new Error('Duración semanal inválida.');
      if ((s.kind === 'unassigned' || s.kind === 'rest') && s.minutes === 0)
        return { kind: s.kind, minutes: 0 };
      if (s.kind === 'external' && s.minutes > 0 && text(s.label, 80))
        return { kind: s.kind, label: s.label.trim(), minutes: s.minutes };
      if (
        s.kind === 'session' &&
        kind === 'adult' &&
        s.minutes > 0 &&
        text(s.label, 80) &&
        text(s.sessionId, 80) &&
        text(s.contentStamp, 60000)
      )
        return {
          kind: s.kind,
          label: s.label.trim(),
          minutes: s.minutes,
          sessionId: s.sessionId,
          contentStamp: s.contentStamp,
        };
      throw new Error('Actividad no permitida para este perfil.');
    });
    return {
      version: w.version,
      savedAt: w.savedAt,
      context: validatePlanningContext(w.context),
      slots,
    };
  });
  return { context: validatePlanningContext(p.context), weeks };
}
export function weekSummary(slots: WeekSlot[], context: PlanningContext) {
  return {
    minutes: slots.reduce((total, s) => total + s.minutes, 0),
    externalMinutes: slots.reduce(
      (total, s) => total + (s.kind === 'external' ? s.minutes : 0),
      0,
    ),
    restDays: slots.filter((s) => s.kind === 'rest').length,
    unassignedDays: slots.filter((s) => s.kind === 'unassigned').length,
    overbooked: slots.flatMap((s, i) => {
      const available = context.availableMinutes[i];
      return available != null && s.minutes > available ? [weekdays[i]!] : [];
    }),
  };
}
