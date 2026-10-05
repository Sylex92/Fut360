/* global indexedDB, document, innerWidth, URL */
// Isolated browser contexts; synthetic identities and dates only.
export async function verifyCalendarStorage(page, url = 'http://127.0.0.1:4175') {
  await page.route(url + '/calendar-check', (r) =>
    r.fulfill({ contentType: 'text/html', body: '<title>Calendar storage test</title>' }),
  );
  await page.goto(url + '/calendar-check');
  return page.evaluate(async () => {
    const p = {
      id: 'p-calendar-synthetic',
      alias: 'Calendario ficticio',
      kind: 'child',
      foot: 'unknown',
      modalities: [],
      goals: [],
      createdAt: '2020-01-01T00:00:00Z',
    };
    await new Promise((resolve, reject) => {
      const r = indexedDB.open('fut360-training', 3);
      r.onupgradeneeded = () => {
        r.result.createObjectStore('sessions', { keyPath: 'record.id' });
        r.result.createObjectStore('participants', { keyPath: 'id' });
        r.result.createObjectStore('meta');
      };
      r.onerror = () => reject(r.error);
      r.onsuccess = () => {
        const db = r.result;
        const tx = db.transaction('participants', 'readwrite');
        tx.objectStore('participants').put(p);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
      };
    });
    const s = await import('/src/platform/participant-store.ts');
    const { emptyPlanningContext, emptyWeek } = await import('/src/platform/planning.ts');
    const assert = (v, m) => {
      if (!v) throw new Error(m);
    };
    const rejects = async (work) => {
      let failed = false;
      try {
        await work();
      } catch {
        failed = true;
      }
      assert(failed, 'Expected rejection');
    };
    assert(
      JSON.stringify((await s.listParticipants())[0]) === JSON.stringify(p),
      'Migration changed profile',
    );
    await rejects(
      () =>
        new Promise((resolve, reject) => {
          const r = indexedDB.open('fut360-training', 3);
          r.onerror = () => reject(r.error);
          r.onsuccess = () => {
            r.result.close();
            resolve();
          };
        }),
    );
    const plan = {
      versions: [
        {
          version: 1,
          savedAt: p.createdAt,
          start: '2020-01-06',
          weeks: 8,
          stage: 'play',
          context: emptyPlanningContext(),
          slots: emptyWeek(),
          reason: 'Prueba sintética',
        },
      ],
      reports: [],
      observations: [],
    };
    const next = { ...p, personalPlan: plan };
    await s.saveParticipant(next, p);
    await rejects(() => s.saveParticipant({ ...p, alias: 'Stale' }, p));
    await rejects(() => s.saveParticipant(p, next));
    const amended = {
      ...next,
      personalPlan: {
        ...plan,
        reports: [
          {
            id: 'report-test',
            recordedAt: p.createdAt,
            date: '2020-01-07',
            planVersion: 1,
            outcome: 'partial',
            minutes: 5,
            notes: 'Sintético',
          },
        ],
      },
    };
    await s.saveParticipant(amended, next);
    const backup = await s.participantBackup(p.id);
    assert(backup.version === 3, 'Wrong backup version');
    assert(backup.participant.personalPlan.reports.length === 1, 'Report missing');
    await rejects(() => s.saveParticipant(next, amended));
    const other = { ...p, id: 'p-calendar-other' };
    await s.saveParticipant(other);
    assert(!(await s.participantBackup(other.id)).participant.personalPlan, 'Profile leaked');
    await s.removeParticipant(p.id);
    await s.restoreParticipant(backup);
    await s.restoreParticipant(backup);
    assert(
      JSON.stringify(await s.participantBackup(p.id)) === JSON.stringify(backup),
      'Restore changed plan',
    );
    return {
      v3Preserved: true,
      oldV3Blocked: true,
      cas: true,
      appendOnly: true,
      backupV3: true,
      restoreIdempotent: true,
      isolated: true,
    };
  });
}
export async function verifyCalendarUI(
  page,
  url = 'http://127.0.0.1:4173',
  screenshotPath = null,
) {
  const errors = [];
  const external = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (!r.url().startsWith(url)) external.push(r.url());
  });
  const offer = {
    format: 'fut360-plan-offer',
    kind: 'child',
    context: {
      availableMinutes: Array(7).fill(90),
      participants: 2,
      places: ['home', 'court'],
      facilities: [],
    },
    days: [
      { kind: 'rest' },
      { kind: 'external', label: 'Club ficticio', minutes: 45 },
      { kind: 'rest' },
      { kind: 'external', label: 'Práctica ficticia', minutes: 45 },
      { kind: 'rest' },
      { kind: 'session', sessionId: 'youth-explore-15' },
      { kind: 'rest' },
    ],
  };
  await page.goto(url + '/#plan=' + encodeURIComponent(JSON.stringify(offer)));
  await page.getByRole('button', { name: 'Crear perfil' }).click();
  await page.getByLabel('Alias', { exact: true }).fill('Infantil calendario prueba');
  await page.getByLabel('Tipo de perfil').selectOption('child');
  await page.getByLabel('Soy el adulto responsable que administra este perfil.').check();
  await page.getByRole('button', { name: 'Guardar perfil', exact: true }).click();
  await page.getByRole('button', { name: 'Cargar mi propuesta para revisar' }).click();
  await page.getByLabel('Lunes de inicio').fill('2020-01-06');
  await page.getByRole('button', { name: 'Guardar plan con fechas' }).click();
  await page
    .getByText('Plan guardado. Las versiones anteriores y los resultados se conservan.')
    .waitFor();
  if ((await page.locator('.dated-days li').count()) !== 7)
    throw new Error('No seven calendar days');
  await page.getByText('Disponibilidad, compañía y lugares', { exact: true }).click();
  if (
    (await page
      .getByLabel('Personas que participan, incluyéndote', { exact: true })
      .inputValue()) !== '2'
  )
    throw new Error('Reviewed context was not synchronized');
  if (new URL(page.url()).hash) throw new Error('Private offer was not removed after saving');
  await page
    .locator('.dated-days')
    .getByText('Explorar, frenar y marcar · juego breve · 15 min', { exact: true })
    .waitFor();
  await page.getByLabel('Semana visible').selectOption('1');
  await page
    .locator('.dated-days')
    .getByText('Recibir, pasar y ofrecerse · juego breve · 15 min', { exact: true })
    .waitFor();
  await page.getByText('Semana de revisión', { exact: true }).waitFor();
  await page.getByLabel('Fecha realizada').fill('2020-01-14');
  await page.getByLabel('Minutos realmente practicados').fill('8');
  await page.getByLabel('Notas del día', { exact: true }).fill('Resultado de prueba');
  await page.getByRole('button', { name: 'Guardar resultado del día' }).click();
  await page
    .getByText('Resultado guardado como declaración de práctica; no como medición automática.')
    .waitFor();
  await page.getByText('Observar avances por ejercicio', { exact: true }).click();
  await page.getByLabel('Fecha observada').fill('2020-01-14');
  await page
    .getByLabel('Condiciones y qué cuenta como acierto')
    .fill('Puerta ficticia de 2 m, pase desde 3 m');
  await page.getByLabel('Aciertos según la misma regla').fill('5');
  await page.getByRole('button', { name: 'Guardar observación', exact: true }).click();
  await page
    .getByText('Primera referencia en estas condiciones; todavía sin comparación entre días.')
    .waitFor();
  await page.getByLabel('Fecha observada').fill('2020-01-16');
  await page.getByLabel('Aciertos según la misma regla').fill('7');
  await page.getByRole('button', { name: 'Guardar observación', exact: true }).click();
  await page
    .getByText(
      '+20 puntos porcentuales frente a 2020-01-14, en las mismas condiciones declaradas.',
    )
    .waitFor();
  await page.reload();
  await page.getByLabel('Semana visible').selectOption('1');
  await page.getByText('REALIZADO · 8 min declarados').waitFor();
  await page.getByText('Observar avances por ejercicio', { exact: true }).click();
  await page
    .getByText(
      '+20 puntos porcentuales frente a 2020-01-14, en las mismas condiciones declaradas.',
    )
    .waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.dated-days').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  if (screenshotPath) await page.screenshot({ path: screenshotPath });
  if (errors.length || external.length || overflow)
    throw new Error(JSON.stringify({ errors, external, overflow }));
  return {
    offerReviewed: true,
    offerRemovedAfterSave: true,
    alternatingWeeks: true,
    datedWeek: true,
    reviewWeeks: true,
    reports: true,
    comparableObservations: true,
    reload: true,
    mobileOverflow: overflow,
    externalRequests: external.length,
    pageErrors: errors,
  };
}
