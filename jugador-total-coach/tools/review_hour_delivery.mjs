import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { networkInterfaces } from 'node:os';
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const root = 'apps/coach-pwa/dist';
const files = [
  'index.html',
  ...readdirSync(root + '/assets')
    .filter((f) => /\.(js|css|glb)$/.test(f))
    .map((f) => 'assets/' + f),
];
const origins = process.argv.slice(2);
const localAddresses = Object.values(networkInterfaces())
  .flat()
  .filter(Boolean)
  .map((entry) => entry.address);
if (!origins.length) throw new Error('Indica los orígenes locales que se van a verificar.');
const deliveries = [];
for (const origin of origins) {
  const parsed = new globalThis.URL(origin);
  if (
    parsed.protocol !== 'http:' ||
    !localAddresses.includes(parsed.hostname) ||
    !['4173', '4174'].includes(parsed.port)
  )
    throw new Error('Origen fuera de la comprobación local autorizada.');
  const results = [];
  for (const file of files) {
    const response = await globalThis.fetch(
      origin + '/' + (file === 'index.html' ? '' : file),
      {
        signal: globalThis.AbortSignal.timeout(5000),
      },
    );
    const sha256 = hash(new Uint8Array(await response.arrayBuffer()));
    const matches = sha256 === hash(readFileSync(root + '/' + file));
    if (response.status !== 200 || !matches)
      throw new Error(origin + '/' + file + ': respuesta diferente del build');
    results.push({ file, status: response.status, sha256, matches });
  }
  deliveries.push({ origin, results });
}
writeFileSync(
  'docs/reviews/evidence/phase07/delivery.json',
  JSON.stringify({ checkedAt: new Date().toISOString(), deliveries }, null, 2) + '\n',
);
console.log(
  JSON.stringify(
    deliveries.map((d) => ({ origin: d.origin, files: d.results.length, allMatch: true })),
  ),
);
