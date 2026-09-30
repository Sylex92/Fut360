// Reproduce with the existing Playwright page; no dependency install required.
export default async (page) => {
  page.setDefaultTimeout(6000);
  await page.bringToFront();
  const root = page.locator('.movement-library'),
    checks = [];
  const ready = () =>
    page.waitForFunction(
      () => document.querySelector('.movement-library .button-primary')?.disabled === false,
      {},
      { timeout: 15000 },
    );
  const time = async () => Number(await root.locator('output').getAttribute('data-seconds'));
  const check = (name, passed, detail) => {
    checks.push({ name, passed, detail });
    if (!passed) throw Error(name);
  };
  try {
    const pattern = '**/mini-squat-v1-*.glb';
    await page.route(pattern, (r) => r.abort());
    await root.locator('select').first().selectOption('mini-squat');
    await root.getByRole('alert').waitFor();
    check(
      'failed load stops and disables',
      (await root.locator('.button-primary').isDisabled()) && (await time()) === 0,
      await root.getByRole('alert').innerText(),
    );
    await page.unroute(pattern);
    await root.getByRole('button', { name: 'Volver a cargar', exact: true }).click();
    await ready();
    check(
      'retry loads without autostart',
      (await time()) === 0 &&
        (await root
          .getByRole('button', { name: 'Reproducir ejemplo', exact: true })
          .isVisible()),
      await time(),
    );
    await root.getByRole('button', { name: 'Reproducir ejemplo', exact: true }).click();
    await page.waitForFunction(
      () =>
        Number(
          document.querySelector('.movement-library output')?.getAttribute('data-seconds'),
        ) > 0.3,
    );
    await root
      .locator('canvas')
      .evaluate((el) => el.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
    await root.getByRole('alert').waitFor();
    const lost = await time();
    await page.waitForTimeout(250);
    check(
      'context loss freezes and disables',
      (await time()) === lost && (await root.locator('.button-primary').isDisabled()),
      lost,
    );
    await root.getByRole('button', { name: 'Volver a cargar', exact: true }).click();
    await ready();
    await page.waitForTimeout(200);
    check(
      'context recovery remains paused',
      (await time()) === lost &&
        (await root
          .getByRole('button', { name: 'Reproducir ejemplo', exact: true })
          .isVisible()),
      await time(),
    );
    await root.locator('select').first().selectOption('glute-bridge');
    await ready();
    await page.setViewportSize({ width: 390, height: 844 });
    await root.scrollIntoViewIfNeeded();
    check(
      '390px no horizontal overflow',
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        width: innerWidth,
      })),
    );
    const sizes = await root
      .locator('button,select')
      .evaluateAll((es) =>
        es.map((e) => ({
          text: e.textContent.trim().slice(0, 45),
          height: e.getBoundingClientRect().height,
          width: e.getBoundingClientRect().width,
        })),
      );
    check(
      'buttons and selects at least 44px',
      sizes.every((s) => s.height >= 44),
      sizes,
    );
    await root.getByRole('button', { name: 'Lateral', exact: true }).focus();
    await page.keyboard.press('Space');
    check(
      'camera works by keyboard',
      (await root
        .getByRole('button', { name: 'Lateral', exact: true })
        .getAttribute('aria-pressed')) === 'true',
      await page.evaluate(() => document.activeElement.textContent),
    );
    await root.screenshot({
      path: 'C:/Users/mario.sabaleta/Documents/GitHub/Fut360/jugador-total-coach/docs/reviews/evidence/phase06/library-390.png',
      timeout: 15000,
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.bringToFront();
    const perf = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const deltas = [];
          let last, id;
          const frame = (t) => {
            if (last !== undefined) deltas.push(t - last);
            last = t;
            id = requestAnimationFrame(frame);
          };
          id = requestAnimationFrame(frame);
          setTimeout(() => {
            cancelAnimationFrame(id);
            const ordered = [...deltas].sort((a, b) => a - b);
            resolve({
              samples: deltas.length,
              medianMs: ordered[Math.floor(ordered.length / 2)],
              p95Ms: ordered[Math.floor(ordered.length * 0.95)],
            });
          }, 2000);
        }),
    );
    await root.screenshot({
      path: 'C:/Users/mario.sabaleta/Documents/GitHub/Fut360/jugador-total-coach/docs/reviews/evidence/phase06/library-desktop.png',
      timeout: 15000,
    });
    return {
      checks,
      performance: perf,
      faults:
        'Aborted GLB and synthetic webglcontextlost; expected console errors separate from normal run',
      mobile: 'desktop viewport only; Samsung physical pending',
    };
  } catch (error) {
    return { checks, error: String(error), cursor: await time() };
  }
};
