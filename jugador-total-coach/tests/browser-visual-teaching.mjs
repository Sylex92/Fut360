/* global document, innerWidth */
// Opt-in live-provider check: a fresh isolated page, no media downloads or user data.
export async function verifyVisualTeaching(page, tasks, url = 'http://127.0.0.1:4173/') {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await page.getByRole('button', { name: 'Biblioteca de ejercicios', exact: true }).click();
  const results = [];
  for (const task of tasks) {
    const close = page.getByRole('button', { name: 'Cerrar ficha', exact: true });
    if (await close.count()) await close.click();
    await page.getByRole('searchbox', { name: 'Buscar ejercicio', exact: true }).fill(task.id);
    const cards = page.locator('.coaching-task-grid > button');
    if ((await cards.count()) !== 1) throw new Error('Ambiguous task: ' + task.id);
    await cards.click();
    await page.getByRole('button', { name: 'Ver video del ejercicio', exact: true }).click();
    if (task.rate)
      await page
        .getByRole('combobox', { name: 'Velocidad del ejemplo', exact: true })
        .selectOption(String(task.rate));
    const repeat = page.getByRole('button', { name: 'Repetir fragmento', exact: true });
    await repeat.click();
    const frame = page.frames().find((f) => f.url().includes('/embed/' + task.videoId));
    if (!frame) throw new Error('Wrong source for ' + task.id);
    let nativeActivation = false;
    try {
      await page
        .getByText('Reproduciendo el fragmento.', { exact: true })
        .waitFor({ timeout: 6000 });
    } catch (error) {
      // A live provider can require its own activation; record it rather than
      // claiming this test proves autoplay on every source/browser.
      const blocked = page.getByText('Usa el botón de reproducción del video.', {
        exact: true,
      });
      const play = frame.getByRole('button', { name: /^(Play|Reproducir video)$/ });
      if (!(await blocked.isVisible()) || !(await play.isVisible())) throw error;
      await play.click();
      nativeActivation = true;
      await page.getByText('Reproduciendo el fragmento.', { exact: true }).waitFor();
    }
    const video = frame.locator('video');
    const beginning = await video.evaluate((v) => ({
      time: v.currentTime,
      paused: v.paused,
      rate: v.playbackRate,
    }));
    if (task.rate && beginning.rate !== task.rate)
      throw new Error('Provider did not apply selected rate: ' + task.id);
    if (beginning.paused || beginning.time < task.start - 2 || beginning.time > task.start + 4)
      throw new Error('Video did not start near the selected range: ' + task.id);
    await page
      .getByText('Fragmento terminado.', { exact: true })
      .waitFor({ timeout: ((task.end - task.start) * 1000) / (task.rate || 1) + 12000 });
    const ending = await video.evaluate((v) => ({ time: v.currentTime, paused: v.paused }));
    if (!ending.paused || Math.abs(ending.time - task.end) > 0.5)
      throw new Error('Video did not stop near selected end: ' + task.id);
    results.push({ ...task, beginning, ending, nativeActivation });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
    throw new Error('Mobile overflow');
  if (errors.length) throw new Error(errors.join('; '));
  return { results, mobileOverflow: false, pageErrors: errors, provider: 'YouTube real' };
}
