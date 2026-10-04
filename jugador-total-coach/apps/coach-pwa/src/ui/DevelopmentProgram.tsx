import { useState } from 'react';
import { adultProgram, youthProgram } from '../composition/personal-programs';
import { useParticipant } from './ParticipantContext';
import { participantGoals } from '../platform/participant';
import { coachingSessions } from '../composition/development-plan';

export function DevelopmentProgram({ onSelect }: { onSelect: (id: string) => void }) {
  const { participant } = useParticipant();
  const child = participant?.kind === 'child';
  const stages = child ? youthProgram : adultProgram;
  const [index, setIndex] = useState(0);
  const stage = stages[index] ?? stages[0]!;
  return (
    <section className="panel development-program" aria-labelledby="program-heading">
      <p className="eyebrow">
        {child ? 'JUGAR, DECIDIR Y DISFRUTAR' : 'CONTROL · GOL · MEDIOCAMPO · DEFENSA'}
      </p>
      <h2 id="program-heading">
        {child ? 'Su recorrido de aprendizaje' : 'Tu recorrido de desarrollo'}
      </h2>
      <p>
        {child
          ? 'Se complementa con el trabajo del equipo y del gimnasio. El adulto acompaña y organiza; no actúa como rival físico.'
          : 'Una ruta individual para comenzar, y tareas con oposición cuando el entorno lo permita. La fecha orienta las revisiones; avanzar depende de lo que puedas hacer y sostener.'}
      </p>
      {participant && (
        <p className="quiet-note">
          {participant.modalities.length
            ? `Modalidades: ${participant.modalities.map((m) => 'FUT ' + m).join(' · ')}. `
            : ''}
          {participant.foot === 'left'
            ? 'Empieza las primeras demostraciones con la izquierda; después explora la derecha sin invertir el texto del video.'
            : participant.foot === 'right'
              ? 'Empieza por la derecha y compara luego el otro lado.'
              : 'Practica ambos lados dentro de la dosis indicada.'}
        </p>
      )}
      {!!participant?.goals.length && (
        <p>
          Prioridades del perfil:{' '}
          {participant.goals.map((g) => participantGoals[g]).join(' · ')}.
        </p>
      )}
      <label>
        Etapa del recorrido
        <select value={index} onChange={(e) => setIndex(Number(e.target.value))}>
          {stages.map((s, i) => (
            <option value={i} key={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <h3>{stage.horizon}</h3>
      <p>{stage.rhythm}</p>
      <div className="camera-controls">
        {stage.sessions.map((id) => (
          <button key={id} onClick={() => onSelect(id)}>
            {coachingSessions.find((s) => s.id === id)!.name}
          </button>
        ))}
      </div>
      <h3>Antes de avanzar</h3>
      <ul>
        {stage.advance.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p>{stage.adjust}</p>
      <p className="quiet-note">
        {child
          ? 'Observa disfrute, decisiones y control. No se califica el cuerpo ni se asigna una posición definitiva.'
          : 'Bellingham y Firmino orientan capacidades: llegar, asociarse, proteger y recuperar. El calendario y las sesiones completadas no certifican nivel profesional.'}
      </p>
    </section>
  );
}
