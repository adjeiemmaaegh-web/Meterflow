import fs from 'node:fs';
import path from 'node:path';

// GitHub Pages hosts project sites beneath /<repository>/ rather than /.
const base = process.env.METERFLOW_PAGES_BASE || '/Meterflow/';
if (!/^\/[A-Za-z0-9._-]+\/$/.test(base)) throw Error(`Invalid GitHub Pages base path: ${base}`);
const out = path.resolve('dist');
const read = name => fs.readFileSync(path.join(out, name), 'utf8');
const write = (name, contents) => fs.writeFileSync(path.join(out, name), contents);

let html = read('index.html');
html = html.replace(/(href|src)="\/(?!\/)/g, `$1="${base}`);
if (!html.includes(`src="${base}app.js"`)) throw Error('Could not rewrite the app script URL');
write('index.html', html);

const manifest = JSON.parse(read('manifest.webmanifest'));
manifest.id = base;
manifest.start_url = base;
manifest.scope = base;
for (const icon of manifest.icons) icon.src = `${base}${icon.src.replace(/^\//, '')}`;
write('manifest.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`);

let app = read('app.js');
const originalWorker = /navigator\.serviceWorker\.register\(['"]\/sw\.js['"]\)/g;
if (!originalWorker.test(app)) throw Error('Service worker registration path did not match expected source');
app = app.replace(originalWorker, `navigator.serviceWorker.register('${base}sw.js')`);
write('app.js', app);

let sw = read('sw.js');
const precache = /const FILES=(\[[^;]+\]);/;
const found = precache.exec(sw);
if (!found) throw Error('Service worker asset list not found');
const files = JSON.parse(found[1]);
if (!Array.isArray(files) || files.length < 9 || files[0] !== '/') throw Error('Unexpected service worker asset list');
const scoped = files.map(url => `${base}${url.slice(1)}`);
sw = sw.replace(precache, `const FILES=${JSON.stringify(scoped)};`);
sw = sw.replaceAll("'/index.html'", `'${base}index.html'`);
if (!sw.includes(`c.put('${base}index.html'`)) throw Error('Service worker offline path was not changed');
write('sw.js', sw);

// Guard against accidentally deploying private readings through the Pages artifact.
for (const file of fs.readdirSync(out)) {
  if (file==='bundled-readings.js') continue; // Required owner-provided reference readings\n  if (/private|watermeter|_IMPORT|\.xlsx$/i.test(file)) throw Error(`Unsafe Pages artifact file: ${file}`);
}
console.log(`Prepared GitHub Pages site with base ${base} and ${scoped.length} offline assets.`);
