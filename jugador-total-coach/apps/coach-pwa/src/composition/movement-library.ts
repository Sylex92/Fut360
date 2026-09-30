export interface MovementPreview {
  id: string;
  name: string;
  assetUrl: string;
  clipName: string;
  durationMs: number;
  framing: 'standing' | 'floor';
  equipment: string;
  preparation: string;
  cues: readonly string[];
}

// Product instructions only; the documentary review is not imported into the app.
export const movements: readonly MovementPreview[] = [
  {
    id: 'hip-hinge',
    name: 'Bisagra de cadera',
    assetUrl: new URL('../../../../assets/runtime/hip-hinge-v1.glb', import.meta.url).href,
    clipName: 'EX_hip-hinge__neutral__v1',
    durationMs: 8000,
    framing: 'standing',
    equipment: 'Sin material',
    preparation: 'Una bisagra completa: cadera atrás y regreso.',
    cues: [
      'Pies separados y completamente apoyados.',
      'Cadera hacia atrás; rodillas ligeramente flexionadas.',
      'Tronco y cuello alineados; respira sin contener el aire.',
      'Vuelve de forma controlada, sin inclinarte hacia atrás al terminar.',
    ],
  },
  {
    id: 'inside-inside',
    name: 'Campanitas · interior-interior',
    assetUrl: new URL('../../../../assets/runtime/inside-inside-v2.glb', import.meta.url).href,
    clipName: 'EX_inside-inside__alternating__v2',
    durationMs: 6500,
    framing: 'standing',
    equipment: 'Balón · sin saltos',
    preparation: 'Cuatro toques alternos: dos pares de interior derecho e izquierdo.',
    cues: [
      'Balón entre los pies, cerca del cuerpo.',
      'El interior del pie derecho dirige el balón hacia el izquierdo.',
      'El interior izquierdo lo devuelve con un recorrido corto.',
      'Mantén el control antes de aumentar el ritmo.',
    ],
  },
  {
    id: 'glute-bridge',
    name: 'Puente de glúteos',
    assetUrl: new URL('../../../../assets/runtime/glute-bridge-v1.glb', import.meta.url).href,
    clipName: 'EX_glute-bridge__bilateral__v1',
    durationMs: 8000,
    framing: 'floor',
    equipment: 'Colchoneta · sin banda',
    preparation:
      'El ejemplo comienza tumbado. Una repetición es subir la cadera y volver a apoyarla.',
    cues: [
      'Boca arriba, rodillas flexionadas y pies apoyados.',
      'Eleva la cadera de forma controlada, sin buscar la máxima altura.',
      'Conserva el apoyo de cabeza, parte alta de la espalda y pies; respira sin contener el aire.',
      'Baja suavemente hasta la posición inicial.',
    ],
  },
  {
    id: 'active-march',
    name: 'Marcha en el sitio',
    assetUrl: new URL('../../../../assets/runtime/active-march-v2.glb', import.meta.url).href,
    clipName: 'EX_active-march__alternate__v2',
    durationMs: 8000,
    framing: 'standing',
    equipment: 'Sin material',
    preparation: 'Seis pasos alternos con brazos acompañando, y regreso a ambos apoyos.',
    cues: [
      'Alterna los pasos en el sitio, sin saltar ni correr.',
      'Acompaña cada pierna con el brazo contrario, con los codos flexionados.',
      'Deja los hombros relajados y conserva un ritmo cómodo.',
    ],
  },
  {
    id: 'mini-squat',
    name: 'Sentadilla corta',
    assetUrl: new URL('../../../../assets/runtime/mini-squat-v2.glb', import.meta.url).href,
    clipName: 'EX_mini-squat__bilateral__v2',
    durationMs: 5200,
    framing: 'standing',
    equipment: 'Sin material',
    preparation: 'Una bajada corta y regreso a la posición de pie.',
    cues: [
      'Pies apoyados y separados de forma cómoda.',
      'Flexiona rodillas y caderas con un recorrido corto.',
      'Mantén los talones apoyados y las rodillas orientadas con los pies.',
      'Regresa de forma controlada; no fuerces la profundidad.',
    ],
  },
  {
    id: 'ankle-mobility-left',
    name: 'Balanceo de tobillo · izquierdo delante',
    assetUrl: new URL('../../../../assets/runtime/ankle-mobility-left-v1.glb', import.meta.url)
      .href,
    clipName: 'EX_ankle-mobility__left__v1',
    durationMs: 8000,
    framing: 'standing',
    equipment: 'Sin material',
    preparation: 'El ejemplo comienza con el pie izquierdo adelantado.',
    cues: [
      'Ambos pies apoyados y posición escalonada.',
      'Desplaza suavemente la rodilla delantera hacia delante sin despegar el talón.',
      'Vuelve al inicio sin forzar el recorrido.',
    ],
  },
  {
    id: 'ankle-mobility-right',
    name: 'Balanceo de tobillo · derecho delante',
    assetUrl: new URL(
      '../../../../assets/runtime/ankle-mobility-right-v1.glb',
      import.meta.url,
    ).href,
    clipName: 'EX_ankle-mobility__right__v1',
    durationMs: 8000,
    framing: 'standing',
    equipment: 'Sin material',
    preparation: 'El ejemplo comienza con el pie derecho adelantado.',
    cues: [
      'Ambos pies apoyados y posición escalonada.',
      'Desplaza suavemente la rodilla delantera hacia delante sin despegar el talón.',
      'Vuelve al inicio sin forzar el recorrido.',
    ],
  },
  {
    id: 'soft-step-turn-left',
    name: 'Giro por pasos · izquierda',
    assetUrl: new URL('../../../../assets/runtime/soft-step-turn-left-v2.glb', import.meta.url)
      .href,
    clipName: 'EX_soft-step-turn__left__v2',
    durationMs: 7200,
    framing: 'standing',
    equipment: 'Sin material',
    preparation: 'Pequeños pasos hacia la izquierda y regreso al frente.',
    cues: [
      'Recoloca los pies en pasos pequeños.',
      'Levanta el pie antes de cambiar su orientación.',
      'Acompaña con el cuerpo, sin girar sobre un pie fijo.',
      'Regresa al frente también mediante pasos.',
    ],
  },
  {
    id: 'soft-step-turn-right',
    name: 'Giro por pasos · derecha',
    assetUrl: new URL(
      '../../../../assets/runtime/soft-step-turn-right-v2.glb',
      import.meta.url,
    ).href,
    clipName: 'EX_soft-step-turn__right__v2',
    durationMs: 7200,
    framing: 'standing',
    equipment: 'Sin material',
    preparation: 'Pequeños pasos hacia la derecha y regreso al frente.',
    cues: [
      'Recoloca los pies en pasos pequeños.',
      'Levanta el pie antes de cambiar su orientación.',
      'Acompaña con el cuerpo, sin girar sobre un pie fijo.',
      'Regresa al frente también mediante pasos.',
    ],
  },
  {
    id: 'dead-bug',
    name: 'Pierna alterna con brazos apoyados',
    assetUrl: new URL('../../../../assets/runtime/dead-bug-v1.glb', import.meta.url).href,
    clipName: 'EX_dead-bug__arms-supported__v1',
    durationMs: 14000,
    framing: 'floor',
    equipment: 'Colchoneta',
    preparation: 'El ejemplo empieza tumbado: eleva y baja una pierna antes de alternar.',
    cues: [
      'Boca arriba, brazos relajados y rodillas flexionadas.',
      'Eleva una pierna con recorrido corto, manteniendo el otro pie apoyado.',
      'Devuélvela al suelo antes de cambiar de lado.',
      'Mantén el tronco estable y respira sin contener el aire.',
    ],
  },
  {
    id: 'slow-breathing',
    name: 'Postura para respirar cómodamente',
    assetUrl: new URL('../../../../assets/runtime/slow-breathing-v1.glb', import.meta.url)
      .href,
    clipName: 'EX_slow-breathing__comfortable-standing__v1',
    durationMs: 8000,
    framing: 'standing',
    equipment: 'Sin material',
    preparation: 'Observa la postura; el avatar no marca tus ciclos de respiración.',
    cues: [
      'Permanece en una postura cómoda, con ambos pies apoyados.',
      'Relaja los brazos y deja fluir la respiración sin forzarla.',
      'No necesitas acompasar la respiración al reloj o al avatar.',
    ],
  },
  {
    id: 'lateral-sole-roll-left',
    name: 'Planta lateral · pie izquierdo',
    assetUrl: new URL(
      '../../../../assets/runtime/lateral-sole-roll-left-v2.glb',
      import.meta.url,
    ).href,
    clipName: 'EX_lateral-sole-roll__left__v2',
    durationMs: 6500,
    framing: 'standing',
    equipment: 'Balón · sin saltos',
    preparation: 'Desplaza el balón con la planta y devuélvelo antes de apoyar el pie.',
    cues: [
      'El pie derecho sostiene el apoyo en el suelo.',
      'Coloca suavemente la planta izquierda sobre el balón.',
      'Desliza el balón de lado y vuelve, sin apoyar tu peso sobre él.',
      'Retira el pie y vuelve a apoyarlo en el suelo.',
    ],
  },
  {
    id: 'lateral-sole-roll-right',
    name: 'Planta lateral · pie derecho',
    assetUrl: new URL(
      '../../../../assets/runtime/lateral-sole-roll-right-v2.glb',
      import.meta.url,
    ).href,
    clipName: 'EX_lateral-sole-roll__right__v2',
    durationMs: 6500,
    framing: 'standing',
    equipment: 'Balón · sin saltos',
    preparation: 'Desplaza el balón con la planta y devuélvelo antes de apoyar el pie.',
    cues: [
      'El pie izquierdo sostiene el apoyo en el suelo.',
      'Coloca suavemente la planta derecha sobre el balón.',
      'Desliza el balón de lado y vuelve, sin apoyar tu peso sobre él.',
      'Retira el pie y vuelve a apoyarlo en el suelo.',
    ],
  },
  {
    id: 'inside-outside-left',
    name: 'Interior/exterior · pie izquierdo',
    assetUrl: new URL('../../../../assets/runtime/inside-outside-left-v2.glb', import.meta.url)
      .href,
    clipName: 'EX_inside-outside__left__v2',
    durationMs: 6500,
    framing: 'standing',
    equipment: 'Balón · sin saltos',
    preparation: 'Dos toques con el mismo pie: primero interior, después exterior.',
    cues: [
      'El pie derecho sostiene el apoyo.',
      'Acerca el balón con el interior izquierdo.',
      'Recoloca ese pie por detrás del balón, sin pisarlo.',
      'Devuélvelo con el exterior del mismo pie y vuelve al inicio.',
    ],
  },
  {
    id: 'inside-outside-right',
    name: 'Interior/exterior · pie derecho',
    assetUrl: new URL(
      '../../../../assets/runtime/inside-outside-right-v2.glb',
      import.meta.url,
    ).href,
    clipName: 'EX_inside-outside__right__v2',
    durationMs: 6500,
    framing: 'standing',
    equipment: 'Balón · sin saltos',
    preparation: 'Dos toques con el mismo pie: primero interior, después exterior.',
    cues: [
      'El pie izquierdo sostiene el apoyo.',
      'Acerca el balón con el interior derecho.',
      'Recoloca ese pie por detrás del balón, sin pisarlo.',
      'Devuélvelo con el exterior del mismo pie y vuelve al inicio.',
    ],
  },
];
