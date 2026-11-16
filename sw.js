const CACHE='meterflow-shell-v2-1039b310ef8c7d99';
const FILES=["/Meterflow/","/Meterflow/index.html","/Meterflow/style.css","/Meterflow/engine.js","/Meterflow/daily.js","/Meterflow/storage.js","/Meterflow/export.js","/Meterflow/bundled-readings.js","/Meterflow/app.js","/Meterflow/vendor/runtime.js","/Meterflow/manifest.webmanifest","/Meterflow/icon-192.png","/Meterflow/icon-512.png"];
const ASSETS=new Set(FILES);
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('meterflow-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 if(r.mode==='navigate'){
   e.respondWith(fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('/Meterflow/index.html',copy))}return res}).catch(()=>caches.match('/Meterflow/index.html')));return;
 }
 if(!ASSETS.has(u.pathname))return;
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy))}return res})));
});