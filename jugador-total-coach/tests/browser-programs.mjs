/* global document, innerWidth, URL */
// Run only in an isolated context. All profiles and schedules here are synthetic.
export async function verifyProgramsUI(
  page,
  url = 'http://127.0.0.1:4173/?e2e=1',
  screenshotPath = null,
) {
  const errors = [];
  const external = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (!['127.0.0.1', 'localhost'].includes(new URL(r.url()).hostname))
      external.push(r.url());
  });
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  const button = (name) => page.getByRole('button', { name, exact: true });
  const combo = (name) => page.getByRole('combobox', { name, exact: true });
  await page.goto(url);
  await button('Crear perfil').click();
  await page.getByLabel('Alias', { exact: true }).fill('Programa adulto sintético');
  await button('Guardar perfil').click();
  await page.getByRole('heading', { name: 'Tu recorrido de desarrollo' }).waitFor();
  const adultId = await combo('Perfil actual').inputValue();
  await page.getByText('Disponibilidad, compañía y lugares', { exact: true }).click();
  for (const day of ['Lunes', 'Miércoles', 'Viernes'])
    await page.getByLabel(day + ' · minutos disponibles', { exact: true }).fill('50');
  await page.getByLabel('Personas que participan, incluyéndote', { exact: true }).fill('1');
  await page.getByLabel('Casa · 2×2 libres', { exact: true }).check();
  await page.getByLabel('Cancha', { exact: true }).check();
  await button('Guardar disponibilidad').click();
  await page
    .getByText('Disponibilidad guardada. No añade entrenamientos automáticamente.', {
      exact: true,
    })
    .waitFor();
  await page.getByText('Organizar semana tipo', { exact: true }).click();
  await button('Proponer inicio en los días libres').click();
  assert(
    (await combo('Actividad del lunes').inputValue()) === 'solo-control-20',
    'Wrong initial solo session',
  );
  assert(
    (await combo('Actividad del miércoles').inputValue()) === 'solo-strength-24',
    'Strength not separated',
  );
  assert(
    (await combo('Actividad del viernes').inputValue()) === 'solo-court-30',
    'Missing solo court proposal',
  );
  await button('Guardar nueva versión de la semana').click();
  await page
    .getByText('Semana guardada · versión 1. Las anteriores se conservan.', { exact: true })
    .waitFor();
  await button('Recorrer esta propuesta').click();
  await button('Comenzar recorrido').click();
  await button('Pausar todo').waitFor();
  await page
    .getByText('Termina el recorrido antes de cambiar de persona.', { exact: true })
    .waitFor();
  assert(await combo('Perfil actual').isDisabled(), 'Can switch profile mid-session');
  await button('+30 s para prepararme').click();
  assert(await button('Pausar todo').isVisible(), 'Extra preparation paused session');
  await button('Terminar recorrido').click();
  await button('Volver al plan').waitFor();
  await page.waitForFunction(() =>
    [...document.querySelectorAll('button')].some(
      (b) => b.textContent === 'Volver al plan' && !b.disabled,
    ),
  );
  await button('Volver al plan').click();
  await button('Crear perfil').click();
  await page.getByLabel('Alias', { exact: true }).fill('Programa infantil sintético');
  await combo('Tipo de perfil').selectOption('child');
  await page
    .getByLabel('Soy el adulto responsable que administra este perfil.', { exact: true })
    .check();
  await button('Guardar perfil').click();
  await page.getByRole('heading', { name: 'Su recorrido de aprendizaje' }).waitFor();
  const childId = await combo('Perfil actual').inputValue();
  await page.getByText('Disponibilidad, compañía y lugares', { exact: true }).click();
  await page.getByLabel('Lunes · minutos disponibles', { exact: true }).fill('120');
  await page.getByLabel('Personas que participan, incluyéndote', { exact: true }).fill('2');
  await page.getByLabel('Cancha', { exact: true }).check();
  await button('Guardar disponibilidad').click();
  await page
    .getByText('Disponibilidad guardada. No añade entrenamientos automáticamente.', {
      exact: true,
    })
    .waitFor();
  await page.getByText('Organizar semana tipo', { exact: true }).click();
  await combo('Actividad del jueves').selectOption('external');
  await page.getByLabel('Descripción del jueves', { exact: true }).fill('Club sintético');
  await page.getByLabel('Minutos del jueves', { exact: true }).fill('45');
  await combo('Actividad del domingo').selectOption('rest');
  await button('Proponer inicio en los días libres').click();
  assert(
    (await combo('Actividad del lunes').inputValue()) === 'youth-explore-15',
    'Missing child play',
  );
  assert((await combo('Actividad del jueves').inputValue()) === 'external', 'Lost club');
  assert(
    (await combo('Actividad del lunes').locator('option[value="solo-control-20"]').count()) ===
      0,
    'Adult agenda option shown to child',
  );
  await button('Guardar nueva versión de la semana').click();
  await page
    .getByText('Semana guardada · versión 1. Las anteriores se conservan.', { exact: true })
    .waitFor();
  await page.reload();
  await page.getByRole('heading', { name: 'Su recorrido de aprendizaje' }).waitFor();
  await button('Biblioteca de ejercicios').click();
  await page.getByText('13 fichas encontradas', { exact: true }).waitFor();
  await page.getByRole('button', { name: /Explorar puertas con el balón/ }).click();
  await page.getByRole('link', { name: 'Abrir FIFA · conducción por puertas' }).waitFor();
  assert(
    (await page.locator('iframe').count()) === 0,
    'External media loaded in child library',
  );
  assert(external.length === 0, 'Unsolicited external requests');
  await page.setViewportSize({ width: 390, height: 844 });
  assert(
    !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)),
    'Phone view overflow',
  );
  if (screenshotPath) await page.screenshot({ path: screenshotPath, fullPage: false });
  await button('Mi plan').click();
  await button('Recorrer esta propuesta').click();
  await button('Comenzar recorrido').click();
  await button('Pausar todo').waitFor();
  await button('Pausar todo').click();
  await page.reload();
  await button('Retomar recorrido guardado').click();
  await button('Recuperar en pausa').click();
  await button('Continuar').waitFor();
  await button('Continuar').click();
  await page.getByText('Recorrido finalizado', { exact: true }).waitFor({ timeout: 30000 });
  await page.waitForFunction(() =>
    [...document.querySelectorAll('button')].some(
      (b) => b.textContent === 'Volver al plan' && !b.disabled,
    ),
  );
  await button('Volver al plan').click();
  await button('Mi historial').click();
  await page
    .getByRole('heading', { name: 'Explorar, frenar y marcar · juego breve', exact: true })
    .waitFor();
  assert(
    !(await page.locator('body').innerText()).includes('Volver al balón · control cercano'),
    'Adult record leaked into child history',
  );
  await combo('Perfil actual').selectOption(adultId);
  await button('Mi historial').click();
  await page
    .getByRole('heading', { name: 'Volver al balón · control cercano', exact: true })
    .waitFor();
  assert(
    !(await page.locator('body').innerText()).includes('Explorar, frenar y marcar'),
    'Child record leaked into adult history',
  );
  await combo('Perfil actual').selectOption(childId);
  await button('Mi plan').click();
  assert(errors.length === 0, errors.join('; '));
  return {
    adultSoloWeek: true,
    childSupplement: true,
    preservesClubAndRest: true,
    reload: true,
    childRecovery: true,
    childCompletion: true,
    profileIsolation: true,
    extraPreparationAutomatic: true,
    mobileOverflow: false,
    externalRequests: external.length,
    pageErrors: errors,
  };
}
