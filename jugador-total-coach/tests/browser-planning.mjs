/* global indexedDB, document, innerWidth, structuredClone */
/** Fresh isolated browser context only. No personal profiles or clinical data. */
export async function verifyPlanningStorage(page, url = 'http://127.0.0.1:4175') {
  await page.route(url + '/planning-storage-check', (r) =>
    r.fulfill({ contentType: 'text/html', body: '<title>Synthetic planning check</title>' }),
  );
  await page.goto(url + '/planning-storage-check');
  return page.evaluate(async () => {
    const profile = {
      id: 'p-week-synthetic',
      alias: 'Prueba de agenda',
      kind: 'adult',
      foot: 'unknown',
      modalities: [],
      goals: [],
      createdAt: '2020-01-01T00:00:00Z',
    };
    await new Promise((resolve, reject) => {
      const r = indexedDB.open('fut360-training', 2);
      r.onupgradeneeded = () => {
        r.result.createObjectStore('sessions', { keyPath: 'record.id' });
        r.result.createObjectStore('meta');
        r.result.createObjectStore('participants', { keyPath: 'id' });
      };
      r.onerror = () => reject(r.error);
      r.onsuccess = () => {
        const db = r.result;
        const tx = db.transaction('participants', 'readwrite');
        tx.objectStore('participants').put(profile);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onabort = () => reject(tx.error);
      };
    });
    const {
      listParticipants,
      saveParticipant,
      participantBackup,
      parseParticipantBackup,
      restoreParticipant,
      removeParticipant,
    } = await import('/src/platform/participant-store.ts');
    const { emptyPlanningContext, emptyWeek } = await import('/src/platform/planning.ts');
    const { proposalSlot } = await import('/src/composition/session-eligibility.ts');
    const assert = (v, message) => {
      if (!v) throw new Error(message);
    };
    const rejects = async (work, message) => {
      let failed = false;
      try {
        await work();
      } catch {
        failed = true;
      }
      assert(failed, message);
    };
    assert(
      JSON.stringify((await listParticipants())[0]) === JSON.stringify(profile),
      'v2 profile changed during upgrade',
    );
    await rejects(
      () =>
        new Promise((resolve, reject) => {
          const r = indexedDB.open('fut360-training', 2);
          r.onerror = () => reject(r.error);
          r.onsuccess = () => {
            r.result.close();
            resolve();
          };
        }),
      'Old app can still overwrite new planning fields',
    );
    const context = { ...emptyPlanningContext(), participants: 1, places: ['home'] };
    const slots = emptyWeek();
    slots[1] = proposalSlot('control-30');
    const version = { version: 1, savedAt: profile.createdAt, context, slots };
    const next = { ...profile, planning: { context, weeks: [version] } };
    await saveParticipant(next, profile);
    await rejects(
      () => saveParticipant({ ...profile, alias: 'Obsoleto' }, profile),
      'Stale profile lost planning',
    );
    await rejects(
      () => saveParticipant({ ...next, planning: { context, weeks: [] } }, next),
      'Old version removed',
    );
    const changed = structuredClone(next);
    changed.planning.weeks[0].slots[1] = { kind: 'rest', minutes: 0 };
    await rejects(() => saveParticipant(changed, next), 'Past week rewritten');
    const another = { ...profile, id: 'p-another-week', alias: 'Otro perfil' };
    await saveParticipant(another);
    assert(
      !(await listParticipants()).find((p) => p.id === another.id).planning,
      'Week leaked to another person',
    );
    const backup = await participantBackup(profile.id);
    assert(
      backup.version === 2 && backup.participant.planning.weeks.length === 1,
      'Planning missing from backup',
    );
    assert(
      JSON.stringify(parseParticipantBackup(JSON.stringify(backup))) ===
        JSON.stringify(backup),
      'Backup round trip changed data',
    );
    await removeParticipant(profile.id);
    await restoreParticipant(backup);
    await restoreParticipant(backup);
    assert(
      JSON.stringify((await participantBackup(profile.id)).participant) ===
        JSON.stringify(backup.participant),
      'Restore lost planning',
    );
    assert(
      (await listParticipants()).some((p) => p.id === another.id),
      'Unrelated profile deleted',
    );
    return {
      v2Preserved: true,
      staleAppsBlocked: true,
      immutablePastWeeks: true,
      conflictsRejected: true,
      profileIsolation: true,
      backupV2RoundTrip: true,
      restoreIdempotent: true,
    };
  });
}

export async function verifyPlanningUI(page, url = 'http://127.0.0.1:4173/') {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await page.getByRole('button', { name: 'Crear perfil', exact: true }).click();
  await page.getByLabel('Alias', { exact: true }).fill('Agenda sintética');
  await page.getByRole('button', { name: 'Guardar perfil', exact: true }).click();
  await page
    .getByRole('heading', { name: 'La semana de Agenda sintética', exact: true })
    .waitFor();
  const adultId = await page
    .getByRole('combobox', { name: 'Perfil actual', exact: true })
    .inputValue();
  await page.getByText('Disponibilidad, compañía y lugares', { exact: true }).click();
  await page.getByLabel('Lunes · minutos disponibles', { exact: true }).fill('25');
  await page.getByLabel('Personas que participan, incluyéndote', { exact: true }).fill('1');
  await page.getByLabel('Casa · 2×2 libres', { exact: true }).check();
  await page.getByRole('button', { name: 'Guardar disponibilidad', exact: true }).click();
  await page
    .getByText('Disponibilidad guardada. No añade entrenamientos automáticamente.', {
      exact: true,
    })
    .waitFor();
  if (
    await page
      .getByRole('button', { name: 'Recorrer esta propuesta', exact: true })
      .isEnabled()
  )
    throw new Error('Multi-person attack still offered to solo profile');
  await page.getByRole('button', { name: /Control y combinaciones/ }).click();
  if (
    !(await page
      .getByRole('button', { name: 'Recorrer esta propuesta', exact: true })
      .isEnabled())
  )
    throw new Error('Compatible solo proposal blocked');
  await page.getByText('Organizar semana tipo', { exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Actividad del lunes', exact: true })
    .selectOption('control-30');
  await page
    .getByRole('combobox', { name: 'Actividad del miércoles', exact: true })
    .selectOption('external');
  await page
    .getByLabel('Descripción del miércoles', { exact: true })
    .fill('Actividad ficticia');
  await page.getByLabel('Minutos del miércoles', { exact: true }).fill('45');
  await page
    .getByRole('combobox', { name: 'Actividad del domingo', exact: true })
    .selectOption('rest');
  await page.getByText('Supera tu disponibilidad: Lunes.', { exact: false }).waitFor();
  // Saving context must not discard an unsaved week being edited.
  await page.getByRole('button', { name: 'Guardar disponibilidad', exact: true }).click();
  await page
    .getByText('Disponibilidad guardada. No añade entrenamientos automáticamente.', {
      exact: true,
    })
    .waitFor();
  if (
    (await page
      .getByRole('combobox', { name: 'Actividad del miércoles', exact: true })
      .inputValue()) !== 'external'
  )
    throw new Error('Saving context discarded draft week');
  await page
    .getByRole('button', { name: 'Guardar nueva versión de la semana', exact: true })
    .click();
  await page
    .getByText('Semana guardada · versión 1. Las anteriores se conservan.', { exact: true })
    .waitFor();
  await page
    .getByRole('combobox', { name: 'Actividad del lunes', exact: true })
    .selectOption('rest');
  await page
    .getByRole('button', { name: 'Guardar nueva versión de la semana', exact: true })
    .click();
  await page
    .getByText('Semana guardada · versión 2. Las anteriores se conservan.', { exact: true })
    .waitFor();
  await page.getByRole('button', { name: 'Editar perfil', exact: true }).click();
  await page.getByLabel('Alias', { exact: true }).fill('Agenda editada');
  await page.getByRole('button', { name: 'Guardar perfil', exact: true }).click();
  await page
    .getByRole('heading', { name: 'La semana de Agenda editada', exact: true })
    .waitFor();
  await page.reload();
  await page.getByText('Organizar semana tipo · versión 2', { exact: true }).click();
  if ((await page.getByLabel('Minutos del miércoles', { exact: true }).inputValue()) !== '45')
    throw new Error('External activity lost after alias edit/reload');
  await page.setViewportSize({ width: 390, height: 844 });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
    throw new Error('Week editor overflows phone width');
  await page.getByRole('button', { name: 'Crear perfil', exact: true }).click();
  await page.getByLabel('Alias', { exact: true }).fill('Agenda infantil sintética');
  await page
    .getByRole('combobox', { name: 'Tipo de perfil', exact: true })
    .selectOption('child');
  await page
    .getByLabel('Soy el adulto responsable que administra este perfil.', { exact: true })
    .check();
  await page.getByRole('button', { name: 'Guardar perfil', exact: true }).click();
  await page
    .getByRole('heading', { name: 'La semana de Agenda infantil sintética', exact: true })
    .waitFor();
  await page.getByText('Organizar semana tipo', { exact: true }).click();
  if (
    await page
      .getByRole('combobox', { name: 'Actividad del lunes', exact: true })
      .locator('option[value="control-30"]')
      .count()
  )
    throw new Error('Adult dose exposed to child');
  if (
    (await page
      .getByRole('combobox', { name: 'Actividad del miércoles', exact: true })
      .inputValue()) !== 'unassigned'
  )
    throw new Error('Adult week mixed with child');
  await page
    .getByRole('combobox', { name: 'Actividad del viernes', exact: true })
    .selectOption('external');
  await page
    .getByLabel('Descripción del viernes', { exact: true })
    .fill('Actividad externa de prueba');
  await page.getByLabel('Minutos del viernes', { exact: true }).fill('40');
  await page
    .getByRole('button', { name: 'Guardar nueva versión de la semana', exact: true })
    .click();
  await page
    .getByText('Semana guardada · versión 1. Las anteriores se conservan.', { exact: true })
    .waitFor();
  await page
    .getByRole('combobox', { name: 'Perfil actual', exact: true })
    .selectOption(adultId);
  await page.getByText('Organizar semana tipo · versión 2', { exact: true }).waitFor();
  if (errors.length) throw new Error(errors.join('; '));
  return {
    soloEligibility: true,
    versionsPreserved: true,
    contextSavePreservesDraft: true,
    aliasEditPreservesWeek: true,
    reloadPersists: true,
    childExternalOnly: true,
    isolatedWeeks: true,
    narrowOverflow: false,
    pageErrors: errors,
  };
}
