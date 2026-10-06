import input from '../../../../content/coaching/catalog.json';
import { validateSegment } from '../platform/youtube';
import type { VideoSegment } from '../platform/youtube';
import {
  localTeachingAsset,
  type LocalVideoSegment,
  type TeachingVideo,
} from '../platform/local-teaching-media';
export interface CoachingTask {
  id: string;
  familyId: string;
  name: string;
  category: string;
  objective: string;
  setup: string;
  space: string;
  participants: number;
  equipment: string[];
  steps: string[];
  success: string;
  mistakes: string;
  easier: string;
  harder: string;
  limits: string;
  modalities: { fut5: string; fut7: string; fut11: string };
  videos: VideoSegment[];
  localVideos?: LocalVideoSegment[];
  sourceRefs: string[];
  review: string;
}
export const coachingTasks = input.tasks as CoachingTask[];
export const taskById = new Map(coachingTasks.map((task) => [task.id, task]));
export const taskCategories = [...new Set(coachingTasks.map((task) => task.category))];
export const spaceLabels: Record<string, string> = {
  home: 'Casa · espacio libre',
  court: 'Cancha',
  pitch: 'Campo',
  'wall-area': 'Zona con pared o rebotador',
  'goal-area': 'Campo con portería',
  'running-area': 'Zona amplia para correr',
  'gym-or-home': 'Gimnasio · equipo indicado',
  'training-area': 'Zona de entrenamiento',
};
export function taskAudience(task: CoachingTask) {
  return task.id.startsWith('Y') ? 'child' : 'adult';
}
export function teachingVideos(task: CoachingTask): TeachingVideo[] {
  return [...(task.localVideos ?? []), ...(taskAudience(task) === 'child' ? [] : task.videos)];
}
export function findTasks(
  query: string,
  category = '',
  place = '',
  videosOnly = false,
  audience: 'adult' | 'child' = 'adult',
) {
  const norm = (s: string) =>
    s
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
  const words = norm(query).trim().split(/\s+/).filter(Boolean);
  return coachingTasks.filter(
    (task) =>
      taskAudience(task) === audience &&
      (!category || task.category === category) &&
      (!place || (place === 'home' ? task.space === 'home' : task.space !== 'home')) &&
      (!videosOnly || teachingVideos(task).length > 0) &&
      words.every((word) =>
        norm([task.name, task.objective, task.category, task.id].join(' ')).includes(word),
      ),
  );
}
export function validateCoachingCatalog() {
  if (taskById.size !== coachingTasks.length) throw new Error('IDs duplicados.');
  for (const task of coachingTasks) {
    if (
      !task.setup ||
      task.steps.length < 2 ||
      !task.success ||
      !task.mistakes ||
      task.participants < 1
    )
      throw new Error('Ficha incompleta: ' + task.id);
    for (const segment of task.videos) validateSegment(segment);
    for (const segment of task.localVideos ?? []) localTeachingAsset(segment);
  }
}
validateCoachingCatalog();
