import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import fixture from '../../../content/examples/mvp1-60min.workout.json';
import { App } from './ui/App';
import './ui/styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('No se encuentra el contenedor de la aplicación.');
createRoot(container).render(
  <StrictMode>
    <App content={fixture} />
  </StrictMode>,
);
