/* global window, document, setTimeout, clearTimeout */
// Controlled provider failure tests, never evidence of third-party playback.
export async function verifyAutomaticVideos(page, url = 'http://127.0.0.1:4173/?e2e=1') {
  await page.addInitScript(() => {
    window.__mediaPlayers = [];
    window.YT = {
      Player: class {
        constructor(node, options) {
          this.options = options;
          this.state = 5;
          this.time = 0;
          this.rate = 1;
          this.iframe = document.createElement('iframe');
          this.iframe.src = 'about:blank';
          node.replaceChildren(this.iframe);
          window.__mediaPlayers.push(this);
          setTimeout(() => {
            if (!this.dead) options.events.onReady({ target: this });
          }, 60);
        }
        emit(state) {
          if (!this.dead) {
            this.state = state;
            this.options.events.onStateChange({ data: state, target: this });
          }
        }
        cueVideoById(v) {
          this.value = v;
          this.time = v.startSeconds;
          this.emit(5);
        }
        loadVideoById(v) {
          this.value = v;
          this.time = v.startSeconds;
          this.emit(3);
          this.timer = setTimeout(() => this.emit(1), 700);
        }
        playVideo() {
          this.emit(1);
        }
        pauseVideo() {
          this.emit(2);
        }
        mute() {}
        getPlaybackRate() {
          return this.rate;
        }
        getAvailablePlaybackRates() {
          return [0.5, 1, 1.5];
        }
        setPlaybackRate(rate) {
          this.rate = rate;
          this.options.events.onPlaybackRateChange({ data: rate, target: this });
        }
        seekTo(t) {
          this.time = t;
        }
        getCurrentTime() {
          return this.time;
        }
        getPlayerState() {
          return this.state;
        }
        getIframe() {
          return this.iframe;
        }
        destroy() {
          this.dead = true;
          clearTimeout(this.timer);
          this.iframe.remove();
        }
      },
    };
  });
  await page.goto(url);
  await page.getByRole('button', { name: 'Crear perfil', exact: true }).click();
  await page.getByLabel('Alias', { exact: true }).fill('Video automático ficticio');
  await page.getByRole('button', { name: 'Guardar perfil', exact: true }).click();
  await page.getByRole('button', { name: 'Recorrer esta propuesta', exact: true }).click();
  await page
    .getByRole('button', { name: 'Activar demostraciones automáticas', exact: true })
    .click();
  await page.getByRole('button', { name: 'Comenzar recorrido', exact: true }).click();
  await page.waitForFunction(() => window.__mediaPlayers.some((p) => !p.dead));
  await page.getByText('Reproduciendo el fragmento.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Pausar todo', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).waitFor();
  const pausedClock = await page.locator('.guided-clock strong').innerText();
  await page
    .getByRole('combobox', { name: 'Velocidad del ejemplo', exact: true })
    .selectOption('0.5');
  if (
    !(await page.evaluate(() => window.__mediaPlayers.find((p) => !p.dead).rate === 0.5)) ||
    (await page.locator('.guided-clock strong').innerText()) !== pausedClock ||
    (await page.getByRole('button', { name: 'Pausar todo', exact: true }).count())
  )
    throw new Error('Changing example speed changed the session or failed');
  const playerPaused = await page.evaluate(
    () => window.__mediaPlayers.find((p) => !p.dead).state === 2,
  );
  if (!playerPaused) throw new Error('Manual pause did not pause video');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.getByRole('button', { name: 'Pausar todo', exact: true }).waitFor();
  await page.evaluate(() => window.__mediaPlayers.find((p) => !p.dead).emit(2));
  await page.getByRole('button', { name: 'Continuar', exact: true }).waitFor();
  if (await page.getByRole('button', { name: 'Continuar', exact: true }).isDisabled())
    throw new Error('A loaded but paused video blocked resume');
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page.evaluate(() => window.__mediaPlayers.find((p) => !p.dead).emit(3));
  await page.getByRole('button', { name: 'Mantener todo en pausa', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Mantener todo en pausa', exact: true }).click();
  await page.evaluate(() => window.__mediaPlayers.find((p) => !p.dead).emit(1));
  if (await page.getByRole('button', { name: 'Pausar todo', exact: true }).count())
    throw new Error('Manual pause was overridden by readiness');
  if (await page.getByRole('button', { name: 'Continuar', exact: true }).isDisabled())
    throw new Error('Ready video did not allow explicit resume after manual hold');
  await page
    .getByRole('button', { name: 'Desactivar videos automáticos', exact: true })
    .click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  await page
    .getByRole('button', { name: 'Activar demostraciones automáticas', exact: true })
    .click();
  await page.getByText('Reproduciendo el fragmento.', { exact: true }).waitFor();
  await page.evaluate(() => {
    const p = window.__mediaPlayers.find((p) => !p.dead);
    p.options.events.onError({ data: 100 });
  });
  await page.getByRole('button', { name: 'Continuar', exact: true }).waitFor();
  if (!(await page.getByRole('button', { name: 'Continuar', exact: true }).isDisabled()))
    throw new Error('Failed video did not block timer resume');
  return {
    oneActivation: true,
    loadingHold: true,
    manualPause: true,
    videoPausesWithClock: true,
    manualHoldNotOverridden: true,
    errorPaused: true,
    exampleSpeedIndependent: true,
    provider: 'simulated',
  };
}
