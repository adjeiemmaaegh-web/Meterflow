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
  /**
   * MeterFlow v1.4: discrete empirical forecasting, not a cloud ML model.
   * We estimate a regularized probability distribution over physical daily
   * meter changes 0..5. Each apartment has its own history; matched preceding
   * one-, two-, and three-day changes add evidence with explicit shrinkage
   * toward the apartment's complete observed distribution.
   *
   * No future observations, model-generated deltas, or neighboring apartments
   * are used to train a forecast for a selected date.
   */
  export function nextDayDistribution(history:(number|null)[]):number[] {
    const observed=history.filter((v):v is number=>v!==null&&v>=0&&v<=5);
    const out=[0,0,0,0,0,0];
    if(!observed.length){out[0]=1;return out;}
    for(const d of observed)out[d]+=3/observed.length;
    for(let k=1;k<=3;k++) {
      if(history.length<=k || history.slice(-k).some(v=>v===null))continue;
      const weight=.25*Math.pow(2.5,k-1);
      for(let i=k;i<history.length;i++) {
        const following=history[i];
        if(following===null || following<0 || following>5)continue;
        let same=true;
        for(let j=0;j<k;j++)if(history[i-k+j]!==history[history.length-k+j]){same=false;break;}
        if(same)out[following]+=weight;
      }
    }
    const sum=out.reduce((a,b)=>a+b,0);
    return out.map(n=>n/sum);
  }
  function modalIndex(probabilities:number[]):number {
    let best=0;
    for(let i=1;i<probabilities.length;i++)if(probabilities[i]>probabilities[best])best=i;
    return best;
  }
  export function adaptiveOneDay(history:(number|null)[]):number {
    return modalIndex(nextDayDistribution(history));
  }
  /** Marginalize all possible first-day increments; never lock in a guessed value. */
  export function adaptiveTwoDay(history:(number|null)[]):number {
    const first=nextDayDistribution(history),joint=Array(11).fill(0) as number[];
    for(let a=0;a<=5;a++) {
      if(first[a]<=0)continue;
      const second=nextDayDistribution(history.concat([a]));
      for(let b=0;b<=5;b++)joint[a+b]+=first[a]*second[b];
    }
    return modalIndex(joint);
  }
  /** Robust OLS trend over clean cumulative changes for 3-13 day planning. */
  export function robustTrendRate(history:(number|null)[]):number {
    const levels=[0];
    for(const d of history)levels.push(levels[levels.length-1]+(d===null?0:d));
    if(levels.length<3)return 0;
    const center=(levels.length-1)/2;
    let numerator=0,denominator=0;
    for(let i=0;i<levels.length;i++) {
      const x=i-center;
      numerator+=x*levels[i];denominator+=x*x;
    }
    return Math.max(0,denominator?numerator/denominator:0);
  }
  /** Long-gap drift with modest recent-history adjustment; no recursive guesses. */
  export function conservativeRate(history:(number|null)[]):number {
    const observed=history.filter((v):v is number=>v!==null&&v>=0&&v<=5);
    if(!observed.length)return 0;
    const overall=observed.reduce((a,b)=>a+b,0)/observed.length;
    const recent=observed.slice(-7);
    const local=recent.reduce((a,b)=>a+b,0)/recent.length;
    return Math.max(0,.85*overall+.15*local);
  }
  export function adaptiveHistoricalBacktest(ds:(number|null)[]):Backtest {
    let hits=0,trials=0;
    for(let i=14;i<ds.length;i++) {
      const actual=ds[i];
      if(actual===null)continue;
      if(adaptiveOneDay(ds.slice(0,i))===actual)hits++;
      trials++;
    }
    return {hits,trials};
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
    const anchor=all.filter(r=>r.date<target).at(-1);
    if(!anchor)return null;
    const horizon=gap(anchor.date,target);
    if(horizon<1||horizon>366)return null;
    const history=historyToDate(all,anchor.date);
    const eligible=history.filter((v):v is number=>v!==null).length;
    const daily=changes(all,anchor.date);
    const recent=daily.slice(-7);
    const warnings:string[]=[];
    if(recent.some(d=>d.flag))warnings.push('Recent unusual meter change; confirm physical readings');
    if(horizon>=3)warnings.push(`Estimate spans ${horizon} days since the last recorded reading; obtain a new actual reading`);
    if(eligible<5)warnings.push('Limited history for this apartment');
    const actual=all.find(r=>r.date===target);
    const isCorrected=overrides.some(o=>o.apartmentId===a.id&&o.date===target);
    const validation=adaptiveHistoricalBacktest(history);
    // A conservative empirical one-day hit estimate; not a calibrated guarantee.
    const reliability=(validation.hits+6*.73)/(validation.trials+6);
    const likelihood=horizon===1&&eligible>=14?Math.round(reliability*100):null;
    let confidence:Confidence='Low';
    if(horizon>=3||recent.some(d=>d.flag))confidence='Caution';
    else if(eligible<14||horizon===2)confidence='Low';
    else if(reliability>=.77&&validation.trials>=8)confidence='High';
    else if(reliability>=.64)confidence='Moderate';
    let increase=0;
    let model:ForecastResult['model']='Adaptive transitions';
    if(horizon===1){increase=adaptiveOneDay(history);}
    else if(horizon===2){increase=adaptiveTwoDay(history);model='Two-day distribution';}
    else if(horizon<=13){
      increase=Math.round(robustTrendRate(history)*horizon);
      model='Robust observed trend';
    }else{
      increase=Math.round(conservativeRate(history)*horizon);
      model='Blended consumption rate';
    }
    const predicted=anchor.value+Math.max(0,increase);
    const good=history.filter((v):v is number=>v!==null);
    const ordered=good.slice().sort((a,b)=>a-b);
    const lo=ordered.length?ordered[Math.floor(.1*(ordered.length-1))]:0;
    const hi=ordered.length?ordered[Math.ceil(.9*(ordered.length-1))]:0;
    const reference=horizon===1?[anchor.value+lo,anchor.value+hi] as [number,number]:null;
    const trend=all.filter(r=>r.date<=anchor.date).slice(-14).map(r=>r.value);
    return {
      apartment:a,targetDate:target,anchorDate:anchor.date,anchorReading:anchor.value,
      predicted,increment:predicted-anchor.value,daysAhead:horizon,
      confidence,likelihood,reference,actual:actual?actual.value:null,isCorrected,
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
