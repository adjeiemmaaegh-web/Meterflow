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
