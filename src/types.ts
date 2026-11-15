/** Global type declarations for the self-contained, offline-first React runtime. */
type BlockName = 'A'|'B'|'C'|'D'|'E'|'F'|'G';
type TabName = 'home' | 'apartments' | 'activity' | 'settings';
type Confidence = 'High'|'Moderate'|'Low'|'Caution';
interface Reading { date:string; value:number; }
interface Apartment { id:string; block:BlockName; number:string; type:string; readings:Reading[]; }
interface DatasetPack {
  schemaVersion:1; kind:'meterflow-dataset'; name:string;
  period?:{start:string;end:string}; sourceReport?:string;
  sourceSpreadsheet?:string; sourceSpreadsheetSHA256?:string;
  apartments: Apartment[];
}
interface Override {
  id:string; apartmentId:string; date:string; value:number;
  note:string; updatedAt:string;
}
interface ActivityEntry {
  id?:number; kind:string; timestamp:string; apartmentId?:string;
  date?:string; before?:number|null; after?:number|null; note?:string; count?:number;
}
interface StoredFile { id:string; name:string; type:string; size:number; addedAt:string; data:Blob; }
interface Metadata { key:'dataset'; name:string; importedAt:string; sourceReport?:string; }
interface Backtest { hits:number; trials:number; }
interface ForecastResult {
  apartment:Apartment; targetDate:string; anchorDate:string; anchorReading:number;
  predicted:number; increment:number; daysAhead:number;
  confidence:Confidence; likelihood:number|null; reference:[number,number]|null;
  actual:number|null; isCorrected:boolean; warnings:string[];
  eligible:number; recentDeltas:{date:string;delta:number;flag:boolean}[];
  trend:number[]; model:'Two-step pattern'|'One-step pattern'|'Frequent change';
  validation:Backtest;
}
interface MeterFlowState {
  ready:boolean; loading:boolean; error:string; toast:string;
  apartments:Apartment[]; overrides:Override[]; activities:ActivityEntry[];
  files:StoredFile[]; meta:Metadata|null;
  tab:TabName; date:string; block:BlockName|'All'; search:string;
  selected:string|null; editDate:string; editValue:string; editNote:string;
  showEditor:boolean; showImport:boolean; showDatePicker:boolean;
  sort:'number'|'attention'; showAll:boolean;
  pendingImport: boolean;
}
declare const React: {
  createElement: (...args:any[])=>any;
  Component: new (props?:any)=>{
    props:any; state:any; setState:(next:any, callback?:()=>void)=>void;
    forceUpdate:()=>void;
  };
};
declare const ReactDOM: {render:(node:any, container:Element|null)=>void};
declare namespace JSX {interface IntrinsicElements { [elemName:string]:any; }}
