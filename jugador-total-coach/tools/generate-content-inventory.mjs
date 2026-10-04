import { readFileSync, writeFileSync } from 'node:fs';
const json = (p) => JSON.parse(readFileSync(p, 'utf8'));
const cat = json('assets/phase06-catalog.json'),
  kb = json('docs/training/FOOTBALL_KNOWLEDGE_BASE.json'),
  videos = json('docs/research/VIDEO_CATALOGUE.json'),
  obs = json('docs/research/VIDEO_OBSERVATIONS.json');
const map = {
  T01: ['inside-outside-sole', 'sole-pull-push'],
  T02: ['v-pull'],
  T27: ['hip-hinge', 'mini-squat', 'glute-bridge'],
  T28: ['wall-push-up'],
  T29: ['dead-bug'],
  T30: ['ankle-mobility', 'soft-step-turn'],
  T31: ['active-march', 'inside-inside', 'lateral-sole-roll', 'inside-outside'],
};
const runtime = cat.entries.map((e) => {
  const m = json(e.manifest),
    x = json(e.exercise);
  return {
    id: e.exerciseId,
    name: x.displayName,
    pattern: e.patternId,
    durationSeconds: m.durationMs / 1000,
    sides: e.supportedSides,
    reviewStatus: m.reviewStatus,
    manifest: e.manifest,
    source: e.source,
    sha256: m.sha256,
    documentaryReview: e.documentaryReview,
    humanReview: e.humanReview,
  };
});
const practices = kb.practices.map((p) => ({
  ...p,
  animatedComponents: runtime
    .filter((r) => (map[p.id] ?? []).includes(r.pattern))
    .map((r) => r.id),
  familyFullyImplemented: false,
  videoObservations: obs.observations
    .filter((o) => o.practiceIds.includes(p.id))
    .map((o) => o.id),
}));
const channelKey = (s) => s.toLowerCase().replaceAll(' ', '').replace(/com$/, '');
const inventory = {
  updatedAt: '2026-10-03',
  scope:
    'Todo el catálogo propio registrado; familias propuestas y censo externo por separado. No catálogo exhaustivo del fútbol ni videos íntegramente validados.',
  runtime,
  practices,
  capabilities: kb.capabilities,
  videoCoverage: videos.channels.map((c) => ({
    channel: c.channel,
    listed: c.entries.length,
    listingStopped: c.noMoreLoaded,
    observedVideos: obs.observations.filter(
      (o) => channelKey(o.channel) === channelKey(c.channel),
    ).length,
  })),
  wholeVideosReviewed: 0,
};
writeFileSync(
  'docs/training/CONTENT_INVENTORY.json',
  JSON.stringify(inventory, null, 2) + '\n',
);
const esc = (s) => String(s).replaceAll('|', '/').replaceAll('\n', ' ');
const link = (name, path) => '[' + name + '](' + path + ')';
let md =
  '# Inventario de ejercicios, tareas y recursos\n\nActualizado: 2026-10-03. ' +
  inventory.scope +
  '\n\n## Disponible en la aplicación\n\n' +
  runtime.length +
  ' variantes de ' +
  new Set(runtime.map((r) => r.pattern)).size +
  ' patrones, con GLB y fuente Blender. Deportivo draft; aceptación humana donde consta, no revisión profesional. Las cuatro variantes nuevas están en la biblioteca; la hora v2 conserva sus 16 variantes mientras se revisa su progresión.\n\n| Variante | Patrón | Clip | Claridad humana |\n|---|---|---|---|\n' +
  runtime
    .map(
      (r) =>
        '| ' +
        link(r.name, '../../' + r.manifest) +
        ' | ' +
        r.pattern +
        ' | ' +
        r.durationSeconds +
        ' s | ' +
        r.humanReview +
        ' |',
    )
    .join('\n');
md +=
  '\n\n## Familias de práctica y jugadas\n\nSon 32 familias de diseño, no 32 ejercicios totalmente animados. Una familia puede necesitar varios gestos, compañeros, decisiones y escenas. Los componentes disponibles no acreditan la tarea completa. Fichas detalladas y fuentes: [base estructurada](FOOTBALL_KNOWLEDGE_BASE.json).\n\n| ID | Tarea / objetivo | Entorno / participantes mínimos | Componentes animados |\n|---|---|---|---|\n' +
  practices
    .map(
      (p) =>
        '| ' +
        p.id +
        ' | ' +
        esc(p.name) +
        ' · ' +
        esc(p.objective) +
        ' | ' +
        p.setup.spaceClass +
        ' / ' +
        p.setup.minimumParticipants +
        ' | ' +
        (p.animatedComponents.join(', ') || 'Pendientes') +
        ' |',
    )
    .join('\n');
md +=
  '\n\n## Capacidades y modalidades\n\n' +
  kb.capabilities.map((c) => '- **' + c.label + '**: ' + c.definition).join('\n') +
  '\n\nFUT 5/futsal, FUT 7 y FUT 11 comparten capacidades. Cada familia del JSON especifica adaptación por modalidad, regresión, progresión, material y límites. Casa 2×2 no sustituye oposición, pase largo, sprint, remate ni organización colectiva. No se contabilizan variantes por pie como capacidades diferentes.\n\n## Cobertura de fuentes audiovisuales\n\n| Canal | Enlaces de la pestaña Videos | Final del listado observado |\n|---|---|---|\n' +
  videos.channels
    .map(
      (c) =>
        '| ' +
        c.channel +
        ' | ' +
        c.entries.length +
        ' | ' +
        (c.noMoreLoaded
          ? 'No cargó más en la comprobación; no garantía de exhaustividad'
          : 'Pendiente') +
        ' |',
    )
    .join('\n');
md +=
  '\n\nTotal: ' +
  videos.channels.reduce((n, c) => n + c.entries.length, 0) +
  ' entradas de video. Excluye Shorts/directos/privados y puede contener duplicados entre canales. Listado no equivale a visionado. ' +
  obs.observations.length +
  ' videos con muestras visuales, procedentes de los siete canales; **ningún canal ni video entero se declara completamente validado**.\n\n- [Todos los enlaces y títulos](../research/VIDEO_CATALOGUE.json).\n- [Índice CSV de enlaces](../research/VIDEO_CATALOGUE.csv).\n- [Observaciones, tiempos y pendientes concretos](../research/VIDEO_OBSERVATIONS.json).\n- [Revisión de acceso](../research/VIDEO_VISUAL_REVIEW.md).\n\n## Qué falta para el producto ampliado\n\nComposición de sesiones variables y periodización ejecutable; conversación real con coste/licencia resueltos; recepción, tiro, defensa y jugadas con compañeros/oposición; observar ciclos completos del inventario externo; validar las representaciones, las cargas y la transferencia. No se marca una ficha como animada por tener un enlace.\n';
writeFileSync('docs/training/CONTENT_INVENTORY.md', md);
const quote = (v) => {
  let s = String(v);
  if (['=', '+', '@', '-', '\t', '\r'].includes(s[0])) s = "'" + s;
  return '"' + s.replaceAll('"', '""') + '"';
};
writeFileSync(
  'docs/research/VIDEO_CATALOGUE.csv',
  'canal,titulo,url,estado\r\n' +
    videos.channels
      .flatMap((c) =>
        c.entries.map((e) =>
          [
            c.channel,
            e.title,
            e.url,
            obs.observations.some((o) => e.url.includes(o.videoId))
              ? 'muestras observadas'
              : 'localizado; visionado pendiente',
          ]
            .map(quote)
            .join(','),
        ),
      )
      .join('\r\n') +
    '\r\n',
);
console.log({
  runtime: runtime.length,
  patterns: new Set(runtime.map((r) => r.pattern)).size,
  practices: practices.length,
  capabilities: kb.capabilities.length,
  listed: videos.channels.reduce((n, c) => n + c.entries.length, 0),
  observed: obs.observations.length,
});
