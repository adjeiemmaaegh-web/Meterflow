# GitHub repository setup

This folder contains the MeterFlow v1.1 React/TypeScript PWA **source only**. Historical apartment readings are intentionally excluded.

## Create and upload to your new repository

1. While signed in to GitHub, open <https://github.com/new> and create a **private**, empty repository named `meterflow-mobile`. Do not select "Add a README", `.gitignore`, or license (the source already has its own docs and licenses).
2. In a terminal inside this source directory, run:

```bash
git init -b main
git add .
git status --short
git commit -m "Initial MeterFlow Mobile v1.1 source"
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/meterflow-mobile.git
git push -u origin main
```

Replace `YOUR-GITHUB-USERNAME` with your account's GitHub login. The account connected in ChatGPT at preparation time was `adjeiemmaaegh-web`.

Do **not** add the original Excel workbook, `.md` meter readings report, or `WaterMeter_October2026_PRIVATE_IMPORT.json` to the repository. These contain private records and should only be imported on the device.

## Release state

- Source targets React 19.3.1 and React DOM 19.3.1.
- Modern production npm install/build on a connected environment remains unverified.
- Genuine mobile PWA/IndexedDB/browser-origin testing remains outstanding.
- No live Vercel site has been deployed as part of this repository preparation.
- Vercel project settings are in `vercel.json` (`npm run build`, output `dist`).

**Important:** Private GitHub repositories and Vercel projects do not automatically make a published application or its bundled assets private. Keep apartment data out of all source and hosted assets.
