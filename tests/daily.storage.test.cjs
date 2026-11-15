/* Simulated IndexedDB atomic full-block storage regression (not physical-phone QA). */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class FakeRequest {result;onsuccess;onerror;onupgradeneeded;error;}
class DB {
 constructor(){this.stores=new Map();this.auto=0;this.objectStoreNames={contains:n=>this.stores.has(n)};}
 createObjectStore(n){this.stores.set(n,new Map());}close(){}
 transaction(names){return new TX(this,names);}
}
class TX {
 constructor(db,names){this.db=db;this.names=names;this.pending=0;this.completed=false;this.aborted=false;this.oncomplete=null;this.onerror=null;this.onabort=null;}
 objectStore(name){if(!this.names.includes(name))throw Error(`Store ${name} not in transaction`);return new STORE(this,name);}
 abort(){this.aborted=true;queueMicrotask(()=>this.onabort?.());}
 run(fn){let r=new FakeRequest();this.pending++;setTimeout(()=>{try{if(!this.aborted){r.result=fn();r.onsuccess?.();}}catch(e){r.error=e;r.onerror?.();this.onerror?.();}finally{this.pending--;if(!this.pending&&!this.aborted&&!this.completed){setTimeout(()=>{if(!this.pending&&!this.aborted&&!this.completed){this.completed=true;this.oncomplete?.();}},0);}}},0);return r;}
}
class STORE {
 constructor(tx,n){this.tx=tx;this.items=tx.db.stores.get(n)}
 get(x){return this.tx.run(()=>structuredClone(this.items.get(x)))}
 getAll(){return this.tx.run(()=>[...this.items.values()].map(x=>structuredClone(x)))}
 put(x){return this.tx.run(()=>{this.items.set(x.id??x.key,structuredClone(x));})}
 add(x){return this.tx.run(()=>{this.items.set(++this.tx.db.auto,structuredClone({...x,id:this.tx.db.auto}));})}
 clear(){return this.tx.run(()=>{this.items.clear()})}
 delete(x){return this.tx.run(()=>{this.items.delete(x)})}
}
const db=new DB(),idb={open:()=>{const r=new FakeRequest();setTimeout(()=>{r.result=db;r.onupgradeneeded?.();setTimeout(()=>r.onsuccess?.(),0);},0);return r;}};
const ctx=vm.createContext({console,indexedDB:idb,crypto,structuredClone,Blob,File,FileReader:class{readAsDataURL(blob){blob.arrayBuffer().then(buf=>{this.result='data:application/octet-stream;base64,'+Buffer.from(buf).toString('base64');this.onload?.()});}},fetch,Date,Intl,Map,Set,Math,Number,String,Array,Promise,Error,window:{indexedDB:idb},setTimeout,clearTimeout,queueMicrotask});
for(const m of ['engine','daily','storage'])vm.runInContext(fs.readFileSync(`dist/${m}.js`,'utf8'),ctx);
(async()=>{
 const app=ctx.MeterEngine.validateDataset(require('./fixture.cjs'));
 await ctx.MeterStorage.seedBundledIfEmpty(app);
 const date='2026-10-26',block='A';let rows=ctx.MeterDaily.buildRows(app.apartments,[],date,block);
 assert.equal(rows.length,2);assert.equal(rows[0].number,'G01');
 rows[0].value+=2;
 let draft=ctx.MeterDaily.makeSession(date,block,rows,undefined,'draft');
 await ctx.MeterStorage.saveBlockDraft(draft,app.apartments);
 let snap=await ctx.MeterStorage.snapshot();
 assert.equal(snap.sessions.length,1);assert.equal(snap.sessions[0].status,'draft');assert.equal(snap.overrides.length,0,'Draft must not change verified actuals');
 assert.equal(snap.sessions[0].rows[0].value,rows[0].value);
 let final=ctx.MeterDaily.makeSession(date,block,rows,snap.sessions[0],'confirmed');
 await ctx.MeterStorage.confirmBlock(final,app.apartments);
 snap=await ctx.MeterStorage.snapshot();
 assert.equal(snap.sessions[0].status,'confirmed');assert.equal(snap.overrides.length,2,'Whole block saved together');
 const g=app.apartments.find(x=>x.id==='A:G01');
 assert.equal(ctx.MeterEngine.predict(g,snap.overrides,'2026-10-27').anchorReading,rows[0].value,'Next-day forecast must use confirmed actual');
 let changed=ctx.MeterDaily.buildRows(app.apartments,snap.overrides,date,block,snap.sessions[0]);changed[0].value+=1;
 const amended=ctx.MeterDaily.makeSession(date,block,changed,snap.sessions[0],'draft');
 await ctx.MeterStorage.saveBlockDraft(amended,app.apartments);
 snap=await ctx.MeterStorage.snapshot();
 assert.equal(snap.sessions[0].status,'confirmed','Previous confirmation persists while amending a draft');
 assert.equal(snap.sessions[0].draftRows[0].value,changed[0].value);
 assert.equal(snap.overrides.find(x=>x.apartmentId==='A:G01').value,rows[0].value);
 const revised=ctx.MeterDaily.makeSession(date,block,changed,snap.sessions[0],'confirmed');
 await ctx.MeterStorage.confirmBlock(revised,app.apartments);
 snap=await ctx.MeterStorage.snapshot();
 assert.equal(snap.sessions[0].revision,4);assert.equal(snap.sessions[0].draftRows,undefined);
 assert.equal(snap.overrides.find(x=>x.apartmentId==='A:G01').value,changed[0].value);
 let backup=JSON.parse(await (await ctx.MeterStorage.makeBackup()).text());
 assert.equal(backup.schemaVersion,2);assert.equal(backup.sessions.length,1);
 await ctx.MeterStorage.restoreBackup(backup);
 snap=await ctx.MeterStorage.snapshot();assert.equal(snap.sessions.length,1);assert.equal(snap.sessions[0].rows[0].value,changed[0].value);
 console.log('✓ Full-block draft → confirm → reopen → amend → reconfirm → backup/restore storage simulation passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
