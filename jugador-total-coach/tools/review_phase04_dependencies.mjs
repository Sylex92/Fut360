// Compare the previously retrieved registry metadata with installed package notices.
// Reads project-local dependencies only; no network, install, or global configuration.
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (path) =>
  JSON.parse(readFileSync(resolve(root, path), 'utf8').replace(/^\uFEFF/, ''));
const metadata = readJson('.cache/phase04/dependency-metadata.json');
const runtime = new Set();
function visit(node) {
  for (const [name, item] of Object.entries(node.dependencies ?? {})) {
    runtime.add(name + '@' + item.version);
    visit(item);
  }
}
for (const project of readJson('.cache/phase04/runtime-dependencies.json')) visit(project);
const local = (path) => relative(root, path).replaceAll('\\', '/');
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const store = resolve(root, 'node_modules/.pnpm');
const entries = readdirSync(store);
const records = metadata.map((remote) => {
  const key = remote.name + '@' + remote.version;
  const prefix = remote.name.replaceAll('/', '+') + '@' + remote.version;
  const candidates = entries.filter(
    (name) => name === prefix || name.startsWith(prefix + '_'),
  );
  if (!candidates.length) throw new Error('Missing installed package: ' + key);
  const copies = candidates.map((directory) =>
    resolve(store, directory, 'node_modules', remote.name),
  );
  const path = copies[0];
  const pkg = JSON.parse(readFileSync(resolve(path, 'package.json'), 'utf8'));
  if (
    pkg.name !== remote.name ||
    pkg.version !== remote.version ||
    pkg.license !== remote.license
  )
    throw new Error('Metadata mismatch: ' + key);
  const installScripts = Object.keys(pkg.scripts ?? {}).filter((s) =>
    ['preinstall', 'install', 'postinstall'].includes(s),
  );
  if (installScripts.length) throw new Error('Unreviewed install script: ' + key);
  const licenses = readdirSync(path).filter((file) =>
    /^(license|licence|notice|copying)(\.|$)/i.test(file),
  );
  const files = licenses.map((file) => ({
    path: local(resolve(path, file)),
    sha256: sha(readFileSync(resolve(path, file))),
  }));
  let noticeSource = null;
  if (remote.name === '@react-three/fiber' && !files.length) {
    const noticePath = 'docs/licenses/react-three-fiber-9.8.1-MIT.txt';
    files.push({ path: noticePath, sha256: sha(readFileSync(resolve(root, noticePath))) });
    noticeSource =
      'https://raw.githubusercontent.com/pmndrs/react-three-fiber/53ec672ac4a7189711766b87ece18889abbb32d4/LICENSE';
  }
  return {
    name: pkg.name,
    version: pkg.version,
    license: pkg.license,
    scope: runtime.has(key) ? 'production-dependency-graph' : 'development',
    repository: remote.repository,
    integrity: remote.dist.integrity,
    noticeSource,
    installScripts,
    files,
    installedCopies: copies.length,
    evidence: noticeSource
      ? 'Official repository at npm gitHead; package omits LICENSE'
      : files.length
        ? 'Packaged license/notice files read and hashed'
        : 'Registry/package metadata; no top-level license file',
  };
});
const report = {
  reviewedAt: '2026-09-29',
  scope:
    '20 additions to phase02 inventory; metadata and notices, not source-code security review',
  packages: records,
};
writeFileSync(
  resolve(root, 'docs/reviews/phase04-dependencies.json'),
  JSON.stringify(report, null, 2) + '\n',
);
const noticesPath = resolve(root, 'apps/coach-pwa/public/THIRD_PARTY_NOTICES.txt');
const marker = '\n\n=== PHASE 04 ADDITIONS ===\n';
const base = readFileSync(noticesPath, 'utf8').split(marker)[0];
let notices = base + marker;
for (const record of records.filter((r) => r.scope === 'production-dependency-graph')) {
  if (!record.files.length) throw new Error('Missing runtime notice: ' + record.name);
  notices += '\n--- ' + record.name + ' ' + record.version + ' (' + record.license + ') ---\n';
  for (const file of record.files)
    notices += readFileSync(resolve(root, file.path), 'utf8') + '\n';
}
const assetLicense = resolve(root, 'assets/source/hip-hinge/QUATERNIUS_LICENSE.txt');
if (existsSync(assetLicense))
  notices +=
    '\n--- Quaternius · Universal Base Characters Standard · CC0-1.0 ---\n' +
    readFileSync(assetLicense, 'utf8');
// Keep original license files untouched; normalize trailing spaces in the assembled notice.
writeFileSync(noticesPath, notices.replace(/[\t ]+\r?$/gm, ''));
console.log(
  JSON.stringify({
    packages: records.length,
    runtimeGraph: records.filter((r) => r.scope === 'production-dependency-graph').length,
    missingLicenseFiles: records.filter((r) => !r.files.length).map((r) => r.name),
  }),
);
