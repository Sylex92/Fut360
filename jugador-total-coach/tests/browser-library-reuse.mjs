/** Real-browser regression: pass an existing Playwright Page on Fut360.
 * This checks resource readiness and persistent Canvas identity, not sports technique.
 */
export async function verifyLibraryReuse(page) {
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on('pageerror', onError);
  try {
    await page
      .getByRole('button', { name: 'Animaciones 3D · en revisión', exact: true })
      .click();
    await page.getByRole('searchbox', { name: 'Buscar ejercicio', exact: true }).fill('');
    await page.getByRole('combobox', { name: 'Objetivo', exact: true }).selectOption('');
    await page.getByRole('combobox', { name: 'Material', exact: true }).selectOption('');
    const select = page.getByRole('combobox', { name: 'Movimiento', exact: true });
    const ids = await select
      .getByRole('option')
      .evaluateAll((options) => options.map((o) => o.value));
    if (!ids.length) throw new Error('Empty library');
    await page.getByRole('slider', { name: 'Instante del movimiento', exact: true }).fill('1');
    const canvas = await page.locator('canvas').elementHandle();
    for (const id of ids) {
      await select.selectOption(id);
      await page
        .getByRole('slider', { name: 'Instante del movimiento', exact: true })
        .fill('1');
      if (
        !(await page.locator('canvas').evaluate((node, original) => node === original, canvas))
      )
        throw new Error('Canvas recreated for ' + id);
      if (
        !(await page
          .getByRole('button', { name: 'Reproducir ejemplo', exact: true })
          .isEnabled())
      )
        throw new Error('Resource unavailable: ' + id);
    }
    if (errors.length) throw new Error(errors.join('; '));
    return { checked: ids.length, sameCanvas: true, pageErrors: 0 };
  } finally {
    page.off('pageerror', onError);
  }
}
