/* global document, innerWidth */
/** Pass a fresh, isolated Playwright Page. No user history is changed or erased. */
export async function verifyCoachingPlan(page, url = 'http://127.0.0.1:4173/') {
  const errors = [];
  const external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (/youtube|googlevideo|ytimg/.test(request.url())) external.push(request.url());
  });
  await page.goto(url + '?e2e=1&review=coaching-e2e');
  await page.getByRole('heading', { name: 'Mi plan de desarrollo' }).waitFor();
  await page.getByRole('button', { name: 'Biblioteca de ejercicios', exact: true }).click();
  const cards = page.locator('.coaching-task-grid > button');
  if ((await cards.count()) !== 52) throw new Error('Expected 52 instructional cards');
  await page.getByRole('checkbox', { name: 'Con referencia en video' }).check();
  if ((await cards.count()) !== 20) throw new Error('Expected 20 cards with a reference');
  await page.getByRole('checkbox', { name: 'Con referencia en video' }).uncheck();
  await page.getByRole('searchbox', { name: 'Buscar ejercicio' }).fill('recepcion');
  if (!(await cards.count())) throw new Error('Accent-insensitive search failed');
  await cards.first().click();
  await page.getByRole('region', { name: 'Detalle del ejercicio' }).waitFor();
  if (external.length) throw new Error('Provider requested before consent');
  await page.setViewportSize({ width: 390, height: 844 });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
    throw new Error('Mobile horizontal overflow');
  await page.getByRole('button', { name: 'Mi plan', exact: true }).click();
  await page.getByRole('button', { name: /Control y combinaciones/ }).click();
  await page.getByRole('button', { name: 'Recorrer esta propuesta' }).click();
  await page.getByRole('button', { name: 'Comenzar recorrido' }).click();
  await page.getByRole('button', { name: '+30 s para prepararme' }).click();
  if (!(await page.getByRole('button', { name: 'Pausar todo', exact: true }).isVisible()))
    throw new Error('Extension unexpectedly paused session');
  await page.getByRole('button', { name: 'Pausar todo', exact: true }).click();
  await page.getByText('Progreso guardado en este navegador.', { exact: false }).waitFor();
  page.once('dialog', (dialog) => dialog.accept());
  await page.reload();
  await page.getByRole('button', { name: 'Retomar recorrido guardado' }).click();
  await page.getByRole('button', { name: 'Recuperar en pausa' }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByText('Recorrido finalizado', { exact: true }).waitFor({ timeout: 40000 });
  if (await page.getByRole('alert').count())
    throw new Error(await page.getByRole('alert').allTextContents());
  if (errors.length) throw new Error(errors.join('; '));
  return {
    cards: 52,
    referenced: 20,
    providerRequests: external.length,
    mobileOverflow: false,
    extraPreparationWithoutPause: true,
    recoveredPaused: true,
    completed: true,
    pageErrors: errors,
  };
}
