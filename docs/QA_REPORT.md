# MeterFlow v1.1 verification and acceptance report — 15 November 2026

## Grounding
Source input retained from the original report: 335 apartments (A 49, B 49, C 42, D 51, E 51, F 51, G 42), 10,050 cumulative readings dated 2026-09-26–2026-10-25, 9,715 consecutive-day deltas. Earlier private-report integration check verified count, apartment identities, report reconstruction and the retrospective 3,721 / 5,020 (74.1%) model hit rate. The accuracy figure is not prospectively calibrated.

## New since v1.0

1. Introduced an npm-based **React 19.3.1** production build path (ReactDOM createRoot compatibility bridge, esbuild 0.28.2, TypeScript) without using third-party CDN scripts. Production build is **not verified** due npm registry resolution block.
2. Introduced a serial IndexedDB read/write revision record (`meta.revision`) and optimistic conflict rejection in the same transaction for every mutation, including restores/imports. A stale tab must reload before saving. Existing v1 IndexedDB database and stores are preserved; this is additive and migrates without a schema version change.
3. Made the offline service worker cache name content-fingerprinted, network-first for navigation, cache-first for a fixed safe list of same-origin shell assets and cleanup limited to MeterFlow caches only.
4. Memoized apartment forecast results between UI-only state changes, increased selectable date range and clarified local-storage privacy language.
5. Added CSP security headers for the static Vercel origin, standalone private report test command and clearer build/preview separation.

## Evidence

| Verification gate | Status | What it means |
|---|---|---|
| TypeScript compile | PASS | `tsc -p tsconfig.json` on v1.1 source |
| Offline legacy-preview build | PASS | Public shell generated, cache fingerprint validated, private dataset excluded |
| Synthetic forecast tests | PASS | 10/10 inherited assertions |
| Simulated storage transactions | PASS | Import, correction, CSV, archive, restore and reload in a fake IndexedDB model |
| Simulated stale-tab conflict | PASS | Different client contexts, stale correction refused and newer value preserved |
| Source report integration | PASS | Reconstructed apartment readings and 74.1% walk-forward comparison (requires private pack locally) |
| Service worker static/privacy checks | PASS | Fingerprinting, navigation fallback logic, no private file in cache list |
| Mobile UI embedded Chromium | PASS (legacy runtime) | 390×844 mobile UI, 335 apartment cards, search, detail, correction, next-day anchor; zero page errors, with in-memory mocked persistence |
| React 19 npm install and bundled runtime | BLOCKED | `registry.npmjs.org` fails DNS lookup, no authentic lockfile or modern compiled bundle |
| Chromium real-origin IndexedDB + PWA offline | BLOCKED | Browser navigation returns `ERR_BLOCKED_BY_ADMINISTRATOR` even for intercepted localhost/https navigation |
| Android/iOS installation, quota and browser update | UNVERIFIED | Requires real devices and hosted HTTPS origin |
| Vercel deployment | NOT PERFORMED | No identified existing MeterFlow project; no live URL verified |

**State:** source engineering continuation with substantive safety and modernization changes. **Production release and real-device acceptance: NO-GO until React 19 build, origin tests, phone QA, and live deployment succeed.** No private data is included in either app artifact.
