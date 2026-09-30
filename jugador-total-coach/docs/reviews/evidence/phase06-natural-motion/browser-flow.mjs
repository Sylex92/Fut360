async (page) => {
  const folder = 'C:/Users/mario.sabaleta/Documents/GitHub/Fut360/jugador-total-coach/docs/reviews/evidence/phase06-natural-motion/';
  const results = [], errors = [], warnings = [], requests = [];
  const onError = error => errors.push(String(error));
  const onConsole = message => {
    if (message.type() === 'error') errors.push(message.text());
    if (message.type() === 'warning') warnings.push(message.text());
  };
  const onRequest = request => requests.push(request.url());
  const check = (name, condition, detail) => {
    results.push({ name, passed: !!condition, detail });
    if (!condition) throw new Error(name + ': ' + JSON.stringify(detail));
  };
  page.on('pageerror', onError); page.on('console', onConsole); page.on('request', onRequest);
  const previousViewport = page.viewportSize();
  try {
    await page.bringToFront();
    await page.reload();
    const panel = page.locator('.movement-library');
    const cursor = () => panel.getByTestId('movement-cursor').getAttribute('data-seconds').then(Number);
    const ready = () => panel.locator('.button-primary:enabled').waitFor();
    const select = async id => { await panel.locator('select').first().selectOption(id); await ready(); };
    const seek = async time => {
      await panel.locator('input[type=range]').evaluate((el, value) => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(value));
        el.dispatchEvent(new Event('input', {bubbles: true}));
      }, time);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    };
    await ready();
    check('La biblioteca abre la marcha corregida', await panel.locator('select').first().inputValue() === 'active-march');
    await panel.getByRole('button', {name: 'Reproducir ejemplo', exact: true}).click();
    await page.waitForTimeout(1000);
    await panel.getByRole('button', {name: 'Pausar ejemplo', exact: true}).click();
    const paused = await cursor();
    check('Reproducción avanza', paused > .6 && paused < 2, paused);
    const pixels = async () => (await panel.locator('canvas').screenshot()).toString('base64');
    const pose = await pixels();
    await page.waitForTimeout(300);
    check('Pausa conserva cursor y píxeles del avatar', paused === await cursor() && pose === await pixels(), {paused});
    await panel.getByRole('button', {name: 'Lateral', exact: true}).click();
    check('Cámara conserva el instante', paused === await cursor());
    await panel.getByRole('button', {name: 'Volver al inicio', exact: true}).click();
    await panel.locator('select').nth(1).selectOption('0.5');
    await panel.getByRole('button', {name: 'Reproducir ejemplo', exact: true}).click();
    await page.waitForTimeout(1000);
    await panel.getByRole('button', {name: 'Pausar ejemplo', exact: true}).click();
    const slow = await cursor();
    check('Media velocidad de observación', slow > .3 && slow < .85, slow);
    await panel.locator('select').nth(1).selectOption('1');
    await panel.getByRole('button', {name: 'Reproducir ejemplo', exact: true}).click();
    await select('inside-inside');
    check('Cambio de movimiento detiene y reinicia', await cursor() === 0 && await panel.getByRole('button',{name:'Reproducir ejemplo',exact:true}).isVisible());
    await panel.locator('select').nth(1).selectOption('2');
    await panel.getByRole('button', {name: 'Reproducir ejemplo', exact: true}).click();
    await page.waitForTimeout(1000);
    await panel.getByRole('button', {name: 'Pausar ejemplo', exact: true}).click();
    const fast = await cursor();
    check('Campanitas permite observar a 2×', fast > 1.3 && fast < 3, fast);
    for (const [id, duration] of [['active-march',8], ['mini-squat',5.2], ['soft-step-turn-left',7.2], ['soft-step-turn-right',7.2], ['inside-inside',6.5], ['lateral-sole-roll-left',6.5], ['lateral-sole-roll-right',6.5], ['inside-outside-left',6.5], ['inside-outside-right',6.5]]) {
      await select(id);
      await seek(duration - .2);
      await panel.getByRole('button', {name: 'Reproducir ejemplo', exact: true}).click();
      await panel.getByRole('button', {name: 'Ver de nuevo', exact: true}).waitFor({timeout: 4000});
      const atEnd = await cursor();
      await page.waitForTimeout(100);
      check('Final finito ' + id, atEnd === duration && await cursor() === duration, {duration, atEnd});
    }
    await select('active-march');
    await panel.locator('input[type=range]').focus();
    await panel.locator('input[type=range]').press('ArrowRight');
    check('Revisión por teclado', await cursor() === .05, await cursor());
    await page.setViewportSize({width: 390, height: 844});
    await seek(2.15);
    await panel.locator('.avatar-stage').scrollIntoViewIfNeeded();
    const size = await page.evaluate(() => ({body: document.documentElement.scrollWidth, viewport: innerWidth}));
    check('Ancho 390 sin desbordamiento horizontal', size.body <= size.viewport, size);
    await panel.screenshot({path: folder + 'library-390.png'});
    await page.setViewportSize(previousViewport ?? {width: 1280, height: 900});
    check('Sin errores de consola o página', errors.length === 0, errors);
    const external = requests.filter(url => !url.startsWith('http://127.0.0.1:4173/') && !url.startsWith('blob:') && !url.startsWith('data:'));
    check('Sin solicitudes externas en el recorrido', external.length === 0, external);
    const report = {checkedAt:'2026-09-30',method:'Independent Playwright browser, foreground, real WebGL; 390px is emulation, not Samsung hardware',results,errors,warnings:[...new Set(warnings)],requestedGlbs:[...new Set(requests.filter(url=>url.includes('.glb')))]};
    return report;
  } finally {
    page.off('pageerror', onError);page.off('console', onConsole);page.off('request', onRequest);
    if (previousViewport) await page.setViewportSize(previousViewport);
  }
}
