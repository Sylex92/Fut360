/* global indexedDB, document, innerWidth, window, structuredClone, URL */
/** Use a fresh isolated Page against Vite dev; never run against personal data. */
export async function verifyParticipantStorage(page, url = 'http://127.0.0.1:4175') {
  await page.route(url + '/profile-storage-check', (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<title>Fut360 synthetic storage checks</title>',
    }),
  );
  await page.goto(url + '/profile-storage-check');
  return page.evaluate(async () => {
    const { prepareSession, shortTechnicalPlan } = await import('/src/composition/session.ts');
    const { IndexedTrainingStore } = await import('/src/platform/training-store.ts');
    const {
      saveParticipant,
      listParticipants,
      participantBackup,
      restoreParticipant,
      removeParticipant,
      assignLegacyHistory,
    } = await import('/src/platform/participant-store.ts');
    const check = (value, message) => {
      if (!value) throw new Error(message);
    };
    const rejects = async (work, message) => {
      let failed = false;
      try {
        await work();
      } catch {
        failed = true;
      }
      check(failed, message);
    };
    const date = '2020-01-01T00:00:00Z';
    function record(id, participantId, terminal = false) {
      const e = prepareSession(shortTechnicalPlan, id, () => 0).engine;
      for (const type of terminal ? ['Start', 'Abort'] : ['Start']) {
        const sent = e.send({
          sessionId: id,
          commandId: type,
          expectedControlRevision: e.project().controlRevision,
          action: { type },
        });
        check(sent.accepted, 'Fixture action rejected');
      }
      return {
        id,
        ...(participantId ? { participantId } : {}),
        startedAt: date,
        updatedAt: date,
        contentStamp: 'synthetic',
        journal: e.exportJournal(),
        test: true,
        feedback: null,
      };
    }
    const legacyRecord = record('legacy-original');
    await new Promise((resolve, reject) => {
      const request = indexedDB.open('fut360-training', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('sessions', { keyPath: 'record.id' });
        request.result.createObjectStore('meta');
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(['sessions', 'meta'], 'readwrite');
        tx.objectStore('sessions').put({
          record: legacyRecord,
          revision: 1,
          owner: 'old-window',
        });
        tx.objectStore('meta').put(legacyRecord.id, 'active');
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onabort = () => reject(tx.error);
      };
    });
    const legacy = new IndexedTrainingStore();
    check(
      JSON.stringify((await legacy.list())[0].record) === JSON.stringify(legacyRecord),
      'Upgrade altered v1 history',
    );
    const profile = (id, kind = 'adult') => ({
      id,
      alias: id,
      kind,
      foot: 'unknown',
      modalities: ['5'],
      goals: ['control'],
      createdAt: date,
    });
    const a = profile('p-synthetic-adult-a'),
      b = profile('p-synthetic-adult-b'),
      child = profile('p-synthetic-child', 'child');
    for (const p of [a, b, child]) await saveParticipant(p);
    const sa = new IndexedTrainingStore(a.id),
      sb = new IndexedTrainingStore(b.id),
      sc = new IndexedTrainingStore(child.id);
    const ra = record('adult-a-current', a.id),
      rb = record('adult-b-ended', b.id, true);
    await sa.save(ra, 'a-window', 0);
    await sb.save(rb, 'b-window', 0);
    check(
      (await sa.list()).length === 1 &&
        (await sb.list()).length === 1 &&
        (await sc.list()).length === 0,
      'Profile list mixed people',
    );
    await rejects(() => sb.save(ra, 'b-window', 0), 'Cross-profile save allowed');
    await rejects(() => sb.remove(ra.id), 'Cross-profile delete allowed');
    await rejects(() => sb.import([ra]), 'Cross-profile import allowed');
    await rejects(() => sa.save(ra, 'stale-window', 1), 'Other window took over silently');
    await rejects(() => sa.save(ra, 'a-window', 0), 'Stale revision accepted');
    await rejects(() => assignLegacyHistory(child.id), 'Legacy assigned to child');
    await rejects(() => assignLegacyHistory(a.id), 'Two pending sessions combined');
    check((await assignLegacyHistory(b.id)) === 1, 'Legacy assignment failed');
    const moved = (await sb.list()).find((r) => r.record.id === legacyRecord.id);
    check(
      (await legacy.list()).length === 0 &&
        JSON.stringify(moved.record.journal) === JSON.stringify(legacyRecord.journal),
      'Legacy events lost',
    );
    await rejects(
      () => legacy.save(legacyRecord, 'old-window', 1),
      'Stale legacy window overwrote assigned history',
    );
    await rejects(
      () => sb.save(record('another-pending', b.id), 'b-window', 0),
      'Assignment lost active pointer',
    );
    const copy = await participantBackup(b.id);
    const c = profile('p-synthetic-conflict');
    await rejects(
      () =>
        restoreParticipant({
          format: 'fut360-participant',
          version: 1,
          participant: c,
          records: [record('new-before-conflict', c.id, true), { ...rb, participantId: c.id }],
        }),
      'Conflicting backup restored',
    );
    check(
      !(await listParticipants()).some((p) => p.id === c.id),
      'Failed restore left a new profile',
    );
    await saveParticipant(c);
    check(
      (await new IndexedTrainingStore(c.id).list()).length === 0,
      'Failed restore left partial records',
    );
    await removeParticipant(b.id);
    await rejects(
      () => sb.save(record('stale-after-delete', b.id), 'b-window', 0),
      'Deleted profile resurrected',
    );
    check((await sa.list()).length === 1, 'Deleting B affected A');
    await restoreParticipant(copy);
    check((await sb.list()).length === 2, 'Backup restore lost history');
    await rejects(
      () => sb.save(record('conflict-after-restore', b.id), 'b-window', 0),
      'Restore lost pending session pointer',
    );
    await restoreParticipant(copy);
    check((await sb.list()).length === 2, 'Idempotent restore duplicated history');
    const badCopy = structuredClone(copy);
    badCopy.records[0].contentStamp = 'different';
    await rejects(() => restoreParticipant(badCopy), 'Backup replaced newer record');
    check(
      JSON.stringify(await participantBackup(b.id)) === JSON.stringify(copy),
      'Rejected restore changed data',
    );
    await rejects(
      () => saveParticipant({ ...a, kind: 'child' }, a),
      'Profile type changed with adult history',
    );
    return {
      upgradeV1Preserved: true,
      isolatedProfiles: 3,
      crossProfileWritesRejected: true,
      staleRevisionRejected: true,
      legacyAssignedExplicitly: true,
      legacyJournalUnchanged: true,
      childAssignmentRejected: true,
      atomicRestoreRollback: true,
      deleteScoped: true,
      deletedProfileWriteRejected: true,
      backupRoundtrip: true,
      pendingSessionPointersPreserved: true,
    };
  });
}

export async function verifyParticipantUI(page, url = 'http://127.0.0.1:4173/') {
  const errors = [],
    external = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (/youtube|googlevideo|ytimg/.test(new URL(r.url()).hostname)) external.push(r.url());
  });
  await page.goto(url + '?e2e=1&review=participant-ui');
  await page.getByRole('button', { name: 'Crear perfil', exact: true }).click();
  await page.getByRole('textbox', { name: 'Alias', exact: true }).fill('Prueba adulta');
  await page.getByRole('checkbox', { name: 'FUT 7', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Crear ocasiones y marcar', exact: true }).check();
  await page.getByRole('button', { name: 'Guardar perfil', exact: true }).click();
  await page.getByRole('button', { name: 'Editar perfil', exact: true }).waitFor();
  const adultId = await page
    .getByRole('combobox', { name: 'Perfil actual', exact: true })
    .inputValue();
  await page.getByRole('button', { name: 'Crear perfil', exact: true }).click();
  await page.getByRole('textbox', { name: 'Alias', exact: true }).fill('Prueba infantil');
  await page
    .getByRole('combobox', { name: 'Tipo de perfil', exact: true })
    .selectOption('child');
  await page
    .getByRole('combobox', { name: 'Pie preferido', exact: true })
    .selectOption('left');
  await page
    .getByRole('checkbox', {
      name: 'Soy el adulto responsable que administra este perfil.',
      exact: true,
    })
    .check();
  await page.getByRole('button', { name: 'Guardar perfil', exact: true }).click();
  await page
    .getByRole('heading', { name: 'El plan de Prueba infantil', exact: true })
    .waitFor();
  const childId = await page
    .getByRole('combobox', { name: 'Perfil actual', exact: true })
    .inputValue();
  if (
    await page
      .getByRole('button', { name: 'Biblioteca de ejercicios', exact: true })
      .isEnabled()
  )
    throw new Error('Adult library offered as youth plan');
  await page.getByRole('button', { name: 'Mi historial', exact: true }).click();
  await page
    .getByText('Aquí aparecerán tus sesiones cuando empieces.', { exact: true })
    .waitFor();
  await page
    .getByRole('combobox', { name: 'Perfil actual', exact: true })
    .selectOption(adultId);
  await page.getByRole('button', { name: /Control y combinaciones/ }).click();
  await page.getByRole('button', { name: 'Recorrer esta propuesta', exact: true }).click();
  await page.getByRole('button', { name: 'Comenzar recorrido', exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector('.participant-bar select')?.disabled,
  );
  if (await page.getByRole('combobox', { name: 'Perfil actual', exact: true }).isEnabled())
    throw new Error('Profile change allowed in active session');
  await page.getByRole('button', { name: '+30 s para prepararme', exact: true }).click();
  await page.getByRole('button', { name: 'Pausar todo', exact: true }).click();
  await page.getByText('Progreso guardado en este navegador.', { exact: false }).waitFor();
  page.once('dialog', (d) => d.accept());
  await page.reload();
  if (
    (await page.getByRole('combobox', { name: 'Perfil actual', exact: true }).inputValue()) !==
    adultId
  )
    throw new Error('Selection lost on reload');
  await page.getByRole('button', { name: 'Retomar recorrido guardado', exact: true }).click();
  await page.getByRole('button', { name: 'Recuperar en pausa', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar', exact: true }).waitFor();
  await page.evaluate(async () => {
    window.releaseProfileWrite = false;
    await new Promise((resolve, reject) => {
      const request = indexedDB.open('fut360-training');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(['sessions', 'meta', 'participants'], 'readwrite');
        tx.oncomplete = () => db.close();
        const hold = () => {
          const read = tx.objectStore('sessions').get('synthetic-lock');
          read.onsuccess = () => {
            if (!window.releaseProfileWrite) hold();
          };
        };
        hold();
        resolve();
      };
    });
  });
  await page.getByRole('button', { name: 'Terminar recorrido', exact: true }).click();
  await page.getByText('Recorrido finalizado', { exact: true }).waitFor();
  if (await page.getByRole('button', { name: 'Mi historial', exact: true }).isEnabled())
    throw new Error('Navigation allowed before final record was saved');
  await page.evaluate(() => {
    window.releaseProfileWrite = true;
  });
  await page.getByRole('button', { name: 'Mi historial', exact: true }).click();
  await page
    .getByText('Finalizada antes de tiempo · prueba acelerada', { exact: true })
    .waitFor();
  await page
    .getByRole('combobox', { name: 'Perfil actual', exact: true })
    .selectOption(childId);
  await page.getByRole('button', { name: 'Mi historial', exact: true }).click();
  await page
    .getByText('Aquí aparecerán tus sesiones cuando empieces.', { exact: true })
    .waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
    throw new Error('Narrow profile layout overflows');
  await page.getByRole('button', { name: 'Editar perfil', exact: true }).click();
  if (
    (await page.getByRole('combobox', { name: 'Pie preferido', exact: true }).inputValue()) !==
    'left'
  )
    throw new Error('Foot preference lost');
  await page.getByRole('button', { name: 'Cancelar edición', exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Perfil actual', exact: true })
    .selectOption(adultId);
  await page.getByRole('button', { name: 'Recorrer esta propuesta', exact: true }).click();
  await page.getByRole('button', { name: 'Comenzar recorrido', exact: true }).click();
  await page.getByRole('button', { name: 'Terminar recorrido', exact: true }).click();
  await page.getByText('Recorrido finalizado', { exact: true }).waitFor();
  await page.waitForFunction(
    () => !document.querySelector('.participant-bar select')?.disabled,
  );
  const entries = page.locator('.history-list > li');
  if ((await entries.count()) !== 2) throw new Error('Missing final record before deletion');
  // The history orders the newest record first; remove only that synthetic session.
  await entries
    .first()
    .getByRole('button', { name: 'Eliminar registro', exact: true })
    .click();
  await page.getByRole('button', { name: 'Confirmar eliminación', exact: true }).click();
  await page.getByText('Registro eliminado.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Mi historial', exact: true }).click();
  await page
    .getByText('Finalizada antes de tiempo · prueba acelerada', { exact: true })
    .waitFor();
  if ((await page.locator('.history-list > li').count()) !== 1)
    throw new Error('Deleting a final record recreated it');
  if (errors.length) throw new Error(errors.join('; '));
  if (external.length) throw new Error('Unexpected media provider request');
  return {
    createdAdultAndChild: true,
    childContentSeparated: true,
    adultHistoryHiddenFromChild: true,
    profilePreservedOnReload: true,
    recoveredPaused: true,
    selectionLockedWhileActive: true,
    waitsForFinalSaveBeforeNavigation: true,
    deletingFinalRecordKeepsNavigationAvailable: true,
    leftFootPreserved: true,
    narrowOverflow: false,
    providerRequests: external.length,
    pageErrors: errors,
  };
}
