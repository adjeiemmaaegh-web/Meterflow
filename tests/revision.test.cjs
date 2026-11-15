// Model-based IndexedDB test for optimistic cross-tab revision guard.
// Genuine multi-tab IndexedDB behavior still requires a browser origin.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
class Req {result;onsuccess;onerror;onupgradeneeded;error;}
class Db {
 constructor(){this.stores=new Map();this.objectStoreNames={contains:n=>this.stores.has(n)};this.auto=0;}
 createObjectStore(n){this.stores.set(n,new Map())}
 transaction(ns){return new Tx(this,ns)}
 close(){}
}
class Tx {
 constructor(db,ns){this.db=db;this.ns=ns;this.pending=0;this.finished=false;this.aborted=false;this.oncomplete=null;this.onabort=null;this.onerror=null;}
 objectStore(name){if(!this.ns.includes(name))throw Error(`Unknown store ${name}`);return new Store(this,name)}
 abort(){if(this.aborted||this.finished)return;this.aborted=true;queueMicrotask(()=>this.onabort?.());}
 run(f){const r=new Req();this.pending++;setTimeout(()=>{try{if(!this.aborted){r.result=f();r.onsuccess?.();}}catch(e){r.error=e;r.onerror?.();this.onerror?.();}finally{this.pending--;if(this.pending===0&&!this.aborted)setTimeout(()=>{if(!this.pending&&!this.finished&&!this.aborted){this.finished=true;this.oncomplete?.();}},0)}},0);return r;}
}
class Store{
 constructor(tx,name){this.tx=tx;this.items=tx.db.stores.get(name)}
 get(id){return this.tx.run(()=>structuredClone(this.items.get(id)))}
 getAll(){return this.tx.run(()=>[...this.items.values()].map(x=>structuredClone(x)))}
 put(v){return this.tx.run(()=>{this.items.set(v.id??v.key,structuredClone(v));})}
 clear(){return this.tx.run(()=>{this.items.clear()})}
 add(v){return this.tx.run(()=>{const k=v.id??++this.tx.db.auto;this.items.set(k,structuredClone({...v,id:k}));})}
 delete(k){return this.tx.run(()=>{this.items.delete(k)})}
}
const db=new Db(),idb={open:()=>{const r=new Req();setTimeout(()=>{r.result=db;r.onupgradeneeded?.();setTimeout(()=>r.onsuccess?.(),0)},0);return r;}};
function instance(){
 const ctx=vm.createContext({console,indexedDB:idb,crypto,structuredClone,Blob,File,fetch,window:{indexedDB:idb},Date,Math,Map,Set,Number,String,Array,Promise,Error,Intl,setTimeout,clearTimeout,queueMicrotask});
 vm.runInContext(fs.readFileSync('dist/engine.js','utf8'),ctx);
 vm.runInContext(fs.readFileSync('dist/storage.js','utf8'),ctx);
 return ctx;
}
(async()=>{
 const first=instance(),second=instance();
 await Promise.all([first.MeterStorage.snapshot(),second.MeterStorage.snapshot()]);
 const pack=first.MeterEngine.validateDataset(require('./fixture.cjs'));
 await first.MeterStorage.importDataset(pack,new File(['{}'],'source.json',{type:'application/json'}));
 const row={id:'A:G01|2026-10-26',apartmentId:'A:G01',date:'2026-10-26',value:2230,note:'verified',updatedAt:new Date().toISOString()};
 await assert.rejects(second.MeterStorage.saveCorrection(row,null),/another tab/i);
 assert.equal((await first.MeterStorage.snapshot()).overrides.length,0,'Stale write must be fully rejected');
 await second.MeterStorage.snapshot();
 await second.MeterStorage.saveCorrection(row,null);
 await assert.rejects(first.MeterStorage.saveCorrection({...row,value:2231},null),/another tab/i);
 const result=await first.MeterStorage.snapshot();
 assert.equal(result.overrides.length,1);
 assert.equal(result.overrides[0].value,2230,'Newer correction must not be overwritten');
 assert.equal(db.stores.get('meta').get('revision').value,2);
 console.log('✓ Stale writes rejected across simulated tabs; latest reading preserved.');
})().catch(e=>{console.error(e);process.exitCode=1;});
