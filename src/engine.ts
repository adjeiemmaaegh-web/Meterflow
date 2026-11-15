/** Deterministic meter forecasting. Never trains on a selected date or a future reading. */
namespace MeterEngine {
  export const MIN_DATE='2026-09-26';
  export function validDate(s:string):boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const d=new Date(s+'T00:00:00Z');
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10)===s;
  }
  export function dayNumber(s:string):number { return Math.round(Date.parse(s+'T00:00:00Z')/86400000); }
  export function nextDate(s:string,days=1):string { return new Date((dayNumber(s)+days)*86400000).toISOString().slice(0,10); }
  export function gap(a:string,b:string):number { return dayNumber(b)-dayNumber(a); }
  export function formatDate(s:string,opts?:Intl.DateTimeFormatOptions):string {
    if(!validDate(s)) return s;
    return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC',...opts}).format(new Date(s+'T12:00:00Z'));
  }
  export function getReadings(a:Apartment,ov:Override[]):Reading[] {
    const m=new Map(a.readings.map(r=>[r.date,r.value]));
    for (const r of ov) if(r.apartmentId===a.id) m.set(r.date,r.value);
    return [...m].map(([date,value])=>({date,value})).sort((x,y)=>x.date.localeCompare(y.date));
  }
  export function changes(readings:Reading[], endDate?:string):{date:string;delta:number;flag:boolean}[] {
    const subset=endDate?readings.filter(r=>r.date<=endDate):readings;
    const out:{date:string;delta:number;flag:boolean}[]=[];
    for(let i=1;i<subset.length;i++){
      const prev=subset[i-1],curr=subset[i];
      if(gap(prev.date,curr.date)!==1)continue;
      const delta=curr.value-prev.value;
      out.push({date:curr.date,delta,flag:delta<0||delta>5});
    }
    return out;
  }
  function chooseMode(ds:number[]):number {
    if(!ds.length)return 0;
    const freq=new Map<number,number>();
    ds.forEach(d=>freq.set(d,(freq.get(d)||0)+1));
    const sorted=[...freq].sort((a,b)=>b[1]-a[1]||a[0]-b[0]);
    return sorted[0][0];
  }
  export function nextIncrement(history:(number|null)[]):{increment:number;model:ForecastResult['model']} {
    const usable=history.filter((v):v is number=>v!==null&&v>=0&&v<=5);
    const fallback=chooseMode(usable);
    if(!usable.length)return {increment:0,model:'Frequent change'};
    const last=history[history.length-1];
    const penult=history.length>1?history[history.length-2]:null;
    if (penult!==null && penult!==undefined && last!==null && last!==undefined) {
      const matching:number[]=[];
      for(let i=0;i<history.length-2;i++) {
        const v=history[i+2];
        if(history[i]===penult && history[i+1]===last && v!==null && v>=0 && v<=5) matching.push(v);
      }
      if(matching.length>=3)return {increment:chooseMode(matching),model:'Two-step pattern'};
    }
    if(last!==null && last!==undefined){
      const matching:number[]=[];
      for(let i=0;i<history.length-1;i++) {
        const v=history[i+1];
        if(history[i]===last && v!==null&&v>=0&&v<=5)matching.push(v);
      }
      if(matching.length>=3)return {increment:chooseMode(matching),model:'One-step pattern'};
    }
    return {increment:fallback,model:'Frequent change'};
  }
  // The first comparison is 27 Sept. Outlier changes remain in the chronology as nulls,
  // rather than being silently erased and thereby creating false transition patterns.
  function historyToDate(readings:Reading[],upTo:string):(number|null)[] {
    const valid=readings.filter(r=>r.date<=upTo).sort((a,b)=>a.date.localeCompare(b.date));
    const out:(number|null)[]=[];
    for(let i=1;i<valid.length;i++){
      if(gap(valid[i-1].date,valid[i].date)!==1){out.push(null);continue;}
      const d=valid[i].value-valid[i-1].value;
      out.push(d>=0&&d<=5?d:null);
    }
    return out;
  }
  export function historicalBacktest(ds:(number|null)[]):Backtest {
    let hits=0,trials=0;
    for(let i=14;i<ds.length;i++) {
      const actual=ds[i];
      if(actual===null)continue;
      const guess=nextIncrement(ds.slice(0,i)).increment;
      if(guess===actual)hits++;
      trials++;
    }
    return {hits,trials};
  }
  export function predict(a:Apartment, overrides:Override[],target:string):ForecastResult|null {
    if(!validDate(target))return null;
    const all=getReadings(a,overrides);
    const anchors=all.filter(r=>r.date<target);
    if(!anchors.length)return null;
    const anchor=anchors[anchors.length-1];
    const horizon=gap(anchor.date,target);
    if(horizon<1||horizon>366)return null;
    const history=historyToDate(all,anchor.date);
    const eligible=history.filter(v=>v!==null).length;
    const daily=changes(all,anchor.date);
    const warnings:string[]=[];
    const recent=daily.slice(-7);
    if(recent.some(d=>d.flag))warnings.push('Recent unusual meter change');
    if(horizon>7)warnings.push('Long-range forecast; verify with a new actual reading');
    if(eligible<5)warnings.push('Limited history for this apartment');
    const latest=all.find(r=>r.date===target);
    const isCorrected=overrides.some(o=>o.apartmentId===a.id&&o.date===target);
    const validation=historicalBacktest(history);
    // Prior 74.1% = 3721 / 5020 across all apartment-based walk-forward tests
    // under the SAME two-step -> one-step -> mode rule, as established offline.
    const reliability=(validation.hits+8*.741)/(validation.trials+8);
    let likelihood=eligible>=14?Math.round(100*reliability):null;
    if(horizon>1) likelihood=null; // Do not pass one-day hit rate off as multi-day probability.
    let confidence:Confidence='Low';
    if(horizon>=3 || recent.some(d=>d.flag))confidence='Caution';
    else if(eligible<14 || horizon>1)confidence='Low';
    else if(reliability>=.77 && validation.trials>=8)confidence='High';
    else if(reliability>=.64)confidence='Moderate';
    let predicted=anchor.value;
    let model:ForecastResult['model']='Frequent change';
    let increment=0;
    if(horizon>=3){
      // Feeding our own predicted daily changes back into the model causes
      // unstable repeated patterns. Project only observed consecutive daily
      // changes, excluding negative readings and increases above five units.
      const observed=history.filter((v):v is number=>v!==null);
      const average=observed.length?observed.reduce((sum,d)=>sum+d,0)/observed.length:0;
      predicted=anchor.value+Math.round(average*horizon);
      increment=predicted-anchor.value;
      model='Historical daily average';
      warnings.push(`Estimate spans ${horizon} days since the last recorded reading; obtain a new actual reading`);
    }else{
      const working=history.slice();
      for(let i=0;i<horizon;i++){
        const step=nextIncrement(working);
        increment=step.increment;
        model=step.model;
        predicted+=step.increment;
        // Forecast steps are temporary calculations, never saved as observations.
        working.push(step.increment);
      }
      increment=predicted-anchor.value;
    }
    const good=history.filter((v):v is number=>v!==null);
    const ordered=good.slice().sort((x,y)=>x-y);
    const lo=ordered.length?ordered[Math.floor(.1*(ordered.length-1))]:0;
    const hi=ordered.length?ordered[Math.ceil(.9*(ordered.length-1))]:0;
    const reference=horizon===1?[anchor.value+lo,anchor.value+hi] as [number,number]:null;
    const trend=all.filter(r=>r.date<=anchor.date).slice(-14).map(r=>r.value);
    return {
      apartment:a,targetDate:target,anchorDate:anchor.date,anchorReading:anchor.value,
      predicted,increment:predicted-anchor.value,daysAhead:horizon,
      confidence,likelihood,reference,actual:latest?latest.value:null,isCorrected,
      warnings,eligible,recentDeltas:daily.slice(-12),trend,model,validation
    };
  }
  export function validateDataset(raw:unknown):DatasetPack {
    if(!raw||typeof raw!=='object')throw Error('The file is not a MeterFlow data pack.');
    const p=raw as Partial<DatasetPack>;
    if(p.kind!=='meterflow-dataset'||p.schemaVersion!==1||!Array.isArray(p.apartments)||!p.apartments.length||p.apartments.length>20000) throw Error('Unsupported or empty data pack.');
    const seen=new Set<string>();
    const apartments:Apartment[]=[];
    for(const x of p.apartments) {
      if(!x||!['A','B','C','D','E','F','G'].includes(x.block)||typeof x.number!=='string'||!/^([A-Za-z0-9_-]{1,20})$/.test(x.number)||x.id!==`${x.block}:${x.number}`||seen.has(x.id)||!Array.isArray(x.readings)||!x.readings.length||x.readings.length>10000)throw Error('Invalid or duplicate apartment entry.');
      seen.add(x.id);
      const dseen=new Set<string>();
      const readings:Reading[]=[];
      for(const r of x.readings) {
        if(!r||!validDate(r.date)||!Number.isSafeInteger(r.value)||r.value<0||r.value>1000000000||dseen.has(r.date))throw Error(`Invalid or duplicate reading in ${x.id}.`);
        dseen.add(r.date);readings.push({date:r.date,value:r.value});
      }
      readings.sort((a,b)=>a.date.localeCompare(b.date));
      apartments.push({id:x.id,block:x.block,number:x.number,type:String(x.type||''),readings});
    }
    return {kind:'meterflow-dataset',schemaVersion:1,name:String(p.name||'Imported readings').slice(0,120),apartments,period:p.period,sourceReport:p.sourceReport,sourceSpreadsheet:p.sourceSpreadsheet,sourceSpreadsheetSHA256:p.sourceSpreadsheetSHA256};
  }
}
