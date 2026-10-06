/* global document, innerWidth, Event, URL */
// Uses an isolated synthetic child profile, real local MP4 playback, no remote provider.
export async function verifyLocalTeaching(
  page,
  url = 'http://127.0.0.1:4173/?e2e=1&local-media-test=1',
) {
  const errors = [];
  const external = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (request) => {
    if (!request.url().startsWith(new URL(url).origin)) external.push(request.url());
  });
  await page.goto(url);
  await page.getByRole('button', { name: 'Crear perfil', exact: true }).click();
  await page.getByLabel('Alias', { exact: true }).fill('Prueba infantil multimedia');
  await page.getByRole('combobox', { name: /Tipo de perfil/ }).selectOption('child');
  await page
    .getByRole('checkbox', { name: 'Soy el adulto responsable que administra este perfil.' })
    .check();
  await page.getByRole('button', { name: 'Guardar perfil', exact: true }).click();
  await page.getByRole('button', { name: 'Biblioteca de ejercicios', exact: true }).click();
  const ranges = [];
  for (const [id, start, end] of [
    ['Y01', 8, 24],
    ['Y07', 12, 40],
  ]) {
    const close = page.getByRole('button', { name: 'Cerrar ficha', exact: true });
    if (await close.count()) await close.click();
    await page.getByRole('searchbox', { name: 'Buscar ejercicio', exact: true }).fill(id);
    await page.locator('.coaching-task-grid > button').click();
    await page.getByRole('button', { name: 'Ver video del ejercicio', exact: true }).click();
    await page.waitForFunction((start) => {
      const v = document.querySelector('.local-video-frame');
      return v && !v.paused && v.currentTime > start;
    }, start);
    await page
      .getByRole('combobox', { name: 'Velocidad del ejemplo', exact: true })
      .selectOption('0.5');
    if ((await page.locator('video').evaluate((v) => v.playbackRate)) !== 0.5)
      throw new Error('Slow playback not applied');
    await page.locator('video').evaluate((v, end) => {
      v.currentTime = end - 0.2;
    }, end);
    await page.getByText('Fragmento terminado.', { exact: true }).waitFor();
    const ending = await page
      .locator('video')
      .evaluate((v) => ({ time: v.currentTime, paused: v.paused, duration: v.duration }));
    if (!ending.paused || Math.abs(ending.time - end) > 0.3)
      throw new Error('Range did not stop: ' + id);
    await page.getByRole('checkbox', { name: 'Repetir en bucle', exact: true }).check();
    await page.getByRole('button', { name: 'Repetir fragmento', exact: true }).click();
    await page.locator('video').evaluate((v, end) => {
      v.currentTime = end - 0.2;
    }, end);
    await page.waitForFunction((start) => {
      const v = document.querySelector('video');
      return v && !v.paused && v.currentTime >= start && v.currentTime < start + 2;
    }, start);
    ranges.push({ id, start, end, ending, loop: true, rate: 0.5 });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
    throw new Error('Mobile overflow');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole('button', { name: 'Mi plan', exact: true }).click();
  await page.getByRole('button', { name: 'Recorrer esta propuesta', exact: true }).click();
  await page
    .getByRole('button', { name: 'Activar demostraciones automáticas', exact: true })
    .click();
  await page.getByRole('button', { name: 'Comenzar recorrido', exact: true }).click();
  await page.locator('.coaching-runner video').waitFor();
  await page.waitForFunction(() => {
    const v = document.querySelector('video');
    return v && !v.paused && v.currentTime > 8;
  });
  await page.getByRole('button', { name: 'Pausar todo', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('video')?.paused);
  const pausedClock = await page.locator('.guided-clock strong').innerText();
  await page
    .getByRole('combobox', { name: 'Velocidad del ejemplo', exact: true })
    .selectOption('0.5');
  // Reloading the media while manually paused must not restart the session.
  await page.getByRole('button', { name: 'Reintentar video', exact: true }).click();
  await page.waitForFunction(() => {
    const v = document.querySelector('video');
    return v?.paused && v.readyState >= 2;
  });
  if (
    (await page.getByRole('button', { name: 'Pausar todo', exact: true }).count()) ||
    (await page.locator('.guided-clock strong').innerText()) !== pausedClock
  )
    throw new Error('Manual pause was overridden');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('video')?.paused);
  await page.locator('video').evaluate((v) => v.pause());
  await page.getByRole('button', { name: 'Continuar', exact: true }).waitFor();
  if (await page.getByRole('button', { name: 'Continuar', exact: true }).isDisabled())
    throw new Error('Native pause blocked explicit resume');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  // Controlled visibility event; this is not a physical-device minimize test.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForFunction(() => document.querySelector('video')?.paused);
  await page.getByRole('button', { name: 'Continuar', exact: true }).waitFor();
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.getByRole('button', { name: 'Pausar todo', exact: true }).waitFor();
  await page.waitForFunction(() => !document.querySelector('video')?.paused);
  await page.getByRole('button', { name: 'Pausar todo', exact: true }).click();
  if (errors.length || external.length) throw new Error(JSON.stringify({ errors, external }));
  return {
    ranges,
    automaticChild: true,
    manualPause: true,
    nativePause: true,
    visibilitySimulated: true,
    mobileOverflow: false,
    externalRequests: external,
    pageErrors: errors,
  };
}
