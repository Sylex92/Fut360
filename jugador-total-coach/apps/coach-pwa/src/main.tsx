import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import fixture from '../../../content/examples/mvp1-60min.workout.json';
import { App } from './ui/App';
import { ParticipantBoundary } from './ui/ParticipantManager';
import './ui/styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('No se encuentra el contenedor de la aplicación.');
createRoot(container).render(
  <StrictMode>
    <ParticipantBoundary>
      <App content={fixture} />
    </ParticipantBoundary>
  </StrictMode>,
);
