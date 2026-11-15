import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd(),out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(path.join(out,'vendor'),{recursive:true});
const copy=(a,b)=>fs.copyFileSync(path.join(root,a),path.join(out,b));
for(const x of ['engine.js','storage.js','app.js'])copy(`.build/${x}`,x);
for(const x of ['style.css','index.html'])copy(`src/${x}`,x);
copy('src/bundled-readings.js','bundled-readings.js');
const legacy=process.argv.includes('--legacy-preview');
if(legacy){
  for(const x of ['react.production.min.js','react-dom.production.min.js'])copy(`public/vendor/${x}`,`vendor/${x}`);
}else{
  let esbuild;
  try{({build:esbuild}=await import('esbuild'));}catch(e){throw Error('React 19 production build requires npm install; esbuild is unavailable in this environment.',{cause:e});}
  await esbuild({entryPoints:[path.join(root,'src/react19-bridge.mjs')],bundle:true,platform:'browser',format:'iife',target:'es2020',minify:true,legalComments:'none',outfile:path.join(out,'vendor/runtime.js')});
}
for(const x of ['icon-192.png','icon-512.png'])copy(`public/${x}`,x);
copy('public/manifest.webmanifest','manifest.webmanifest');
let html=fs.readFileSync(path.join(out,'index.html'),'utf8');
if(!legacy)html=html.replace(/<script src="\/vendor\/react.production.min.js" defer><\/script>\s*<script src="\/vendor\/react-dom.production.min.js" defer><\/script>/, '<script src="/vendor/runtime.js" defer></script>');
fs.writeFileSync(path.join(out,'index.html'),html);
// Historical readings are deliberately included in the public site at the owner's request.
// Private corrections and imported files must never enter the publish artifact.
const list=['/','/index.html','/style.css','/engine.js','/storage.js','/bundled-readings.js','/app.js',...(legacy?['/vendor/react.production.min.js','/vendor/react-dom.production.min.js']:['/vendor/runtime.js']),'/manifest.webmanifest','/icon-192.png','/icon-512.png'];
const names=list.filter(p=>p!=='/');
const hash=crypto.createHash('sha256');
for(const item of names) hash.update(fs.readFileSync(path.join(out,item.slice(1))));
const fingerprint=hash.digest('hex').slice(0,16);
const worker = `const CACHE='meterflow-shell-v2-${fingerprint}';
const FILES=${JSON.stringify(list)};
const ASSETS=new Set(FILES);
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('meterflow-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 if(r.mode==='navigate'){
   e.respondWith(fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('/index.html',copy))}return res}).catch(()=>caches.match('/index.html')));return;
 }
 if(!ASSETS.has(u.pathname))return;
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy))}return res})));
});`;
fs.writeFileSync(path.join(out,'sw.js'),worker);
const banned=[...fs.readdirSync(out)].filter(x=>/private|October2026|xlsx|_IMPORT/i.test(x));
if(banned.length)throw Error(`Private data accidentally included: ${banned.join(', ')}`);
const sourceStrings=names.filter(n=>/\.(js|html|css|webmanifest)$/.test(n)).map(n=>fs.readFileSync(path.join(out,n.slice(1)),'utf8')).join('\n');
if(!fs.readFileSync(path.join(out,'bundled-readings.js'),'utf8').includes('MeterFlowBundledPack'))throw Error('Built-in apartment history is missing.');
console.log(`Built ${legacy?'legacy preview':'React 19 production'} public PWA in dist/ (${fingerprint}); built-in historical readings included.`);
