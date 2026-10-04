export async function openTrainingDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let blocked = false;
    // Older apps must not rewrite a participant while dropping its new planning fields.
    const request = indexedDB.open('fut360-training', 3);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('sessions'))
        db.createObjectStore('sessions', { keyPath: 'record.id' });
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
      if (!db.objectStoreNames.contains('participants'))
        db.createObjectStore('participants', { keyPath: 'id' });
    };
    request.onerror = () => reject(new Error('No se pudo abrir el guardado local.'));
    request.onblocked = () => {
      blocked = true;
      reject(
        new Error(
          'Cierra las otras ventanas de Fut360 y recarga para actualizar el guardado.',
        ),
      );
    };
    request.onsuccess = () => {
      if (blocked) {
        request.result.close();
        return;
      }
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
  });
}

/** All requests in work must be queued synchronously or in IDB callbacks. */
export async function transact<T>(
  names: string[],
  mode: IDBTransactionMode,
  work: (
    tx: IDBTransaction,
    result: (value: T) => void,
    fail: (message: string) => void,
  ) => void,
): Promise<T> {
  const db = await openTrainingDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(names, mode);
    let value: T;
    let reason = 'No se pudo completar el guardado local.';
    const fail = (message: string) => {
      reason = message;
      tx.abort();
    };
    tx.oncomplete = () => {
      db.close();
      resolve(value);
    };
    tx.onabort = () => {
      db.close();
      reject(new Error(reason));
    };
    try {
      work(
        tx,
        (next) => {
          value = next;
        },
        fail,
      );
    } catch (error) {
      fail(error instanceof Error ? error.message : reason);
    }
  });
}
