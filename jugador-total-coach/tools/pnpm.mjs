// Run the pinned local pnpm without changing machine-wide configuration.
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cli = resolve(root, '.tooling/node_modules/pnpm/bin/pnpm.mjs');
if (!existsSync(cli)) {
  process.stderr.write('Falta pnpm local. Sigue docs/setup/LOCAL_DEVELOPMENT.md.\n');
  process.exit(1);
}
const local = (path) => resolve(root, '.cache', path);
for (const path of ['tmp', 'pnpm/home', 'pnpm/config', 'pnpm/state', 'npm']) {
  mkdirSync(local(path), { recursive: true });
}
const result = spawnSync(
  process.execPath,
  [
    cli,
    '--config.store-dir=' + local('pnpm/store'),
    '--config.cache-dir=' + local('pnpm/cache'),
    '--config.state-dir=' + local('pnpm/state'),
    '--config.config-dir=' + local('pnpm/config'),
    '--config.global-dir=' + local('pnpm/global'),
    '--config.global-bin-dir=' + local('pnpm/bin'),
    '--config.manage-package-manager-versions=false',
    ...process.argv.slice(2),
  ],
  {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      PNPM_HOME: local('pnpm/home'),
      npm_config_cache: local('npm'),
      npm_config_userconfig: resolve(root, '.tooling/npmrc'),
      npm_config_globalconfig: resolve(root, '.tooling/npm-globalrc'),
      XDG_CACHE_HOME: local('xdg/cache'),
      XDG_STATE_HOME: local('xdg/state'),
      XDG_CONFIG_HOME: local('xdg/config'),
      TEMP: local('tmp'),
      TMP: local('tmp'),
      TMPDIR: local('tmp'),
      NO_UPDATE_NOTIFIER: '1',
    },
  },
);
if (result.error) process.stderr.write(result.error.message + '\n');
process.exit(result.status ?? 1);
