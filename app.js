"use strict";
/* MeterFlow mobile-first public forecasting website. The historical source readings
 * are bundled into the public static site. User corrections remain in IndexedDB. */
function Icon(p) {
    const size = p.size || 20, common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: p.stroke || 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', className: p.className || 'icon', 'aria-hidden': true };
    switch (p.name) {
        case 'drop': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M12 2.4S4.8 10.6 4.8 15a7.2 7.2 0 0 0 14.4 0C19.2 10.6 12 2.4 12 2.4Z" }),
            React.createElement("path", { d: "M8.5 16a3.7 3.7 0 0 0 3.7 3.7" }));
        case 'home': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" }));
        case 'building': return React.createElement("svg", { ...common },
            React.createElement("rect", { x: "4", y: "3", width: "16", height: "18", rx: "2" }),
            React.createElement("path", { d: "M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3" }));
        case 'clock': return React.createElement("svg", { ...common },
            React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
            React.createElement("path", { d: "M12 7v5l3 2" }));
        case 'settings': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M4 5h16M4 12h16M4 19h16" }),
            React.createElement("circle", { cx: "8", cy: "5", r: "2", fill: "currentColor" }),
            React.createElement("circle", { cx: "16", cy: "12", r: "2", fill: "currentColor" }),
            React.createElement("circle", { cx: "10", cy: "19", r: "2", fill: "currentColor" }));
        case 'search': return React.createElement("svg", { ...common },
            React.createElement("circle", { cx: "10.5", cy: "10.5", r: "6.5" }),
            React.createElement("path", { d: "m16 16 5 5" }));
        case 'arrow': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "m9 18 6-6-6-6" }));
        case 'back': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "m15 18-6-6 6-6" }));
        case 'plus': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M12 5v14M5 12h14" }));
        case 'edit': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M15 5 19 9M4 20l4.3-1 11-11a2.1 2.1 0 0 0-3-3l-11 11Z" }));
        case 'close': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M5 5 19 19M19 5 5 19" }));
        case 'check': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "m4 12 5 5L20 6" }));
        case 'calendar': return React.createElement("svg", { ...common },
            React.createElement("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
            React.createElement("path", { d: "M7 3v4M17 3v4M3 10h18" }));
        case 'chart': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M3 3v18h18M7 15l4-4 3 3 6-7" }));
        case 'trend': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "m3 17 6-6 4 4 8-9M15 6h6v6" }));
        case 'alert': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "m12 3 10 18H2L12 3Z" }),
            React.createElement("path", { d: "M12 9v5m0 3h.01" }));
        case 'shield': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "m12 2 9 4v6c0 6-4 9-9 10-5-1-9-4-9-10V6l9-4Z" }),
            React.createElement("path", { d: "m8 12 3 3 5-6" }));
        case 'download': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4" }));
        case 'upload': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M12 17V4m-5 5 5-5 5 5M4 16v5h16v-5" }));
        case 'file': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" }),
            React.createElement("path", { d: "M13 2v7h7M8 14h8M8 18h6" }));
        case 'trash': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6m4-6v6" }));
        case 'wifi': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M9 16a5 5 0 0 1 6 0" }),
            React.createElement("circle", { cx: "12", cy: "20", r: "1", fill: "currentColor" }));
        case 'sparkle': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4Z" }));
        case 'info': return React.createElement("svg", { ...common },
            React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
            React.createElement("path", { d: "M12 11v6m0-10h.01" }));
        case 'refresh': return React.createElement("svg", { ...common },
            React.createElement("path", { d: "M20 7v5h-5M4 17v-5h5" }),
            React.createElement("path", { d: "M5.5 9A7.5 7.5 0 0 1 19 7l1 5M4 12l1 5a7.5 7.5 0 0 0 13.5-2" }));
        default: return React.createElement("svg", { ...common },
            React.createElement("circle", { cx: "12", cy: "12", r: "9" }));
    }
}
function formatNumber(n) { return n === null || n === undefined ? '—' : new Intl.NumberFormat('en-GB').format(n); }
function compactDate(s) { return MeterEngine.formatDate(s, { month: 'short', day: 'numeric', year: undefined }); }
function badgeClass(c) { return c === 'High' ? 'confidence-good' : c === 'Moderate' ? 'confidence-mid' : c === 'Caution' ? 'confidence-warn' : 'confidence-low'; }
function MiniLine(props) {
    const vals = [...props.values];
    if (props.forecast !== undefined)
        vals.push(props.forecast);
    if (vals.length < 2)
        return React.createElement("div", { className: "empty-chart" }, "Not enough readings");
    const w = props.width || 180, h = props.height || 55, pad = 5, min = Math.min(...vals), max = Math.max(...vals), range = Math.max(1, max - min);
    const points = vals.map((v, i) => `${pad + i / (vals.length - 1) * (w - 2 * pad)},${h - pad - (v - min) / range * (h - 2 * pad)}`);
    const past = props.forecast !== undefined ? points.slice(0, -1) : points;
    const last = points[points.length - 1].split(',').map(Number);
    return React.createElement("svg", { className: "mini-line", width: "100%", height: h, viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none", "aria-label": "Recent cumulative meter reading trend" },
        React.createElement("path", { d: `M${past.join(' L')}`, fill: "none", stroke: "#178d84", strokeWidth: "2.6", strokeLinecap: "round", strokeLinejoin: "round" }),
        props.forecast !== undefined ? React.createElement("g", null,
            React.createElement("path", { d: `M${points[points.length - 2]} L${points[points.length - 1]}`, fill: "none", stroke: "#e7a75b", strokeWidth: "2.5", strokeDasharray: "4 4", strokeLinecap: "round" }),
            React.createElement("circle", { cx: last[0], cy: last[1], r: "3.4", fill: "#e7a75b", stroke: "white", strokeWidth: "1.5" })) : null);
}
function EmptyState(props) { return React.createElement("div", { className: "empty-state" },
    React.createElement("div", { className: "empty-state-icon" },
        React.createElement(Icon, { name: props.icon, size: 26 })),
    React.createElement("h3", null, props.title),
    React.createElement("p", null, props.text),
    props.children); }
class MeterFlowApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ready: false, loading: true, error: '', toast: '', apartments: [], overrides: [], activities: [], files: [], meta: null, tab: 'home', date: '2026-10-26', block: 'All', search: '', selected: null, quickApartment: '', editDate: '2026-10-26', editValue: '', editNote: '', showEditor: false, showImport: false, showDatePicker: false, sort: 'number', showAll: false, pendingImport: false, sessions: [], dailyFloor: 0, dailyReview: false, dailyEdits: {}, dailyBusy: false, exportingSessionId: null };
        this.toastTimer = null;
        this.installEvent = null;
        this.predictionsCache = null;
        this.handleInstallEvent = (event) => { event.preventDefault(); this.installEvent = event; this.forceUpdate(); };
        this.handleEscape = (e) => { if (e.key === 'Escape')
            this.setState({ showEditor: false, selected: null, showImport: false }); };
        this.refresh = async () => {
            try {
                const baseline = MeterEngine.validateDataset(MeterFlowBundledPack());
                await MeterStorage.seedBundledIfEmpty(baseline);
                const s = await MeterStorage.snapshot();
                if (!s.apartments.length)
                    throw Error('Built-in historical readings could not be loaded.');
                this.setState({ ...s, ready: true, loading: false, error: '' });
            }
            catch (e) {
                this.setState({ loading: false, ready: false, error: e instanceof Error ? e.message : String(e) });
            }
        };
        this.onVaultFile = (event) => {
            const file = event?.target?.files?.[0];
            if (!file)
                return;
            event.target.value = '';
            if (file.size > 25 * 1024 * 1024) {
                this.fail(Error('Choose a file under 25 MB.'));
                return;
            }
            this.setState({ pendingImport: true, error: '' });
            MeterStorage.addFile(file).then(() => this.refresh()).then(() => this.notify('File archived on this device')).catch(e => this.fail(e)).finally(() => this.setState({ pendingImport: false }));
        };
        this.onFile = (event, forceDataset = false) => {
            const file = event?.target?.files?.[0];
            if (!file)
                return;
            this.setState({ pendingImport: true, error: '' });
            this.importFile(file, forceDataset).catch(e => this.fail(e)).finally(() => this.setState({ pendingImport: false }));
            event.target.value = '';
        };
        this.saveCorrection = async (e) => {
            e?.preventDefault?.();
            const { selected, editDate, editValue, editNote, apartments, overrides } = this.state;
            const a = apartments.find(x => x.id === selected);
            const value = Number(editValue.trim());
            if (!a || !MeterEngine.validDate(editDate) || !/^\d+$/.test(editValue.trim()) || !Number.isSafeInteger(value) || value > 1000000000) {
                this.fail(Error('Enter a valid date and a whole-number reading (0–1,000,000,000).'));
                return;
            }
            const readings = MeterEngine.getReadings(a, overrides);
            const previous = readings.find(x => x.date === editDate)?.value ?? null;
            const older = readings.filter(x => x.date < editDate).slice(-1)[0];
            const newer = readings.find(x => x.date > editDate);
            if ((older && value < older.value) || (newer && value > newer.value)) {
                if (!window.confirm('This reading makes the cumulative meter go backwards on an adjacent date. Save anyway and flag it for review?'))
                    return;
            }
            if (previous === value) {
                this.setState({ showEditor: false });
                this.notify('Reading already matches the saved value');
                return;
            }
            try {
                await MeterStorage.saveCorrection({ id: `${a.id}|${editDate}`, apartmentId: a.id, date: editDate, value, note: editNote.trim().slice(0, 300), updatedAt: new Date().toISOString() }, previous);
                await this.refresh();
                this.setState({ showEditor: false, error: '' });
                this.notify('Reading saved and predictions recalculated');
            }
            catch (e) {
                this.fail(e);
            }
        };
        this.deleteCorrection = async (id, date) => {
            const row = this.state.overrides.find(o => o.apartmentId === id && o.date === date);
            if (!row)
                return;
            if (!window.confirm('Remove this correction and use the original reading if one exists?'))
                return;
            const a = this.state.apartments.find(x => x.id === id), original = a?.readings.find(r => r.date === date)?.value ?? null;
            try {
                await MeterStorage.removeCorrection(id, date, row.value, original);
                await this.refresh();
                this.notify('Correction removed');
            }
            catch (e) {
                this.fail(e);
            }
        };
        this.exportBackup = async () => {
            this.setState({ pendingImport: true, error: '' });
            try {
                const backup = await MeterStorage.makeBackup();
                MeterStorage.download(backup, `meterflow-private-backup-${new Date().toISOString().slice(0, 10)}.json`);
                this.notify('Backup downloaded — keep it private and secure');
            }
            catch (e) {
                this.fail(e);
            }
            finally {
                this.setState({ pendingImport: false });
            }
        };
        this.exportCSV = () => {
            const rows = ['block,apartment,date,reading,source'];
            for (const a of this.state.apartments) {
                const overrides = new Set(this.state.overrides.filter(o => o.apartmentId === a.id).map(o => o.date));
                for (const r of MeterEngine.getReadings(a, this.state.overrides))
                    rows.push([a.block, a.number, r.date, r.value, overrides.has(r.date) ? 'manual' : 'source'].join(','));
            }
            MeterStorage.download(new Blob([rows.join('\r\n')], { type: 'text/csv;charset=utf-8' }), 'meterflow-all-readings.csv');
            this.notify('Readings CSV exported');
        };
        this.install = async () => {
            if (this.installEvent) {
                const event = this.installEvent;
                this.installEvent = null;
                await event.prompt();
                this.forceUpdate();
            }
            else
                this.notify('iPhone: Safari → Share → Add to Home Screen. Android: browser menu → Install app.');
        };
        this.exportSaved = async (session, format) => {
            if (this.state.exportingSessionId || this.state.dailyBusy)
                return;
            this.setState({ exportingSessionId: session.id, error: '' });
            try {
                // Fresh IndexedDB snapshot: newer manually saved actual readings take precedence.
                // Never read pending draft edits or the forecast engine for a download.
                const snapshot = await MeterStorage.snapshot();
                const persisted = snapshot.sessions.find(s => s.id === session.id);
                if (!persisted || persisted.status !== 'confirmed')
                    throw Error('This block has not been confirmed and saved.');
                const rows = MeterFinalExport.confirmedRows(persisted, snapshot.apartments, snapshot.overrides);
                const blob = format === 'pdf' ? MeterFinalExport.toPdf(rows) : await MeterFinalExport.toJpeg(rows);
                MeterStorage.download(blob, MeterFinalExport.filename(persisted, format));
                this.notify(`Downloaded ${rows.length} saved final readings as ${format.toUpperCase()}`);
            }
            catch (e) {
                this.fail(e);
            }
            finally {
                this.setState({ exportingSessionId: null });
            }
        };
        this.state = { ...this.state };
    }
    componentDidMount() {
        this.refresh();
        window.addEventListener('beforeinstallprompt', this.handleInstallEvent);
        window.addEventListener('keydown', this.handleEscape);
        if ('serviceWorker' in navigator && location.protocol !== 'file:')
            navigator.serviceWorker.register('/Meterflow/sw.js').catch(() => { });
    }
    componentWillUnmount() {
        window.removeEventListener('beforeinstallprompt', this.handleInstallEvent);
        window.removeEventListener('keydown', this.handleEscape);
    }
    notify(text) { clearTimeout(this.toastTimer); this.setState({ toast: text }); this.toastTimer = setTimeout(() => this.setState({ toast: '' }), 4200); }
    fail(e) { this.setState({ error: e instanceof Error ? e.message : String(e), pendingImport: false }); }
    trigger(id) { document.getElementById(id)?.click(); }
    async importFile(file, forceDataset = false) {
        if (file.size > 25 * 1024 * 1024)
            throw Error('Choose a file under 25 MB.');
        const lower = file.name.toLowerCase();
        if (lower.endsWith('.json') || forceDataset) {
            const raw = JSON.parse(await file.text());
            if (raw?.kind === 'meterflow-backup') {
                if (this.state.apartments.length && !window.confirm('Restore this backup? It replaces all current readings, corrections and archived files on this device. Export a backup first.'))
                    return;
                await MeterStorage.restoreBackup(raw);
                this.notify('Device backup restored');
            }
            else {
                const p = MeterEngine.validateDataset(raw);
                if (this.state.apartments.length && !window.confirm(`Replace ${this.state.apartments.length} apartments with ${p.apartments.length} from this file? Existing corrections will be cleared. Export a backup first.`))
                    return;
                await MeterStorage.importDataset(p, file);
                this.notify(`${p.apartments.length} apartments loaded privately`);
            }
        }
        else if (lower.endsWith('.csv') && this.state.apartments.length) {
            const rows = MeterStorage.parseCSV(await file.text(), this.state.apartments);
            if (!window.confirm(`Apply ${rows.length} actual readings? Matching dates will be replaced by these manual values.`))
                return;
            await MeterStorage.saveMany(rows, file);
            this.notify(`${rows.length} readings imported`);
        }
        else {
            await MeterStorage.addFile(file);
            this.notify('File saved to local device vault');
        }
        await this.refresh();
        this.setState({ showImport: false });
    }
    editFor(id, date) {
        const a = this.state.apartments.find(a => a.id === id);
        if (!a)
            return;
        const target = date || this.state.date;
        const existing = MeterEngine.getReadings(a, this.state.overrides).find(r => r.date === target);
        this.setState({ selected: id, editDate: target, editValue: existing ? String(existing.value) : '', editNote: '', showEditor: true, error: '' });
    }
    datasetDate() {
        return this.state.apartments.reduce((max, a) => { const d = a.readings[a.readings.length - 1]?.date; return d && d > max ? d : max; }, '2026-10-25');
    }
    results() {
        const { apartments, overrides, date } = this.state;
        if (this.predictionsCache && this.predictionsCache.apartments === apartments && this.predictionsCache.overrides === overrides && this.predictionsCache.date === date)
            return this.predictionsCache.value;
        const value = apartments.map(a => MeterEngine.predict(a, overrides, date)).filter((v) => v !== null);
        this.predictionsCache = { apartments, overrides, date, value };
        return value;
    }
    scoped(rs) { return this.state.block === 'All' ? rs : rs.filter(r => r.apartment.block === this.state.block); }
    nav(next) { if (!this.allowLeaveDraft())
        return; this.setState({ tab: next, selected: null, search: '', showAll: false, error: '', dailyReview: false }); window.scrollTo(0, 0); }
    allowLeaveDraft() { return Object.keys(this.state.dailyEdits).length === 0 || window.confirm('You have unsaved reading edits. Leave without saving a draft?'); }
    chooseDailyScope(change) {
        if (!this.allowLeaveDraft())
            return;
        const date = change.date || this.state.date, block = change.block || this.dailyBlock();
        if (!MeterEngine.validDate(date) || date <= '2026-09-26')
            return;
        const floors = MeterDaily.floors(this.state.apartments, block);
        this.setState({ date, block, dailyFloor: floors[0] || 0, dailyEdits: {}, dailyReview: false, error: '' });
    }
    dailyBlock() { return this.state.block === 'All' ? 'A' : this.state.block; }
    currentSession() { return this.state.sessions.find(s => s.id === `${this.state.date}|${this.dailyBlock()}`); }
    dailyRows() {
        const rows = MeterDaily.buildRows(this.state.apartments, this.state.overrides, this.state.date, this.dailyBlock(), this.currentSession());
        return rows.map(r => {
            const typed = this.state.dailyEdits[r.apartmentId];
            return typed === undefined ? r : { ...r, value: /^\d+$/.test(typed) ? Number(typed) : NaN };
        });
    }
    dailyInput(row) { return React.createElement("input", { className: `daily-value-input ${row.value !== row.suggested ? 'changed' : ''}`, type: "text", inputMode: "numeric", pattern: "[0-9]*", autoComplete: "off", "aria-label": `Reading for apartment ${row.number}`, value: this.state.dailyEdits[row.apartmentId] ?? (Number.isFinite(row.value) ? String(row.value) : ''), onChange: (e) => { const value = e.target.value; this.setState((old) => ({ dailyEdits: { ...old.dailyEdits, [row.apartmentId]: value } })); } }); }
    dailyRow(row, compact = false) { return React.createElement("div", { className: `daily-row ${row.value !== row.suggested ? 'daily-row-edited' : ''}`, key: row.apartmentId },
        React.createElement("div", { className: "daily-unit" },
            React.createElement("strong", null, row.number),
            React.createElement("small", null,
                row.origin === 'recorded' ? 'Recorded baseline' : 'Predicted',
                " \u00B7 ",
                row.confidence)),
        React.createElement("div", { className: "daily-suggestion" },
            React.createElement("small", null, row.origin === 'recorded' ? 'Original' : 'Forecast'),
            React.createElement("strong", null, formatNumber(row.suggested))),
        React.createElement("div", { className: "daily-final" },
            React.createElement("small", null, compact ? 'Final reading' : 'Reading to save'),
            this.dailyInput(row))); }
    async saveDailyDraft() {
        if (this.state.dailyBusy)
            return;
        try {
            const rows = this.dailyRows();
            MeterDaily.validateRows(rows, this.state.apartments, this.state.date, this.dailyBlock());
            this.setState({ dailyBusy: true, error: '' });
            await MeterStorage.saveBlockDraft(MeterDaily.makeSession(this.state.date, this.dailyBlock(), rows, this.currentSession(), 'draft'), this.state.apartments);
            await this.refresh();
            this.setState({ dailyEdits: {}, dailyBusy: false });
            this.notify('Full block draft saved on this device');
        }
        catch (e) {
            this.setState({ dailyBusy: false });
            this.fail(e);
        }
    }
    async confirmDailyBlock() {
        if (this.state.dailyBusy || !this.state.dailyReview)
            return;
        try {
            const rows = this.dailyRows(), block = this.dailyBlock(), date = this.state.date;
            MeterDaily.validateRows(rows, this.state.apartments, date, block);
            const changed = rows.filter(r => r.value !== r.suggested).length;
            const gaps = rows.map(r => this.state.apartments.find(a => a.id === r.apartmentId)).filter((a) => !!a).map(a => MeterEngine.predict(a, this.state.overrides, date)).filter((r) => r !== null && r.actual === null);
            const maxGap = gaps.reduce((n, r) => Math.max(n, r.daysAhead), 0);
            const prompt = maxGap >= 3
                ? `Warning: Some forecasts are based on meter readings up to ${maxGap} days old. Have you physically checked ALL ${rows.length} actual readings for Block ${block} on ${date}? Confirming guesses as actual readings will make later predictions less reliable. Choose Cancel to save a draft instead.`
                : `Confirm all ${rows.length} readings for Block ${block} on ${date}? Only confirm values you have checked against actual meters (${changed} changed from the initial values).`;
            if (!window.confirm(prompt))
                return;
            this.setState({ dailyBusy: true, error: '' });
            await MeterStorage.confirmBlock(MeterDaily.makeSession(date, block, rows, this.currentSession(), 'confirmed'), this.state.apartments);
            await this.refresh();
            this.setState({ dailyEdits: {}, dailyReview: false, dailyBusy: false });
            this.notify(`Block ${block}: ${rows.length} readings confirmed and saved`);
        }
        catch (e) {
            this.setState({ dailyBusy: false });
            this.fail(e);
        }
    }
    exportButtons(session) {
        if (session.status !== 'confirmed')
            return null;
        const busy = !!this.state.exportingSessionId || this.state.dailyBusy;
        return React.createElement("div", { className: "final-export-actions", role: "group", "aria-label": `Download final readings for Block ${session.block} on ${session.date}` },
            React.createElement("button", { type: "button", className: "final-export-button", disabled: busy, onClick: () => this.exportSaved(session, 'jpeg') },
                React.createElement(Icon, { name: "download", size: 16 }),
                " Download JPEG"),
            React.createElement("button", { type: "button", className: "final-export-button", disabled: busy, onClick: () => this.exportSaved(session, 'pdf') },
                React.createElement(Icon, { name: "download", size: 16 }),
                " Download PDF"));
    }
    openSaved(s) {
        if (!this.allowLeaveDraft())
            return;
        this.setState({ date: s.date, block: s.block, dailyFloor: 0, dailyEdits: {}, dailyReview: true, tab: 'home', selected: null, error: '' });
        window.scrollTo(0, 0);
    }
    header() { return React.createElement("header", { className: "site-header" },
        React.createElement("div", { className: "header-brand" },
            React.createElement("span", { className: "brand-mark" },
                React.createElement(Icon, { name: "drop", size: 19, stroke: 2.2 })),
            React.createElement("span", { className: "brand-name" },
                "meter",
                React.createElement("span", null, "flow"),
                React.createElement("small", null, "SMART METER READINGS"))),
        React.createElement("div", { className: "header-right" },
            React.createElement("span", { className: "header-private" },
                React.createElement("span", { className: "status-pulse" }),
                "On this device"),
            React.createElement("button", { type: "button", className: "header-avatar", "aria-label": "Open settings", onClick: () => this.nav('settings') },
                React.createElement(Icon, { name: "settings", size: 20 })))); }
    blockChips() { return React.createElement("div", { className: "chips-scroll", role: "group", "aria-label": "Filter by block" }, ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].map(b => React.createElement("button", { key: b, className: `chip ${this.state.block === b ? 'active' : ''}`, type: "button", onClick: () => this.setState({ block: b }) }, b === 'All' ? 'All blocks' : `Block ${b}`))); }
    daySelector() { return React.createElement("div", { className: "date-control" },
        React.createElement("button", { className: "date-step", type: "button", "aria-label": "Previous day", onClick: () => this.setState({ date: MeterEngine.nextDate(this.state.date, -1) }) },
            React.createElement(Icon, { name: "back", size: 20 })),
        React.createElement("label", { className: "date-target" },
            React.createElement("span", { className: "date-target-caption" }, "FORECAST DATE"),
            React.createElement("span", { className: "date-target-text" },
                React.createElement(Icon, { name: "calendar", size: 15 }),
                MeterEngine.formatDate(this.state.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })),
            React.createElement("input", { "aria-label": "Choose forecast date", type: "date", min: "2026-01-01", max: "2100-12-31", value: this.state.date, onChange: (e) => { if (MeterEngine.validDate(e.target.value))
                    this.setState({ date: e.target.value }); } })),
        React.createElement("button", { className: "date-step", type: "button", "aria-label": "Next day", onClick: () => this.setState({ date: MeterEngine.nextDate(this.state.date, 1) }) },
            React.createElement(Icon, { name: "arrow", size: 20 }))); }
    topPanel(rs) {
        const scoped = this.scoped(rs);
        const delta = scoped.reduce((sum, r) => sum + r.increment, 0);
        const cautions = scoped.filter(r => r.confidence === 'Caution').length;
        const daily = scoped.length > 0 && scoped.every(r => r.daysAhead === 1);
        return React.createElement("div", { className: "top-panel-content" },
            React.createElement("section", { className: "hero-panel" },
                React.createElement("div", { className: "hero-glow" }),
                React.createElement("div", { className: "hero-content" },
                    React.createElement("div", { className: "eyebrow" },
                        React.createElement("span", { className: "eyebrow-dot" }),
                        "YOUR DAILY OVERVIEW"),
                    React.createElement("h1", null,
                        "Every drop,",
                        React.createElement("br", null),
                        React.createElement("em", null, "accounted for.")),
                    React.createElement("p", { className: "hero-description" }, "Better estimates, simpler readings, effortless corrections."),
                    this.daySelector(),
                    React.createElement("div", { className: "hero-foot" },
                        React.createElement(Icon, { name: "shield", size: 16 }),
                        React.createElement("span", null, "Corrections stay on this phone \u00B7 Works offline")))),
            React.createElement("section", { className: "stats-grid", "aria-label": "Forecast summary" },
                React.createElement("article", { className: "stat-card highlighted" },
                    React.createElement("div", { className: "stat-head" },
                        React.createElement("span", null, "PROJECTED INCREASE"),
                        React.createElement(Icon, { name: "trend", size: 19 })),
                    React.createElement("div", { className: "stat-value" },
                        "+",
                        formatNumber(delta)),
                    React.createElement("p", null,
                        daily ? 'For the selected day' : 'Since each last actual reading',
                        " \u00B7 meter units")),
                React.createElement("article", { className: "stat-card" },
                    React.createElement("div", { className: "stat-head" },
                        React.createElement("span", null, "APARTMENTS"),
                        React.createElement(Icon, { name: "building", size: 19 })),
                    React.createElement("div", { className: "stat-value" },
                        formatNumber(scoped.length),
                        React.createElement("small", null,
                            " / ",
                            this.state.apartments.length)),
                    React.createElement("p", null, this.state.block === 'All' ? 'Across all 7 blocks' : `In Block ${this.state.block}`))),
            React.createElement("div", { className: "insight-strip" },
                React.createElement("span", { className: `insight-icon ${cautions ? 'has-warn' : ''}` },
                    React.createElement(Icon, { name: cautions ? 'alert' : 'sparkle', size: 19 })),
                React.createElement("span", null,
                    React.createElement("strong", null, cautions ? `${cautions} prediction${cautions > 1 ? 's' : ''} need attention` : 'Pattern-based predictions are ready'),
                    React.createElement("small", null, daily ? 'Historical one-day exact match: 74.1% on the original October data, not a future guarantee' : 'Multi-day estimates are less reliable; confirm readings regularly')),
                React.createElement(Icon, { name: "arrow", size: 18 })));
    }
    apartmentCard(r) {
        return React.createElement("button", { type: "button", key: r.apartment.id, className: "apartment-card", onClick: () => { this.setState({ selected: r.apartment.id, error: '' }); window.scrollTo(0, 0); }, "aria-label": `Block ${r.apartment.block} apartment ${r.apartment.number}, predicted reading ${r.predicted}` },
            React.createElement("div", { className: "apartment-card-top" },
                React.createElement("span", { className: "apartment-badge" },
                    React.createElement(Icon, { name: "building", size: 16 })),
                React.createElement("div", { className: "apartment-title" },
                    React.createElement("strong", null, r.apartment.number),
                    React.createElement("span", null,
                        "Block ",
                        r.apartment.block,
                        " ",
                        React.createElement("span", { className: "bullet" }, "\u00B7"),
                        " Apartment")),
                React.createElement("span", { className: `confidence ${badgeClass(r.confidence)}` }, r.confidence)),
            React.createElement("div", { className: "apartment-card-values" },
                React.createElement("div", null,
                    React.createElement("small", null, r.daysAhead >= 3 ? 'LONG-RANGE ESTIMATE' : 'PREDICTED READING'),
                    React.createElement("div", { className: "apartment-prediction" },
                        formatNumber(r.predicted),
                        React.createElement("span", { className: "positive-delta" },
                            "+",
                            formatNumber(r.increment)))),
                React.createElement("div", { className: "spark-shell" },
                    React.createElement(MiniLine, { values: r.trend, forecast: r.predicted, height: 48 }))),
            React.createElement("div", { className: "apartment-card-bottom" },
                React.createElement("span", null,
                    "Last actual ",
                    React.createElement("strong", null, formatNumber(r.anchorReading)),
                    " ",
                    React.createElement("span", { className: "muted" },
                        "\u00B7 ",
                        compactDate(r.anchorDate))),
                React.createElement("span", { className: "card-open" },
                    "View ",
                    React.createElement(Icon, { name: "arrow", size: 14 }))));
    }
    quickPrediction(rs) {
        const block = this.state.block === 'All' ? 'A' : this.state.block;
        const units = this.state.apartments.filter(a => a.block === block).sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));
        const id = units.some(a => a.id === this.state.quickApartment) ? this.state.quickApartment : (units[0]?.id || '');
        const result = rs.find(r => r.apartment.id === id);
        return React.createElement("section", { className: "quick-predictor", "aria-label": "Predict an apartment meter reading" },
            React.createElement("div", { className: "quick-predictor-title" },
                React.createElement("span", { className: "quick-visual" },
                    React.createElement(Icon, { name: "sparkle", size: 20 })),
                React.createElement("div", null,
                    React.createElement("span", { className: "section-overline" }, "INSTANT FORECAST"),
                    React.createElement("h2", null, "Predict a meter reading"),
                    React.createElement("p", null, "Choose your date, block and apartment. The historical readings are already loaded."))),
            React.createElement("div", { className: "quick-controls" },
                React.createElement("label", { className: "quick-label" },
                    "Date to predict",
                    React.createElement("input", { "aria-label": "Prediction date", type: "date", min: "2026-09-27", max: "2100-12-31", value: this.state.date, onChange: (e) => { if (MeterEngine.validDate(e.target.value))
                            this.setState({ date: e.target.value }); } })),
                React.createElement("div", { className: "quick-control-row" },
                    React.createElement("label", { className: "quick-label" },
                        "Block",
                        React.createElement("select", { "aria-label": "Select block", value: block, onChange: (e) => this.setState({ block: e.target.value, quickApartment: '' }) }, ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(b => React.createElement("option", { key: b, value: b },
                            "Block ",
                            b)))),
                    React.createElement("label", { className: "quick-label" },
                        "Apartment",
                        React.createElement("select", { "aria-label": "Select apartment", value: id, onChange: (e) => this.setState({ quickApartment: e.target.value }) }, units.map(a => React.createElement("option", { key: a.id, value: a.id }, a.number)))))),
            React.createElement("div", { className: "quick-result", "aria-live": "polite" },
                React.createElement("div", null,
                    React.createElement("span", { className: "quick-result-label" }, result && result.daysAhead >= 3 ? 'LONG-RANGE ESTIMATE · NOT A METER READING' : 'PREDICTED METER READING'),
                    result ? React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "quick-result-number" },
                            formatNumber(result.predicted),
                            " ",
                            React.createElement("span", { className: "quick-result-delta" },
                                "+",
                                formatNumber(result.increment))),
                        React.createElement("div", { className: "quick-result-meta" },
                            "Block ",
                            block,
                            " \u00B7 Apartment ",
                            result.apartment.number,
                            " \u00B7 ",
                            MeterEngine.formatDate(this.state.date, { day: 'numeric', month: 'short', year: 'numeric' })),
                        React.createElement("div", { className: "quick-result-method" },
                            "Last recorded ",
                            formatNumber(result.anchorReading),
                            " on ",
                            compactDate(result.anchorDate),
                            " \u00B7 ",
                            result.model,
                            " \u00B7 ",
                            result.daysAhead,
                            " day",
                            result.daysAhead !== 1 ? 's' : '',
                            " ahead")) : React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "quick-result-number no-result" }, "Not available"),
                        React.createElement("div", { className: "quick-result-method" }, "Select a date after the first reading and within 366 days of the last actual reading."))),
                result ? React.createElement("button", { type: "button", className: "quick-result-button", onClick: () => { this.setState({ selected: id, error: '' }); window.scrollTo(0, 0); } },
                    "View history & correct ",
                    React.createElement(Icon, { name: "arrow", size: 17 })) : null),
            React.createElement("p", { className: "quick-disclaimer" }, "Predictions are estimates, not physical meter measurements. The algorithm now uses different methods for 1-day, 2-day, 3\u201313-day and longer forecasts. The displayed one-day historical match estimate is not a guaranteed probability. Confirm actual readings to improve future forecasts; corrections remain on your phone."));
    }
    daily(rs) {
        const block = this.dailyBlock(), levels = MeterDaily.floors(this.state.apartments, block), saved = this.currentSession();
        let rows = [];
        let unavailable = '';
        try {
            rows = this.dailyRows();
        }
        catch (e) {
            unavailable = e instanceof Error ? e.message : String(e);
        }
        const edited = rows.filter(r => r.value !== r.suggested).length;
        const total = rows.length, invalid = rows.some(r => !Number.isSafeInteger(r.value) || r.value < 0 || r.value > 1e9);
        const selectedFloor = levels.includes(this.state.dailyFloor) ? this.state.dailyFloor : levels[0];
        const shown = rows.filter(r => r.floor === selectedFloor);
        const forecasts = rs.filter(r => r.apartment.block === block && r.actual === null);
        const maxGap = forecasts.reduce((mx, r) => Math.max(mx, r.daysAhead), 0);
        const lastKnown = forecasts.length ? forecasts.map(r => r.anchorDate).sort()[0] : null;
        return React.createElement("main", { className: "main-stack daily-page" },
            React.createElement("div", { className: "daily-heading" },
                React.createElement("span", { className: "section-overline" }, "DAILY READING WORKSPACE"),
                React.createElement("h1", null,
                    "Today's readings",
                    React.createElement("span", { className: "heading-dot" }, ".")),
                React.createElement("p", null, "Choose the date and block, check each floor, then confirm the entire block once.")),
            React.createElement("div", { className: "daily-selectors" },
                React.createElement("label", { className: "quick-label" },
                    "Reading date",
                    React.createElement("input", { type: "date", "aria-label": "Reading date", min: "2026-09-27", max: "2100-12-31", value: this.state.date, onChange: (e) => this.chooseDailyScope({ date: e.target.value }) })),
                React.createElement("label", { className: "quick-label" },
                    "Select block",
                    React.createElement("select", { "aria-label": "Daily block", value: block, onChange: (e) => this.chooseDailyScope({ block: e.target.value }) }, ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(b => React.createElement("option", { key: b, value: b },
                        "Block ",
                        b))))),
            React.createElement("section", { className: "daily-status" },
                React.createElement("div", null,
                    React.createElement("span", { className: "daily-status-caption" },
                        "BLOCK ",
                        block,
                        " \u00B7 ",
                        compactDate(this.state.date)),
                    React.createElement("strong", null,
                        total,
                        " apartments"),
                    React.createElement("small", null,
                        saved?.status === 'confirmed' ? (saved.draftRows ? 'Confirmed · draft changes pending' : 'Confirmed & saved') : saved ? 'Draft saved on device' : 'Not yet confirmed',
                        edited ? ` · ${edited} edited` : '')),
                React.createElement("div", { className: `daily-status-symbol ${saved?.status === 'confirmed' ? 'confirmed' : ''}` },
                    React.createElement(Icon, { name: saved?.status === 'confirmed' ? 'shield' : 'building', size: 23 }))),
            saved?.status === 'confirmed' ? React.createElement("section", { className: "final-export-panel" },
                React.createElement("strong", null, "Download saved final readings"),
                React.createElement("p", null,
                    "Block ",
                    block,
                    " \u00B7 ",
                    saved.date,
                    " \u00B7 Confirmed values only. Unsaved edits and forecasts are excluded."),
                this.exportButtons(saved)) : null,
            maxGap >= 3 ? React.createElement("div", { className: "daily-forecast-warning", role: "alert" },
                React.createElement(Icon, { name: "alert", size: 20 }),
                React.createElement("div", null,
                    React.createElement("strong", null,
                        maxGap,
                        "-day forecast gap \u2014 predictions are not meter readings"),
                    React.createElement("p", null,
                        "The latest known reading for some apartments is ",
                        lastKnown ? MeterEngine.formatDate(lastKnown) : 'unavailable',
                        ". These estimates may differ from the meters. Check actual values before confirmation; otherwise save a draft. New confirmed actuals improve the next day's forecast."))) : null,
            unavailable ? React.createElement(EmptyState, { icon: "calendar", title: "No readings for this date", text: unavailable }) : this.state.dailyReview ? React.createElement(React.Fragment, null,
                React.createElement("div", { className: "daily-review-top" },
                    React.createElement("button", { className: "back-button", type: "button", onClick: () => this.setState({ dailyReview: false }) },
                        React.createElement(Icon, { name: "back", size: 17 }),
                        " Return to floors"),
                    React.createElement("span", { className: "review-chip" }, "Full block review")),
                React.createElement("div", { className: "daily-section-title" },
                    React.createElement("h2", null,
                        "Review all ",
                        total,
                        " apartments"),
                    React.createElement("p", null, "Every floor is shown below. You can edit any reading here before confirming the entire block.")),
                React.createElement("div", { className: "daily-review-summary" },
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "check", size: 16 }),
                        " ",
                        total,
                        " readings ready"),
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "edit", size: 16 }),
                        " ",
                        edited,
                        " adjusted")),
                levels.map(level => React.createElement("section", { className: "daily-floor-section", key: level },
                    React.createElement("div", { className: "daily-floor-title" },
                        React.createElement("strong", null, MeterDaily.floorLabel(level)),
                        React.createElement("small", null,
                            rows.filter(r => r.floor === level).length,
                            " apartments")),
                    React.createElement("div", { className: "daily-rows" }, rows.filter(r => r.floor === level).map(r => this.dailyRow(r, true))))),
                React.createElement("div", { className: "daily-review-actions" },
                    React.createElement("p", null,
                        React.createElement(Icon, { name: "info", size: 17 }),
                        " Confirming means you have checked and accepted each displayed reading as an actual meter reading. All ",
                        total,
                        " readings are saved together and used for later predictions."),
                    React.createElement("button", { type: "button", className: "primary-button", disabled: invalid || this.state.dailyBusy, onClick: () => this.confirmDailyBlock() },
                        React.createElement(Icon, { name: "check", size: 19 }),
                        this.state.dailyBusy ? 'Saving…' : `Confirm & save all ${total} readings`),
                    React.createElement("button", { type: "button", className: "daily-secondary", disabled: invalid || this.state.dailyBusy, onClick: () => this.saveDailyDraft() },
                        React.createElement(Icon, { name: "download", size: 17 }),
                        " Save edits as draft instead"))) : React.createElement(React.Fragment, null,
                React.createElement("div", { className: "daily-section-title" },
                    React.createElement("h2", null, "Select a floor"),
                    React.createElement("p", null, "Ground floor comes first, followed by Floor 1, Floor 2 and higher floors.")),
                React.createElement("div", { className: "daily-floor-tabs", role: "group", "aria-label": "Select floor" }, levels.map(level => React.createElement("button", { key: level, type: "button", "aria-pressed": selectedFloor === level, className: selectedFloor === level ? 'selected' : '', onClick: () => this.setState({ dailyFloor: level }) }, level === 0 ? 'Ground' : `Floor ${level}`))),
                React.createElement("div", { className: "daily-floor-title" },
                    React.createElement("strong", null, MeterDaily.floorLabel(selectedFloor)),
                    React.createElement("small", null,
                        shown.length,
                        " apartments")),
                React.createElement("div", { className: "daily-rows" }, shown.map(row => this.dailyRow(row))),
                React.createElement("div", { className: "daily-floor-actions" },
                    React.createElement("button", { type: "button", className: "primary-button", disabled: invalid || this.state.dailyBusy || !total, onClick: () => { this.setState({ dailyReview: true, error: '' }); window.scrollTo(0, 0); } },
                        " ",
                        React.createElement(Icon, { name: "file", size: 19 }),
                        " Preview entire Block ",
                        block,
                        " (",
                        total,
                        ")"),
                    React.createElement("button", { className: "daily-secondary", disabled: invalid || this.state.dailyBusy || !total, type: "button", onClick: () => this.saveDailyDraft() },
                        React.createElement(Icon, { name: "download", size: 18 }),
                        " Save draft and continue later")),
                React.createElement("p", { className: "daily-help" }, "Switch floors freely: changes stay in this workspace. A draft is not an actual reading until you confirm the entire block.")),
            this.state.error ? React.createElement("div", { className: "daily-form-error", role: "alert" }, this.state.error) : null);
    }
    records() {
        const sessions = this.state.sessions.slice().sort((a, b) => b.date.localeCompare(a.date) || a.block.localeCompare(b.block));
        const dates = [...new Set(sessions.map(s => s.date))];
        return React.createElement("main", { className: "main-stack daily-records" },
            React.createElement("div", { className: "page-title" },
                React.createElement("span", { className: "section-overline" }, "YOUR SAVED WORK"),
                React.createElement("h1", null,
                    "Daily records",
                    React.createElement("span", { className: "heading-dot" }, ".")),
                React.createElement("p", null, "Reopen yesterday's block, review every apartment and make changes. Saved records stay on this phone.")),
            sessions.length ? React.createElement(React.Fragment, null,
                React.createElement("div", { className: "records-summary" },
                    React.createElement(Icon, { name: "clock", size: 21 }),
                    React.createElement("div", null,
                        React.createElement("strong", null,
                            sessions.filter(s => s.status === 'confirmed').length,
                            " confirmed block records"),
                        React.createElement("small", null,
                            dates.length,
                            " recorded dates \u00B7 ",
                            sessions.filter(s => s.status === 'draft' || s.draftRows?.length).length,
                            " with pending drafts"))),
                dates.map(date => React.createElement("section", { className: "records-day", key: date },
                    React.createElement("div", { className: "daily-floor-title" },
                        React.createElement("strong", null, MeterEngine.formatDate(date, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })),
                        React.createElement("small", null,
                            sessions.filter(s => s.date === date).length,
                            " blocks")),
                    sessions.filter(s => s.date === date).map(session => React.createElement("div", { className: "record-entry", key: session.id },
                        React.createElement("button", { type: "button", className: "record-link", onClick: () => this.openSaved(session) },
                            React.createElement("span", { className: "record-block" }, session.block),
                            React.createElement("span", null,
                                React.createElement("strong", null,
                                    "Block ",
                                    session.block),
                                React.createElement("small", null,
                                    session.rows.length,
                                    " apartments \u00B7 ",
                                    session.status === 'confirmed' ? 'Confirmed' : 'Draft',
                                    session.draftRows?.length ? ' · pending edits' : '')),
                            React.createElement(Icon, { name: "arrow", size: 19 })),
                        this.exportButtons(session)))))) : React.createElement(EmptyState, { icon: "file", title: "No saved days yet", text: "Choose a date and block on the Daily tab. Save a draft or confirm the entire block to see it here." }),
            this.state.error ? React.createElement("div", { className: "daily-form-error", role: "alert" }, this.state.error) : null,
            React.createElement("div", { className: "section-header" },
                React.createElement("h2", null, "Change history")),
            React.createElement("div", { className: "records-audit" }, this.state.activities.filter(e => ['block-confirmed', 'block-draft'].includes(e.kind)).slice(0, 10).map((event, i) => React.createElement("div", { className: "audit-line", key: event.id ?? i },
                React.createElement(Icon, { name: "clock", size: 16 }),
                React.createElement("span", null,
                    event.note,
                    React.createElement("small", null, new Date(event.timestamp).toLocaleString('en-GB')))))));
    }
    home(rs) {
        const scoped = this.scoped(rs);
        const list = scoped.slice().sort((a, b) => a.apartment.block.localeCompare(b.apartment.block) || a.apartment.number.localeCompare(b.apartment.number, undefined, { numeric: true }));
        return React.createElement("main", { className: "main-stack" },
            React.createElement("div", { className: "section-intro" },
                React.createElement("div", null,
                    React.createElement("span", { className: "section-overline" }, "OVERVIEW"),
                    React.createElement("h2", null, "Good to see you.")),
                React.createElement("div", { className: "today-chip" },
                    React.createElement(Icon, { name: "calendar", size: 14 }),
                    compactDate(this.state.date))),
            this.quickPrediction(rs),
            this.topPanel(rs),
            React.createElement("div", { className: "section-header" },
                React.createElement("div", null,
                    React.createElement("h2", null, "Browse blocks"),
                    React.createElement("p", null, "Find the apartments you manage"))),
            this.blockChips(),
            React.createElement("div", { className: "section-header list-heading" },
                React.createElement("div", null,
                    React.createElement("h2", null, "Apartment forecasts"),
                    React.createElement("p", null,
                        scoped.length,
                        " predictions for ",
                        compactDate(this.state.date))),
                React.createElement("button", { className: "text-action", onClick: () => this.nav('apartments'), type: "button" },
                    "View all ",
                    React.createElement(Icon, { name: "arrow", size: 15 }))),
            list.length ? React.createElement("div", { className: "card-list" }, list.slice(0, 6).map(r => this.apartmentCard(r))) : React.createElement(EmptyState, { icon: "calendar", title: "No forecast available", text: "Choose a date after the first stored reading." }),
            React.createElement("div", { className: "small-print" },
                React.createElement(Icon, { name: "info", size: 16 }),
                React.createElement("span", null, "Predictions are estimates, not measured usage. Open an apartment to record a verified reading.")));
    }
    apartmentList(rs) {
        const scoped = this.scoped(rs).filter(r => `${r.apartment.number} ${r.apartment.block} ${r.apartment.type}`.toLowerCase().includes(this.state.search.trim().toLowerCase()));
        const list = scoped.sort((a, b) => this.state.sort === 'attention' ? ((a.confidence === 'Caution' ? 0 : 1) - (b.confidence === 'Caution' ? 0 : 1) || a.apartment.block.localeCompare(b.apartment.block) || a.apartment.number.localeCompare(b.apartment.number, undefined, { numeric: true })) : a.apartment.block.localeCompare(b.apartment.block) || a.apartment.number.localeCompare(b.apartment.number, undefined, { numeric: true }));
        return React.createElement("main", { className: "main-stack" },
            React.createElement("div", { className: "page-title" },
                React.createElement("span", { className: "section-overline" }, "DIRECTORY"),
                React.createElement("h1", null,
                    "All apartments",
                    React.createElement("span", { className: "heading-dot" }, ".")),
                React.createElement("p", null, "Search, forecast and correct in one place.")),
            React.createElement("div", { className: "directory-date" }, this.daySelector()),
            React.createElement("label", { className: "search-field" },
                React.createElement(Icon, { name: "search", size: 20 }),
                React.createElement("input", { autoComplete: "off", type: "search", value: this.state.search, onChange: (e) => this.setState({ search: e.target.value }), placeholder: "Search apartment, block or type", "aria-label": "Search apartments" }),
                this.state.search ? React.createElement("button", { onClick: () => this.setState({ search: '' }), "aria-label": "Clear search" },
                    React.createElement(Icon, { name: "close", size: 16 })) : null),
            React.createElement("div", { className: "list-filters" },
                this.blockChips(),
                React.createElement("select", { "aria-label": "Sort apartment list", value: this.state.sort, onChange: (e) => this.setState({ sort: e.target.value }) },
                    React.createElement("option", { value: "number" }, "Apartment order"),
                    React.createElement("option", { value: "attention" }, "Needs attention first"))),
            React.createElement("div", { className: "directory-summary" },
                React.createElement("strong", null, list.length),
                " matching apartments ",
                React.createElement("span", null, "\u00B7"),
                " ",
                React.createElement("span", null, compactDate(this.state.date))),
            list.length ? React.createElement("div", { className: "card-list" }, list.map(r => this.apartmentCard(r))) : React.createElement(EmptyState, { icon: "search", title: "No apartments found", text: "Try a different apartment number, block or forecast date." }));
    }
    detail(r) {
        const readings = MeterEngine.getReadings(r.apartment, this.state.overrides);
        const corrected = this.state.overrides.filter(o => o.apartmentId === r.apartment.id).sort((a, b) => b.date.localeCompare(a.date));
        const totalActual = readings.length;
        return React.createElement("main", { className: "detail-view" },
            React.createElement("div", { className: "detail-top" },
                React.createElement("button", { className: "back-button", type: "button", onClick: () => this.setState({ selected: null }) },
                    React.createElement(Icon, { name: "back", size: 20 }),
                    " ",
                    React.createElement("span", null, "Back to apartments")),
                React.createElement("span", { className: "detail-block" },
                    "BLOCK ",
                    r.apartment.block)),
            React.createElement("div", { className: "detail-heading" },
                React.createElement("span", { className: "section-overline" }, "APARTMENT PROFILE"),
                React.createElement("h1", null,
                    r.apartment.number,
                    React.createElement("span", { className: "heading-dot" }, ".")),
                React.createElement("p", null,
                    r.apartment.type || 'Apartment',
                    " ",
                    React.createElement("span", { className: "bullet" }, "\u00B7"),
                    " ",
                    totalActual,
                    " stored readings")),
            React.createElement("section", { className: "detail-hero" },
                React.createElement("div", { className: "detail-hero-top" },
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "sparkle", size: 17 }),
                        " PREDICTION FOR ",
                        compactDate(r.targetDate).toUpperCase()),
                    React.createElement("span", { className: `confidence ${badgeClass(r.confidence)}` }, r.confidence)),
                React.createElement("div", { className: "big-meter" },
                    formatNumber(r.predicted),
                    React.createElement("small", null, "meter units \u00B7 estimated")),
                React.createElement("div", { className: "forecast-delta" },
                    React.createElement("span", null,
                        "+",
                        formatNumber(r.increment),
                        " since ",
                        compactDate(r.anchorDate)),
                    React.createElement("span", null,
                        r.daysAhead,
                        " day",
                        r.daysAhead !== 1 ? 's' : '',
                        " ahead")),
                React.createElement("div", { className: "detail-spark" },
                    React.createElement(MiniLine, { values: r.trend, forecast: r.predicted, height: 105, width: 310 }))),
            r.actual !== null ? React.createElement("div", { className: "actual-info" },
                React.createElement(Icon, { name: "check", size: 19 }),
                React.createElement("div", null,
                    React.createElement("strong", null,
                        r.isCorrected ? 'Manually saved reading' : 'Recorded source reading',
                        " on this date: ",
                        formatNumber(r.actual)),
                    React.createElement("span", null, "Actual readings are shown separately from the forecast, so you can compare them."))) : null,
            r.warnings.length ? React.createElement("div", { className: "warnings-box" },
                React.createElement(Icon, { name: "alert", size: 19 }),
                React.createElement("span", null, r.warnings.join(' · '))) : null,
            React.createElement("div", { className: "metrics-row" },
                React.createElement("div", { className: "mini-metric" },
                    React.createElement("small", null, "LAST ACTUAL"),
                    React.createElement("strong", null, formatNumber(r.anchorReading)),
                    React.createElement("span", null, compactDate(r.anchorDate))),
                React.createElement("div", { className: "mini-metric" },
                    React.createElement("small", null, "EXACT-HIT EST."),
                    React.createElement("strong", null, r.likelihood === null ? '—' : `${r.likelihood}%`),
                    React.createElement("span", null, r.daysAhead === 1 ? 'Retrospective estimate, not guaranteed' : 'Not rated for multi-day')),
                React.createElement("div", { className: "mini-metric" },
                    React.createElement("small", null, "METHOD"),
                    React.createElement("strong", { className: "mini-metric-model" }, r.model),
                    React.createElement("span", null,
                        r.validation.hits,
                        "/",
                        r.validation.trials,
                        " past tests"))),
            React.createElement("div", { className: "section-header detail-subheader" },
                React.createElement("div", null,
                    React.createElement("h2", null, "Daily consumption"),
                    React.createElement("p", null, "Recent changes in cumulative readings"))),
            React.createElement("div", { className: "daily-ledger" }, r.recentDeltas.length ? r.recentDeltas.slice().reverse().map(d => React.createElement("div", { key: d.date, className: "daily-row" },
                React.createElement("span", null, MeterEngine.formatDate(d.date, { weekday: 'short', day: 'numeric', month: 'short', year: undefined })),
                React.createElement("div", { className: "bar-track" },
                    React.createElement("div", { className: `bar-fill ${d.flag ? 'bar-alert' : ''}`, style: { width: `${Math.min(100, Math.abs(d.delta) / Math.max(1, ...r.recentDeltas.map(x => Math.abs(x.delta))) * 100)}%` } })),
                React.createElement("strong", { className: d.flag ? 'danger-text' : '' },
                    d.delta >= 0 ? '+' : '',
                    d.delta))) : React.createElement("p", { className: "quiet-note" }, "No consecutive historical readings available.")),
            React.createElement("div", { className: "data-method" },
                React.createElement(Icon, { name: "info", size: 18 }),
                React.createElement("p", null,
                    "Predictions use earlier readings only. Daily differences of 0\u20135 train the model; negative changes and jumps above 5 stay visible but are excluded from normal consumption patterns. ",
                    r.reference ? `One-day historical reference: ${formatNumber(r.reference[0])}–${formatNumber(r.reference[1])}.` : '')),
            corrected.length ? React.createElement("section", { className: "correction-list" },
                React.createElement("div", { className: "section-header" },
                    React.createElement("h2", null, "Saved corrections"),
                    React.createElement("span", { className: "tiny-tag" }, corrected.length)),
                corrected.map(o => React.createElement("div", { key: o.id, className: "correction-row" },
                    React.createElement("div", null,
                        React.createElement("strong", null,
                            compactDate(o.date),
                            " \u00B7 ",
                            formatNumber(o.value)),
                        React.createElement("small", null,
                            o.note || 'Manual reading',
                            " ")),
                    React.createElement("div", { className: "correction-actions" },
                        React.createElement("button", { type: "button", "aria-label": `Edit correction ${o.date}`, onClick: () => this.editFor(r.apartment.id, o.date) },
                            React.createElement(Icon, { name: "edit", size: 17 })),
                        React.createElement("button", { type: "button", "aria-label": `Remove correction ${o.date}`, onClick: () => this.deleteCorrection(r.apartment.id, o.date) },
                            React.createElement(Icon, { name: "trash", size: 17 })))))) : null,
            React.createElement("div", { className: "sticky-action" },
                React.createElement("button", { className: "primary-button", type: "button", onClick: () => this.editFor(r.apartment.id) },
                    React.createElement(Icon, { name: "edit", size: 19 }),
                    " Enter or correct a reading")));
    }
    activity() { return React.createElement("main", { className: "main-stack" },
        React.createElement("div", { className: "page-title" },
            React.createElement("span", { className: "section-overline" }, "YOUR CHANGES"),
            React.createElement("h1", null,
                "Activity",
                React.createElement("span", { className: "heading-dot" }, ".")),
            React.createElement("p", null, "A local record of imports and manual corrections.")),
        !this.state.activities.length ? React.createElement(EmptyState, { icon: "clock", title: "Nothing here yet", text: "Imported data and corrected readings will appear here." }) : React.createElement("div", { className: "activity-list" }, this.state.activities.map((a, i) => React.createElement("article", { key: a.id ?? i, className: "activity-item" },
            React.createElement("div", { className: `activity-icon ${a.kind === 'correction' ? 'activity-edit' : ''}` },
                React.createElement(Icon, { name: a.kind === 'correction' ? 'edit' : a.kind === 'revert' ? 'refresh' : a.kind === 'file' || a.kind === 'file-deleted' ? 'file' : 'upload', size: 18 })),
            React.createElement("div", { className: "activity-content" },
                React.createElement("div", { className: "activity-item-top" },
                    React.createElement("strong", null, a.kind === 'correction' ? 'Reading corrected' : a.kind === 'revert' ? 'Correction removed' : a.kind === 'dataset' ? 'Dataset imported' : a.kind === 'csv' ? 'CSV readings imported' : a.kind === 'backup' ? 'Backup restored' : a.kind === 'file-deleted' ? 'Archived file deleted' : 'File archived'),
                    React.createElement("time", null, new Date(a.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))),
                a.apartmentId ? React.createElement("p", null,
                    React.createElement("b", null, a.apartmentId.replace(':', ' · ')),
                    " \u00B7 ",
                    compactDate(a.date || '')) : null,
                a.kind === 'correction' || a.kind === 'revert' ? React.createElement("div", { className: "change-inline" },
                    formatNumber(a.before),
                    " ",
                    React.createElement(Icon, { name: "arrow", size: 14 }),
                    " ",
                    React.createElement("strong", null, formatNumber(a.after))) : null,
                a.note ? React.createElement("p", { className: "activity-note" }, a.note) : null,
                a.count ? React.createElement("p", { className: "activity-note" },
                    a.count,
                    " entries") : null))))); }
    settings() {
        return React.createElement("main", { className: "main-stack settings-page" },
            React.createElement("div", { className: "page-title" },
                React.createElement("span", { className: "section-overline" }, "YOUR WORKSPACE"),
                React.createElement("h1", null,
                    "Settings",
                    React.createElement("span", { className: "heading-dot" }, ".")),
                React.createElement("p", null, "Everything saved locally on this device.")),
            React.createElement("section", { className: "privacy-card" },
                React.createElement("div", { className: "privacy-symbol" },
                    React.createElement(Icon, { name: "shield", size: 25 })),
                React.createElement("div", null,
                    React.createElement("strong", null, "Built-in readings. Local corrections."),
                    React.createElement("p", null, "The historical apartment readings are published with this website so forecasts work immediately. Your corrections, imported files, and backups remain in this device's IndexedDB; they are not automatically uploaded."))),
            React.createElement("div", { className: "section-header" },
                React.createElement("h2", null, "Your data")),
            React.createElement("div", { className: "settings-group" },
                React.createElement("div", { className: "settings-row" },
                    React.createElement("div", { className: "settings-row-icon" },
                        React.createElement(Icon, { name: "building", size: 20 })),
                    React.createElement("span", null,
                        React.createElement("strong", null, this.state.meta?.name || 'Historical readings included'),
                        React.createElement("small", null,
                            this.state.apartments.length,
                            " apartments \u00B7 ",
                            this.state.overrides.length,
                            " manual readings")),
                    React.createElement(Icon, { name: "check", size: 18 })),
                React.createElement("button", { type: "button", className: "settings-row interactive", onClick: () => this.trigger('data-input') },
                    React.createElement("div", { className: "settings-row-icon" },
                        React.createElement(Icon, { name: "upload", size: 20 })),
                    React.createElement("span", null,
                        React.createElement("strong", null, "Restore or replace dataset (optional)"),
                        React.createElement("small", null, "Optional JSON backup or new dataset")),
                    React.createElement(Icon, { name: "arrow", size: 19 })),
                React.createElement("button", { type: "button", className: "settings-row interactive", onClick: () => this.trigger('csv-input') },
                    React.createElement("div", { className: "settings-row-icon" },
                        React.createElement(Icon, { name: "plus", size: 20 })),
                    React.createElement("span", null,
                        React.createElement("strong", null, "Import actual readings"),
                        React.createElement("small", null, "CSV \u00B7 block, apartment, date, reading")),
                    React.createElement(Icon, { name: "arrow", size: 19 })),
                React.createElement("button", { type: "button", className: "settings-row interactive", disabled: !this.state.apartments.length, onClick: this.exportBackup },
                    React.createElement("div", { className: "settings-row-icon" },
                        React.createElement(Icon, { name: "download", size: 20 })),
                    React.createElement("span", null,
                        React.createElement("strong", null, "Export full private backup"),
                        React.createElement("small", null, "Readings, corrections, audit trail & archived files")),
                    React.createElement(Icon, { name: "arrow", size: 19 })),
                React.createElement("button", { type: "button", className: "settings-row interactive", disabled: !this.state.apartments.length, onClick: this.exportCSV },
                    React.createElement("div", { className: "settings-row-icon" },
                        React.createElement(Icon, { name: "file", size: 20 })),
                    React.createElement("span", null,
                        React.createElement("strong", null, "Export readings CSV"),
                        React.createElement("small", null, "All original and corrected meter values")),
                    React.createElement(Icon, { name: "arrow", size: 19 }))),
            React.createElement("div", { className: "section-header vault-header" },
                React.createElement("div", null,
                    React.createElement("h2", null, "Device file vault"),
                    React.createElement("p", null, "Preserve Excel files, reports and backups")),
                React.createElement("button", { className: "small-primary", type: "button", onClick: () => this.trigger('vault-input') },
                    React.createElement(Icon, { name: "plus", size: 16 }),
                    " Add file")),
            React.createElement("div", { className: "vault-list" }, this.state.files.length ? this.state.files.map(f => React.createElement("div", { className: "vault-row", key: f.id },
                React.createElement("span", { className: "vault-file-icon" },
                    React.createElement(Icon, { name: "file", size: 20 })),
                React.createElement("div", { className: "vault-name" },
                    React.createElement("strong", { title: f.name }, f.name),
                    React.createElement("small", null,
                        (f.size / 1024).toFixed(1),
                        " KB \u00B7 ",
                        new Date(f.addedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))),
                React.createElement("button", { type: "button", "aria-label": `Download ${f.name}`, onClick: () => MeterStorage.download(f.data, f.name) },
                    React.createElement(Icon, { name: "download", size: 18 })),
                React.createElement("button", { type: "button", "aria-label": `Delete ${f.name}`, onClick: () => { if (window.confirm(`Delete ${f.name} from this device?`))
                        MeterStorage.deleteFile(f.id, f.name).then(() => this.refresh()).catch(e => this.fail(e)); } },
                    React.createElement(Icon, { name: "trash", size: 18 })))) : React.createElement("div", { className: "vault-empty" },
                React.createElement(Icon, { name: "file", size: 25 }),
                React.createElement("strong", null, "Your vault is empty"),
                React.createElement("span", null, "Add an Excel workbook, a report or any file up to 25 MB."))),
            React.createElement("div", { className: "section-header" },
                React.createElement("h2", null, "Install on your phone")),
            React.createElement("div", { className: "install-card" },
                React.createElement("div", { className: "install-icon" },
                    React.createElement(Icon, { name: "download", size: 24 })),
                React.createElement("div", null,
                    React.createElement("strong", null, "Use MeterFlow like an app"),
                    React.createElement("p", null, "Install from your browser for a full-screen mobile experience. Works offline after the first online load.")),
                React.createElement("button", { type: "button", className: "outline-button", onClick: this.install }, "Install / instructions")),
            React.createElement("div", { className: "disclaimer" },
                React.createElement(Icon, { name: "info", size: 18 }),
                React.createElement("p", null,
                    React.createElement("strong", null, "Important:"),
                    " IndexedDB is specific to this browser and phone. It is not cloud sync. The data is not app-encrypted: protect your phone. Browser data clearing or uninstalling may erase it. Export and protect a private backup regularly. On iPhone, install from Safari; on Android, use Chrome's install option. Forecasts are estimates, not meter measurements or bills.")),
            React.createElement("div", { className: "settings-footer" },
                "METERFLOW / MOBILE EDITION ",
                React.createElement("span", null, "v1.5 \u00B7 Offline-first")));
    }
    editor() {
        if (!this.state.selected || !this.state.showEditor)
            return null;
        const a = this.state.apartments.find(a => a.id === this.state.selected);
        if (!a)
            return null;
        const same = this.state.overrides.find(o => o.apartmentId === a.id && o.date === this.state.editDate);
        const existing = MeterEngine.getReadings(a, this.state.overrides).find(r => r.date === this.state.editDate);
        return React.createElement("div", { className: "modal-shade", role: "presentation", onClick: () => this.setState({ showEditor: false }) },
            React.createElement("div", { className: "edit-sheet", role: "dialog", "aria-modal": "true", "aria-labelledby": "edit-sheet-title", onClick: (e) => e.stopPropagation() },
                React.createElement("div", { className: "sheet-handle" }),
                React.createElement("div", { className: "sheet-title" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "section-overline" }, "RECORD AN ACTUAL"),
                        React.createElement("h2", { id: "edit-sheet-title" },
                            "Apartment ",
                            a.number),
                        React.createElement("p", null,
                            "Block ",
                            a.block,
                            " \u00B7 Update a meter reading")),
                    React.createElement("button", { className: "close-button", type: "button", "aria-label": "Close", onClick: () => this.setState({ showEditor: false }) },
                        React.createElement(Icon, { name: "close", size: 21 }))),
                React.createElement("form", { onSubmit: this.saveCorrection },
                    React.createElement("label", { className: "form-label" },
                        "Reading date",
                        React.createElement("input", { type: "date", min: "2000-01-01", max: "2100-12-31", value: this.state.editDate, required: true, onChange: (e) => { const date = e.target.value; const current = MeterEngine.getReadings(a, this.state.overrides).find(r => r.date === date); this.setState({ editDate: date, editValue: current ? String(current.value) : '' }); } })),
                    React.createElement("label", { className: "form-label" },
                        "Actual meter reading ",
                        React.createElement("span", null, "(whole number)"),
                        React.createElement("div", { className: "number-input-wrap" },
                            React.createElement(Icon, { name: "drop", size: 20 }),
                            React.createElement("input", { inputMode: "numeric", pattern: "[0-9]+", type: "text", autoComplete: "off", placeholder: "e.g. 2230", value: this.state.editValue, onChange: (e) => this.setState({ editValue: e.target.value }), required: true }))),
                    existing ? React.createElement("div", { className: "sheet-current" },
                        React.createElement(Icon, { name: "info", size: 17 }),
                        " Saved on this date: ",
                        React.createElement("strong", null, formatNumber(existing.value)),
                        same ? ' · manual correction' : ' · original source') : null,
                    React.createElement("label", { className: "form-label" },
                        "Note ",
                        React.createElement("span", null, "(optional)"),
                        React.createElement("textarea", { rows: 2, maxLength: 300, value: this.state.editNote, onChange: (e) => this.setState({ editNote: e.target.value }), placeholder: "e.g. Photo verified, manual check..." })),
                    this.state.error ? React.createElement("p", { className: "form-error" }, this.state.error) : null,
                    React.createElement("button", { className: "primary-button save-button", type: "submit" },
                        React.createElement(Icon, { name: "check", size: 19 }),
                        " Save actual reading"),
                    React.createElement("p", { className: "sheet-tip" }, "Saving recalculates all future forecasts using the corrected history. The original source value stays recoverable."))));
    }
    onboard() { return React.createElement("div", { className: "onboard" },
        React.createElement("div", { className: "onboard-content" },
            React.createElement("h1", null, "Readings not available"),
            React.createElement("p", null, "MeterFlow includes the historical readings automatically. Reload to try again, or check that your browser allows local storage."),
            React.createElement("button", { className: "primary-button", onClick: this.refresh, type: "button" }, "Retry loading readings"))); }
    renderFooter() { const tabs = [{ id: 'home', label: 'Daily', icon: 'calendar' }, { id: 'apartments', label: 'Browse', icon: 'building' }, { id: 'records', label: 'Saved', icon: 'clock' }, { id: 'settings', label: 'Settings', icon: 'settings' }]; return React.createElement("nav", { className: "bottom-nav", "aria-label": "Main navigation" }, tabs.map(t => React.createElement("button", { key: t.id, className: `tab-item ${this.state.tab === t.id ? 'selected' : ''}`, type: "button", onClick: () => this.nav(t.id), "aria-current": this.state.tab === t.id ? 'page' : undefined },
        React.createElement("span", { className: "tab-icon" },
            React.createElement(Icon, { name: t.icon, size: 21 })),
        React.createElement("span", null, t.label)))); }
    render() {
        if (this.state.loading)
            return React.createElement("div", { className: "loading-app" },
                React.createElement("div", { className: "loading-brand" },
                    React.createElement(Icon, { name: "drop", size: 40 })),
                React.createElement("h2", null, "meterflow"),
                React.createElement("p", null, "Loading historical readings and predictions\u2026"));
        if (!this.state.ready)
            return React.createElement("div", { className: "error-screen" },
                React.createElement(Icon, { name: "alert", size: 36 }),
                React.createElement("h2", null, "Device storage unavailable"),
                React.createElement("p", null, this.state.error || 'IndexedDB could not be opened.'),
                React.createElement("p", null, "Open the app in a regular Safari or Chrome tab over HTTPS. Private browsing or strict storage restrictions can prevent offline saving."),
                React.createElement("button", { className: "primary-button", type: "button", onClick: this.refresh }, "Try again"));
        const rs = this.results();
        const selected = this.state.selected ? rs.find(r => r.apartment.id === this.state.selected) : null;
        return React.createElement("div", { className: "app-shell" },
            React.createElement("input", { className: "hidden-input", id: "data-input", type: "file", accept: ".json,application/json", onChange: (e) => this.onFile(e, true) }),
            React.createElement("input", { className: "hidden-input", id: "csv-input", type: "file", accept: ".csv,text/csv", onChange: (e) => this.onFile(e) }),
            React.createElement("input", { className: "hidden-input", id: "vault-input", type: "file", onChange: (e) => this.onVaultFile(e) }),
            this.state.apartments.length ? React.createElement("div", null,
                this.header(),
                selected ? this.detail(selected) : this.state.tab === 'home' ? this.daily(rs) : this.state.tab === 'apartments' ? this.apartmentList(rs) : this.state.tab === 'records' ? this.records() : this.state.tab === 'activity' ? this.activity() : this.settings(),
                !selected ? this.renderFooter() : null,
                this.editor()) : React.createElement("div", null,
                this.header(),
                this.onboard()),
            this.state.toast ? React.createElement("div", { className: "toast", role: "status" },
                React.createElement(Icon, { name: "check", size: 17 }),
                this.state.toast) : null,
            this.state.error && !this.state.showEditor && this.state.apartments.length ? React.createElement("div", { className: "error-toast", role: "alert" },
                React.createElement(Icon, { name: "alert", size: 18 }),
                React.createElement("span", null, this.state.error),
                React.createElement("button", { type: "button", "aria-label": "Dismiss error", onClick: () => this.setState({ error: '' }) },
                    React.createElement(Icon, { name: "close", size: 17 }))) : null);
    }
}
ReactDOM.render(React.createElement(MeterFlowApp, null), document.getElementById('root'));
