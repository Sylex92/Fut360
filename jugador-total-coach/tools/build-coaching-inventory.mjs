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
const { assets } = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/manifests/local-teaching-media.json'), 'utf8'),
);
const media = (t) => [...(t.localVideos ?? []), ...t.videos];
const exact = tasks.filter((t) => media(t).some((v) => v.match === 'demonstration')).length;
const partial = tasks.filter(
  (t) => media(t).length && !media(t).some((v) => v.match === 'demonstration'),
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
    `| ${t.id} | ${cell(t.name)} | ${t.familyId} | ${t.space}; ${t.participants} persona(s) | ${
      media(t)
        .map((v) => {
          const local = v.provider === 'local' ? assets.find((a) => a.id === v.assetId) : null;
          return `[${cell(local ? local.attribution : v.channel)} ${time(v.start)}–${time(v.end)}](${local ? local.source : `https://www.youtube.com/watch?v=${v.videoId}&t=${v.start}s`}) · ${local ? 'archivo local · ' : ''}${v.match === 'demonstration' ? 'gesto observado' : 'componente'}`;
        })
        .join('<br>') ||
      sourceLinks(t) ||
      'Demostración pendiente'
    } |`,
);
const text = `# Inventario de enseñanza dentro de la aplicación

2026-10-06. Generado desde [catálogo real](../../content/coaching/catalog.json) mediante tools/build-coaching-inventory.mjs. ${tasks.length} fichas / ${new Set(tasks.map((t) => t.familyId)).size} familias. ${exact} fichas con referencia del gesto, ${partial} con un componente y ${tasks.filter((t) => !media(t).length).length} sin video integrado. Son ${new Set(tasks.flatMap((t) => t.videos.map((v) => v.videoId))).size} videos YouTube originales y ${assets.length} originales locales FIFA. ${tasks.filter((t) => t.localVideos?.length).length} fichas usan componentes locales, incluidas ${tasks.filter((t) => t.id.startsWith('Y') && t.localVideos?.length).length} infantiles. Las fichas no equivalen a patrones o videos distintos. Los enlaces externos complementan el inventario y no se suman como otra demostración.

Todas las fichas incluyen organización, pasos, objetivo, errores y cambios de dificultad/modalidad. Permanecen documentary-draft: referencia visible, corrección técnica, dosis personal y eficacia no son equivalentes. “Gesto observado” no significa visionado íntegro del video, fotogramas completos revisados o equivalencia de toda la tarea. [Observaciones y límites](../research/VIDEO_TEACHING_REVIEW.md).

Los 22 recursos 3D anteriores siguen en [inventario histórico](CONTENT_INVENTORY.md), con aceptación de claridad/naturalidad reabierta. No sumarlos como nuevas tareas sin deduplicar. Los 5.764 videos localizados tampoco son ejercicios incorporados.

| ID | Ficha disponible | Familia | Lugar / participantes mínimos | Cobertura de video |
|---|---|---|---|---|
${rows.join('\n')}

## Organización visual original
T05, T06, T07, T08, T11, T14, T17, T18, T19, T20, S01–S04, Y01, Y04, Y07, Y08 y Y09 incluyen un esquema propio de posiciones y rutas posibles. Explican organización; no representan biomecánica ni reemplazan un video exacto. Sin escalas físicas inferidas del dibujo.

## Referencias en páginas de autor

${references.map((r) => `- ${r.tasks.join(', ')}: [${r.title}](${r.url}); ${r.section}. ${r.note} Evidencia: ${r.observation}`).join('\n')}

No se incrustan estas páginas ni se controla su final. Infancia dispone de seis referencias locales de componentes, fichas y enlaces acompañados; YouTube sigue sin cargarse. Las referencias parciales no cierran sus demostraciones exactas. F01 también dispone de Peak Physio integrado y NHS como alternativa externa. [Revisión local y límites](../reviews/local-human-video.md).

## Cobertura pendiente
Completar las variantes sin video y reemplazar componentes cuando haya una demostración pertinente. Revisión por fragmento y tarea. Ningún YouTube descargado. Los originales FIFA locales tienen permiso de exhibición no comercial condicionado y permanecen fuera de Git; no autorizan distribución pública/comercial. [Condiciones locales](../reviews/local-human-video.md), [YouTube](../reviews/video-reference-cost-and-rights.md).
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
