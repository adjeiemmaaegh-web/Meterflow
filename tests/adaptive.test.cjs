const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({console,Date,Intl,Map,Set,Math,Number,String,Array,Error});
vm.runInContext(fs.readFileSync('dist/engine.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/bundled-readings.js','utf8'),context);
const E=context.MeterEngine, pack=E.validateDataset(context.MeterFlowBundledPack());
assert.equal(pack.apartments.length,335);
let one={baseHits:0,newHits:0,n:0,oldErr:0,newErr:0};
let two={baseHits:0,newHits:0,n:0,oldErr:0,newErr:0};
let seven={baseHits:0,newHits:0,n:0,oldErr:0,newErr:0};
for(const a of pack.apartments){
  const rr=a.readings;
  for(let i=22;i<29;i++){
    const target=rr[i+1], source={...a,readings:rr.slice(0,i+1)};
    const hist=rr.slice(1,i+1).map((r,k)=>{
      const d=r.value-rr[k].value;return d>=0&&d<=5?d:null;
    });
    const past=rr[i].value;
    const prior=E.nextIncrement(hist).increment+past;
    const newer=E.predict(source,[],target.date).predicted;
    one.baseHits+=(prior===target.value);one.newHits+=(newer===target.value);one.n++;
    one.oldErr+=Math.abs(prior-target.value);one.newErr+=Math.abs(newer-target.value);
  }
  for(let i=21;i<28;i++){
    const source={...a,readings:rr.slice(0,i+1)},target=rr[i+2];
    const hist=rr.slice(1,i+1).map((r,k)=>{
      const d=r.value-rr[k].value;return d>=0&&d<=5?d:null;
    });
    const first=E.nextIncrement(hist).increment;
    const prior=rr[i].value+first+E.nextIncrement(hist.concat([first])).increment;
    const newer=E.predict(source,[],target.date).predicted;
    two.baseHits+=(prior===target.value);two.newHits+=(newer===target.value);two.n++;
    two.oldErr+=Math.abs(prior-target.value);two.newErr+=Math.abs(newer-target.value);
  }
  for(let i=15;i<=22;i++){
    const source={...a,readings:rr.slice(0,i+1)},target=rr[i+7];
    const hist=rr.slice(1,i+1).map((r,k)=>{
      const d=r.value-rr[k].value;return d>=0&&d<=5?d:null;
    });
    const valid=hist.filter(d=>d!==null);
    const prior=rr[i].value+Math.round(7*valid.reduce((s,d)=>s+d,0)/valid.length);
    const newer=E.predict(source,[],target.date).predicted;
    seven.baseHits+=(prior===target.value);seven.newHits+=(newer===target.value);seven.n++;
    seven.oldErr+=Math.abs(prior-target.value);seven.newErr+=Math.abs(newer-target.value);
  }
}
const percentage=m=>Math.round(10000*m/m.n)/100;
for(const [label,m] of [['one',one],['two',two],['seven',seven]]) {
  console.log(`${label}-day held-out historical windows: ${m.n}, baseline hits ${m.baseHits}, new hits ${m.newHits}, old MAE ${(m.oldErr/m.n).toFixed(4)}, new MAE ${(m.newErr/m.n).toFixed(4)}`);
  assert.ok(m.newHits>=m.baseHits,`${label}-day accuracy must not regress`);
  assert.ok(m.newErr<=m.oldErr,`${label}-day average absolute error must not regress`);
}
const d=pack.apartments.find(x=>x.id==='D:G01');assert.ok(d);
const p1=E.predict(d,[], '2026-10-26'),p2=E.predict(d,[],'2026-10-27'),p7=E.predict(d,[],'2026-11-01'),p20=E.predict(d,[],'2026-11-14');
assert.equal(p1.model,'Adaptive transitions');
assert.equal(p2.model,'Two-day distribution');
assert.equal(p7.model,'Robust observed trend');
assert.equal(p20.model,'Blended consumption rate');
assert.equal(p20.daysAhead,20);assert.equal(p20.confidence,'Caution');assert.equal(p20.likelihood,null);
const pmf=E.nextDayDistribution([0,1,1,0,1,1,0,1]);
assert.equal(pmf.length,6);assert.ok(Math.abs(pmf.reduce((a,b)=>a+b,0)-1)<1e-12);
assert.ok(pmf.every(x=>x>=0&&x<=1));
const readingsWithFuture={...d,readings:[...d.readings,{date:'2026-11-14',value:999999}]};
assert.equal(E.predict(readingsWithFuture,[],'2026-11-01').predicted,p7.predicted);
const ov=[{id:'D:G01|2026-11-13',apartmentId:'D:G01',date:'2026-11-13',value:1430,note:'verified',updatedAt:''}];
const reanchored=E.predict(d,ov,'2026-11-14');
assert.equal(reanchored.anchorReading,1430);assert.equal(reanchored.daysAhead,1);
console.log('PASS: 335 apartments, chronological backtests, probability mass, model selection, data isolation and correction reanchoring.');
