const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({console,Date,Intl,Map,Set,Math,Number,String,Array,Error});
vm.runInContext(fs.readFileSync('dist/engine.js','utf8'),context);
const E=context.MeterEngine;
const privatePath=process.env.METERFLOW_PRIVATE_PACK||'private_data/WaterMeter_October2026_PRIVATE_IMPORT.json';
if(!fs.existsSync(privatePath)){console.log('SKIP private-source integration: supply METERFLOW_PRIVATE_PACK to verify the 335-apartment source.');process.exit(0)}
const pack=JSON.parse(fs.readFileSync(privatePath,'utf8'));
const dataset=E.validateDataset(pack);
let passes=0;
function test(desc,fn){fn();passes++;console.log('✓',desc);}
test('all seven apartment blocks and 335 apartments are retained',()=>{
 assert.equal(dataset.apartments.length,335);
 assert.deepEqual([...new Set(dataset.apartments.map(a=>a.block))].sort(),['A','B','C','D','E','F','G']);
});
test('all apartment readings reconstruct original 30-day report',()=>{
 assert.ok(dataset.apartments.every(a=>a.readings.length===30));
 assert.equal(dataset.apartments.reduce((n,a)=>n+E.changes(a.readings).length,0),9715);
});
test('G01 Block A report baseline and history match',()=>{
 const a=dataset.apartments.find(a=>a.id==='A:G01');
 assert.ok(a.readings.at(-1).value>=0);
 assert.equal(a.readings[0].date,'2026-09-26');
 const r=E.predict(a,[],'2026-10-26');
 assert.ok(r);assert.equal(r.anchorReading,a.readings.at(-1).value);
 assert.ok(r.predicted>=r.anchorReading);
 assert.equal(r.daysAhead,1);
});
test('unusual decreases and spikes are retained and flagged',()=>{
 const d=dataset.apartments.find(a=>a.id==='C:G05');
 assert.equal(E.changes(d.readings).at(-1).delta,28);
 assert.ok(E.predict(d,[],'2026-10-26').warnings.length>=1);
});
test('selected historical date never trains on the selected-date actual',()=>{
 const a=dataset.apartments.find(a=>a.id==='A:G01');
 const on=E.predict(a,[],'2026-10-13');
 assert.equal(on.anchorDate,'2026-10-12');
 assert.equal(on.actual,a.readings.find(r=>r.date==='2026-10-13').value);
 const tampered={...a,readings:a.readings.map(r=>r.date==='2026-10-13'?{date:r.date,value:9999}:r)};
 assert.equal(E.predict(tampered,[],'2026-10-13').predicted,on.predicted);
});
test('manual override changes the next forecast anchor',()=>{
 const a=dataset.apartments.find(a=>a.id==='A:G01');
 const override=[{id:'A:G01|2026-10-25',apartmentId:'A:G01',date:'2026-10-25',value:5000,note:'verified',updatedAt:'2026-11-15T10:00:00Z'}];
 const r=E.predict(a,override,'2026-10-26');
 assert.equal(r.anchorReading,5000);assert.ok(r.predicted>=5000);
 assert.equal(E.getReadings(a,override).at(-1).value,5000);
 assert.ok(a.readings.at(-1).value>=0);
});
test('forecasting known date displays actual separately from estimate',()=>{
 const r=E.predict(dataset.apartments[0],[],'2026-10-20');
 assert.ok(r.actual!==null);assert.equal(r.targetDate,'2026-10-20');
 assert.ok(r.predicted>0);
});
test('future date confidence does not pretend single-day hit probability',()=>{
 const r=E.predict(dataset.apartments[0],[],'2026-11-20');
 assert.ok(r);assert.equal(r.likelihood,null);assert.equal(r.confidence,'Caution');
});
test('invalid dates and duplicated readings are rejected',()=>{
 assert.equal(E.validDate('2026-02-29'),false);
 const duplicated=JSON.parse(JSON.stringify(pack));
 duplicated.apartments[0].readings.push({...duplicated.apartments[0].readings[0]});
 assert.throws(()=>E.validateDataset(duplicated));
});
test('retrospective backtest matches independently calculated Python result',()=>{
 let n=0,h=0;
 for(const a of dataset.apartments){
  const ds=E.changes(a.readings).map(x=>x.flag?null:x.delta);
  const t=E.historicalBacktest(ds); n+=t.trials;h+=t.hits;
 }
 assert.equal(n,5020);assert.equal(h,3721);
});
console.log(`ALL ${passes} / ${passes} ENGINE TESTS PASS`);
