# MeterFlow v1.4 — Forecasting architecture and evidence

## Purpose

Predict a **cumulative meter reading** for an apartment on a selected future date while minimizing two different mistakes: (1) guessing the exact reading incorrectly, and (2) being far away from the physical meter. Forecasts are **estimates, never recorded actual readings**. Only confirmed readings and manually entered corrections belong in IndexedDB as observed data.

The existing data includes **335 apartments** in blocks A–G, **30 observations per apartment** from 26 September to 25 October 2026 (10,050 observations; 9,715 consecutive daily differences). Nearly all observed daily changes are 0 or 1, with smaller numbers of 2-unit changes and a few anomalies. There is not enough evidence to promise a 95–99% exact forecast rate across unseen dates.

## Pipeline

```text
History + confirmed local corrections
  -> chronological normalization, deduplication and date cutoff
  -> consecutive daily changes (invalid negative/>5 changes excluded)
  -> forecast horizon selection:
       1 day      : regularized conditional transition distribution
       2 days     : marginalize second-day distribution over ALL possible day-one changes
       3–13 days : robust observed linear trend; no synthetic meter readings
       14+ days  : blend 85% full-history mean with 15% most recent 7 valid changes
  -> round to integer, enforce non-decreasing projection
  -> horizon-aware caution, retrospective one-day test and display
  -> editable full-block review; confirmed actuals saved locally
```

### Short horizon

The one-day model estimates the relative frequency of daily differences 0–5. It gives a small prior of total weight 3 to the apartment's observed change distribution, then adds weighted evidence from previous patterns that match the most recent 1, 2 or 3 daily changes. Context lengths use weights **0.25**, **0.625**, and **1.5625** per matching observation. This shrinkage prevents the algorithm from treating a single unusual sequence as a certainty. The most likely change is added to the most recent **actual** reading.

For two days, the engine computes a probability distribution for the first increment, conditionally computes the second-day distribution for each possible first increment, and **sums** their joint probabilities into a distribution for the *total* two-day consumption. It chooses the most likely total. These hypothetical steps never become observed training readings.

### Longer horizon

For 3–13 days, the engine fits a least-squares line to cumulative changes reconstructed from **valid observed daily deltas only**. Outliers are retained in the log but not used to generate a slope. For 14 or more days, it uses a conservative per-apartment average consumption rate, blending entire-history and recent seven valid changes. Both are extrapolations: the error generally rises with the number of days since the last actual meter reading.

If the user confirms today's actual meter readings, tomorrow's predictions are anchored to **those new actual values**, not to last month's forecast. Missing days are not fabricated. Previously confirmed records and corrections are retained in IndexedDB and can be reopened or amended.

## Reproducible chronological comparison

These are **historical simulations using later recorded dates withheld from each forecast**. The sample counts are apartment/date forecast opportunities, not statistically independent households. Improvements do not establish future field accuracy.

| Forecast horizon | Samples | Prior exact hits | v1.4 exact hits | Prior MAE | v1.4 MAE |
|---|---:|---:|---:|---:|---:|
| 1 day | 2,345 | 1,725 (73.56%) | **1,739 (74.16%)** | 0.2797 | **0.2738** |
| 2 days | 2,345 | 1,562 (66.61%) | **1,613 (68.78%)** | 0.3684 | **0.3424** |
| 7 days | 2,680 | 1,276 (47.61%) | **1,336 (49.85%)** | 0.7466 | **0.7336** |

For the **Block D screenshot comparison on 14 November 2026**, 51 screenshot-derived actual readings were reviewed manually: the previous long-range model hit **13/51** exactly and had MAE **1.4706**; the revised blended-rate model hit **16/51** and had MAE **1.3922**. This was an **exploratory development example**, not a new blind holdout. The underlying newer private readings were **not committed into GitHub or bundled as official app history**.

MAE = mean absolute error in cumulative meter reading units; lower is better. Exact-hit rate = percentage matching the physical reading with no tolerance; higher is better. Do not compare a 20-day exact-hit rate with a one-day rate.

## Honest uncertainty and guardrails

- One-day exact-hit numbers displayed in the app are *smoothed historical estimates from a short retrospective sample*, not calibrated per-household probabilities or guarantees. Two-day and longer forecasts have no exact-hit percentage shown.
- A 3+ day forecast is labeled **Caution** and flagged as a stale estimate. The confirmation screen still requires the user to decide whether they have physically checked the displayed readings; unverified predictions should be saved as drafts rather than confirmed as actuals.
- Only observations strictly earlier than the selected date influence its forecast. A later correction does not change an earlier date's forecast.
- Negative or greater-than-5 daily increases are flagged and excluded from ordinary pattern training, not erased from the stored data.
- Data is specific to each apartment. It is not legitimate to claim AI can predict unusual usage, occupancy changes, leaks, faulty meters, or new behavior with near-certainty using 30 days of readings.

## Next field-validation requirement

The strongest practical improvement is **new, frequent verified readings**. Save each block's physical readings daily, then evaluate the engine prospectively for at least 30 new days, measuring exact matches, ±1/±2 tolerance, MAE, performance by block/floor, data corrections and the gap since the last verified reading. Revisit model weights only using past training periods; leave the latest test dates untouched for unbiased comparisons. Version and document model changes before publishing them.
