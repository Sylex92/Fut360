import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from './App';
import fixture from '../../../../content/examples/mvp1-60min.workout.json';

it('presenta tiempos reales y el estado de borrador sin ofrecer iniciar entrenamiento', () => {
  const html = renderToStaticMarkup(<App content={fixture} />);
  expect(html).toContain('Archivo de referencia válido');
  expect(html).toContain('60:00');
  expect(html).toContain('BORRADOR');
  expect(html).toContain('No es todavía una rutina aprobada');
  expect(html).not.toContain('Iniciar entrenamiento');
});
it('muestra errores comprensibles en vez de un resumen de éxito', () => {
  const html = renderToStaticMarkup(
    <App content={{ ...fixture, expectedDurationSeconds: 1 }} />,
  );
  expect(html).toContain('El contenido necesita correcciones');
  expect(html).toContain('pero los bloques suman 3600 s');
  expect(html).not.toContain('Así se distribuye la hora');
});
