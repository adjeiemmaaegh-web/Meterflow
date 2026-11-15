const assert=require('node:assert/strict');const fs=require('node:fs');const crypto=require('node:crypto');
const sw=fs.readFileSync('dist/sw.js','utf8');
const cache=/meterflow-shell-v2-([0-9a-f]{16})/.exec(sw);
assert.ok(cache,'SW must have a versioned content fingerprint');
assert.match(sw,/r\.mode==='navigate'/,'Navigation requests must have network-first handling');
assert.match(sw,/k\.startsWith\('meterflow-shell-'\)/,'Only MeterFlow caches must be deleted on upgrade');
assert.ok(!sw.includes('PRIVATE_IMPORT'),'Private data file must not be precached');
assert.ok(!sw.includes('*.json'),'SW must not cache arbitrary private imports');
const privatePath='../WaterMeter_October2026_PRIVATE_IMPORT.json';
if(fs.existsSync(privatePath)){
  const pack=fs.readFileSync(privatePath,'utf8');
  assert.ok(!sw.includes(pack.slice(60,130)),'Private dataset source must never be embedded in SW');
}
const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest','utf8'));
assert.equal(manifest.display,'standalone');
assert.ok(manifest.icons.some(i=>i.sizes==='192x192'));
console.log('✓ Fingerprinted offline-cache upgrade and privacy smoke check.');
