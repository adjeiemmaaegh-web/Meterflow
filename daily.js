"use strict";
/** Floor mapping and complete-block review snapshots. Pure functions, no storage side effects. */
var MeterDaily;
(function (MeterDaily) {
    function floor(number) {
        if (/^G\d{2}$/i.test(number))
            return 0;
        if (/^\d{3,4}$/.test(number))
            return Number(number.slice(0, -2));
        return -1;
    }
    MeterDaily.floor = floor;
    function floorLabel(level) { return level === 0 ? 'Ground floor' : `Floor ${level}`; }
    MeterDaily.floorLabel = floorLabel;
    function sortApartments(items) {
        return items.slice().sort((a, b) => floor(a.number) - floor(b.number) || Number(a.number.replace(/^G/i, '')) % 100 - Number(b.number.replace(/^G/i, '')) % 100);
    }
    MeterDaily.sortApartments = sortApartments;
    function floors(apartments, block) {
        return [...new Set(apartments.filter(a => a.block === block).map(a => floor(a.number)))].filter(n => n >= 0).sort((a, b) => a - b);
    }
    MeterDaily.floors = floors;
    function buildRows(apartments, overrides, date, block, prior) {
        const units = sortApartments(apartments.filter(a => a.block === block));
        const saved = new Map((prior?.draftRows || prior?.rows)?.map(row => [row.apartmentId, row]) || []);
        return units.map(a => {
            const remembered = saved.get(a.id);
            if (remembered)
                return { ...remembered, number: a.number, floor: floor(a.number) };
            const prediction = MeterEngine.predict(a, overrides, date);
            if (!prediction)
                throw Error(`No prediction available for ${block} ${a.number} on ${date}. Choose a date after the first recorded day and within the forecasting limit.`);
            const base = prediction.actual === null ? prediction.predicted : prediction.actual;
            return { apartmentId: a.id, number: a.number, floor: floor(a.number), suggested: base, value: base, origin: prediction.actual !== null ? 'recorded' : 'forecast', confidence: prediction.confidence };
        });
    }
    MeterDaily.buildRows = buildRows;
    function validateRows(rows, apartments, date, block) {
        if (!MeterEngine.validDate(date) || date <= '2026-09-26' || !['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(block))
            throw Error('Select a valid date and block.');
        const expected = apartments.filter(a => a.block === block);
        if (expected.length !== rows.length || !rows.length)
            throw Error('The entire block must be present before saving.');
        const unique = new Set();
        for (const row of rows) {
            if (!expected.some(a => a.id === row.apartmentId && a.number === row.number) || unique.has(row.apartmentId))
                throw Error('Block includes a missing, duplicate, or incorrect apartment.');
            unique.add(row.apartmentId);
            if (!Number.isSafeInteger(row.value) || row.value < 0 || row.value > 1e9 || !Number.isSafeInteger(row.suggested) || row.suggested < 0)
                throw Error(`Invalid whole-number reading for ${row.number}.`);
        }
    }
    MeterDaily.validateRows = validateRows;
    function makeSession(date, block, rows, previous, status = 'draft') {
        const at = new Date().toISOString();
        if (status === 'draft' && previous?.status === 'confirmed') {
            return { ...previous, draftRows: rows.map(r => ({ ...r })), revision: previous.revision + 1, updatedAt: at };
        }
        return { id: `${date}|${block}`, date, block, status, rows: rows.map(r => ({ ...r })), revision: (previous?.revision || 0) + 1, updatedAt: at, confirmedAt: status === 'confirmed' ? at : null };
    }
    MeterDaily.makeSession = makeSession;
})(MeterDaily || (MeterDaily = {}));
