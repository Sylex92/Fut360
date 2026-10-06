import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));

// Local originals are acquired explicitly, never fetched by a build or committed to Git.
export function localMediaPlugin() {
  return {
    name: 'fut360-local-teaching-media',
    async configResolved(config) {
      const { assets } = JSON.parse(
        await readFile(resolve(root, 'assets/manifests/local-teaching-media.json'), 'utf8'),
      );
      for (const asset of assets) {
        if (!/^[a-z0-9-]+\/[a-z0-9-]+\.mp4$/.test(asset.file))
          throw new Error('Ruta multimedia inválida.');
        const source = resolve(root, 'assets/downloads', asset.file);
        let bytes;
        try {
          bytes = await readFile(source);
        } catch {
          throw new Error(
            `Falta el original local ${asset.originalFilename}. Consulta docs/reviews/local-human-video.md. La compilación no descarga medios.`,
          );
        }
        if (
          bytes.length !== asset.bytes ||
          createHash('sha256').update(bytes).digest('hex') !== asset.sha256.toLowerCase()
        )
          throw new Error(`El original ${asset.id} no coincide con el manifiesto auditado.`);
        const target = resolve(config.publicDir, 'media', asset.file);
        await mkdir(dirname(target), { recursive: true });
        await copyFile(source, target);
      }
    },
  };
}
