export default async (page) => {
  const checks = [],
    errors = [],
    warnings = [],
    urls = [];
  const check = (name, ok, detail) => {
    checks.push({ name, passed: !!ok, detail });
    if (!ok) throw new Error(name + ': ' + JSON.stringify(detail));
  };
  const onError = (e) => errors.push(e.message);
  const onConsole = (m) => {
    if (m.type() === 'error') errors.push(m.text());
    if (m.type() === 'warning') warnings.push(m.text());
  };
  const onRequest = (r) => urls.push(r.url());
  page.on('pageerror', onError);
  page.on('console', onConsole);
  page.on('request', onRequest);
  const dir =
    'C:/Users/mario.sabaleta/Documents/GitHub/Fut360/jugador-total-coach/docs/reviews/evidence/phase06-wall-push-up/';
  try {
    await page.goto('http://127.0.0.1:4173/');
    await page.bringToFront();
    await page.setViewportSize({ width: 1250, height: 1000 });
    const root = page.locator('.movement-library');
    const time = async () =>
      Number(await root.locator('output[data-seconds]').getAttribute('data-seconds'));
    await root.locator('select').first().selectOption('wall-push-up');
    await page.waitForFunction(
      () => !document.querySelector('.movement-library .button-primary').disabled,
    );
    check(
      'local asset loaded',
      (await root.locator('canvas').count()) === 1 && (await time()) === 0,
    );
    await root.getByRole('button', { name: 'Reproducir ejemplo', exact: true }).click();
    await page.waitForFunction(
      () => Number(document.querySelector('.movement-library output').dataset.seconds) > 0.5,
    );
    await root.getByRole('button', { name: 'Pausar ejemplo', exact: true }).click();
    const paused = await time();
    await page.waitForTimeout(300);
    check('pause keeps cursor', (await time()) === paused, paused);
    for (const name of ['Lateral', 'Frontal', 'Tres cuartos']) {
      await root.getByRole('button', { name, exact: true }).click();
      check(name + ' preserves cursor', (await time()) === paused);
    }
    const slider = root.locator('input[type=range]');
    await slider.focus();
    await slider.press('Home');
    await slider.press('ArrowRight');
    check('keyboard seek', (await time()) === 0.05, await time());
    await root.getByRole('button', { name: 'Volver al inicio', exact: true }).click();
    check('reset', (await time()) === 0);
    await root.locator('select').nth(1).selectOption('0.5');
    await root.getByRole('button', { name: 'Reproducir ejemplo', exact: true }).click();
    await page.waitForTimeout(2000);
    await root.getByRole('button', { name: 'Pausar ejemplo', exact: true }).click();
    check(
      'half speed advances approximately 1 second',
      (await time()) > 0.75 && (await time()) < 1.3,
      await time(),
    );
    await root.getByRole('button', { name: 'Volver al inicio', exact: true }).click();
    await root.locator('select').nth(1).selectOption('1');
    await root.getByRole('button', { name: 'Reproducir ejemplo', exact: true }).click();
    await root
      .getByRole('button', { name: 'Ver de nuevo', exact: true })
      .waitFor({ timeout: 15000 });
    check('finite 8 second finish', (await time()) === 8);
    await page.waitForTimeout(300);
    check('does not repeat automatically', (await time()) === 8);
    await root.getByRole('button', { name: 'Ver de nuevo', exact: true }).click();
    await root.getByRole('button', { name: 'Pausar ejemplo', exact: true }).click();
    check('explicit replay restarts', (await time()) < 1);
    await page.setViewportSize({ width: 390, height: 844 });
    await slider.evaluate((el) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, '3.5');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await root.getByRole('button', { name: 'Lateral', exact: true }).click();
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    );
    await root.screenshot({ path: dir + 'wall-library-390.png' });
    const metrics = await root.evaluate((el) => ({
      width: innerWidth,
      scroll: document.documentElement.scrollWidth,
      buttons: [...el.querySelectorAll('button')].map((b) => ({
        text: b.textContent,
        height: b.getBoundingClientRect().height,
      })),
    }));
    check(
      'narrow layout has no horizontal overflow',
      metrics.scroll <= metrics.width,
      metrics,
    );
    check(
      'touch controls at least 44px',
      metrics.buttons.every((b) => b.height >= 44),
      metrics.buttons,
    );
    await root.locator('select').first().selectOption('inside-inside');
    await page.waitForFunction(
      () => !document.querySelector('.movement-library .button-primary').disabled,
    );
    check(
      'feet camera remains available for ball',
      (await root.getByRole('button', { name: 'Detalle de pies', exact: true }).count()) === 1,
    );
    await root.locator('select').first().selectOption('wall-push-up');
    await page.waitForFunction(
      () => !document.querySelector('.movement-library .button-primary').disabled,
    );
    check(
      'wall has the three full body cameras',
      (await root.getByRole('button', { name: 'Detalle de pies', exact: true }).count()) === 0,
    );
    check('no browser errors', errors.length === 0, errors);
    check(
      'no external network requests',
      urls.every(
        (url) =>
          url.startsWith('http://127.0.0.1:4173/') ||
          url.startsWith('blob:') ||
          url.startsWith('data:'),
      ),
    );
    await page.setViewportSize({ width: 1250, height: 1000 });
    return {
      checkedAt: '2026-09-30',
      checks,
      errors,
      warnings,
      requests: [...new Set(urls)],
      limits:
        'Desktop automation at 390px is not a Samsung hardware test. Previous user acceptance excludes this new clip.',
    };
  } finally {
    page.off('pageerror', onError);
    page.off('console', onConsole);
    page.off('request', onRequest);
  }
};
