// Reproduce with the existing Playwright page; no dependency install required.
export default async (page) => {
  page.setDefaultTimeout(6000);
  await page.bringToFront();
  const errors = [],
    warnings = [],
    requests = [],
    checks = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'warning') warnings.push(m.text());
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('request', (r) => requests.push(r.url()));
  const root = page.locator('.movement-library');
  const ready = () =>
    page.waitForFunction(
      () => document.querySelector('.movement-library .button-primary')?.disabled === false,
      {},
      { timeout: 15000 },
    );
  const time = async () => Number(await root.locator('output').getAttribute('data-seconds'));
  const check = (name, condition, detail) => {
    checks.push({ name, passed: condition, detail });
    if (!condition) throw Error(name);
  };
  const click = (name) => root.getByRole('button', { name, exact: true }).click();
  const seek = (t) =>
    root.locator('input[type=range]').evaluate((el, v) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, String(t));
  try {
    await page.goto('http://127.0.0.1:4173/', { timeout: 15000 });
    await ready();
    check(
      'only selected GLB loaded',
      requests.filter((u) => u.includes('.glb')).length === 1,
      requests.filter((u) => u.includes('.glb')),
    );
    await click('Reproducir ejemplo');
    await page.waitForFunction(
      () =>
        Number(
          document.querySelector('.movement-library output')?.getAttribute('data-seconds'),
        ) > 0.5,
    );
    await click('Pausar ejemplo');
    const paused = await time();
    await page.waitForTimeout(250);
    check('pause holds time', (await time()) === paused, paused);
    await click('Lateral');
    check('camera preserves time', (await time()) === paused, await time());
    await seek(7.8);
    await click('Reproducir ejemplo');
    await root.getByRole('button', { name: 'Ver de nuevo', exact: true }).waitFor();
    check('finite end', (await time()) === 8, await time());
    await click('Ver de nuevo');
    await click('Pausar ejemplo');
    check('replay resets', (await time()) < 3, await time());
    await click('Volver al inicio');
    await root.locator('input[type=range]').focus();
    await root.locator('input[type=range]').press('ArrowRight');
    check('keyboard seek', Math.abs((await time()) - 0.05) < 0.001, await time());
    await click('Reproducir ejemplo');
    await page.waitForFunction(
      () =>
        Number(
          document.querySelector('.movement-library output')?.getAttribute('data-seconds'),
        ) > 0.4,
    );
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    const h = await time();
    await page.waitForTimeout(300);
    check('hidden freezes time', (await time()) === h, h);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForFunction(
      (t) =>
        Number(
          document.querySelector('.movement-library output')?.getAttribute('data-seconds'),
        ) >
        t + 0.2,
      h,
    );
    await click('Pausar ejemplo');
    const m = await time();
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(200);
    check('manual pause not auto-resumed', (await time()) === m, m);
    await root.locator('select').first().selectOption('inside-inside');
    await ready();
    check('selection resets', (await time()) === 0, await time());
    await root.locator('select').nth(1).selectOption('2');
    await seek(9.8);
    await click('Reproducir ejemplo');
    await root.getByRole('button', { name: 'Ver de nuevo', exact: true }).waitFor();
    check('2x finite end', (await time()) === 10, await time());
    check('normal console errors', errors.length === 0, errors);
    check(
      'no external requests',
      requests.every(
        (u) =>
          u.startsWith('http://127.0.0.1:4173/') ||
          u.startsWith('data:') ||
          u.startsWith('blob:'),
      ),
      requests.filter((u) => !u.startsWith('http://127.0.0.1:4173/')),
    );
    return {
      checks,
      errors,
      warnings: [...new Set(warnings)],
      visibility: 'simulated, not native minimize',
    };
  } catch (error) {
    return {
      checks,
      error: String(error),
      cursor: await time(),
      hidden: await page.evaluate(() => document.hidden),
    };
  }
};
