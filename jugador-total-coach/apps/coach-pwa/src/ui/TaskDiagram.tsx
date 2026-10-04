import { useId } from 'react';
type Person = { x: number; y: number; label: string; opponent?: boolean };
type Route = { from: [number, number]; to: [number, number]; kind: 'pass' | 'run' };
type Diagram = {
  caption: string;
  people: Person[];
  routes: Route[];
  goals?: [number, number][];
};
const a = (x: number, y: number, label: string, opponent = false): Person => ({
  x,
  y,
  label,
  opponent,
});
const p = (x: number, y: number, u: number, v: number): Route => ({
  from: [x, y],
  to: [u, v],
  kind: 'pass',
});
const r = (x: number, y: number, u: number, v: number): Route => ({
  from: [x, y],
  to: [u, v],
  kind: 'run',
});
const diagrams: Record<string, Diagram> = {
  S01: {
    caption:
      'Una persona conduce por una puerta y busca la otra, conservando espacio para frenar.',
    people: [a(180, 165, 'Tú')],
    routes: [r(165, 150, 95, 70), r(115, 70, 265, 70)],
    goals: [
      [90, 45],
      [275, 45],
    ],
  },
  S02: {
    caption:
      'Conduce unos pasos y envía el balón raso por la puerta. Deja libre la zona posterior.',
    people: [a(90, 170, 'Tú')],
    routes: [r(100, 150, 155, 115), p(165, 100, 180, 40)],
    goals: [[180, 25]],
  },
  S03: {
    caption: 'Acércate a la marca central, frena y sal a un lado. Aquí no hay rival.',
    people: [a(180, 175, 'Tú')],
    routes: [r(180, 150, 180, 100), r(165, 85, 85, 85), r(195, 85, 280, 85)],
  },
  S04: {
    caption: 'Pasa por la puerta y recupera caminando. Un intento cada vez.',
    people: [a(180, 170, 'Tú')],
    routes: [p(180, 145, 180, 45), r(210, 155, 255, 65)],
    goals: [[180, 30]],
  },
  Y01: {
    caption:
      'El niño elige una puerta y conduce por ella. El adulto acompaña fuera del recorrido.',
    people: [a(180, 170, 'Niño'), a(305, 170, 'Adulto')],
    routes: [r(165, 150, 95, 65), r(195, 150, 250, 65)],
    goals: [
      [90, 40],
      [255, 40],
    ],
  },
  Y04: {
    caption: 'El adulto pasa suave. El niño recibe hacia una puerta y conduce por ella.',
    people: [a(180, 175, 'Adulto'), a(180, 100, 'Niño')],
    routes: [p(180, 155, 180, 120), r(162, 90, 90, 50), r(198, 90, 270, 50)],
    goals: [
      [80, 30],
      [280, 30],
    ],
  },
  Y07: {
    caption: 'Pase suave entre niño y adulto por una puerta ancha.',
    people: [a(180, 175, 'Niño'), a(180, 40, 'Adulto')],
    routes: [p(170, 150, 170, 65), p(190, 65, 190, 150)],
    goals: [[180, 105]],
  },
  Y08: {
    caption:
      'Unos toques para preparar el balón y un golpeo raso a la puerta; el adulto vigila la zona.',
    people: [a(90, 175, 'Niño'), a(290, 170, 'Adulto')],
    routes: [r(105, 155, 150, 115), p(160, 100, 180, 45)],
    goals: [[180, 30]],
  },
  Y09: {
    caption: 'Después de pasar al adulto, el niño cambia de ángulo para recibir otra vez.',
    people: [a(80, 170, 'Niño'), a(250, 100, 'Adulto')],
    routes: [p(100, 158, 230, 108), r(80, 145, 120, 60), p(230, 90, 140, 62)],
  },
  T05: {
    caption: 'Pasador a receptor; el primer toque busca una de las dos puertas.',
    people: [a(65, 165, 'Pasador'), a(180, 105, 'Receptor')],
    routes: [p(80, 150, 164, 118), r(190, 90, 265, 45), r(170, 90, 95, 45)],
    goals: [
      [275, 35],
      [85, 35],
    ],
  },
  T06: {
    caption: 'El apoyo cambia de lado. El receptor mira antes de elegir el pase.',
    people: [a(50, 165, 'Pasador'), a(170, 125, 'Receptor'), a(240, 50, 'Apoyo')],
    routes: [p(65, 159, 155, 130), r(240, 50, 100, 50), p(165, 108, 120, 65)],
  },
  T07: {
    caption: 'Pasa al apoyo, cambia de línea y recibe la devolución por delante.',
    people: [a(80, 170, 'A'), a(230, 125, 'Apoyo')],
    routes: [p(95, 163, 211, 132), r(80, 154, 140, 55), p(218, 111, 150, 60)],
  },
  T08: {
    caption: 'A conecta con B; C ofrece otra línea. Después A vuelve a apoyar.',
    people: [a(75, 160, 'A'), a(185, 120, 'B'), a(285, 65, 'C')],
    routes: [
      p(90, 153, 168, 126),
      p(201, 112, 267, 76),
      r(70, 145, 85, 55),
      r(285, 65, 300, 120),
    ],
  },
  T11: {
    caption: 'El defensor protege una salida. El atacante conserva o aprovecha la otra.',
    people: [a(180, 160, 'Atacante'), a(180, 100, 'Defensor', true)],
    routes: [r(160, 151, 75, 50), r(200, 151, 285, 50)],
    goals: [
      [65, 35],
      [295, 35],
    ],
  },
  T14: {
    caption: 'Dos atacantes ante un defensor: tiro si hay ventana o pase al apoyo libre.',
    people: [a(110, 160, 'Balón'), a(270, 135, 'Apoyo'), a(175, 95, 'Defensor', true)],
    routes: [p(125, 154, 253, 140), p(114, 142, 150, 38), r(270, 119, 230, 50)],
    goals: [[180, 25]],
  },
  T17: {
    caption: 'El defensor frena la aproximación y protege la ruta directa al objetivo.',
    people: [a(95, 165, 'Atacante'), a(165, 110, 'Defensor', true)],
    routes: [r(158, 123, 125, 145), r(90, 148, 50, 85)],
    goals: [[180, 25]],
  },
  T18: {
    caption: 'Un defensor presiona al balón; el segundo cubre el espacio detrás.',
    people: [
      a(95, 160, 'A'),
      a(270, 155, 'B'),
      a(120, 115, 'Presiona', true),
      a(225, 65, 'Cubre', true),
    ],
    routes: [r(117, 130, 103, 143), r(215, 65, 174, 58), p(113, 161, 250, 158)],
    goals: [[180, 25]],
  },
  T19: {
    caption:
      'El defensor observa balón y receptor; intercepta solo si llega a la trayectoria.',
    people: [a(55, 145, 'Pasador'), a(295, 145, 'Receptor'), a(175, 75, 'Defensor', true)],
    routes: [p(73, 145, 275, 145), r(175, 92, 175, 145), r(295, 145, 310, 80)],
  },
  T20: {
    caption:
      'Al cambiar la posesión cambian los roles. El más cercano actúa; el otro protege.',
    people: [
      a(115, 155, 'A'),
      a(260, 130, 'B'),
      a(150, 125, 'C', true),
      a(230, 65, 'D', true),
    ],
    routes: [r(135, 145, 148, 133), r(260, 130, 300, 180), p(164, 113, 216, 78)],
    goals: [
      [180, 25],
      [180, 195],
    ],
  },
};
export function TaskDiagram({ taskId }: { taskId: string }) {
  const id = useId().replace(/:/g, '');
  const d = diagrams[taskId];
  if (!d) return null;
  return (
    <figure className="task-diagram">
      <svg viewBox="0 0 360 220" role="img" aria-label={d.caption}>
        <defs>
          <marker
            id={id + 'pass'}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#1c547b" />
          </marker>
          <marker
            id={id + 'run'}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#84620b" />
          </marker>
        </defs>
        <rect x="12" y="12" width="336" height="196" rx="10" fill="#edf3e6" stroke="#92a383" />
        {d.goals?.map(([x, y], i) => (
          <rect
            key={i}
            x={x - 23}
            y={y - 7}
            width="46"
            height="14"
            fill="#fff"
            stroke="#213e34"
            strokeWidth="2"
          />
        ))}
        {d.routes.map((route, i) => (
          <line
            key={i}
            x1={route.from[0]}
            y1={route.from[1]}
            x2={route.to[0]}
            y2={route.to[1]}
            stroke={route.kind === 'pass' ? '#1c547b' : '#84620b'}
            strokeDasharray={route.kind === 'run' ? '6 5' : undefined}
            strokeWidth="2"
            markerEnd={`url(#${id + route.kind})`}
          />
        ))}
        {d.people.map((person, i) => (
          <g key={i}>
            <circle
              cx={person.x}
              cy={person.y}
              r="13"
              fill={person.opponent ? '#9a493b' : '#213e34'}
            />
            <text x={person.x} y={person.y + 4} textAnchor="middle" fontSize="11" fill="white">
              {i + 1}
            </text>
            <text
              x={person.x}
              y={person.y + 29}
              textAnchor="middle"
              fontSize="11"
              fill="#183227"
            >
              {person.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        {d.caption}
        <span>
          Azul continuo: pase posible. Ocre discontinuo: desplazamiento. Esquema de
          organización, sin escala.
        </span>
      </figcaption>
    </figure>
  );
}
