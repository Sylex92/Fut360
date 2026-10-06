/* global document, innerWidth, KeyboardEvent */
// Keyboard and viewport verification, not a physical Sony remote/device test.
export async function verifyTvView(page, url = 'http://127.0.0.1:4173/?tv-test=1') {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(url);
  await page.getByRole('button', { name: 'Crear perfil', exact: true }).click();
  await page.getByLabel('Alias', { exact: true }).fill('Perfil TV sintético');
  await page.getByRole('button', { name: 'Guardar perfil', exact: true }).click();
  await page.getByRole('button', { name: 'Vista de TV', exact: true }).click();
  await page.keyboard.press('ArrowDown');
  if (
    await page
      .locator('select')
      .first()
      .evaluate((s) => document.activeElement !== s)
  )
    throw new Error('Ordered focus failed');
  const before = await page.locator('select').first().inputValue();
  await page.keyboard.press('ArrowRight');
  if ((await page.locator('select').first().inputValue()) !== before)
    throw new Error('Leaving select changed its value');
  if ((await page.evaluate(() => document.activeElement?.textContent)) !== 'Crear perfil')
    throw new Error('Focus trapped in select');
  await page.keyboard.press('Escape');
  if (await page.locator('.tv-view').count()) throw new Error('Exit failed');
  await page.getByRole('button', { name: 'Vista de TV', exact: true }).click();
  await page.getByRole('button', { name: 'Recorrer esta propuesta', exact: true }).click();
  await page.getByRole('button', { name: 'Comenzar recorrido', exact: true }).click();
  // A removed Start button leaves focus on body; the media key must still pause.
  await page.evaluate(() =>
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'MediaPlayPause', bubbles: true }),
    ),
  );
  await page.getByRole('button', { name: 'Continuar', exact: true }).waitFor();
  const clock = await page.locator('.guided-clock strong').innerText();
  await page.evaluate(() =>
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'MediaPlayPause', bubbles: true }),
    ),
  );
  await page.getByRole('button', { name: 'Pausar todo', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Pausar todo', exact: true }).click();
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
    throw new Error('TV overflow');
  await page.setViewportSize({ width: 390, height: 844 });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
    throw new Error('TV mode mobile overflow');
  if (errors.length) throw new Error(errors.join('; '));
  return {
    orderedArrows: true,
    selectValuePreserved: true,
    escape: true,
    mediaKeySimulated: true,
    pausedClock: clock,
    desktop1920: true,
    mobile390: true,
    physicalSony: false,
    pageErrors: errors,
  };
}
