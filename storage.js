"use strict";
/** Offline local storage. Data is not transmitted to the hosting provider. */
var MeterStorage;
(function (MeterStorage) {
    const NAME = 'meterflow-private-v1';
    let cached = null;
    // A revision is written in the same IndexedDB transaction as each mutation.
    // Independently opened tabs keep their own lastSeenRevision; a stale tab
    // must refresh before overwriting another tab's data.
    let lastSeenRevision = 0;
    const CONFLICT = 'This device data changed in another tab. Reload the app before saving again; your newer data has not been overwritten.';
    async function mutate(stores, apply) {
        const db = await open();
        const tx = db.transaction([...new Set([...stores, 'meta'])], 'readwrite');
        const done = complete(tx);
        const revStore = tx.objectStore('meta');
        let conflict = false, mutationError = null;
        const revRequest = revStore.get('revision');
        revRequest.onsuccess = () => {
            const current = revRequest.result?.value || 0;
            if (current !== lastSeenRevision) {
                conflict = true;
                tx.abort();
                return;
            }
            try {
                apply(tx);
                revStore.put({ key: 'revision', value: current + 1 });
            }
            catch (e) {
                mutationError = e;
                tx.abort();
            }
        };
        try {
            await done;
            lastSeenRevision++;
        }
        catch (e) {
            if (conflict)
                throw Error(CONFLICT);
            if (mutationError)
                throw mutationError;
            throw e;
        }
    }
    function open() {
        if (cached)
            return cached;
        cached = new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) {
                reject(Error('IndexedDB is unavailable in this browser.'));
                return;
            }
            const request = indexedDB.open(NAME, 2);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains('apartments'))
                    db.createObjectStore('apartments', { keyPath: 'id' });
                if (!db.objectStoreNames.contains('overrides'))
                    db.createObjectStore('overrides', { keyPath: 'id' });
                if (!db.objectStoreNames.contains('events'))
                    db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
                if (!db.objectStoreNames.contains('sessions'))
                    db.createObjectStore('sessions', { keyPath: 'id' });
                if (!db.objectStoreNames.contains('files'))
                    db.createObjectStore('files', { keyPath: 'id' });
                if (!db.objectStoreNames.contains('meta'))
                    db.createObjectStore('meta', { keyPath: 'key' });
            };
            request.onerror = () => reject(request.error || Error('Cannot open local device storage.'));
            request.onsuccess = () => {
                const db = request.result;
                db.onversionchange = () => { db.close(); cached = null; };
                resolve(db);
            };
        }).catch(e => { cached = null; throw e; });
        return cached;
    }
    MeterStorage.open = open;
    function complete(tx) {
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || Error('A storage transaction failed.'));
            tx.onabort = () => reject(tx.error || Error('The device did not save the change.'));
        });
    }
    function request(req) {
        return new Promise((resolve, reject) => {
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error || Error('A local storage request failed.'));
        });
    }
    async function snapshot() {
        const db = await open();
        const tx = db.transaction(['apartments', 'overrides', 'events', 'files', 'sessions', 'meta'], 'readonly');
        const ps = [request(tx.objectStore('apartments').getAll()), request(tx.objectStore('overrides').getAll()), request(tx.objectStore('events').getAll()), request(tx.objectStore('files').getAll()), request(tx.objectStore('sessions').getAll()), request(tx.objectStore('meta').get('dataset')), request(tx.objectStore('meta').get('revision'))];
        const [apartments, overrides, activities, files, sessions, meta, revision] = await Promise.all(ps);
        lastSeenRevision = revision?.value || 0;
        return { apartments: apartments, overrides: overrides, activities: activities.sort((a, b) => (b.id || 0) - (a.id || 0)), files: files.sort((a, b) => b.addedAt.localeCompare(a.addedAt)), sessions: sessions.sort((a, b) => b.date.localeCompare(a.date) || a.block.localeCompare(b.block)), meta: meta || null };
    }
    MeterStorage.snapshot = snapshot;
    /** Initialize only an empty browser database from the public historical baseline.
     * Never overwrite previously imported data or any local corrections. */
    async function seedBundledIfEmpty(pack) {
        const before = await snapshot();
        if (before.apartments.length)
            return;
        try {
            await mutate(['apartments', 'events'], tx => {
                for (const apartment of pack.apartments)
                    tx.objectStore('apartments').put(apartment);
                tx.objectStore('meta').put({ key: 'dataset', name: pack.name, importedAt: new Date().toISOString(), sourceReport: pack.sourceReport || '' });
                tx.objectStore('events').add({ kind: 'dataset', timestamp: new Date().toISOString(), count: pack.apartments.length, note: 'Loaded historical readings bundled with the public website' });
            });
        }
        catch (e) {
            const after = await snapshot();
            if (after.apartments.length)
                return; // a different tab initialized the data first
            throw e;
        }
    }
    MeterStorage.seedBundledIfEmpty = seedBundledIfEmpty;
    async function importDataset(p, file) {
        await mutate(['apartments', 'overrides', 'events', 'files', 'sessions'], tx => {
            tx.objectStore('apartments').clear();
            tx.objectStore('overrides').clear();
            tx.objectStore('sessions').clear();
            for (const a of p.apartments)
                tx.objectStore('apartments').put(a);
            tx.objectStore('meta').put({ key: 'dataset', name: p.name, importedAt: new Date().toISOString(), sourceReport: p.sourceReport || '' });
            tx.objectStore('events').add({ kind: 'dataset', timestamp: new Date().toISOString(), count: p.apartments.length, note: 'Imported source data; previous corrections cleared' });
            tx.objectStore('files').put({ id: crypto.randomUUID(), name: file.name, type: file.type || 'application/json', size: file.size, addedAt: new Date().toISOString(), data: file });
        });
    }
    MeterStorage.importDataset = importDataset;
    /** Drafts are local and do not become actual readings until the whole block is confirmed. */
    async function saveBlockDraft(session, apartments) {
        const proposed = session.draftRows || session.rows;
        MeterDaily.validateRows(proposed, apartments, session.date, session.block);
        if (session.id !== `${session.date}|${session.block}`)
            throw Error('Invalid block session key.');
        await mutate(['sessions', 'events'], tx => {
            tx.objectStore('sessions').put(session);
            tx.objectStore('events').add({ kind: 'block-draft', timestamp: new Date().toISOString(), date: session.date, count: proposed.length, note: `Block ${session.block}: draft saved for ${session.date}` });
        });
    }
    MeterStorage.saveBlockDraft = saveBlockDraft;
    /** One atomic device transaction confirms the whole block and its daily readings. */
    async function confirmBlock(session, apartments) {
        if (session.status !== 'confirmed' || session.draftRows?.length)
            throw Error('Review the whole block before confirming.');
        MeterDaily.validateRows(session.rows, apartments, session.date, session.block);
        if (session.id !== `${session.date}|${session.block}`)
            throw Error('Invalid block session key.');
        const now = new Date().toISOString();
        await mutate(['sessions', 'overrides', 'events'], tx => {
            tx.objectStore('sessions').put(session);
            for (const row of session.rows) {
                tx.objectStore('overrides').put({ id: `${row.apartmentId}|${session.date}`, apartmentId: row.apartmentId, date: session.date, value: row.value, note: `Confirmed in Block ${session.block} daily review`, updatedAt: now });
            }
            tx.objectStore('events').add({ kind: 'block-confirmed', timestamp: now, date: session.date, count: session.rows.length, note: `Block ${session.block}: all ${session.rows.length} readings confirmed (revision ${session.revision})` });
        });
    }
    MeterStorage.confirmBlock = confirmBlock;
    async function saveCorrection(row, previous) {
        await mutate(['overrides', 'events'], tx => {
            tx.objectStore('overrides').put(row);
            tx.objectStore('events').add({ kind: 'correction', timestamp: new Date().toISOString(), apartmentId: row.apartmentId, date: row.date, before: previous, after: row.value, note: row.note });
        });
    }
    MeterStorage.saveCorrection = saveCorrection;
    async function removeCorrection(apartmentId, date, current, original) {
        await mutate(['overrides', 'events'], tx => {
            tx.objectStore('overrides').delete(`${apartmentId}|${date}`);
            tx.objectStore('events').add({ kind: 'revert', timestamp: new Date().toISOString(), apartmentId, date, before: current, after: original, note: 'Removed manual override' });
        });
    }
    MeterStorage.removeCorrection = removeCorrection;
    async function addFile(file) {
        await mutate(['files', 'events'], tx => {
            tx.objectStore('files').put({ id: crypto.randomUUID(), name: file.name, type: file.type || 'application/octet-stream', size: file.size, addedAt: new Date().toISOString(), data: file });
            tx.objectStore('events').add({ kind: 'file', timestamp: new Date().toISOString(), note: `Saved ${file.name} on this device` });
        });
    }
    MeterStorage.addFile = addFile;
    async function deleteFile(id, name) {
        await mutate(['files', 'events'], tx => {
            tx.objectStore('files').delete(id);
            tx.objectStore('events').add({ kind: 'file-deleted', timestamp: new Date().toISOString(), note: `Deleted ${name} from local vault` });
        });
    }
    MeterStorage.deleteFile = deleteFile;
    async function saveMany(rows, file) {
        await mutate(['overrides', 'files', 'events'], tx => {
            for (const row of rows)
                tx.objectStore('overrides').put(row);
            tx.objectStore('files').put({ id: crypto.randomUUID(), name: file.name, type: file.type || 'text/csv', size: file.size, addedAt: new Date().toISOString(), data: file });
            tx.objectStore('events').add({ kind: 'csv', timestamp: new Date().toISOString(), count: rows.length, note: `Imported ${rows.length} actual readings from ${file.name}` });
        });
    }
    MeterStorage.saveMany = saveMany;
    function parseCSV(content, apartments) {
        const records = [];
        let row = [], field = '', quoted = false;
        const text = content.replace(/^\uFEFF/, '');
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === '"') {
                if (quoted && text[i + 1] === '"') {
                    field += '"';
                    i++;
                }
                else
                    quoted = !quoted;
            }
            else if (ch === ',' && !quoted) {
                row.push(field);
                field = '';
            }
            else if ((ch === '\n' || ch === '\r') && !quoted) {
                if (ch === '\r' && text[i + 1] === '\n')
                    i++;
                row.push(field);
                field = '';
                if (row.some(x => x.trim()))
                    records.push(row);
                row = [];
            }
            else
                field += ch;
        }
        if (quoted)
            throw Error('CSV contains an unclosed quoted value.');
        row.push(field);
        if (row.some(x => x.trim()))
            records.push(row);
        if (records.length < 2)
            throw Error('CSV must have headings and at least one reading.');
        const heads = records[0].map(s => s.trim().toLowerCase());
        const index = (...alts) => heads.findIndex(h => alts.includes(h));
        const bi = index('block');
        const ai = index('apartment', 'number', 'unit');
        const di = index('date');
        const ri = index('reading', 'value');
        if ([bi, ai, di, ri].some(i => i < 0))
            throw Error('CSV columns must be: block, apartment, date, reading.');
        const known = new Set(apartments.map(a => a.id));
        const dedupe = new Set();
        const now = new Date().toISOString(), out = [];
        for (let i = 1; i < records.length; i++) {
            const cols = records[i];
            const block = (cols[bi] || '').trim().toUpperCase(), unit = (cols[ai] || '').trim();
            const date = (cols[di] || '').trim(), num = (cols[ri] || '').trim();
            const id = `${block}:${unit}`, key = `${id}|${date}`;
            const value = Number(num);
            if (!known.has(id))
                throw Error(`CSV row ${i + 1}: unknown apartment ${id}.`);
            if (!MeterEngine.validDate(date) || !/^\d+$/.test(num) || !Number.isSafeInteger(value) || value > 1e9)
                throw Error(`CSV row ${i + 1}: invalid date or whole-number reading.`);
            if (dedupe.has(key))
                throw Error(`CSV row ${i + 1}: duplicate ${id} / ${date}.`);
            dedupe.add(key);
            out.push({ id: key, apartmentId: id, date, value, note: 'Imported from CSV', updatedAt: now });
        }
        if (out.length > 30000)
            throw Error('Too many CSV readings (maximum 30,000).');
        return out;
    }
    MeterStorage.parseCSV = parseCSV;
    function toDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onerror = () => reject(Error('Failed to read local file.'));
            r.onload = () => resolve(String(r.result));
            r.readAsDataURL(blob);
        });
    }
    async function makeBackup() {
        const s = await snapshot();
        const contents = [];
        for (const f of s.files)
            contents.push({ name: f.name, type: f.type, addedAt: f.addedAt, dataUrl: await toDataUrl(f.data) });
        const pack = { kind: 'meterflow-backup', schemaVersion: 2, exportedAt: new Date().toISOString(), dataset: { kind: 'meterflow-dataset', schemaVersion: 1, name: s.meta?.name || 'MeterFlow readings', apartments: s.apartments }, overrides: s.overrides, sessions: s.sessions, activities: s.activities, files: contents };
        return new Blob([JSON.stringify(pack)], { type: 'application/json' });
    }
    MeterStorage.makeBackup = makeBackup;
    async function restoreBackup(raw) {
        if (!raw || raw.kind !== 'meterflow-backup' || ![1, 2].includes(raw.schemaVersion))
            throw Error('Unsupported backup file.');
        const data = MeterEngine.validateDataset(raw.dataset);
        if (!Array.isArray(raw.overrides) || !Array.isArray(raw.files) || !Array.isArray(raw.activities) || raw.files.length > 2000 || raw.overrides.length > 100000)
            throw Error('Invalid backup entries.');
        const known = new Set(data.apartments.map(a => a.id));
        const savedSessions = [];
        if (raw.schemaVersion === 2) {
            if (!Array.isArray(raw.sessions) || raw.sessions.length > 10000)
                throw Error('Invalid saved daily records in backup.');
            for (const x of raw.sessions) {
                if (!x || !['draft', 'confirmed'].includes(x.status) || x.id !== `${x.date}|${x.block}` || !Number.isSafeInteger(x.revision) || x.revision < 1)
                    throw Error('Invalid saved block record.');
                MeterDaily.validateRows(x.rows, data.apartments, x.date, x.block);
                if (x.draftRows)
                    MeterDaily.validateRows(x.draftRows, data.apartments, x.date, x.block);
                if (savedSessions.some(y => y.id === x.id))
                    throw Error('Duplicate block record in backup.');
                savedSessions.push(x);
            }
        }
        const corrections = raw.overrides.map((x) => {
            if (!x || !known.has(x.apartmentId) || !MeterEngine.validDate(x.date) || !Number.isSafeInteger(x.value) || x.value < 0 || x.value > 1e9)
                throw Error('Backup has invalid corrections.');
            return { id: `${x.apartmentId}|${x.date}`, apartmentId: x.apartmentId, date: x.date, value: x.value, note: String(x.note || '').slice(0, 300), updatedAt: String(x.updatedAt || new Date().toISOString()) };
        });
        const files = [];
        for (const item of raw.files) {
            if (typeof item?.dataUrl !== 'string' || !/^data:[^,]*;base64,/.test(item.dataUrl) || item.dataUrl.length > 35000000)
                throw Error('Backup contains invalid or oversized archived files.');
            const response = await fetch(item.dataUrl);
            const blob = await response.blob();
            files.push({ id: crypto.randomUUID(), name: String(item.name || 'archive').slice(0, 150), type: String(item.type || 'application/octet-stream'), size: blob.size, addedAt: new Date().toISOString(), data: blob });
        }
        await mutate(['apartments', 'overrides', 'events', 'files', 'sessions'], tx => {
            for (const store of ['apartments', 'overrides', 'events', 'files', 'sessions', 'meta']) {
                // Preserve the meta revision record so the transaction can advance it.
                if (store !== 'meta')
                    tx.objectStore(store).clear();
            }
            for (const a of data.apartments)
                tx.objectStore('apartments').put(a);
            for (const o of corrections)
                tx.objectStore('overrides').put(o);
            for (const session of savedSessions)
                tx.objectStore('sessions').put(session);
            for (const e of raw.activities.slice().reverse()) {
                if (e && typeof e.kind === 'string') {
                    const { id, ...clean } = e;
                    tx.objectStore('events').add(clean);
                }
            }
            for (const f of files)
                tx.objectStore('files').put(f);
            tx.objectStore('meta').put({ key: 'dataset', name: data.name, importedAt: new Date().toISOString() });
            tx.objectStore('events').add({ kind: 'backup', timestamp: new Date().toISOString(), note: 'Restored private device backup' });
        });
    }
    MeterStorage.restoreBackup = restoreBackup;
    function download(blob, name) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
    }
    MeterStorage.download = download;
})(MeterStorage || (MeterStorage = {}));
