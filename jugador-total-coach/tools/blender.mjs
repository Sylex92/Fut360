// Run only project authoring scripts with the existing, audited portable Blender.
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = resolve(root, process.argv[2] ?? '');
const rel = relative(root, script);
if (!rel || rel.startsWith('..') || isAbsolute(rel) || !script.endsWith('.py'))
  throw new Error('El script Python debe estar dentro del proyecto.');
const executable = resolve(root, '.local/blender/blender-4.5.14-windows-x64/blender.exe');
if (!existsSync(executable) || !existsSync(script))
  throw new Error('Falta el Blender portable autorizado o el script solicitado.');
const local = (name) => resolve(root, '.cache', name);
for (const name of ['tmp', 'blender/user', 'phase06'])
  mkdirSync(local(name), { recursive: true });
const result = spawnSync(
  executable,
  [
    '--background',
    '--factory-startup',
    '--disable-autoexec',
    '--threads',
    '2',
    '--python-exit-code',
    '1',
    '--python',
    script,
    '--',
    ...process.argv.slice(3),
  ],
  {
    cwd: root,
    stdio: 'inherit',
    windowsHide: true,
    env: {
      ...process.env,
      BLENDER_USER_RESOURCES: local('blender/user'),
      TEMP: local('tmp'),
      TMP: local('tmp'),
      TMPDIR: local('tmp'),
      PYTHONDONTWRITEBYTECODE: '1',
    },
  },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
