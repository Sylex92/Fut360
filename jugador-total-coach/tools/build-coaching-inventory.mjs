import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { tasks } = JSON.parse(
  fs.readFileSync(path.join(root, 'content/coaching/catalog.json'), 'utf8'),
);
const { references } = JSON.parse(
  fs.readFileSync(path.join(root, 'content/coaching/source-pages.json'), 'utf8'),
);
const exact = tasks.filter((t) => t.videos.some((v) => v.match === 'demonstration')).length;
const partial = tasks.filter(
  (t) => t.videos.length && !t.videos.some((v) => v.match === 'demonstration'),
).length;
const time = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
const cell = (s) => s.replaceAll('|', '/').replaceAll('\n', ' ');
const sourceLinks = (task) =>
  references
    .filter((r) => r.tasks.includes(task.id))
    .map(
      (r) =>
        `[${cell(r.title)}](${r.url}) · ${r.match === 'demonstration' ? 'gesto en página externa' : 'componente externo'}`,
    )
    .join('<br>');
const rows = tasks.map(
  (t) =>
    `| ${t.id} | ${cell(t.name)} | ${t.familyId} | ${t.space}; ${t.participants} persona(s) | ${t.videos.map((v) => `[${cell(v.channel)} ${time(v.start)}–${time(v.end)}](https://www.youtube.com/watch?v=${v.videoId}&t=${v.start}s) · ${v.match === 'demonstration' ? 'gesto observado' : 'componente'}`).join('<br>') || sourceLinks(t) || 'Demostración pendiente'} |`,
);
const text = `# Inventario de enseñanza dentro de la aplicación

2026-10-05. Generado desde [catálogo real](../../content/coaching/catalog.json) mediante tools/build-coaching-inventory.mjs. ${tasks.length} fichas / ${new Set(tasks.map((t) => t.familyId)).size} familias. ${exact} fichas con referencia del gesto, ${partial} con un componente y ${tasks.filter((t) => !t.videos.length).length} sin video incrustado. Son ${new Set(tasks.flatMap((t) => t.videos.map((v) => v.videoId))).size} videos YouTube originales; una fuente puede contener varios ejercicios y dos fichas pueden compartir fragmento. Las fichas no equivalen a patrones distintos ni a videos diferentes. Fuera del reproductor integrado, una ficha enlaza el gesto de sentadilla NHS y siete ejemplos parciales FIFA. No sumar estos enlaces como videos incrustados.

Todas las fichas incluyen organización, pasos, objetivo, errores y cambios de dificultad/modalidad. Permanecen documentary-draft: referencia visible, corrección técnica, dosis personal y eficacia no son equivalentes. “Gesto observado” no significa visionado íntegro del video, fotogramas completos revisados o equivalencia de toda la tarea. [Observaciones y límites](../research/VIDEO_TEACHING_REVIEW.md).

Los 22 recursos 3D anteriores siguen en [inventario histórico](CONTENT_INVENTORY.md), con aceptación de claridad/naturalidad reabierta. No sumarlos como nuevas tareas sin deduplicar. Los 5.764 videos localizados tampoco son ejercicios incorporados.

| ID | Ficha disponible | Familia | Lugar / participantes mínimos | Cobertura de video |
|---|---|---|---|---|
${rows.join('\n')}

## Organización visual original
T05, T06, T07, T08, T11, T14, T17, T18, T19, T20, S01–S04, Y01, Y04, Y07, Y08 y Y09 incluyen un esquema propio de posiciones y rutas posibles. Explican organización; no representan biomecánica ni reemplazan un video exacto. Sin escalas físicas inferidas del dibujo.

## Referencias en páginas de autor

${references.map((r) => `- ${r.tasks.join(', ')}: [${r.title}](${r.url}); ${r.section}. ${r.note} Evidencia: ${r.observation}`).join('\n')}

No se incrustan estas páginas ni se controla su final. La modalidad infantil usa fichas y enlaces acompañados, sin cargar YouTube dentro de la aplicación. Las referencias parciales no cierran sus demostraciones exactas. F01 dispone además de una referencia integrada de Peak Physio; su enlace NHS es una alternativa externa. [Revisión de este incremento](../reviews/visual-teaching-increment.md).

## Cobertura pendiente
Completar referencias de las variantes sin video y reemplazar referencias parciales cuando exista una demostración pertinente. Revisión por fragmento y tarea, no por número de enlaces. Joner Football y Unisport permanecen en la investigación previa; este incremento no les atribuye nuevos fragmentos exactos. Ninguna referencia se descarga ni se redistribuye. [Condiciones](../reviews/video-reference-cost-and-rights.md).
`;
fs.writeFileSync(path.join(root, 'docs/training/COACHING_LIBRARY_INVENTORY.md'), text);
console.log(
  JSON.stringify({
    tasks: tasks.length,
    exact,
    partial,
    pending: tasks.length - exact - partial,
  }),
);
