import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kb = JSON.parse(
  fs.readFileSync(path.join(root, 'docs/training/FOOTBALL_KNOWLEDGE_BASE.json'), 'utf8'),
);
// Original instructions for concrete variants; source families retain their documentary evidence.
const details = {
  T01: [
    'Control',
    'Balón entre los pies y espacio libre a ambos lados.',
    [
      'Empuja corto con el interior del pie derecho hacia la izquierda.',
      'Con el mismo pie usa el exterior para devolverlo a la derecha.',
      'Recoge con la planta, recoloca el apoyo y repite con el pie izquierdo.',
    ],
    'Balón al alcance del siguiente toque; no perseguirlo fuera del área.',
    'Golpear fuerte, dejar el peso encima del balón o añadir saltos sin control.',
  ],
  T02: [
    'Control',
    'Balón delante; marca dos salidas diagonales cortas.',
    [
      'Apoya un pie en el suelo y coloca la planta del otro sobre el balón.',
      'Arrastra hacia ti; retira la planta y abre el pie.',
      'Empuja con el interior hacia la diagonal del mismo lado; cambia los apoyos para repetir.',
    ],
    'El balón dibuja una V con dos contactos distinguibles.',
    'Intentar arrastrar y empujar a la vez; perder el equilibrio sobre el balón.',
  ],
  T03: [
    'Regate',
    'Pareja en una zona amplia; presión suave al principio, sin empujones.',
    [
      'Recibe y coloca tu cuerpo entre rival y balón.',
      'Mantén el balón en el lado alejado, con pasos cortos para seguir la presión.',
      'Gira únicamente si aparece espacio; si no, conserva o descarga al pasador.',
    ],
    'Conservar una opción de pase o salida sin cargar contra el rival.',
    'Girar siempre hacia la presión o usar los brazos para empujar.',
  ],
  T04: [
    'Recepción y pase',
    'Pared apta o rebotador, fuera de casa; marca dos zonas laterales de recepción.',
    [
      'Pasa por el suelo hacia una zona de rebote constante.',
      'Antes del regreso, ajusta el apoyo y abre el cuerpo hacia la siguiente salida.',
      'Recibe alejando el balón del centro y devuelve con el otro pie; alterna lados.',
    ],
    'Primer toque útil para el pase siguiente, sin correcciones apresuradas.',
    'Golpear demasiado fuerte, esperar inmóvil o recibir debajo del cuerpo.',
  ],
  T05: [
    'Recepción y pase',
    'Pasador, receptor y dos puertas laterales; acordar primero dirección y velocidad.',
    [
      'Mira las puertas antes de que llegue el pase.',
      'Colócate con posibilidad de salir a ambos lados, sin perder el balón de vista al contacto.',
      'Orienta el primer toque a la puerta libre y conduce o pasa después; cambia de lado.',
    ],
    'La primera acción lleva hacia espacio aprovechable.',
    'Decidir la salida sin mirar, recibir de frente rígido o alargar demasiado el toque.',
  ],
  T06: [
    'Percepción',
    'Un pasador, un receptor y un apoyo que cambia de lado detrás del receptor.',
    [
      'El apoyo se mueve mientras el receptor prepara la recepción.',
      'El receptor mira para localizarlo antes de controlar.',
      'Recibe y pasa a su nueva posición; si la línea se cierra, conserva y vuelve a ofrecerte.',
    ],
    'Usar lo visto en la elección, no contar giros de cabeza.',
    'Mirar por obligación sin identificar nada o dejar de ver el balón al golpear.',
  ],
  T07: [
    'Combinación',
    'Dos jugadores y una marca que representa una línea a superar; sin rival al inicio.',
    [
      'Pasa al apoyo y comienza un desmarque a un lado de la marca.',
      'El apoyo devuelve hacia tu recorrido cuando la línea esté libre.',
      'Recibe en movimiento y continúa; después intercambien funciones.',
    ],
    'La devolución coincide con el movimiento y permite avanzar.',
    'Correr detrás de tu pase o pedir la devolución cuando la línea está cerrada.',
  ],
  T08: [
    'Combinación',
    'Tres jugadores en triángulo con espacio entre líneas.',
    [
      'A pasa a B, que se coloca para ver a C.',
      'C cambia de posición para ofrecer un ángulo diferente.',
      'B conecta con C o devuelve a A si se cierra la salida; A vuelve a ofrecer apoyo.',
    ],
    'Crear una línea nueva y conectar sin pases forzados.',
    'Todos acercándose al balón o memorizar una dirección aunque quede bloqueada.',
  ],
  T09: [
    'Recepción y pase',
    'Dos jugadores en campo amplio; empezar con distancia que ambos controlen.',
    [
      'El receptor inicia un desplazamiento lateral visible.',
      'Mira su recorrido y pasa por delante, hacia donde pueda seguir.',
      'El receptor ajusta el primer toque y devuelve; aumenta distancia solo si conservan precisión.',
    ],
    'El receptor puede continuar sin detenerse a rescatar el balón.',
    'Confundir pase al pie con pase al espacio o forzar potencia antes de precisión.',
  ],
  T10: [
    'Regate',
    'Tres zonas de conducción en cancha: entrada, cambio y salida, con margen para frenar.',
    [
      'Conduce a ritmo cómodo con balón cercano.',
      'Acorta los toques al acercarte al cambio y modifica dirección.',
      'Al tener espacio, separa progresivamente el balón y acompaña con carrera; frena con control.',
    ],
    'El ritmo cambia sin perder la siguiente acción.',
    'Empujar lejos antes de crear espacio o terminar sin zona de frenado.',
  ],
  T11: [
    'Regate',
    'Atacante, defensor y dos puertas; presión limitada al aprender la tarea.',
    [
      'El atacante se aproxima observando qué puerta protege el rival.',
      'Muestra una intención con cuerpo o balón sin comprometer el equilibrio.',
      'Sal por la opción disponible; si ambas se cierran, conserva. Cambia de rol.',
    ],
    'Superar una opción real, no ejecutar una finta por obligación.',
    'Mirar solo el balón, chocar de frente o hacer un gesto aunque no abra espacio.',
  ],
  T12: [
    'Recepción y pase',
    'Pasador, receptor de espaldas y defensor detrás; presión pactada.',
    [
      'Mira la posición del defensor y del pasador antes del envío.',
      'Recibe con el cuerpo protegiendo el balón.',
      'Descarga si hay presión próxima; gira al espacio cuando lo permita la posición del rival.',
    ],
    'Elegir entre girar y descargar sin regalar posesión.',
    'Girar a ciegas o recibir separado del apoyo cuando el defensor está cerca.',
  ],
  T13: [
    'Finalización',
    'Balón preparado y blanco seguro en portería; nadie detrás del objetivo.',
    [
      'Elige una zona y aproxima con pasos controlados.',
      'Coloca el apoyo junto al balón orientado de forma compatible con el tiro; fija el tobillo de golpeo.',
      'Golpea y acompaña sin perder el equilibrio. Recupera el balón caminando y cambia de lado.',
    ],
    'Dirección repetible antes de buscar potencia.',
    'Tirar sin objetivo, contener el aire o golpear al máximo desde el primer intento.',
  ],
  T14: [
    'Finalización',
    'Dos atacantes frente a un defensor, portería y espacio para detenerse; después portero.',
    [
      'Recibe orientando hacia una opción de tiro o pase.',
      'El apoyo crea un ángulo diferente, sin esconderse detrás del defensor.',
      'Finaliza si existe ventana; pasa si el defensor la cierra y deja libre al compañero.',
    ],
    'Crear una ocasión mejor, aunque la decisión correcta sea asistir.',
    'Rematar siempre o acercarse ambos atacantes a la misma línea.',
  ],
  T15: [
    'Finalización',
    'Balón y portería segura en cancha; empezar con balón quieto y poca fuerza.',
    [
      'Colócate cerca del balón, con apoyo equilibrado y pie de golpeo estable.',
      'Usa un recorrido corto para contactar con la punta de la bota.',
      'Compara dirección y control con tu golpeo habitual; no fuerces el dedo ni busques potencia si molesta.',
    ],
    'Salida rápida hacia un objetivo cercano.',
    'Golpear descalzo, desde demasiado lejos o insistir ante dolor.',
  ],
  T16: [
    'Percepción',
    'Pasador, receptor y defensor que alterna atención entre balón y atacante.',
    [
      'El receptor observa hacia dónde mira el defensor.',
      'Se separa de su línea de visión y cambia dirección para ofrecer pase.',
      'El pasador entrega solo si aparece una línea útil; el receptor ajusta primer toque y continúa.',
    ],
    'Recibir con ventaja temporal o espacial.',
    'Correr antes de que el pasador pueda jugar o confundir desmarque con esconderse sin línea.',
  ],
  T17: [
    'Defensa',
    'Pareja, corredor amplio y zona que el atacante intenta cruzar; sin entradas al suelo.',
    [
      'Acércate mientras el balón viaja o está separado del atacante.',
      'Reduce la velocidad antes de quedar a su alcance; flexiona ligeramente y conserva apoyos móviles.',
      'Protege la dirección peligrosa y espera un toque que permita intervenir; no te lances por ansiedad.',
    ],
    'Retrasar o desviar la progresión manteniéndote entre rival y objetivo.',
    'Llegar sin frenar, cruzar pies cerca del rival o buscar robo en cada acción.',
  ],
  T18: [
    'Defensa',
    'Dos atacantes y dos defensores, con dos objetivos.',
    [
      'El defensor más próximo ajusta su aproximación al portador.',
      'Su compañero protege el pase o espacio detrás y comunica.',
      'Cuando cambia el balón, cambian presión y cobertura sin perseguir ambos al mismo jugador.',
    ],
    'Evitar que una sola acción supere a los dos defensores.',
    'Defender en una línea plana o presionar sin protección detrás.',
  ],
  T19: [
    'Defensa',
    'Pasador, receptor móvil y defensor entre líneas.',
    [
      'Mantén una posición que permita ver balón y receptor.',
      'Observa trayectoria y velocidad al salir el pase.',
      'Intercepta si puedes llegar; si no, acompaña al receptor y protege la siguiente progresión.',
    ],
    'Elegir bien cuándo abandonar la posición para anticipar.',
    'Saltar antes de que salga el pase o regalar la espalda por buscar una intercepción imposible.',
  ],
  T20: [
    'Transiciones',
    'Juego 2v2 con objetivos opuestos y límites visibles.',
    [
      'Tras perder, el más cercano decide si puede presionar; el otro protege espacio.',
      'Tras recuperar, mira si hay ventaja para avanzar.',
      'Si no existe, asegura un pase y vuelve a ofrecer apoyo. Todos cambian función con la posesión.',
    ],
    'Reorganizarse con intención tras pérdida y recuperación.',
    'Pararse a lamentar la pérdida o avanzar siempre aunque no haya apoyo.',
  ],
  T21: [
    'Velocidad',
    'Campo con tramo corto medido y margen amplio de desaceleración.',
    [
      'Adopta una salida cómoda y mira el recorrido.',
      'Acelera progresivamente con apoyos debajo de tu trayectoria y brazos acompañando.',
      'Continúa más allá de la marca y frena gradualmente; recupera antes del siguiente intento.',
    ],
    'Repetir acciones de calidad, sin perseguir fatiga.',
    'Buscar máximos durante el retorno o frenar en seco en la marca.',
  ],
  T22: [
    'Velocidad',
    'Marca entrada, zona amplia de frenado y salida lateral; superficie con agarre.',
    [
      'Entra a velocidad moderada que puedas controlar.',
      'Reduce velocidad en varios apoyos antes de cambiar de dirección.',
      'Orienta cuerpo y pies hacia la salida y vuelve a acelerar con control; alterna lados.',
    ],
    'Cambiar dirección sin que rodilla y tronco se desorganicen.',
    'Clavar el pie a toda velocidad, girar sobre una pierna rígida o usar poco margen.',
  ],
  T23: [
    'Velocidad',
    'Dos personas frente a frente y dos puertas, sin contacto físico.',
    [
      'El líder puede desplazarse a una de las puertas.',
      'El compañero observa su cuerpo y responde, sin saber la dirección.',
      'Termina en una zona de frenado y alterna quién decide.',
    ],
    'Respuesta a una intención real con control de la frenada.',
    'Convertirlo en un recorrido memorizado o correr hacia una persona sin salida.',
  ],
  T24: [
    'Velocidad',
    'Césped o superficie apta con espacio de entrada, carrera y frenado medidos.',
    [
      'Revisa superficie y obstáculos antes de empezar.',
      'Construye velocidad de forma gradual dentro de la exposición acordada.',
      'Desacelera progresivamente y recupera por completo. La intensidad alta requiere preparación previa.',
    ],
    'Carrera técnicamente estable con recuperación suficiente.',
    'Usar el espacio doméstico, improvisar máximos o acumular repeticiones fatigado.',
  ],
  T25: [
    'Resistencia',
    'Tramo medido, cronómetro y pauta de esfuerzo/recuperación previamente ajustada.',
    [
      'Registra cada tiempo con el mismo procedimiento.',
      'Respeta la recuperación acordada, sin añadir repeticiones por motivación.',
      'Finaliza si se deteriora la ejecución o aparecen síntomas; revisa la serie completa después.',
    ],
    'Observar repetición de esfuerzos bajo un protocolo comparable.',
    'Confundir RSA con correr agotado sin criterio de interrupción.',
  ],
  T26: [
    'Resistencia',
    '2v2 o grupo mayor, objetivos y área suficiente según nivel; pausas acordadas.',
    [
      'Juega hacia el objetivo con opciones de pase y conducción.',
      'Al cambiar posesión, cambia también la función ofensiva/defensiva.',
      'Descansa entre bloques y revisa participación real, decisiones y esfuerzo.',
    ],
    'Sostener acciones útiles en un contexto de juego.',
    'Reducir tanto el espacio que solo haya choques o medir resistencia por el marcador.',
  ],
  T27: [
    'Fuerza',
    'Sentadilla dividida: pies separados adelante/atrás, ambos en el suelo; apoyo ligero opcional.',
    [
      'Encuentra una separación que permita bajar sin perder equilibrio.',
      'Flexiona ambas piernas con tronco estable y rodilla delantera siguiendo el pie.',
      'Empuja el suelo para volver; termina la serie con margen y cambia de pierna.',
    ],
    'Subir y bajar con control, sin necesidad de silla ni salto.',
    'Convertirla en búlgara, cargar peso no conocido o continuar al perder control.',
  ],
  T28: [
    'Fuerza',
    'Remo sentado en polea de gimnasio, asiento y resistencia ajustables; revisar el equipo concreto.',
    [
      'Apoya los pies y toma el agarre con tronco estable.',
      'Acerca el agarre hacia el torso sin impulsarte con la espalda.',
      'Devuelve controlando la resistencia y respirando; termina antes de perder la postura.',
    ],
    'Tracción controlada con material real y carga tolerable.',
    'Improvisar anclajes de banda corta o balancearse para mover más peso.',
  ],
  T29: [
    'Fuerza',
    'Tumbado sobre colchoneta, rodillas flexionadas y brazos cómodos.',
    [
      'Estabiliza la pelvis en una postura cómoda, respirando normalmente.',
      'Aleja lentamente un talón sin cambiar la posición del tronco.',
      'Vuelve y alterna; amplía la palanca solo si mantienes control sin dolor.',
    ],
    'Mover extremidades sin arquear ni tensar innecesariamente la espalda.',
    'Contener el aire o bajar la pierna más lejos de lo que puedes controlar.',
  ],
  T30: [
    'Movilidad',
    'De pie con apoyo estable cercano; un pie adelantado y talón apoyado.',
    [
      'Lleva suavemente la rodilla hacia delante en la dirección del pie.',
      'Mantén el talón en contacto y vuelve sin rebotes forzados.',
      'Compara ambos lados en rango cómodo.',
    ],
    'Movimiento fluido del tobillo conservando apoyo.',
    'Levantar el talón para simular más movilidad o forzar dolor.',
  ],
  T31: [
    'Control',
    'Balón y marcas planas; empezar sin salto.',
    [
      'Camina alrededor del balón con pasos cortos y brazos acompañando.',
      'Añade un contacto de interior cuando el apoyo sea estable.',
      'Enlaza lado derecho e izquierdo sin acelerar hasta perder precisión.',
    ],
    'Coordinar pasos y contactos sin rigidez del tronco.',
    'Buscar contactos rápidos mientras los apoyos llegan tarde.',
  ],
  T32: [
    'Potencia',
    'Zona libre de aterrizaje y superficie apropiada; exposición solo tras preparación suficiente.',
    [
      'Empieza entendiendo un aterrizaje equilibrado con ambos pies.',
      'Realiza un salto de amplitud pequeña acorde a tu capacidad.',
      'Absorbe con tobillos, rodillas y caderas; estabiliza y recupera antes de repetir.',
    ],
    'Aterrizaje controlado antes de aumentar altura o distancia.',
    'Saltar repetidamente por tiempo, caer rígido o añadir carga sin preparación.',
  ],
};
const tasks = kb.practices.map((p) => {
  const [category, setup, steps, success, mistakes] = details[p.id];
  return {
    id: p.id,
    familyId: p.id,
    name: p.name,
    category,
    objective: p.objective,
    setup,
    space: p.setup.spaceClass,
    participants: p.setup.minimumParticipants,
    equipment: p.setup.equipment,
    steps,
    success,
    mistakes,
    easier: p.regression,
    harder: p.progression.join(' '),
    limits: p.limits,
    modalities: p.modalityAdaptations,
    videos: [],
    sourceRefs: p.evidenceRefs,
    review: 'documentary-draft',
  };
});
tasks.find((t) => t.id === 'T27').name = 'Sentadilla dividida con ambos pies en el suelo';
tasks.find((t) => t.id === 'T28').name = 'Remo sentado en polea';
tasks.find((t) => t.id === 'T29').name = 'Control de tronco con talón alterno';
tasks.find((t) => t.id === 'T30').name = 'Movilidad de tobillo con apoyo';
const add = (
  id,
  familyId,
  name,
  category,
  setup,
  steps,
  success,
  equipment = ['balón'],
  space = 'home',
  participants = 1,
) => {
  const family = tasks.find((t) => t.id === familyId);
  const task = {
    ...family,
    id,
    familyId,
    name,
    category,
    objective: success,
    setup,
    steps,
    success,
    equipment,
    space,
    participants,
    videos: [],
  };
  tasks.push(task);
  return task;
};
const mastery = [
  [
    'Croqueta: interior a interior',
    'T01',
    40,
    68,
    ['Pasa el balón de un interior al otro.', 'Acompaña lateralmente con los apoyos.'],
  ],
  [
    'Rodar el balón con la planta',
    'T01',
    115,
    148,
    ['Rueda el balón lateralmente con la planta.', 'Libera el contacto y recoloca el apoyo.'],
  ],
  [
    'Empuje con exterior',
    'T01',
    157,
    195,
    ['Recoge el balón hacia tu apoyo.', 'Empuja corto con el exterior y acompaña.'],
  ],
  [
    'Recorte en V',
    'T02',
    207,
    242,
    ['Arrastra con la planta hacia ti.', 'Redirige en diagonal con el interior.'],
  ],
  [
    'Triángulo de contactos',
    'T01',
    252,
    290,
    ['Conecta un pase corto entre interiores.', 'Arrastra y devuelve a la siguiente esquina.'],
  ],
  [
    'V alternando pies',
    'T02',
    300,
    330,
    ['Recoge con una planta.', 'Devuelve con el interior del otro pie.'],
  ],
  [
    'V y V alterna encadenadas',
    'T02',
    343,
    385,
    ['Haz una V con el mismo pie.', 'Enlaza otra V cambiando el pie de salida.'],
  ],
  [
    'Cuadrado de contactos',
    'T01',
    400,
    440,
    ['Alterna contactos laterales y arrastres.', 'Completa el recorrido y cambia de sentido.'],
  ],
  [
    'Arrastre en L y cuadrado',
    'T02',
    458,
    503,
    [
      'Recoge el balón y llévalo detrás del apoyo.',
      'Enlaza la salida con el recorrido cuadrado.',
    ],
  ],
  [
    'Planta atrás y empuje con empeine',
    'T01',
    518,
    551,
    ['Arrastra corto con la planta.', 'Libera el balón y empújalo suavemente con el empeine.'],
  ],
];
mastery.forEach(([name, family, start, end, steps], i) => {
  const t = add(
    'M' + String(i + 1).padStart(2, '0'),
    family,
    name,
    'Control',
    'Balón y una marca plana; deja espacio para recolocar ambos pies.',
    steps,
    'Secuencia controlada por ambos lados.',
  );
  t.videos = [
    {
      id: 'mastery-' + (i + 1),
      videoId: 'e5RxAJM-oxc',
      channel: '7mlc',
      title: name,
      start,
      end,
      match: 'demonstration',
      note: 'Observa el cambio de apoyos junto al contacto. El ritmo del video no es una dosis obligatoria.',
    },
  ];
});
const v = (
  id,
  videoId,
  channel,
  title,
  start,
  end,
  match = 'component',
  note = 'Referencia de un componente; la organización de nuestra tarea se explica debajo.',
) => ({ id, videoId, channel, title, start, end, match, note });
tasks.find((t) => t.id === 'T02').videos = tasks.find((t) => t.id === 'M04').videos;
tasks.find((t) => t.id === 'T04').videos = [
  v('rebound', 'Bd7TH9t_djM', 'Become Elite', 'Recepción y pase con rebotador', 458, 491),
];
tasks.find((t) => t.id === 'T05').videos = [
  v('box-first-touch', 'Bd7TH9t_djM', 'Become Elite', 'Primer toque en un cuadro', 35, 65),
];
tasks.find((t) => t.id === 'T06').videos = [
  v(
    'box-scan',
    'Bd7TH9t_djM',
    'Become Elite',
    'Localizar al compañero antes de recibir',
    205,
    237,
  ),
];
tasks.find((t) => t.id === 'T09').videos = [
  v('passing-space', 'Bd7TH9t_djM', 'Become Elite', 'Distribución y movimiento', 458, 491),
];
tasks.find((t) => t.id === 'T12').videos = [
  v(
    'futsal-receive',
    'VkDQ4F9c6Fk',
    'Futsal Movement',
    'Orientación corporal al recibir',
    102,
    122,
  ),
];
tasks.find((t) => t.id === 'T13').videos = [
  v(
    'finishing',
    'Bd7TH9t_djM',
    'Become Elite',
    'Ejemplo de circuito de finalización',
    596,
    632,
  ),
];
tasks.find((t) => t.id === 'T17').videos = [
  v('defensive-position', '4vBZzkVRqbE', 'AllAttack', 'Orientación defensiva', 130, 165),
];
const winger = add(
  'B01',
  'T11',
  'Recibir, amagar y finalizar desde banda',
  'Finalización',
  'Campo con portería, pasador y una marca o maniquí como referencia; no representa un defensor real.',
  [
    'Sepárate de la marca para crear línea de pase y recibe en movimiento.',
    'Orienta hacia dentro, muestra la intención y cambia hacia la salida exterior.',
    'Acompaña el balón y prepara el tiro hacia una zona elegida; alterna banda.',
  ],
  'Encadenar recepción, cambio y golpeo manteniendo control.',
  ['balón', 'portería', 'marca', 'pasador'],
  'goal-area',
  2,
);
winger.videos = [
  v(
    'winger-pattern',
    'E24XzLAlcRk',
    'My Personal Football Coach',
    'Recepción, finta y finalización del extremo',
    468,
    497,
    'demonstration',
    'La marca prepara el patrón; después se necesita oposición real para trabajar la decisión.',
  ),
];
const zones = add(
  'B02',
  'T13',
  'Finalización por zonas de entrada',
  'Finalización',
  'Marca zonas amplias de entrada al tiro y dos objetivos en la portería, sin personas detrás.',
  [
    'Conduce desde una zona elegida manteniendo el balón a distancia de golpeo.',
    'Prepara el apoyo y dirige el tiro a una mitad de la portería.',
    'Cambia el lado de entrada y compara precisión antes de exigir más potencia.',
  ],
  'Golpear con intención según el ángulo de llegada.',
  ['balón', 'marcas', 'portería'],
  'goal-area',
);
zones.videos = [
  v(
    'strike-zones',
    'UrcPHLR4nfw',
    'AllAttack',
    'Ejemplo de finalización desde zonas',
    158,
    194,
    'demonstration',
    'La ficha propone una entrada gradual; no adopta la frecuencia ni todas las exigencias del autor.',
  ),
];
const force = [
  [
    'F01',
    'T27',
    'Sentadilla a rango controlado',
    'Pies firmes en suelo, separación cómoda.',
    [
      'Lleva cadera atrás y flexiona rodillas siguiendo los pies.',
      'Baja hasta un rango que controles y vuelve empujando el suelo.',
      'Respira y termina antes de perder la forma.',
    ],
    'Repeticiones estables, sin caída brusca.',
    ['suelo estable'],
  ],
  [
    'F02',
    'T27',
    'Bisagra de cadera',
    'De pie, rodillas ligeramente flexionadas.',
    [
      'Lleva la cadera atrás manteniendo columna y cuello alineados.',
      'Siente el peso repartido en los pies.',
      'Vuelve con control, sin inclinarte hacia atrás.',
    ],
    'Aprender el patrón; sin resistencia no es fuerza avanzada.',
    ['suelo estable'],
  ],
  [
    'F03',
    'T27',
    'Puente de glúteos',
    'Boca arriba, rodillas flexionadas y pies apoyados.',
    [
      'Presiona el suelo con los pies.',
      'Eleva la pelvis hasta alinear tronco y muslos sin arquear en exceso.',
      'Baja despacio y vuelve a respirar.',
    ],
    'Extensión de cadera controlada.',
    ['colchoneta'],
  ],
  [
    'F04',
    'T28',
    'Flexión en pared',
    'Pared firme, manos a altura cómoda, pies apoyados.',
    [
      'Dobla codos acercando el cuerpo como una unidad.',
      'Empuja la pared y vuelve sin bloquear la respiración.',
      'Ajusta distancia para que el esfuerzo sea controlable.',
    ],
    'Empuje con tronco estable.',
    ['pared estable'],
  ],
  [
    'F05',
    'T27',
    'Elevación de talones',
    'De pie, apoyo estable cercano para equilibrio.',
    [
      'Eleva ambos talones sin balancearte.',
      'Mantén el peso repartido en la parte delantera de los pies.',
      'Desciende lentamente hasta apoyar.',
    ],
    'Subida y bajada controladas.',
    ['apoyo estable'],
  ],
  [
    'F06',
    'T29',
    'Plancha lateral con rodillas apoyadas',
    'De lado, antebrazo bajo hombro y rodillas flexionadas.',
    [
      'Eleva la pelvis sin girar el tronco.',
      'Respira normalmente durante una sostención breve y controlada.',
      'Baja y cambia de lado; termina si pierdes alineación.',
    ],
    'Sostener postura, no soportar dolor.',
    ['colchoneta'],
  ],
];
for (const [id, family, name, setup, steps, success, equipment] of force)
  add(id, family, name, 'Fuerza', setup, steps, success, equipment);
add(
  'W01',
  'T30',
  'Preparación progresiva',
  'Movilidad',
  'Espacio libre adecuado al lugar de la sesión.',
  [
    'Empieza caminando y movilizando tobillos/cadera en rango cómodo.',
    'Añade pasos laterales y gestos suaves relacionados con la sesión.',
    'Introduce balón o desplazamientos gradualmente; no pases directamente a máximos.',
  ],
  'Sentirte preparado para la tarea siguiente, sin buscar cansancio.',
  ['suelo estable'],
);
add(
  'C01',
  'T30',
  'Vuelta a la calma',
  'Movilidad',
  'Zona tranquila al terminar.',
  [
    'Reduce progresivamente el desplazamiento.',
    'Camina y deja que la respiración se normalice.',
    'Revisa cómo te encuentras y registra solo lo que realmente hiciste.',
  ],
  'Finalizar de manera gradual y observar la respuesta.',
  ['suelo estable'],
);
// Variants need their own cues: inheriting a family never proves the variant is equivalent.
const adjustments = {
  B01: [
    'Recibir parado, alejar el primer toque o fintar sin cambiar la dirección de salida.',
    'Pase más lento y salida sin defensor.',
    'Añadir defensor que cierre una salida y permitir conservar o pasar.',
  ],
  F01: [
    'Perder el apoyo del pie, buscar profundidad a costa del control o contener el aire.',
    'Reduce el rango y utiliza apoyo ligero si hace falta.',
    'Aumenta rango o resistencia graduable cuando el control y la respuesta lo permitan.',
  ],
  F02: [
    'Confundirlo con una sentadilla, redondear el tronco para bajar más o contener el aire.',
    'Desplaza la cadera un recorrido corto.',
    'Añade resistencia solo con una variante y carga previamente definidas.',
  ],
  F03: [
    'Arquear la espalda para subir más o empujar con el cuello.',
    'Eleva menos la pelvis manteniendo ambos pies apoyados.',
    'Aumenta la demanda de forma gradual; una variante asimétrica cambia el ejercicio y debe revisarse.',
  ],
  F04: [
    'Dejar caer la pelvis, acercar solo la cabeza o contener el aire.',
    'Acerca los pies a la pared para reducir la inclinación.',
    'Aumenta gradualmente la inclinación; cambiar a suelo requiere revisar esa variante.',
  ],
  F05: [
    'Rebotar, balancearse o perder el apoyo al bajar.',
    'Usa apoyo para equilibrio y un recorrido menor.',
    'Pasa a una variante unilateral con apoyo cuando corresponda, sin saltar.',
  ],
  F06: [
    'Girar el tronco, hundir el hombro o aguantar la respiración.',
    'Sostén menos tiempo y vuelve al suelo con control.',
    'Aumenta la duración breve o la palanca de forma gradual, sin compensar la postura.',
  ],
  W01: [
    'Buscar fatiga o saltar directamente a velocidad máxima.',
    'Empieza con desplazamiento suave y rango cómodo.',
    'Acércate gradualmente a las demandas de la sesión, sin convertir el calentamiento en una prueba máxima.',
  ],
  C01: [
    'Forzar estiramientos o ignorar una respuesta inusual al esfuerzo.',
    'Reduce antes el ritmo y camina de manera cómoda.',
    'No necesita hacerse más difícil; adapta la duración a la transición y a cómo te encuentras.',
  ],
};
for (const [id, [mistakes, easier, harder]] of Object.entries(adjustments))
  Object.assign(
    tasks.find((task) => task.id === id),
    { mistakes, easier, harder },
  );
const output = { version: 1, updatedAt: '2026-10-03', status: 'planning-draft', tasks };
fs.mkdirSync(path.join(root, 'content/coaching'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'content/coaching/catalog.json'),
  JSON.stringify(output, null, 2) + '\n',
);
console.log(
  JSON.stringify({
    tasks: tasks.length,
    families: new Set(tasks.map((t) => t.familyId)).size,
    withVideo: tasks.filter((t) => t.videos.length).length,
  }),
);
