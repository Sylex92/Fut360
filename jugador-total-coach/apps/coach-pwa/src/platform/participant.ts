import { validatePlanning } from './planning';
import type { ParticipantPlanning } from './planning';
export const participantGoals = {
  control: 'Control y primer toque',
  passing: 'Pase y asociación',
  dribbling: 'Conducción y uno contra uno',
  finishing: 'Crear ocasiones y marcar',
  defending: 'Defender y recuperar',
  physical: 'Movimiento, fuerza y resistencia',
} as const;
export type ParticipantGoal = keyof typeof participantGoals;
export interface Participant {
  id: string;
  alias: string;
  kind: 'adult' | 'child';
  foot: 'left' | 'right' | 'both' | 'unknown';
  modalities: ('5' | '7' | '11')[];
  goals: ParticipantGoal[];
  createdAt: string;
  planning?: ParticipantPlanning;
}
export const validParticipantId = (id: unknown): id is string =>
  typeof id === 'string' && /^p-[a-z0-9-]{8,64}$/.test(id);

export function validateParticipant(value: unknown): Participant {
  if (!value || typeof value !== 'object') throw new Error('Perfil inválido.');
  const p = value as Participant;
  if (
    !validParticipantId(p.id) ||
    typeof p.alias !== 'string' ||
    p.alias.trim().length < 1 ||
    p.alias.length > 40 ||
    !['adult', 'child'].includes(p.kind) ||
    !['left', 'right', 'both', 'unknown'].includes(p.foot) ||
    !Array.isArray(p.modalities) ||
    p.modalities.length > 3 ||
    new Set(p.modalities).size !== p.modalities.length ||
    !p.modalities.every((m) => ['5', '7', '11'].includes(m)) ||
    !Array.isArray(p.goals) ||
    p.goals.length > 6 ||
    new Set(p.goals).size !== p.goals.length ||
    !p.goals.every((g) => Object.hasOwn(participantGoals, g)) ||
    typeof p.createdAt !== 'string' ||
    !Number.isFinite(Date.parse(p.createdAt))
  )
    throw new Error('Revisa el alias, tipo y objetivos del perfil.');
  return structuredClone({
    id: p.id,
    alias: p.alias.trim(),
    kind: p.kind,
    foot: p.foot,
    modalities: p.modalities,
    goals: p.goals,
    createdAt: p.createdAt,
    ...(p.planning === undefined ? {} : { planning: validatePlanning(p.planning, p.kind) }),
  });
}
