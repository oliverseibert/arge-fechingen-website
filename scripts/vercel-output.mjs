// Baut aus dist/ die Vercel Build Output API (.vercel/output): statische Dateien + SSR-Function
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative, sep } from 'node:path';

const dist = 'dist/arge-fechingen-website';
const out = '.vercel/output';
const browser = join(dist, 'browser');
const server = join(dist, 'server');

if (!existsSync(join(server, 'server.mjs'))) {
  throw new Error(`${server}/server.mjs fehlt – zuerst "npm run build" ausführen.`);
}

rmSync(out, { recursive: true, force: true });

// Statische Dateien inkl. vorgerenderter Seiten
const staticDir = join(out, 'static');
cpSync(browser, staticDir, { recursive: true });

// Vorgerenderte Seiten (…/index.html) unter ihrer sauberen URL ausliefern
const overrides = {};
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (entry === 'index.html') {
      const file = relative(staticDir, path).split(sep).join('/');
      const route = file === 'index.html' ? '' : file.slice(0, -'/index.html'.length);
      overrides[file] = { path: route, contentType: 'text/html; charset=utf-8' };
    }
  }
};
walk(staticDir);
// index.csr.html ist nur die Shell für clientseitige Routen; Ausgabe erfolgt über die Function
rmSync(join(staticDir, 'index.csr.html'), { force: true });

// SSR-Function mit dem Angular-Server
const fn = join(out, 'functions/ssr.func');
mkdirSync(fn, { recursive: true });
cpSync(server, join(fn, 'server'), { recursive: true });
writeFileSync(
  join(fn, 'index.mjs'),
  "export { reqHandler as default } from './server/server.mjs';\n",
);
writeFileSync(join(fn, 'package.json'), JSON.stringify({ type: 'module' }));
writeFileSync(
  join(fn, '.vc-config.json'),
  JSON.stringify(
    {
      runtime: 'nodejs22.x',
      handler: 'index.mjs',
      launcherType: 'Nodejs',
      shouldAddHelpers: false,
    },
    null,
    2,
  ),
);

writeFileSync(
  join(out, 'config.json'),
  JSON.stringify(
    {
      version: 3,
      overrides,
      routes: [
        // Gehashte Bundles und Assets lange cachen
        {
          src: '^/(?:[a-z]+-[A-Za-z0-9_-]{8}\\.(?:js|css|mjs)|media/.*)$',
          headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
          continue: true,
        },
        {
          src: '^/assets/(.*)$',
          headers: { 'Cache-Control': 'public, max-age=86400' },
          continue: true,
        },
        { handle: 'filesystem' },
        { src: '^/.*$', dest: '/ssr' },
      ],
    },
    null,
    2,
  ),
);

console.log(
  `[vercel-output] ${Object.keys(overrides).length} vorgerenderte Seiten, SSR-Function unter ${fn}`,
);
