import { useEffect, useState } from 'react';
function confirmCache(worker: ServiceWorker, repair = false): Promise<boolean> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const finish = (ready: boolean) => {
      clearTimeout(timer);
      channel.port1.close();
      resolve(ready);
    };
    const timer = setTimeout(() => finish(false), repair ? 30000 : 5000);
    channel.port1.onmessage = (event: MessageEvent<{ ready?: boolean }>) =>
      finish(event.data?.ready === true);
    worker.postMessage(repair ? 'ENSURE_OFFLINE' : 'STATUS', [channel.port2]);
  });
}
export function OfflinePanel({ active }: { active: boolean }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [downloadBytes, setDownloadBytes] = useState<number | null>(null);
  const supported =
    typeof window !== 'undefined' && window.isSecureContext && 'serviceWorker' in navigator;
  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    void fetch('/offline.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { bytes?: unknown } | null) => {
        if (
          !cancelled &&
          typeof data?.bytes === 'number' &&
          Number.isFinite(data.bytes) &&
          data.bytes > 0
        )
          setDownloadBytes(data.bytes);
      })
      .catch(() => {
        /* The optional size preview does not block caching. */
      });
    void navigator.serviceWorker.getRegistration().then(async (r) => {
      if (r?.active)
        setMessage(
          (await confirmCache(r.active))
            ? 'Copia sin conexión disponible en este navegador.'
            : 'Prepara de nuevo la copia para comprobar todos los movimientos.',
        );
      if (r?.waiting) setWaiting(r.waiting);
    });
    return () => {
      cancelled = true;
    };
  }, [supported]);
  async function prepare() {
    if (!supported) return;
    setBusy(true);
    setMessage('Guardando aplicación y movimientos. Mantén esta página abierta…');
    try {
      const r = await navigator.serviceWorker.register('/sw.js');
      if (r.active) await r.update();
      if (r.waiting) {
        setWaiting(r.waiting);
        setMessage('Hay una actualización lista. Puedes aplicarla al terminar la sesión.');
        return;
      }
      const worker = r.installing;
      if (worker)
        await new Promise<void>((resolve, reject) => {
          const check = () => {
            if (worker.state === 'activated' || (worker.state === 'installed' && r.active))
              resolve();
            else if (worker.state === 'redundant')
              reject(
                new Error(
                  'No se guardaron todos los recursos. Revisa la conexión y el espacio libre.',
                ),
              );
          };
          worker.addEventListener('statechange', check);
          check();
        });
      if (r.waiting) {
        setWaiting(r.waiting);
        setMessage('Hay una actualización lista. Puedes aplicarla al terminar la sesión.');
        return;
      }
      if (!r.active || !(await confirmCache(r.active, true)))
        throw new Error(
          'No se guardaron todos los recursos. Revisa la conexión y el espacio libre.',
        );
      setMessage('Aplicación y movimientos guardados para abrir sin conexión.');
    } catch {
      setMessage(
        'No se pudo completar la copia. Revisa la conexión y el espacio libre, y vuelve a intentarlo.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="offline-panel" aria-label="Uso sin conexión">
      <div>
        <strong>Llévate tus movimientos</strong>
        <p>
          {supported
            ? 'Guarda una copia en este navegador para abrir Fut360 sin conexión.'
            : 'Esta dirección de red permite probar la app. La instalación y el modo sin conexión requieren HTTPS o localhost.'}
        </p>
        {downloadBytes !== null && (
          <p>
            La copia incluye los videos locales: aproximadamente{' '}
            {Math.ceil(downloadBytes / 1048576)} MB. Los videos de YouTube necesitan Internet.
          </p>
        )}
      </div>
      {supported && (
        <button disabled={busy || active} onClick={() => void prepare()}>
          {busy ? 'Preparando…' : 'Preparar uso sin conexión'}
        </button>
      )}
      {waiting && (
        <button
          disabled={active}
          onClick={() => {
            navigator.serviceWorker.addEventListener(
              'controllerchange',
              () => window.location.reload(),
              { once: true },
            );
            waiting.postMessage('ACTIVATE_UPDATE');
          }}
        >
          Aplicar actualización
        </button>
      )}
      <p role="status">{message}</p>
      <details>
        <summary>Instalar y conservar la copia</summary>
        <p>
          En un origen seguro, usa el menú de Chrome → Instalar aplicación cuando esté
          disponible. En el teléfono, una dirección de la red local que empieza por http:// no
          permite esta instalación. Borrar los datos del sitio elimina la copia y el historial.
        </p>
      </details>
    </section>
  );
}
