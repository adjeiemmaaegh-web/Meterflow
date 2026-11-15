# Owner's mobile acceptance checklist

Run these manually in a secure HTTPS Vercel preview deployment using the private data pack on your device.

- [ ] On iPhone Safari, open the URL and Add to Home Screen. App icon, title and splash display acceptably.
- [ ] On Android Chrome, install the PWA from browser menu. It opens standalone, not as a desktop-style website.
- [ ] Transfer `WaterMeter_October2026_PRIVATE_IMPORT.json` **privately** to the phone and import inside the installed app.
- [ ] Confirm **335** apartments: A49 / B49 / C42 / D51 / E51 / F51 / G42.
- [ ] Default date is **26 Oct 2026**. Change date in Home and Apartments, verify the forecast responds.
- [ ] Filter Block A and search `G01`. Verify the latest history anchor against the private source report; the app's improved model may differ from the old Markdown modal forecast.
- [ ] Open an apartment, check negative/jump warnings where documented (e.g. C/G05 on 25 Oct).
- [ ] Add a **genuine verified** actual reading for 26 Oct. Confirm it appears as actual, separate from the forecast for that date.
- [ ] Move to 27 Oct. Confirm the forecast anchors to the newly saved 26 Oct actual reading.
- [ ] Correct a historical reading, verify the adjacent daily differences update, then remove the override to recover original data.
- [ ] Test CSV bulk import with genuine readings, and confirm the uploaded CSV is archived.
- [ ] Archive the original XLSX and the Markdown file in Settings; download them again and check bytes.
- [ ] Export a private backup, import it on a fresh browser profile or a second device, and compare apartment counts, corrections and archived file contents.
- [ ] Close/reopen, reload, background/foreground, and simulate an offline restart in airplane mode. Ensure no data is lost.
- [ ] Check phone storage/quota warnings and behavior with limited capacity; do not clear site data before exporting backup.
- [ ] Verify good contrast, readable text, touch targets, dates and number entry on a narrow phone (e.g. 360px), including the on-screen keyboard.
- [ ] Use new independently verified readings to evaluate actual forecast quality over at least several weeks.

Avoid any production reliance until these checks are evidenced and unresolved defects are corrected.
