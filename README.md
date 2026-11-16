# MeterFlow v1.2 — Daily Block Review & Confirmation

Open **https://adjeiemmaaegh-web.github.io/Meterflow/** on your phone. The 335 historical apartment readings are built into this *public* GitHub Pages website. No import is needed. On the **Daily** tab, choose a date, block A–G and a floor (Ground, 1, 2, etc.). Every floor lists the correct apartment numbers, starting from G01. Edit readings, switch floors without losing current edits, optionally **Save draft**, then **Preview entire block** to inspect all apartments on one page and edit them there. Press **Confirm & save** once for the whole block. The **Saved** tab lets you reopen a previous date and block, review all saved readings and reconfirm amendments. Data is saved on your current browser/device using IndexedDB. Confirming a full block accepts displayed estimates as verified readings; do not confirm unmeasured estimates without checking. Confirmed readings become historical actual values for future forecasts. Historical source values remain recoverable in the bundled dataset.

- Drafts are stored in IndexedDB and do not affect predictions until confirmation. Editing a confirmed record as a draft retains its last confirmed values.
- Confirmation writes the full block and its actual readings in one IndexedDB transaction. Multiple-tab version conflicts fail closed rather than silently overwriting newer data.
- Block records and drafts are included in full JSON backup/restore (backup schema v2); legacy v1 backups still restore.
- Browser storage is local and may be lost when site data is cleared. Export regular private backups. No account synchronization.
- The initial historical meter readings are included in public website assets. Only the owner's locally saved confirmations, edits and files remain private to the browser by default.
- Deployment: GitHub Actions builds React 19 and publishes static `gh-pages` files, then GitHub Pages serves `/Meterflow/`. No visitor-side build or import.

---

# MeterFlow · Ready-to-use GitHub Pages forecast app

**Open the website and choose a forecast date, block, and apartment. No initial import is necessary.**

The site is deployed to `https://adjeiemmaaegh-web.github.io/Meterflow/` from the `gh-pages` branch. Historical readings from the owner-provided workbook are **included in the public site** (335 apartments, 10,050 dated readings, 9,715 day-to-day differences). Visitors can inspect or download the historical readings by viewing site assets. Corrections and uploaded files stay in their own browser's IndexedDB. No authentication or cross-device sync is provided.

The default forecast is October 26, 2026, the day after the last workbook reading. Pick a date after September 26, 2026. Forecasts beyond the most recent actual can become unreliable. The model uses two-step, one-step, then frequency patterns with 0–5 normal deltas; it does **not guarantee** a future exact reading. Its 74.1% figure is a retrospective test, not a live accuracy claim. Flagged negative and large changes remain visible.

### Phone
Visit the HTTPS URL in Safari (iPhone) or Chrome (Android), choose a date, block and apartment, and tap **View history & correct** to save a verified actual reading. Install the PWA from the browser's share/menu options; when offline, the app serves cached site assets after a successful online visit. Back up your local data periodically because clearing browser data can erase corrections.

### Build
`npm install && npm run build && npm test` then `node scripts/prepare-github-pages.mjs` to prepare `/Meterflow/` subpaths. Automatic GitHub Action publishes the built files to the `gh-pages` branch; direct branch hosting does not require manual reruns.

Historical baseline: `Daily water meter reading October 2026.xlsx`, SHA-256 `3967b8a2b8c28b41ce65be6ce42d483076d6d08038e2398459f9cadeac4eee8e`.

---

# MeterFlow Mobile v1.1 — React 19 source, offline-first PWA

A mobile-first water meter prediction app for seven blocks and 335 apartments. Production source targets **React 19.3.1 + ReactDOM 19.3.1 + TypeScript 5.8.3**; IndexedDB stores imported readings, manual corrections, historical audit events, and archived files on the phone. No backend or login is required. **It is a PWA, not an APK or IPA.**

## Files and privacy

- `MeterFlow_V11_REACT19_VERCEL_SOURCE.zip`: source and configuration to build using npm on Vercel; intentionally excludes all private readings and the prebuilt legacy fallback.
- `MeterFlow_V11_LEGACY_OFFLINE_PREVIEW.zip`: self-contained, tested browser preview compiled against the legacy React runtime. **Development / inspection only**, not production release.
- `WaterMeter_October2026_PRIVATE_IMPORT.json`: private October data from the earlier report, **separate** from both ZIP files. Do not add it to a Git repository, Vercel, or a public download link.

There are 335 apartment records spanning A–G, 30 dated cumulative readings per apartment (2026-09-26 through 2026-10-25) and 9,715 historical day-to-day deltas. The source report is preserved as provided; no meter unit or tariff is assumed.

## Forecasts and corrections

- Choose an ISO date, search by apartment, filter the block, and view the predicted cumulative reading, estimated daily increase, recent deltas, method and historical confidence indicator.
- Forecasts only use readings before the date being predicted. The one-day model tries two-step patterns with sufficient frequency, then one-step patterns, then the modal valid daily increment. Unusual negative or >5 changes remain visible but are excluded from the trend training.
- Manually enter a verified reading on any selected date. This is an additive override of the source, not a destructive edit. A later forecast automatically considers that reading. Overrides can be reverted.
- The baseline retrospective exact-match proportion is 3,721 / 5,020 = 74.1% versus 65.6% for the modal rule on the same source month. This is model selection on known historical data, **not an independent or future accuracy guarantee**.

## Storage

- `IndexedDB` stores the dataset, overrides, audit log and files; file imports are capped at 25 MB each. CSV actuals accept `block,apartment,date,reading`.
- Versioned IndexedDB revisions reject a stale second-tab write instead of silently overwriting a newer transaction. Refresh after such an error to re-read the latest device state.
- Export a full local JSON backup (including archived files) and restore it on another device. IndexedDB is **not cloud sync, is not automatically backed up, and is not encrypted by this app**. Treat the private JSON pack and backups as sensitive.
- Content-fingerprinted service worker shell caches are replaced on deployment updates, while caches belonging to unrelated apps remain intact. Data remains in IndexedDB separately.

## React 19 production build — connected machine or Vercel

```bash
npm install
npm run build
npm test
```

The production build compiles the TypeScript project and bundles React 19 into `dist/vendor/runtime.js` using esbuild. `ReactDOM.createRoot` is wrapped for compatibility with the existing React class UI, and all runtime assets are local; no third-party CDN is required. The `dist/` folder is static and deploys on Vercel with framework **Other**, command **`npm run build`** and output **`dist`** (already specified in `vercel.json`).

**Current verification limit:** the present build environment cannot reach `registry.npmjs.org` (`EAI_AGAIN`), so the React 19 bundle and its execution cannot be independently built/tested here. **Do not claim that the production React 19 version is accepted before a connected-machine `npm install && npm run build && npm test` and phone acceptance.** No authentic `package-lock.json` was fabricated.

For a local historical-UI engineering preview only, using the included legacy UMD assets and globally available TypeScript 5.8.3, run:

```bash
npm run build:legacy-preview
npm test
npm run test:private-report  # only when the separate private JSON is in the parent folder
npm start
```

The older local preview is not the production React 19 build.

## Vercel + mobile setup

1. Unzip the **React 19 source** without the private JSON into a Git repository. Confirm the repository contains no private data.
2. Connect that repository to a Vercel project. Set framework to Other, build command `npm run build`, output directory `dist`.
3. Confirm the deployment build finishes, open the HTTPS URL on an Android Chrome or iPhone Safari device, and import the **separate private JSON** in the app's first-run screen.
4. Android: browser menu → Install app. iPhone: Safari → Share → Add to Home Screen. Some platforms isolate the installed PWA's local storage from a browser tab, so import again in the installed app as needed.
5. Test first-run import, reload persistence, corrections, airplane-mode startup, service worker updates, CSV import, vault round-trip, backup + restore, low-storage handling and device restart. Export a backup before clearing data.

**Vercel is not yet deployed and real physical phones have not been tested.** The connected Vercel account had no existing MeterFlow project at review; a safe automatic deployment requires a suitable project/repository and a successful production build.

## Source guide

- `src/engine.ts`: deterministic forecasting, anomaly rules, source validation
- `src/storage.ts`: IndexedDB, revision-protected writes, backups, file archive
- `src/app.tsx`: phone UI, date selection, corrections, import/settings
- `src/react19-bridge.mjs`: React 19 createRoot production compatibility entry
- `scripts/build.mjs`: public PWA generation, modern bundle, updateable offline cache
- `public/`, `src/style.css`: install icons, manifest, phone layout
- `tests/`: forecasting, IndexedDB simulation, cross-tab conflict model, cache/privacy smoke, optional private data check
- `docs/QA_REPORT.md`: implementation, checks and outstanding release gates

See `docs/PHONE_ACCEPTANCE_CHECKLIST.md` for owner-side phone QA.


### Long-range forecast caution (v1.3)
For forecasts **three or more days** after the latest actual meter reading, MeterFlow now projects each apartment's observed average daily change instead of repeatedly feeding predicted readings back into the pattern model. Long-range estimates are prominently marked as **not actual meter readings**. The prior 74.1% historical result describes only one-day retrospective testing on the original October data; it does **not** describe longer forecast accuracy. Before confirming any entire block, check every apartment against the physical meter. Save a draft when values have not been verified. Confirmed actual readings can reanchor subsequent forecasts.


## Improved forecasting engine (v1.4)

MeterFlow now uses per-apartment conditional transition distributions for tomorrow, a full two-day convolution for the day after, an observed linear trend for 3–13-day gaps, and a conservative blended actual-consumption rate for 14+ day gaps. Missing days and unconfirmed model predictions never become training observations. Daily confirmations and corrections re-anchor estimates. The one-day historical exact-hit estimate is **not** a calibrated probability or a forecast guarantee. [Architecture, chronological tests and limitations](docs/FORECAST_ARCHITECTURE_V14.md).

## Confirmed final-reading PDF/JPEG export (v1.5)

After confirming a daily block, use **Download JPEG** or **Download PDF** on the Daily screen or beside a confirmed block in Saved records. The export contains only **Apartment number** and **Final meter reading**; no forecast, draft edits, notes, or confidence data. The block and reading date appear in the filename. A fresh local database snapshot supplies the readings; saved corrections take precedence, and missing actuals cause the export to stop rather than substitute predictions. The PDF is searchable and paginated; the JPEG is generated offline on the device. Always verify meter readings before confirming. Real-device download and production deployment checks remain necessary.
