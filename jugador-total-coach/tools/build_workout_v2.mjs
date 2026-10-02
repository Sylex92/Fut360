import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

// Deliberate authoring of v2. Does not read or rewrite the legacy timing fixture.
const catalog = JSON.parse(readFileSync('assets/phase06-catalog.json', 'utf8'));
const resources = catalog.entries.map((entry) => {
  const exercise = JSON.parse(readFileSync(entry.exercise, 'utf8'));
  const asset = JSON.parse(readFileSync(entry.manifest, 'utf8'));
  return {
    exerciseId: exercise.id,
    exerciseVersion: exercise.version,
    assetId: asset.assetId,
    assetVersion: asset.version,
    sha256: asset.sha256,
    clipName: asset.clipName,
    sceneId: ['glute-bridge', 'dead-bug'].includes(exercise.id)
      ? 'guided-floor-v1'
      : 'guided-standing-v1',
  };
});
const blocks = [];
function block(id, title, expectedSeconds, ids, rounds = 1) {
  const items = ids.map((exerciseId, i) => {
    const entry = catalog.entries.find((e) => e.exerciseId === exerciseId);
    if (!entry) throw new Error(exerciseId);
    let demonstrationSeconds = 15,
      workSeconds = 30,
      restSeconds = 15;
    let exampleRepetitions = 4;
    let dose = 'Hasta 4 repeticiones completas; después descansa.';
    let preparation = 'Colócate con espacio libre alrededor y observa el ejemplo.';
    if (exerciseId === 'active-march') {
      demonstrationSeconds = 15;
      workSeconds = 40;
      restSeconds = 5;
      exampleRepetitions = 5;
      dose = '40 s a ritmo cómodo, sin correr ni saltar.';
    } else if (exerciseId.startsWith('ankle') || exerciseId === 'hip-hinge') {
      workSeconds = 35;
      restSeconds = 10;
    } else if (exerciseId.startsWith('soft-step')) {
      demonstrationSeconds = 20;
      workSeconds = 20;
      restSeconds = 20;
      exampleRepetitions = 2;
      dose = 'Hasta 2 giros y regresos por pasos; después descansa.';
      preparation =
        'Detén el balón y déjalo fuera del recorrido de tus pies. Gira levantando y recolocando cada pie.';
    } else if (exerciseId === 'slow-breathing') {
      demonstrationSeconds = 10;
      workSeconds = 40;
      restSeconds = 10;
      exampleRepetitions = 1;
      dose = 'Respira cómodamente durante 40 s, sin contar ciclos ni contener el aire.';
    } else if (
      entry.patternId === 'inside-inside' ||
      entry.patternId === 'inside-outside' ||
      entry.patternId === 'lateral-sole-roll'
    ) {
      dose = '30 s de toques controlados a tu ritmo. Puedes parar antes.';
      preparation =
        'Vuelve a colocar el balón cerca de los pies y dentro del área libre. Empieza sin saltos.';
    }
    if (id === 'physical') {
      demonstrationSeconds = 20;
      workSeconds = 40;
      restSeconds = 60;
      if (exerciseId === 'wall-push-up')
        preparation =
          'Acércate a la pared despejada y coloca las manos a la altura del pecho. Revisa tus apoyos.';
      if (exerciseId === 'glute-bridge') {
        demonstrationSeconds = 60;
        restSeconds = 20;
        preparation =
          'Aparta el balón y coloca la colchoneta sin obstáculos. Baja con calma y colócate boca arriba. Añade tiempo si lo necesitas.';
      }
      if (exerciseId === 'dead-bug') {
        demonstrationSeconds = 30;
        workSeconds = 60;
        restSeconds = 30;
        dose = 'Hasta 4 elevaciones por pierna, alternando; después descansa.';
        preparation = 'Permanece en la colchoneta, boca arriba, con ambos brazos apoyados.';
      }
    }
    if (id === 'integration' && i === 0) {
      demonstrationSeconds = 40;
      workSeconds = 13;
      restSeconds = 7;
      exampleRepetitions = 2;
      dose = '13 s de toques suaves para retomar el balón.';
      preparation =
        'Incorpórate con calma, retira la colchoneta y recupera el balón. Usa +30 s si necesitas más tiempo.';
    }
    if (id === 'cooldown' && i === 0)
      preparation =
        'Detén y aparta el balón. Camina en el sitio bajando el ritmo poco a poco.';
    if (id === 'cooldown' && exerciseId === 'active-march')
      dose = '40 s de marcha suave; reduce gradualmente la altura y el ritmo de los pasos.';
    const timeBased = [
      'active-march',
      'inside-inside',
      'lateral-sole-roll',
      'inside-outside',
      'slow-breathing',
    ].includes(entry.patternId);
    return {
      id: `${id}-${i + 1}`,
      exerciseId,
      exerciseVersion: resources.find((r) => r.exerciseId === exerciseId).exerciseVersion,
      side: entry.supportedSides[0],
      round: Math.floor(i / (ids.length / rounds)) + 1,
      demonstrationSeconds,
      workSeconds,
      restSeconds,
      exampleRepetitions,
      dose,
      doseKind: timeBased ? 'time-based' : 'repetition-based',
      targetRepetitions: timeBased ? null : exampleRepetitions,
      repetitionUnit: timeBased
        ? null
        : exerciseId === 'dead-bug'
          ? 'per-side'
          : entry.patternId === 'soft-step-turn'
            ? 'out-and-back'
            : 'complete-movement',
      preparation,
    };
  });
  blocks.push({ id, title, rounds, expectedSeconds, items });
}
block('warmup', 'Preparación gradual', 480, [
  'active-march',
  'ankle-mobility-left',
  'ankle-mobility-right',
  'hip-hinge',
  'active-march',
  'mini-squat',
  'soft-step-turn-left',
  'soft-step-turn-right',
]);
const ball = [
  'inside-inside',
  'lateral-sole-roll-left',
  'lateral-sole-roll-right',
  'inside-outside-left',
  'inside-outside-right',
  'inside-inside',
];
block('ball', 'Fundamentos de balón', 720, [...ball, ...ball], 2);
block('orientation', 'Orientación corporal', 600, [
  'inside-inside',
  'soft-step-turn-left',
  'lateral-sole-roll-left',
  'soft-step-turn-right',
  'lateral-sole-roll-right',
  'soft-step-turn-left',
  'inside-outside-left',
  'soft-step-turn-right',
  'inside-outside-right',
  'inside-inside',
]);
block('physical', 'Preparación física general', 960, [
  'hip-hinge',
  'mini-squat',
  'wall-push-up',
  'hip-hinge',
  'mini-squat',
  'wall-push-up',
  'glute-bridge',
  'dead-bug',
]);
block('integration', 'Integración técnica', 480, [
  'inside-inside',
  'soft-step-turn-left',
  'lateral-sole-roll-left',
  'soft-step-turn-right',
  'lateral-sole-roll-right',
  'inside-outside-left',
  'inside-outside-right',
  'inside-inside',
]);
block('cooldown', 'Descenso gradual de actividad', 360, [
  'active-march',
  'active-march',
  'ankle-mobility-left',
  'ankle-mobility-right',
  'slow-breathing',
  'slow-breathing',
]);
for (const b of blocks) {
  const sum = b.items.reduce(
    (n, x) => n + x.demonstrationSeconds + x.workSeconds + x.restSeconds,
    0,
  );
  if (sum !== b.expectedSeconds) throw new Error(`${b.id}: ${sum}`);
}
mkdirSync('content/workouts', { recursive: true });
writeFileSync(
  'content/workouts/mvp1-60min-v2.json',
  JSON.stringify(
    {
      id: 'home-foundations-60min-v2',
      version: 2,
      schemaVersion: 2,
      locale: 'es-MX',
      space: { widthM: 2, lengthM: 2 },
      equipment: ['ball', 'mat', 'wall'],
      safety: [
        'Dolor, bloqueo, inflamación o inestabilidad reales: detente y busca valoración.',
      ],
      resources,
      title: 'Fundamentos en casa · 60 minutos',
      reviewStatus: 'draft',
      expectedDurationSeconds: 3600,
      blocks,
    },
    null,
    2,
  ) + '\n',
);
console.log('Workout v2: 52 intervalos, 3600 s. Fixture v1 conservado.');
