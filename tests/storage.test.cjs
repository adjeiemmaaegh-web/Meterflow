/* Storage contract simulation. Not a substitute for genuine phone IndexedDB tests. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class FakeRequest{result=undefined;onsuccess=null;onerror=null;error=null;}
class StoreSet{constructor(db){this.db=db;}contains(n){return this.db.stores.has(n)}}
class FakeTx{
  constructor(db,names){this.db=db;this.names=names;this.pending=0;this.completed=false;this.oncomplete=null;this.onerror=null;this.onabort=null;}
  objectStore(n){if(!this.names.includes(n))throw Error(`Store not in transaction: ${n}`);return new FakeStore(this,n)}
  run(fn){const req=new FakeRequest();this.pending++;
    setTimeout(()=>{try{req.result=fn();req.onsuccess?.({target:req});}catch(e){req.error=e;req.onerror?.({target:req});this.onerror?.({target:this});}finally{this.pending--;if(this.pending===0)setTimeout(()=>{if(!this.pending&&!this.completed){this.completed=true;this.oncomplete?.();}},0)}},0);
    return req;
  }
}
class FakeStore{
  constructor(tx,name){this.tx=tx;this.name=name;this.items=tx.db.stores.get(name);}
  getAll(){return this.tx.run(()=>[...this.items.values()].map(x=>structuredClone(x)))}
  get(key){return this.tx.run(()=>structuredClone(this.items.get(key)))}
  put(val){return this.tx.run(()=>{this.items.set(val.id??val.key,structuredClone(val));return val.id??val.key;})}
  add(val){return this.tx.run(()=>{const key=val.id??(++this.tx.db.autoKey);this.items.set(key,structuredClone({...val,id:key}));return key;})}
  clear(){return this.tx.run(()=>{this.items.clear();return undefined;})}
  delete(key){return this.tx.run(()=>{this.items.delete(key);return undefined;})}
}
class FakeDb{
  constructor(){this.stores=new Map();this.objectStoreNames=new StoreSet(this);this.autoKey=0;}
  createObjectStore(name){this.stores.set(name,new Map());}
  transaction(names){return new FakeTx(this,names)}
  close(){}
}
const db=new FakeDb();
const idb={open:()=>{const req=new FakeRequest();setTimeout(()=>{req.result=db;req.onupgradeneeded?.();setTimeout(()=>req.onsuccess?.(),0)},0);return req;}};
const globals={console,indexedDB:idb,crypto,structuredClone,Blob,File,FileReader:class{readAsDataURL(blob){blob.arrayBuffer().then(buf=>{this.result=`data:${blob.type||'application/octet-stream'};base64,${Buffer.from(buf).toString('base64')}`;this.onload?.();}).catch(e=>this.onerror?.(e));}},fetch,Buffer,Date,Intl,Map,Set,Math,Number,String,Array,Promise,Error,window:{indexedDB:idb},setTimeout,clearTimeout};
const ctx=vm.createContext(globals);
vm.runInContext(fs.readFileSync('dist/engine.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('dist/storage.js','utf8'),ctx);
const pack=require('./fixture.cjs');
const seed=ctx.MeterEngine.validateDataset(pack);
(async()=>{
 const initial=await ctx.MeterStorage.snapshot();assert.equal(initial.apartments.length,0);
 const file=new File([JSON.stringify({kind:'note'})],'source-pack.json',{type:'application/json'});
 await ctx.MeterStorage.importDataset(seed,file);
 const imported=await ctx.MeterStorage.snapshot();
 assert.equal(imported.apartments.length,14);
 assert.equal(imported.overrides.length,0);
 assert.equal(imported.files.length,1);
 const a=seed.apartments.find(a=>a.id==='A:G01');
 const row={id:'A:G01|2026-10-26',apartmentId:'A:G01',date:'2026-10-26',value:2229,note:'Real inspection',updatedAt:new Date().toISOString()};
 await ctx.MeterStorage.saveCorrection(row,null);
 const corrected=await ctx.MeterStorage.snapshot();
 assert.equal(corrected.overrides.length,1);
 assert.equal(corrected.activities.filter(e=>e.kind==='correction').length,1);
 assert.equal(ctx.MeterEngine.predict(a,corrected.overrides,'2026-10-27').anchorReading,2229);
 const csv='block,apartment,date,reading\r\nA,G01,2026-10-27,2230\r\nB,101,2026-10-26,1111\r\n';
 const rows=ctx.MeterStorage.parseCSV(csv,seed.apartments);
 assert.equal(rows.length,2);
 await ctx.MeterStorage.saveMany(rows,new File([csv],'actuals.csv',{type:'text/csv'}));
 assert.equal((await ctx.MeterStorage.snapshot()).overrides.length,3);
 await ctx.MeterStorage.removeCorrection(row.apartmentId,row.date,row.value,null);
 assert.equal((await ctx.MeterStorage.snapshot()).overrides.length,2);
 await ctx.MeterStorage.addFile(new File(['sample'],'notes.txt',{type:'text/plain'}));
 let snap=await ctx.MeterStorage.snapshot();assert.equal(snap.files.length,3);
 await ctx.MeterStorage.deleteFile(snap.files[0].id,snap.files[0].name);
 assert.equal((await ctx.MeterStorage.snapshot()).files.length,2);
 const backup=await ctx.MeterStorage.makeBackup();
 const backupData=JSON.parse(await backup.text());
 assert.equal(backupData.kind,'meterflow-backup');
 assert.equal(backupData.files.length,2);
 await ctx.MeterStorage.restoreBackup(backupData);
 const restored=await ctx.MeterStorage.snapshot();
 assert.equal(restored.apartments.length,14);
 assert.equal(restored.overrides.length,2);
 assert.equal(restored.files.length,2);
 console.log('✓ Full backup/restore simulated with archived Blob files.');
 console.log('✓ IndexedDB store simulation: import, correction, reload, CSV, revert, archive, delete.');
 console.log('ALL STORAGE SIMULATION CHECKS PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
