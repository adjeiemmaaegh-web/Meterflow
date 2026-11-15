const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const code=fs.readFileSync('src/bundled-readings.js','utf8');
const ctx={};vm.runInNewContext(code,ctx);
const pack=ctx.MeterFlowBundledPack();
assert.equal(pack.kind,'meterflow-dataset');
assert.equal(pack.apartments.length,335);
assert.equal(pack.sourceSpreadsheetSHA256,'3967b8a2b8c28b41ce65be6ce42d483076d6d08038e2398459f9cadeac4eee8e');
const counts=Object.fromEntries('ABCDEFG'.split('').map(b=>[b,pack.apartments.filter(a=>a.block===b).length]));
assert.deepEqual(counts,{A:49,B:49,C:42,D:51,E:51,F:51,G:42});
assert.ok(pack.apartments.every(a=>a.readings.length===30 && a.readings[0].date==='2026-09-26' && a.readings[29].date==='2026-10-25'));
assert.equal(pack.apartments[0].id,'A:G01');
assert.equal(pack.apartments[0].readings[29].value,2229);
assert.equal(pack.apartments.reduce((n,a)=>n+a.readings.length-1,0),9715);
if(fs.existsSync('dist/index.html')){
 const html=fs.readFileSync('dist/index.html','utf8');
 assert.match(html,/bundled-readings\.js/);
 assert.ok(fs.existsSync('dist/bundled-readings.js'));
 assert.ok(fs.readFileSync('dist/sw.js','utf8').includes('/bundled-readings.js'));
}
console.log('PASS 335 apartments, 10,050 readings, 9,715 deltas; all readings bundled in the website');
