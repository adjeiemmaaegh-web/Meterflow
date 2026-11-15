const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({console,Date,Intl,Map,Set,Math,Number,String,Array,Error});
vm.runInContext(fs.readFileSync('dist/engine.js','utf8'),context);
const E=context.MeterEngine;
const pack=require('./fixture.cjs');
const dataset=E.validateDataset(pack);
let passes=0;function test(desc,fn){fn();passes++;console.log('✓',desc);}
test('seven synthetic blocks retain unique IDs',()=>{
 assert.equal(dataset.apartments.length,14);
 assert.deepEqual([...new Set(dataset.apartments.map(a=>a.block))].sort(),['A','B','C','D','E','F','G']);
});
test('30-day sequence has 29 consecutive differences',()=>{
 assert.ok(dataset.apartments.every(a=>a.readings.length===30));
 assert.equal(dataset.apartments.reduce((n,a)=>n+E.changes(a.readings).length,0),14*29);
});
test('one-day forecast anchored to yesterday',()=>{
 const a=dataset.apartments[0];const r=E.predict(a,[],'2026-10-26');
 assert.equal(r.anchorReading,a.readings.at(-1).value);assert.equal(r.daysAhead,1);
});
test('historical forecasts do not train on held-out date',()=>{
 const a=dataset.apartments[0],before=E.predict(a,[],'2026-10-10').predicted;
 const variant={...a,readings:a.readings.map(r=>r.date==='2026-10-10'?{...r,value:9999}:r)};
 assert.equal(E.predict(variant,[],'2026-10-10').predicted,before);
});
test('negative and high differences flagged and excluded from normal training',()=>{
 const a=structuredClone(dataset.apartments[0]);a.readings[20].value+=100;
 assert.ok(E.changes(a.readings).some(x=>x.flag));
 assert.ok(E.predict(a,[],'2026-10-26').eligible<29);
});
test('manual values overlay without modifying original readings',()=>{
 const a=dataset.apartments[0];const current=a.readings.at(-1).value;
 const o=[{id:`${a.id}|2026-10-25`,apartmentId:a.id,date:'2026-10-25',value:9000,note:'',updatedAt:''}];
 assert.equal(E.predict(a,o,'2026-10-26').anchorReading,9000);
 assert.equal(a.readings.at(-1).value,current);
});
test('multi-day forecasts do not expose one-day probability',()=>{
 const r=E.predict(dataset.apartments[0],[],'2026-11-21');
 assert.equal(r.likelihood,null);assert.equal(r.confidence,'Caution');
});
test('calendar and malformed date validation',()=>{
 assert.equal(E.validDate('2026-02-29'),false);
 assert.equal(E.validDate('2028-02-29'),true);
 assert.equal(E.gap('2026-10-25','2026-10-26'),1);
});
test('duplicate readings rejected',()=>{
 const corrupted=structuredClone(pack);
 corrupted.apartments[0].readings.push(corrupted.apartments[0].readings[0]);
 assert.throws(()=>E.validateDataset(corrupted));
});
test('pattern model never emits negative daily increase',()=>{
 for(const a of dataset.apartments){for(let d=1;d<=5;d++){
  const r=E.predict(a,[] ,E.nextDate('2026-10-25',d));
  assert.ok(r.predicted>=r.anchorReading);
 }}
});
console.log(`ALL ${passes}/${passes} GENERIC ENGINE TESTS PASS`);
