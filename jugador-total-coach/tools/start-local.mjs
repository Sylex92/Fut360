/* global fetch, AbortSignal, setTimeout */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, closeSync, readFileSync } from 'node:fs';
import { networkInterfaces } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const wait = (ms) => new Promise((done) => setTimeout(done, ms));

export function isPrivateIPv4(address) {
  if (typeof address !== 'string' || !/^\d{1,3}(\.\d{1,3}){3}$/.test(address)) return false;
  const [a, b, c, d] = address.split('.').map(Number);
  return (
    [a, b, c, d].every((n) => n <= 255) &&
    (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168))
  );
}

export function localAddresses(interfaces) {
  const choices = Object.entries(interfaces).flatMap(([name, items]) =>
    (items ?? [])
      .filter(
        (item) => item.family === 'IPv4' && !item.internal && isPrivateIPv4(item.address),
      )
      .map((item) => ({ name, address: item.address })),
  );
  // Prefer a physical Wi-Fi connection already requested for phone testing.
  const wifi = choices.filter((item) => /wi-?fi|wlan|wireless/i.test(item.name));
  const physical = choices.filter(
    (item) => !/vpn|vethernet|virtual|tailscale|docker|wsl/i.test(item.name),
  );
  const eligible = wifi.length ? wifi : physical;
  return [...new Set(eligible.map((item) => item.address))];
}

export async function probeFut360(base, expectedVersion) {
  let response;
  try {
    response = await fetch(base + '/manifest.webmanifest', {
      signal: AbortSignal.timeout(2500),
      redirect: 'error',
    });
  } catch (error) {
    if (error.cause?.code === 'ECONNREFUSED') return 'absent';
    return 'unreachable';
  }
  try {
    if (!response.ok) return 'other';
    const manifest = await response.json();
    if (manifest.name !== 'Fut360 · Jugador Total Coach' || manifest.id !== '/')
      return 'other';
    const release = await fetch(base + '/offline.json', {
      signal: AbortSignal.timeout(2500),
      redirect: 'error',
    });
    if (!release.ok || (await release.json()).version !== expectedVersion)
      return 'different-build';
    return 'ready';
  } catch {
    return 'other';
  }
}

export async function ensurePreview(host, port, version) {
  const url = `http://${host}:${port}`;
  const status = await probeFut360(url, version);
  if (status === 'ready') return { url, reused: true };
  if (status !== 'absent') {
    const reason =
      status === 'different-build'
        ? 'responde otra versión de Fut360'
        : 'no se pudo identificar un servidor Fut360 libre';
    throw new Error(`${url}: ${reason}. No se ha detenido ni reemplazado ningún proceso.`);
  }
  const logDir = resolve(root, '.cache/launcher');
  mkdirSync(logDir, { recursive: true });
  const out = openSync(resolve(logDir, `preview-${port}.stdout.log`), 'a');
  const err = openSync(resolve(logDir, `preview-${port}.stderr.log`), 'a');
  let startError;
  const child = spawn(
    process.execPath,
    [
      resolve(root, 'node_modules/vite/bin/vite.js'),
      'preview',
      '--config',
      resolve(root, 'apps/coach-pwa/vite.config.ts'),
      '--host',
      host,
      '--port',
      String(port),
      '--strictPort',
    ],
    { cwd: root, detached: true, windowsHide: true, stdio: ['ignore', out, err] },
  );
  child.once('error', (error) => {
    startError = error;
  });
  closeSync(out);
  closeSync(err);
  child.unref();
  for (let attempt = 0; attempt < 24; attempt++) {
    if (startError) throw startError;
    await wait(500);
    if ((await probeFut360(url, version)) === 'ready')
      return { url, reused: false, pid: child.pid };
    if (child.exitCode !== null) break;
  }
  if (child.exitCode === null) child.kill();
  throw new Error(
    `No arrancó ${url}. Revisa .cache/launcher/preview-${port}.stderr.log; no cambies el firewall para ocultar el error.`,
  );
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => !['--no-open', '--local-only', '--check'].includes(arg)))
    throw new Error('Opciones: --no-open, --local-only o --check.');
  const index = resolve(root, 'apps/coach-pwa/dist/index.html');
  const offline = resolve(root, 'apps/coach-pwa/dist/offline.json');
  if (!existsSync(index) || !existsSync(offline))
    throw new Error(
      'Falta el build. Ejecuta node tools/pnpm.mjs build dentro del proyecto. No se instalan dependencias automáticamente.',
    );
  const { version } = JSON.parse(readFileSync(offline, 'utf8'));
  if (!/^[a-f0-9]{20}$/.test(version)) throw new Error('Manifiesto de build inválido.');
  const hosts = [{ host: '127.0.0.1', port: 4173 }];
  if (!args.includes('--local-only')) {
    const addresses = localAddresses(networkInterfaces());
    if (addresses.length === 1) hosts.push({ host: addresses[0], port: 4174 });
    else
      console.log(
        'Acceso por Wi-Fi sin seleccionar: no hay una única dirección privada física. La computadora sigue disponible.',
      );
  }
  if (args.includes('--check')) {
    for (const { host, port } of hosts) {
      const url = `http://${host}:${port}`;
      const status = await probeFut360(url, version);
      console.log(`${url}/ · ${status}`);
      if (status !== 'ready') process.exitCode = 1;
    }
    return;
  }
  if (!existsSync(resolve(root, 'node_modules/vite/bin/vite.js')))
    throw new Error(
      'Faltan las dependencias locales ya preparadas. Consulta docs/setup/LOCAL_DEVELOPMENT.md.',
    );
  for (const { host, port } of hosts) {
    try {
      const result = await ensurePreview(host, port, version);
      console.log(
        `${host === '127.0.0.1' ? 'Computadora' : 'Teléfono / TV en la misma red'}: ${result.url}/ (${result.reused ? 'servidor existente' : 'servidor iniciado'}).`,
      );
    } catch (error) {
      if (host === '127.0.0.1') throw error;
      console.error('Acceso Wi-Fi pendiente: ' + error.message);
    }
  }
  console.log(
    'El servidor continúa mientras esta computadora esté encendida. No se modificó el arranque de Windows ni el firewall.',
  );
  if (!args.includes('--no-open') && process.platform === 'win32') {
    const opener = spawn(
      'powershell.exe',
      [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        "Start-Process -FilePath 'http://127.0.0.1:4173/'",
      ],
      { detached: true, windowsHide: true, stdio: 'ignore' },
    );
    opener.on('error', () => console.error('Abre http://127.0.0.1:4173/ en tu navegador.'));
    opener.unref();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error('Fut360: ' + error.message);
    process.exitCode = 1;
  });
}
