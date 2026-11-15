/* MeterFlow mobile-first public forecasting website. The historical source readings
 * are bundled into the public static site. User corrections remain in IndexedDB. */
function Icon(p:{name:string;size?:number;stroke?:number;className?:string}):any {
 const size=p.size||20,common={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:p.stroke||1.9,strokeLinecap:'round',strokeLinejoin:'round',className:p.className||'icon','aria-hidden':true};
 switch(p.name){
 case 'drop':return <svg {...common}><path d="M12 2.4S4.8 10.6 4.8 15a7.2 7.2 0 0 0 14.4 0C19.2 10.6 12 2.4 12 2.4Z"/><path d="M8.5 16a3.7 3.7 0 0 0 3.7 3.7"/></svg>;
 case 'home':return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></svg>;
 case 'building':return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3"/></svg>;
 case 'clock':return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
 case 'settings':return <svg {...common}><path d="M4 5h16M4 12h16M4 19h16"/><circle cx="8" cy="5" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="10" cy="19" r="2" fill="currentColor"/></svg>;
 case 'search':return <svg {...common}><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>;
 case 'arrow':return <svg {...common}><path d="m9 18 6-6-6-6"/></svg>;
 case 'back':return <svg {...common}><path d="m15 18-6-6 6-6"/></svg>;
 case 'plus':return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
 case 'edit':return <svg {...common}><path d="M15 5 19 9M4 20l4.3-1 11-11a2.1 2.1 0 0 0-3-3l-11 11Z"/></svg>;
 case 'close':return <svg {...common}><path d="M5 5 19 19M19 5 5 19"/></svg>;
 case 'check':return <svg {...common}><path d="m4 12 5 5L20 6"/></svg>;
 case 'calendar':return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>;
 case 'chart':return <svg {...common}><path d="M3 3v18h18M7 15l4-4 3 3 6-7"/></svg>;
 case 'trend':return <svg {...common}><path d="m3 17 6-6 4 4 8-9M15 6h6v6"/></svg>;
 case 'alert':return <svg {...common}><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/></svg>;
 case 'shield':return <svg {...common}><path d="m12 2 9 4v6c0 6-4 9-9 10-5-1-9-4-9-10V6l9-4Z"/><path d="m8 12 3 3 5-6"/></svg>;
 case 'download':return <svg {...common}><path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/></svg>;
 case 'upload':return <svg {...common}><path d="M12 17V4m-5 5 5-5 5 5M4 16v5h16v-5"/></svg>;
 case 'file':return <svg {...common}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M13 2v7h7M8 14h8M8 18h6"/></svg>;
 case 'trash':return <svg {...common}><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6m4-6v6"/></svg>;
 case 'wifi':return <svg {...common}><path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>;
 case 'sparkle':return <svg {...common}><path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z"/></svg>;
 case 'info':return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></svg>;
 case 'refresh':return <svg {...common}><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7.5 7.5 0 0 1 19 7l1 5M4 12l1 5a7.5 7.5 0 0 0 13.5-2"/></svg>;
 default:return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
 }
}
function formatNumber(n:number|null|undefined):string {return n===null||n===undefined?'—':new Intl.NumberFormat('en-GB').format(n);}
function compactDate(s:string):string {return MeterEngine.formatDate(s,{month:'short',day:'numeric',year:undefined});}
function badgeClass(c:Confidence):string {return c==='High'?'confidence-good':c==='Moderate'?'confidence-mid':c==='Caution'?'confidence-warn':'confidence-low';}
function MiniLine(props:{values:number[];forecast?:number;width?:number;height?:number}):any {
 const vals=[...props.values];if(props.forecast!==undefined)vals.push(props.forecast);
 if(vals.length<2)return <div className="empty-chart">Not enough readings</div>;
 const w=props.width||180,h=props.height||55,pad=5,min=Math.min(...vals),max=Math.max(...vals),range=Math.max(1,max-min);
 const points=vals.map((v,i)=>`${pad+i/(vals.length-1)*(w-2*pad)},${h-pad-(v-min)/range*(h-2*pad)}`);
 const past=props.forecast!==undefined?points.slice(0,-1):points;
 const last=points[points.length-1].split(',').map(Number);
 return <svg className="mini-line" width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-label="Recent cumulative meter reading trend">
   <path d={`M${past.join(' L')}`} fill="none" stroke="#178d84" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
   {props.forecast!==undefined?<g><path d={`M${points[points.length-2]} L${points[points.length-1]}`} fill="none" stroke="#e7a75b" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round"/><circle cx={last[0]} cy={last[1]} r="3.4" fill="#e7a75b" stroke="white" strokeWidth="1.5"/></g>:null}
 </svg>;
}
function EmptyState(props:{icon:string;title:string;text:string;children?:any}):any {return <div className="empty-state"><div className="empty-state-icon"><Icon name={props.icon} size={26}/></div><h3>{props.title}</h3><p>{props.text}</p>{props.children}</div>;}
class MeterFlowApp extends React.Component {
 state:MeterFlowState={ready:false,loading:true,error:'',toast:'',apartments:[],overrides:[],activities:[],files:[],meta:null,tab:'home',date:'2026-10-26',block:'All',search:'',selected:null,quickApartment:'',editDate:'2026-10-26',editValue:'',editNote:'',showEditor:false,showImport:false,showDatePicker:false,sort:'number',showAll:false,pendingImport:false};
 private toastTimer:any=null;
 private installEvent:any=null;
 private predictionsCache:{apartments:Apartment[];overrides:Override[];date:string;value:ForecastResult[]}|null=null;
 constructor(props:any){super(props);this.state={...this.state};}
 componentDidMount():void {
   this.refresh();
   window.addEventListener('beforeinstallprompt',this.handleInstallEvent as EventListener);
   window.addEventListener('keydown',this.handleEscape);
   if('serviceWorker' in navigator&&location.protocol!=='file:') navigator.serviceWorker.register('/sw.js').catch(()=>{});
 }
 componentWillUnmount():void {
   window.removeEventListener('beforeinstallprompt',this.handleInstallEvent as EventListener);
   window.removeEventListener('keydown',this.handleEscape);
 }
 private handleInstallEvent=(event:Event)=>{event.preventDefault();this.installEvent=event;this.forceUpdate();};
 private handleEscape=(e:KeyboardEvent)=>{if(e.key==='Escape')this.setState({showEditor:false,selected:null,showImport:false});};
 private notify(text:string):void {clearTimeout(this.toastTimer);this.setState({toast:text});this.toastTimer=setTimeout(()=>this.setState({toast:''}),4200);}
 private fail(e:unknown):void {this.setState({error:e instanceof Error?e.message:String(e),pendingImport:false});}
 private refresh=async():Promise<void>=>{
   try{
     const baseline=MeterEngine.validateDataset(MeterFlowBundledPack());
     await MeterStorage.seedBundledIfEmpty(baseline);
     const s=await MeterStorage.snapshot();
     if(!s.apartments.length)throw Error('Built-in historical readings could not be loaded.');
     this.setState({...s,ready:true,loading:false,error:''});
   }catch(e){this.setState({loading:false,ready:false,error:e instanceof Error?e.message:String(e)});}
 };
 private trigger(id:string):void {(document.getElementById(id) as HTMLInputElement|null)?.click();}
 private async importFile(file:File,forceDataset=false):Promise<void>{
   if(file.size>25*1024*1024)throw Error('Choose a file under 25 MB.');
   const lower=file.name.toLowerCase();
   if(lower.endsWith('.json')||forceDataset){
     const raw=JSON.parse(await file.text());
     if(raw?.kind==='meterflow-backup'){
       if(this.state.apartments.length&&!window.confirm('Restore this backup? It replaces all current readings, corrections and archived files on this device. Export a backup first.'))return;
       await MeterStorage.restoreBackup(raw);this.notify('Device backup restored');
     }else{
       const p=MeterEngine.validateDataset(raw);
       if(this.state.apartments.length&&!window.confirm(`Replace ${this.state.apartments.length} apartments with ${p.apartments.length} from this file? Existing corrections will be cleared. Export a backup first.`))return;
       await MeterStorage.importDataset(p,file);this.notify(`${p.apartments.length} apartments loaded privately`);
     }
   }else if(lower.endsWith('.csv')&&this.state.apartments.length){
     const rows=MeterStorage.parseCSV(await file.text(),this.state.apartments);
     if(!window.confirm(`Apply ${rows.length} actual readings? Matching dates will be replaced by these manual values.`))return;
     await MeterStorage.saveMany(rows,file);this.notify(`${rows.length} readings imported`);
   }else{
     await MeterStorage.addFile(file);this.notify('File saved to local device vault');
   }
   await this.refresh();this.setState({showImport:false});
 }
 private onVaultFile=(event:any)=>{
   const file:File|undefined=event?.target?.files?.[0];
   if(!file)return;
   event.target.value='';
   if(file.size>25*1024*1024){this.fail(Error('Choose a file under 25 MB.'));return;}
   this.setState({pendingImport:true,error:''});
   MeterStorage.addFile(file).then(()=>this.refresh()).then(()=>this.notify('File archived on this device')).catch(e=>this.fail(e)).finally(()=>this.setState({pendingImport:false}));
 };
 private onFile=(event:any,forceDataset=false)=>{
   const file:File|undefined=event?.target?.files?.[0];
   if(!file)return;
   this.setState({pendingImport:true,error:''});
   this.importFile(file,forceDataset).catch(e=>this.fail(e)).finally(()=>this.setState({pendingImport:false}));
   event.target.value='';
 };
 private editFor(id:string,date?:string):void{
   const a=this.state.apartments.find(a=>a.id===id);if(!a)return;
   const target=date||this.state.date;
   const existing=MeterEngine.getReadings(a,this.state.overrides).find(r=>r.date===target);
   this.setState({selected:id,editDate:target,editValue:existing?String(existing.value):'',editNote:'',showEditor:true,error:''});
 }
 private saveCorrection=async(e:any):Promise<void>=>{
   e?.preventDefault?.();
   const {selected,editDate,editValue,editNote,apartments,overrides}=this.state;
   const a=apartments.find(x=>x.id===selected);
   const value=Number(editValue.trim());
   if(!a||!MeterEngine.validDate(editDate)||!/^\d+$/.test(editValue.trim())||!Number.isSafeInteger(value)||value>1000000000){this.fail(Error('Enter a valid date and a whole-number reading (0–1,000,000,000).'));return;}
   const readings=MeterEngine.getReadings(a,overrides);
   const previous=readings.find(x=>x.date===editDate)?.value??null;
   const older=readings.filter(x=>x.date<editDate).slice(-1)[0];
   const newer=readings.find(x=>x.date>editDate);
   if((older&&value<older.value)||(newer&&value>newer.value)){
     if(!window.confirm('This reading makes the cumulative meter go backwards on an adjacent date. Save anyway and flag it for review?'))return;
   }
   if(previous===value){this.setState({showEditor:false});this.notify('Reading already matches the saved value');return;}
   try{
     await MeterStorage.saveCorrection({id:`${a.id}|${editDate}`,apartmentId:a.id,date:editDate,value,note:editNote.trim().slice(0,300),updatedAt:new Date().toISOString()},previous);
     await this.refresh();this.setState({showEditor:false,error:''});this.notify('Reading saved and predictions recalculated');
   }catch(e){this.fail(e);}
 }
 private deleteCorrection=async(id:string,date:string):Promise<void>=>{
   const row=this.state.overrides.find(o=>o.apartmentId===id&&o.date===date);
   if(!row)return;
   if(!window.confirm('Remove this correction and use the original reading if one exists?'))return;
   const a=this.state.apartments.find(x=>x.id===id),original=a?.readings.find(r=>r.date===date)?.value??null;
   try{await MeterStorage.removeCorrection(id,date,row.value,original);await this.refresh();this.notify('Correction removed');}catch(e){this.fail(e);}
 }
 private exportBackup=async():Promise<void>=>{
   this.setState({pendingImport:true,error:''});
   try{
     const backup=await MeterStorage.makeBackup();
     MeterStorage.download(backup,`meterflow-private-backup-${new Date().toISOString().slice(0,10)}.json`);
     this.notify('Backup downloaded — keep it private and secure');
   }catch(e){this.fail(e);}finally{this.setState({pendingImport:false});}
 }
 private exportCSV=():void=>{
   const rows=['block,apartment,date,reading,source'];
   for(const a of this.state.apartments){
     const overrides=new Set(this.state.overrides.filter(o=>o.apartmentId===a.id).map(o=>o.date));
     for(const r of MeterEngine.getReadings(a,this.state.overrides))rows.push([a.block,a.number,r.date,r.value,overrides.has(r.date)?'manual':'source'].join(','));
   }
   MeterStorage.download(new Blob([rows.join('\r\n')],{type:'text/csv;charset=utf-8'}),'meterflow-all-readings.csv');this.notify('Readings CSV exported');
 }
 private install=async():Promise<void>=>{
   if(this.installEvent){const event=this.installEvent;this.installEvent=null;await event.prompt();this.forceUpdate();}
   else this.notify('iPhone: Safari → Share → Add to Home Screen. Android: browser menu → Install app.');
 }
 private datasetDate():string {
   return this.state.apartments.reduce((max,a)=>{const d=a.readings[a.readings.length-1]?.date;return d&&d>max?d:max;},'2026-10-25');
 }
 private results():ForecastResult[]{
   const {apartments,overrides,date}=this.state;
   if(this.predictionsCache&&this.predictionsCache.apartments===apartments&&this.predictionsCache.overrides===overrides&&this.predictionsCache.date===date)return this.predictionsCache.value;
   const value=apartments.map(a=>MeterEngine.predict(a,overrides,date)).filter((v):v is ForecastResult=>v!==null);
   this.predictionsCache={apartments,overrides,date,value};
   return value;
 }
 private scoped(rs:ForecastResult[]):ForecastResult[]{return this.state.block==='All'?rs:rs.filter(r=>r.apartment.block===this.state.block);}
 private nav(next:TabName):void {this.setState({tab:next,selected:null,search:'',showAll:false,error:''});window.scrollTo(0,0);}
 private header():any {return <header className="site-header"><div className="header-brand"><span className="brand-mark"><Icon name="drop" size={19} stroke={2.2}/></span><span className="brand-name">meter<span>flow</span><small>SMART METER READINGS</small></span></div><div className="header-right"><span className="header-private"><span className="status-pulse"/>On this device</span><button type="button" className="header-avatar" aria-label="Open settings" onClick={()=>this.nav('settings')}><Icon name="settings" size={20}/></button></div></header>;}
 private blockChips():any {return <div className="chips-scroll" role="group" aria-label="Filter by block">{(['All','A','B','C','D','E','F','G'] as const).map(b=><button key={b} className={`chip ${this.state.block===b?'active':''}`} type="button" onClick={()=>this.setState({block:b})}>{b==='All'?'All blocks':`Block ${b}`}</button>)}</div>;}
 private daySelector():any {return <div className="date-control"><button className="date-step" type="button" aria-label="Previous day" onClick={()=>this.setState({date:MeterEngine.nextDate(this.state.date,-1)})}><Icon name="back" size={20}/></button><label className="date-target"><span className="date-target-caption">FORECAST DATE</span><span className="date-target-text"><Icon name="calendar" size={15}/>{MeterEngine.formatDate(this.state.date,{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</span><input aria-label="Choose forecast date" type="date" min="2026-01-01" max="2100-12-31" value={this.state.date} onChange={(e:any)=>{if(MeterEngine.validDate(e.target.value))this.setState({date:e.target.value});}} /></label><button className="date-step" type="button" aria-label="Next day" onClick={()=>this.setState({date:MeterEngine.nextDate(this.state.date,1)})}><Icon name="arrow" size={20}/></button></div>;}
 private topPanel(rs:ForecastResult[]):any {
   const scoped=this.scoped(rs);
   const delta=scoped.reduce((sum,r)=>sum+r.increment,0);
   const cautions=scoped.filter(r=>r.confidence==='Caution').length;
   const daily=scoped.length>0&&scoped.every(r=>r.daysAhead===1);
   return <div className="top-panel-content"><section className="hero-panel"><div className="hero-glow"/><div className="hero-content"><div className="eyebrow"><span className="eyebrow-dot"/>YOUR DAILY OVERVIEW</div><h1>Every drop,<br/><em>accounted for.</em></h1><p className="hero-description">Better estimates, simpler readings, effortless corrections.</p>{this.daySelector()}<div className="hero-foot"><Icon name="shield" size={16}/><span>Corrections stay on this phone · Works offline</span></div></div></section>
     <section className="stats-grid" aria-label="Forecast summary"><article className="stat-card highlighted"><div className="stat-head"><span>PROJECTED INCREASE</span><Icon name="trend" size={19}/></div><div className="stat-value">+{formatNumber(delta)}</div><p>{daily?'For the selected day':'Since each last actual reading'} · meter units</p></article><article className="stat-card"><div className="stat-head"><span>APARTMENTS</span><Icon name="building" size={19}/></div><div className="stat-value">{formatNumber(scoped.length)}<small> / {this.state.apartments.length}</small></div><p>{this.state.block==='All'?'Across all 7 blocks':`In Block ${this.state.block}`}</p></article></section>
     <div className="insight-strip"><span className={`insight-icon ${cautions?'has-warn':''}`}><Icon name={cautions?'alert':'sparkle'} size={19}/></span><span><strong>{cautions?`${cautions} prediction${cautions>1?'s':''} need attention`:'Pattern-based predictions are ready'}</strong><small>{daily?'Retrospective model match: 74.1% on source dataset':'Multi-day estimates are less reliable; confirm readings regularly'}</small></span><Icon name="arrow" size={18}/></div>
   </div>;
 }
 private apartmentCard(r:ForecastResult):any {
   return <button type="button" key={r.apartment.id} className="apartment-card" onClick={()=>{this.setState({selected:r.apartment.id,error:''});window.scrollTo(0,0);}} aria-label={`Block ${r.apartment.block} apartment ${r.apartment.number}, predicted reading ${r.predicted}`}>
     <div className="apartment-card-top"><span className="apartment-badge"><Icon name="building" size={16}/></span><div className="apartment-title"><strong>{r.apartment.number}</strong><span>Block {r.apartment.block} <span className="bullet">·</span> Apartment</span></div><span className={`confidence ${badgeClass(r.confidence)}`}>{r.confidence}</span></div>
     <div className="apartment-card-values"><div><small>PREDICTED READING</small><div className="apartment-prediction">{formatNumber(r.predicted)}<span className="positive-delta">+{formatNumber(r.increment)}</span></div></div><div className="spark-shell"><MiniLine values={r.trend} forecast={r.predicted} height={48}/></div></div>
     <div className="apartment-card-bottom"><span>Last actual <strong>{formatNumber(r.anchorReading)}</strong> <span className="muted">· {compactDate(r.anchorDate)}</span></span><span className="card-open">View <Icon name="arrow" size={14}/></span></div>
   </button>;
 }
 private quickPrediction(rs:ForecastResult[]):any {
   const block:BlockName=this.state.block==='All'?'A':this.state.block;
   const units=this.state.apartments.filter(a=>a.block===block).sort((a,b)=>a.number.localeCompare(b.number,undefined,{numeric:true}));
   const id=units.some(a=>a.id===this.state.quickApartment)?this.state.quickApartment:(units[0]?.id||'');
   const result=rs.find(r=>r.apartment.id===id);
   return <section className="quick-predictor" aria-label="Predict an apartment meter reading">
     <div className="quick-predictor-title"><span className="quick-visual"><Icon name="sparkle" size={20}/></span><div><span className="section-overline">INSTANT FORECAST</span><h2>Predict a meter reading</h2><p>Choose your date, block and apartment. The historical readings are already loaded.</p></div></div>
     <div className="quick-controls">
       <label className="quick-label">Date to predict<input aria-label="Prediction date" type="date" min="2026-09-27" max="2100-12-31" value={this.state.date} onChange={(e:any)=>{if(MeterEngine.validDate(e.target.value))this.setState({date:e.target.value});}}/></label>
       <div className="quick-control-row"><label className="quick-label">Block<select aria-label="Select block" value={block} onChange={(e:any)=>this.setState({block:e.target.value,quickApartment:''})}>{(['A','B','C','D','E','F','G'] as BlockName[]).map(b=><option key={b} value={b}>Block {b}</option>)}</select></label>
       <label className="quick-label">Apartment<select aria-label="Select apartment" value={id} onChange={(e:any)=>this.setState({quickApartment:e.target.value})}>{units.map(a=><option key={a.id} value={a.id}>{a.number}</option>)}</select></label></div>
     </div>
     <div className="quick-result" aria-live="polite"><div><span className="quick-result-label">PREDICTED METER READING</span>{result?<><div className="quick-result-number">{formatNumber(result.predicted)} <span className="quick-result-delta">+{formatNumber(result.increment)}</span></div><div className="quick-result-meta">Block {block} · Apartment {result.apartment.number} · {MeterEngine.formatDate(this.state.date,{day:'numeric',month:'short',year:'numeric'})}</div><div className="quick-result-method">Last recorded {formatNumber(result.anchorReading)} on {compactDate(result.anchorDate)} · {result.model} · {result.daysAhead} day{result.daysAhead!==1?'s':''} ahead</div></>:<><div className="quick-result-number no-result">Not available</div><div className="quick-result-method">Select a date after the first reading and within 366 days of the last actual reading.</div></>}</div>
       {result?<button type="button" className="quick-result-button" onClick={()=>{this.setState({selected:id,error:''});window.scrollTo(0,0);}}>View history &amp; correct <Icon name="arrow" size={17}/></button>:null}</div>
     <p className="quick-disclaimer">Forecasts estimate readings, not actual meter measurements. Older dates use only earlier readings; corrections are stored privately on your phone.</p>
   </section>;
 }
 private home(rs:ForecastResult[]):any {
   const scoped=this.scoped(rs);
   const list=scoped.slice().sort((a,b)=>a.apartment.block.localeCompare(b.apartment.block)||a.apartment.number.localeCompare(b.apartment.number,undefined,{numeric:true}));
   return <main className="main-stack"><div className="section-intro"><div><span className="section-overline">OVERVIEW</span><h2>Good to see you.</h2></div><div className="today-chip"><Icon name="calendar" size={14}/>{compactDate(this.state.date)}</div></div>{this.quickPrediction(rs)}{this.topPanel(rs)}
     <div className="section-header"><div><h2>Browse blocks</h2><p>Find the apartments you manage</p></div></div>{this.blockChips()}
     <div className="section-header list-heading"><div><h2>Apartment forecasts</h2><p>{scoped.length} predictions for {compactDate(this.state.date)}</p></div><button className="text-action" onClick={()=>this.nav('apartments')} type="button">View all <Icon name="arrow" size={15}/></button></div>
     {list.length?<div className="card-list">{list.slice(0,6).map(r=>this.apartmentCard(r))}</div>:<EmptyState icon="calendar" title="No forecast available" text="Choose a date after the first stored reading."/>}
     <div className="small-print"><Icon name="info" size={16}/><span>Predictions are estimates, not measured usage. Open an apartment to record a verified reading.</span></div>
   </main>;
 }
 private apartmentList(rs:ForecastResult[]):any {
   const scoped=this.scoped(rs).filter(r=>`${r.apartment.number} ${r.apartment.block} ${r.apartment.type}`.toLowerCase().includes(this.state.search.trim().toLowerCase()));
   const list=scoped.sort((a,b)=>this.state.sort==='attention'?((a.confidence==='Caution'?0:1)-(b.confidence==='Caution'?0:1)||a.apartment.block.localeCompare(b.apartment.block)||a.apartment.number.localeCompare(b.apartment.number,undefined,{numeric:true})):a.apartment.block.localeCompare(b.apartment.block)||a.apartment.number.localeCompare(b.apartment.number,undefined,{numeric:true}));
   return <main className="main-stack"><div className="page-title"><span className="section-overline">DIRECTORY</span><h1>All apartments<span className="heading-dot">.</span></h1><p>Search, forecast and correct in one place.</p></div>
     <div className="directory-date">{this.daySelector()}</div>
     <label className="search-field"><Icon name="search" size={20}/><input autoComplete="off" type="search" value={this.state.search} onChange={(e:any)=>this.setState({search:e.target.value})} placeholder="Search apartment, block or type" aria-label="Search apartments"/>{this.state.search?<button onClick={()=>this.setState({search:''})} aria-label="Clear search"><Icon name="close" size={16}/></button>:null}</label>
     <div className="list-filters">{this.blockChips()}<select aria-label="Sort apartment list" value={this.state.sort} onChange={(e:any)=>this.setState({sort:e.target.value})}><option value="number">Apartment order</option><option value="attention">Needs attention first</option></select></div>
     <div className="directory-summary"><strong>{list.length}</strong> matching apartments <span>·</span> <span>{compactDate(this.state.date)}</span></div>
     {list.length?<div className="card-list">{list.map(r=>this.apartmentCard(r))}</div>:<EmptyState icon="search" title="No apartments found" text="Try a different apartment number, block or forecast date."/>}
   </main>;
 }
 private detail(r:ForecastResult):any {
   const readings=MeterEngine.getReadings(r.apartment,this.state.overrides);
   const corrected=this.state.overrides.filter(o=>o.apartmentId===r.apartment.id).sort((a,b)=>b.date.localeCompare(a.date));
   const totalActual=readings.length;
   return <main className="detail-view"><div className="detail-top"><button className="back-button" type="button" onClick={()=>this.setState({selected:null})}><Icon name="back" size={20}/> <span>Back to apartments</span></button><span className="detail-block">BLOCK {r.apartment.block}</span></div>
     <div className="detail-heading"><span className="section-overline">APARTMENT PROFILE</span><h1>{r.apartment.number}<span className="heading-dot">.</span></h1><p>{r.apartment.type||'Apartment'} <span className="bullet">·</span> {totalActual} stored readings</p></div>
     <section className="detail-hero"><div className="detail-hero-top"><span><Icon name="sparkle" size={17}/> PREDICTION FOR {compactDate(r.targetDate).toUpperCase()}</span><span className={`confidence ${badgeClass(r.confidence)}`}>{r.confidence}</span></div><div className="big-meter">{formatNumber(r.predicted)}<small>meter units · estimated</small></div><div className="forecast-delta"><span>+{formatNumber(r.increment)} since {compactDate(r.anchorDate)}</span><span>{r.daysAhead} day{r.daysAhead!==1?'s':''} ahead</span></div><div className="detail-spark"><MiniLine values={r.trend} forecast={r.predicted} height={105} width={310}/></div></section>
     {r.actual!==null?<div className="actual-info"><Icon name="check" size={19}/><div><strong>{r.isCorrected?'Manually saved reading':'Recorded source reading'} on this date: {formatNumber(r.actual)}</strong><span>Actual readings are shown separately from the forecast, so you can compare them.</span></div></div>:null}
     {r.warnings.length?<div className="warnings-box"><Icon name="alert" size={19}/><span>{r.warnings.join(' · ')}</span></div>:null}
     <div className="metrics-row"><div className="mini-metric"><small>LAST ACTUAL</small><strong>{formatNumber(r.anchorReading)}</strong><span>{compactDate(r.anchorDate)}</span></div><div className="mini-metric"><small>EXACT-HIT EST.</small><strong>{r.likelihood===null?'—':`${r.likelihood}%`}</strong><span>{r.daysAhead===1?'Historical test estimate':'Not rated for multi-day'}</span></div><div className="mini-metric"><small>METHOD</small><strong className="mini-metric-model">{r.model}</strong><span>{r.validation.hits}/{r.validation.trials} past tests</span></div></div>
     <div className="section-header detail-subheader"><div><h2>Daily consumption</h2><p>Recent changes in cumulative readings</p></div></div>
     <div className="daily-ledger">{r.recentDeltas.length?r.recentDeltas.slice().reverse().map(d=><div key={d.date} className="daily-row"><span>{MeterEngine.formatDate(d.date,{weekday:'short',day:'numeric',month:'short',year:undefined})}</span><div className="bar-track"><div className={`bar-fill ${d.flag?'bar-alert':''}`} style={{width:`${Math.min(100,Math.abs(d.delta)/Math.max(1,...r.recentDeltas.map(x=>Math.abs(x.delta)))*100)}%`}}/></div><strong className={d.flag?'danger-text':''}>{d.delta>=0?'+':''}{d.delta}</strong></div>):<p className="quiet-note">No consecutive historical readings available.</p>}</div>
     <div className="data-method"><Icon name="info" size={18}/><p>Predictions use earlier readings only. Daily differences of 0–5 train the model; negative changes and jumps above 5 stay visible but are excluded from normal consumption patterns. {r.reference?`One-day historical reference: ${formatNumber(r.reference[0])}–${formatNumber(r.reference[1])}.`:''}</p></div>
     {corrected.length?<section className="correction-list"><div className="section-header"><h2>Saved corrections</h2><span className="tiny-tag">{corrected.length}</span></div>{corrected.map(o=><div key={o.id} className="correction-row"><div><strong>{compactDate(o.date)} · {formatNumber(o.value)}</strong><small>{o.note||'Manual reading'} </small></div><div className="correction-actions"><button type="button" aria-label={`Edit correction ${o.date}`} onClick={()=>this.editFor(r.apartment.id,o.date)}><Icon name="edit" size={17}/></button><button type="button" aria-label={`Remove correction ${o.date}`} onClick={()=>this.deleteCorrection(r.apartment.id,o.date)}><Icon name="trash" size={17}/></button></div></div>)}</section>:null}
     <div className="sticky-action"><button className="primary-button" type="button" onClick={()=>this.editFor(r.apartment.id)}><Icon name="edit" size={19}/> Enter or correct a reading</button></div>
   </main>;
 }
 private activity():any {return <main className="main-stack"><div className="page-title"><span className="section-overline">YOUR CHANGES</span><h1>Activity<span className="heading-dot">.</span></h1><p>A local record of imports and manual corrections.</p></div>{!this.state.activities.length?<EmptyState icon="clock" title="Nothing here yet" text="Imported data and corrected readings will appear here."/>:<div className="activity-list">{this.state.activities.map((a,i)=><article key={a.id??i} className="activity-item"><div className={`activity-icon ${a.kind==='correction'?'activity-edit':''}`}><Icon name={a.kind==='correction'?'edit':a.kind==='revert'?'refresh':a.kind==='file'||a.kind==='file-deleted'?'file':'upload'} size={18}/></div><div className="activity-content"><div className="activity-item-top"><strong>{a.kind==='correction'?'Reading corrected':a.kind==='revert'?'Correction removed':a.kind==='dataset'?'Dataset imported':a.kind==='csv'?'CSV readings imported':a.kind==='backup'?'Backup restored':a.kind==='file-deleted'?'Archived file deleted':'File archived'}</strong><time>{new Date(a.timestamp).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</time></div>{a.apartmentId?<p><b>{a.apartmentId.replace(':',' · ')}</b> · {compactDate(a.date||'')}</p>:null}{a.kind==='correction'||a.kind==='revert'?<div className="change-inline">{formatNumber(a.before)} <Icon name="arrow" size={14}/> <strong>{formatNumber(a.after)}</strong></div>:null}{a.note?<p className="activity-note">{a.note}</p>:null}{a.count?<p className="activity-note">{a.count} entries</p>:null}</div></article>)}</div>}</main>;}
 private settings():any {return <main className="main-stack settings-page"><div className="page-title"><span className="section-overline">YOUR WORKSPACE</span><h1>Settings<span className="heading-dot">.</span></h1><p>Everything saved locally on this device.</p></div>
     <section className="privacy-card"><div className="privacy-symbol"><Icon name="shield" size={25}/></div><div><strong>Built-in readings. Local corrections.</strong><p>The historical apartment readings are published with this website so forecasts work immediately. Your corrections, imported files, and backups remain in this device's IndexedDB; they are not automatically uploaded.</p></div></section>
     <div className="section-header"><h2>Your data</h2></div><div className="settings-group"><div className="settings-row"><div className="settings-row-icon"><Icon name="building" size={20}/></div><span><strong>{this.state.meta?.name||'Historical readings included'}</strong><small>{this.state.apartments.length} apartments · {this.state.overrides.length} manual readings</small></span><Icon name="check" size={18}/></div>
     <button type="button" className="settings-row interactive" onClick={()=>this.trigger('data-input')}><div className="settings-row-icon"><Icon name="upload" size={20}/></div><span><strong>Restore or replace dataset (optional)</strong><small>Optional JSON backup or new dataset</small></span><Icon name="arrow" size={19}/></button>
     <button type="button" className="settings-row interactive" onClick={()=>this.trigger('csv-input')}><div className="settings-row-icon"><Icon name="plus" size={20}/></div><span><strong>Import actual readings</strong><small>CSV · block, apartment, date, reading</small></span><Icon name="arrow" size={19}/></button>
     <button type="button" className="settings-row interactive" disabled={!this.state.apartments.length} onClick={this.exportBackup}><div className="settings-row-icon"><Icon name="download" size={20}/></div><span><strong>Export full private backup</strong><small>Readings, corrections, audit trail & archived files</small></span><Icon name="arrow" size={19}/></button>
     <button type="button" className="settings-row interactive" disabled={!this.state.apartments.length} onClick={this.exportCSV}><div className="settings-row-icon"><Icon name="file" size={20}/></div><span><strong>Export readings CSV</strong><small>All original and corrected meter values</small></span><Icon name="arrow" size={19}/></button></div>
     <div className="section-header vault-header"><div><h2>Device file vault</h2><p>Preserve Excel files, reports and backups</p></div><button className="small-primary" type="button" onClick={()=>this.trigger('vault-input')}><Icon name="plus" size={16}/> Add file</button></div>
     <div className="vault-list">{this.state.files.length?this.state.files.map(f=><div className="vault-row" key={f.id}><span className="vault-file-icon"><Icon name="file" size={20}/></span><div className="vault-name"><strong title={f.name}>{f.name}</strong><small>{(f.size/1024).toFixed(1)} KB · {new Date(f.addedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</small></div><button type="button" aria-label={`Download ${f.name}`} onClick={()=>MeterStorage.download(f.data,f.name)}><Icon name="download" size={18}/></button><button type="button" aria-label={`Delete ${f.name}`} onClick={()=>{if(window.confirm(`Delete ${f.name} from this device?`))MeterStorage.deleteFile(f.id,f.name).then(()=>this.refresh()).catch(e=>this.fail(e));}}><Icon name="trash" size={18}/></button></div>):<div className="vault-empty"><Icon name="file" size={25}/><strong>Your vault is empty</strong><span>Add an Excel workbook, a report or any file up to 25 MB.</span></div>}</div>
     <div className="section-header"><h2>Install on your phone</h2></div><div className="install-card"><div className="install-icon"><Icon name="download" size={24}/></div><div><strong>Use MeterFlow like an app</strong><p>Install from your browser for a full-screen mobile experience. Works offline after the first online load.</p></div><button type="button" className="outline-button" onClick={this.install}>Install / instructions</button></div>
     <div className="disclaimer"><Icon name="info" size={18}/><p><strong>Important:</strong> IndexedDB is specific to this browser and phone. It is not cloud sync. The data is not app-encrypted: protect your phone. Browser data clearing or uninstalling may erase it. Export and protect a private backup regularly. On iPhone, install from Safari; on Android, use Chrome's install option. Forecasts are estimates, not meter measurements or bills.</p></div>
     <div className="settings-footer">METERFLOW / MOBILE EDITION <span>v1.1 · Offline-first</span></div>
   </main>;
 }
 private editor():any {
   if(!this.state.selected||!this.state.showEditor)return null;
   const a=this.state.apartments.find(a=>a.id===this.state.selected);if(!a)return null;
   const same=this.state.overrides.find(o=>o.apartmentId===a.id&&o.date===this.state.editDate);
   const existing=MeterEngine.getReadings(a,this.state.overrides).find(r=>r.date===this.state.editDate);
   return <div className="modal-shade" role="presentation" onClick={()=>this.setState({showEditor:false})}><div className="edit-sheet" role="dialog" aria-modal="true" aria-labelledby="edit-sheet-title" onClick={(e:any)=>e.stopPropagation()}><div className="sheet-handle"/><div className="sheet-title"><div><span className="section-overline">RECORD AN ACTUAL</span><h2 id="edit-sheet-title">Apartment {a.number}</h2><p>Block {a.block} · Update a meter reading</p></div><button className="close-button" type="button" aria-label="Close" onClick={()=>this.setState({showEditor:false})}><Icon name="close" size={21}/></button></div><form onSubmit={this.saveCorrection}>
     <label className="form-label">Reading date<input type="date" min="2000-01-01" max="2100-12-31" value={this.state.editDate} required onChange={(e:any)=>{const date=e.target.value;const current=MeterEngine.getReadings(a,this.state.overrides).find(r=>r.date===date);this.setState({editDate:date,editValue:current?String(current.value):''});}} /></label>
     <label className="form-label">Actual meter reading <span>(whole number)</span><div className="number-input-wrap"><Icon name="drop" size={20}/><input inputMode="numeric" pattern="[0-9]+" type="text" autoComplete="off" placeholder="e.g. 2230" value={this.state.editValue} onChange={(e:any)=>this.setState({editValue:e.target.value})} required /></div></label>
     {existing?<div className="sheet-current"><Icon name="info" size={17}/> Saved on this date: <strong>{formatNumber(existing.value)}</strong>{same?' · manual correction':' · original source'}</div>:null}
     <label className="form-label">Note <span>(optional)</span><textarea rows={2} maxLength={300} value={this.state.editNote} onChange={(e:any)=>this.setState({editNote:e.target.value})} placeholder="e.g. Photo verified, manual check..." /></label>
     {this.state.error?<p className="form-error">{this.state.error}</p>:null}<button className="primary-button save-button" type="submit"><Icon name="check" size={19}/> Save actual reading</button><p className="sheet-tip">Saving recalculates all future forecasts using the corrected history. The original source value stays recoverable.</p>
   </form></div></div>;
 }
 private onboard():any {return <div className="onboard"><div className="onboard-content"><h1>Readings not available</h1><p>MeterFlow includes the historical readings automatically. Reload to try again, or check that your browser allows local storage.</p><button className="primary-button" onClick={this.refresh} type="button">Retry loading readings</button></div></div>;}
 private renderFooter():any {const tabs:{id:TabName;label:string;icon:string}[]=[{id:'home',label:'Home',icon:'home'},{id:'apartments',label:'Apartments',icon:'building'},{id:'activity',label:'Activity',icon:'clock'},{id:'settings',label:'Settings',icon:'settings'}];return <nav className="bottom-nav" aria-label="Main navigation">{tabs.map(t=><button key={t.id} className={`tab-item ${this.state.tab===t.id?'selected':''}`} type="button" onClick={()=>this.nav(t.id)} aria-current={this.state.tab===t.id?'page':undefined}><span className="tab-icon"><Icon name={t.icon} size={21}/></span><span>{t.label}</span></button>)}</nav>;}
 render():any {
   if(this.state.loading)return <div className="loading-app"><div className="loading-brand"><Icon name="drop" size={40}/></div><h2>meterflow</h2><p>Loading historical readings and predictions…</p></div>;
   if(!this.state.ready)return <div className="error-screen"><Icon name="alert" size={36}/><h2>Device storage unavailable</h2><p>{this.state.error||'IndexedDB could not be opened.'}</p><p>Open the app in a regular Safari or Chrome tab over HTTPS. Private browsing or strict storage restrictions can prevent offline saving.</p><button className="primary-button" type="button" onClick={this.refresh}>Try again</button></div>;
   const rs=this.results();const selected=this.state.selected?rs.find(r=>r.apartment.id===this.state.selected):null;
   return <div className="app-shell">
     <input className="hidden-input" id="data-input" type="file" accept=".json,application/json" onChange={(e:any)=>this.onFile(e,true)}/>
     <input className="hidden-input" id="csv-input" type="file" accept=".csv,text/csv" onChange={(e:any)=>this.onFile(e)}/>
     <input className="hidden-input" id="vault-input" type="file" onChange={(e:any)=>this.onVaultFile(e)}/>
     {this.state.apartments.length? <div>{this.header()}{selected?this.detail(selected):this.state.tab==='home'?this.home(rs):this.state.tab==='apartments'?this.apartmentList(rs):this.state.tab==='activity'?this.activity():this.settings()}{!selected?this.renderFooter():null}{this.editor()}</div>:<div>{this.header()}{this.onboard()}</div>}
     {this.state.toast?<div className="toast" role="status"><Icon name="check" size={17}/>{this.state.toast}</div>:null}
     {this.state.error&&!this.state.showEditor&&this.state.apartments.length?<div className="error-toast" role="alert"><Icon name="alert" size={18}/><span>{this.state.error}</span><button type="button" aria-label="Dismiss error" onClick={()=>this.setState({error:''})}><Icon name="close" size={17}/></button></div>:null}
   </div>;
 }
}
ReactDOM.render(<MeterFlowApp/>,document.getElementById('root'));
