// Built-in browser cache; no new production dependency or external assets.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
export function offlinePlugin() {
  let outDir;
  return {
    name: 'fut360-offline',
    apply: 'build',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir);
    },
    async closeBundle() {
      const files = [];
      async function walk(dir, prefix = '') {
        for (const item of await readdir(dir, { withFileTypes: true })) {
          const path = prefix + item.name;
          if (item.isDirectory()) await walk(join(dir, item.name), path + '/');
          else if (!path.endsWith('.map') && !['sw.js', 'offline.json'].includes(path))
            files.push(path);
        }
      }
      await walk(outDir);
      files.sort();
      const hash = createHash('sha256');
      let bytes = 0;
      for (const file of files) {
        const data = await readFile(join(outDir, file));
        hash.update(file).update(data);
        bytes += data.length;
      }
      const version = hash.digest('hex').slice(0, 20);
      const paths = files.map((f) => '/' + f);
      await writeFile(
        join(outDir, 'offline.json'),
        JSON.stringify({ version, files: paths.length, bytes }),
      );
      const source = `const CACHE='fut360-app-${version}';
const FILES=${JSON.stringify(paths)};
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);try{await cache.addAll(FILES);}catch(error){await caches.delete(CACHE);throw error;}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('fut360-app-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{
 if(event.data==='ACTIVATE_UPDATE')self.skipWaiting();
 if(event.data==='STATUS'||event.data==='ENSURE_OFFLINE')event.waitUntil((async()=>{
  try { const cache=await caches.open(CACHE);
   if(event.data==='ENSURE_OFFLINE')await cache.addAll(FILES);
   const ready=(await Promise.all(FILES.map(file=>cache.match(file)))).every(Boolean);
   event.ports[0]?.postMessage({ready,version:'${version}',files:FILES.length,bytes:${bytes}});
  }catch{event.ports[0]?.postMessage({ready:false});}
 })());
});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
if(event.request.mode==='navigate'){event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match('/index.html'))||fetch(event.request)));return;}
if(FILES.includes(url.pathname))event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(url.pathname))||fetch(event.request)));});
`;
      await writeFile(join(outDir, 'sw.js'), source);
    },
  };
}
