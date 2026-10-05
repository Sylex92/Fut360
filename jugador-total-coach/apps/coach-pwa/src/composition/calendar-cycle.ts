import { proposalSlot } from './session-eligibility';
import type { WeekSlot } from '../platform/planning';
import type { PersonalPlanVersion } from '../platform/personal-plan';
/** Rotate equivalent short games; never increase duration or change club/rest. */
export function childBallCycle(slots: WeekSlot[]): WeekSlot[][] {
  const rotations: Record<string, string[]> = {
    'youth-explore-15': [
      'youth-explore-15',
      'youth-pass-15',
      'youth-protect-15',
      'youth-pass-15',
    ],
    'youth-pass-15': [
      'youth-pass-15',
      'youth-explore-15',
      'youth-protect-15',
      'youth-explore-15',
    ],
    'youth-protect-15': [
      'youth-protect-15',
      'youth-pass-15',
      'youth-explore-15',
      'youth-pass-15',
    ],
  };
  return Array.from({ length: 4 }, (_, week) =>
    slots.map((s) => {
      const next = s.kind === 'session' ? rotations[s.sessionId]?.[week] : undefined;
      return next ? proposalSlot(next) : structuredClone(s);
    }),
  );
}
export function calendarSlots(version: PersonalPlanVersion, week: number) {
  return version.cycle?.[week % version.cycle.length] ?? version.slots;
}
export const childReviewFocus = [
  'Semanas 1–2: conocer las tareas y observar control, disfrute y recuperación. Puede parar y recolocarse; no se pide velocidad.',
  'Semanas 3–4: explorar protección sin choque y mirar antes de recibir. Mantén ritmo cómodo; el adulto coopera y deja tiempo para decidir.',
  'Semanas 5–6: si sigue cómodo, cambiar una sola condición: dirección de llegada o señal temprana. Mantener los mismos minutos y permitir más tiempo para responder.',
  'Semanas 7–8: repetir condiciones conocidas y comparar control, decisiones y ganas de jugar. Mantener o simplificar si hace falta; la semana no obliga a aumentar dificultad.',
] as const;
