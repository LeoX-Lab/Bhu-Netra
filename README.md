<div align="center">

# भू-नेत्र · Bhu-Netra

### The eye on the land — Intelligent Land Record Digitization & Validation System

**Validates every land record *before* it enters the system, so nobody has to fight over it after.**

SIH 2026 · Problem Statement **SIH26018** · Ministry of Rural Development · Dept. of Land Resources (DoLR)
Theme: Smart Automation · Team **ZeroTrace**

[Quick Start](#-quick-start) · [Architecture](#-architecture) · [API](#-api) · [Validation Rules](#-the-10-validation-rules) · [What's Real](#-whats-real-vs-simulated)

</div>

---

## 📌 The Problem

- **66% of India's civil cases are land disputes** — the single largest category choking our courts.
- India has scanned crores of land records under **DILRMP** — but **a scan is not a record**. Someone still has to read it, type it, and *check* it.
- Today that checking is manual, inconsistent, or skipped: misspelled names enter the register, the same plot is claimed twice, a deed is registered even though its vendor never owned the land.
- The dispute is discovered **years later — in court**.

**Bhu-Netra stops the dispute before the record.**

## 🚀 Quick Start

```bash
git clone <this-repo>
cd Bhu-Netra
npm install        # express, multer, tesseract.js, sql.js, jsdom (dev)
npm start          # → http://localhost:3000
```

First run downloads the OCR language models (hin, eng + 8 regional scripts) from the tessdata CDN and caches them. Everything else works offline after that.

```bash
npm test           # full suite: 107 assertions (engine, ledger, API, samples, UI, restart persistence)
```

## 🏗 Architecture

```
Browser (public/: index.html + app.css + app.js — GoI-style UI, 7 views)
   │  REST/JSON + multipart uploads
   ▼
Express API (src/server.js)
   ├── OCR service (src/ocr.js)
   │     ├── primary pass: hin+eng (or 8-script regional sweep)
   │     ├── auto script detection (Devanagari ratio + confidence)
   │     └── digit-integrity pass: eng cross-read, bbox-matched repair
   │           (fixes the hin model's '1'→danda/उ/१ misreads: "145"→"45")
   ├── Field mapper (src/engine/mapper.js) — 20 fields, 15 languages,
   │     incl. land classification (PS requirement)
   ├── Validation engine (src/engine/validate.js) — R1–R10, explainable
   ├── Integrity ledger (src/ledger.js) — SHA-256 hash-linked blocks (Node crypto)
   └── SQLite database (src/db.js, sql.js) — records | blocks | activity | queue
```

**Key design decisions**
- **Server re-validates on every commit** — the client is never trusted; seals and hashes are computed server-side only.
- **Digit-integrity repair is targeted, not blind** — tokens are only repaired when the eng pass restores a lost '1' or a Devanagari-digit/danda artifact is present, matched by bounding-box geometry (intersection-over-min). Correct readings are never overwritten.
- **No framework on the frontend** — the original single-file UI, split cleanly; loads fast on kiosk hardware, nothing to install.
- **Everything computed, nothing faked** — all four demo samples run real OCR (the pre-computed transcripts of the prototype era are gone). The only synthetic part is the data itself, disclosed in-app.

## 🔌 API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/state` | records, blocks, activity, queue, stats |
| POST | `/api/scan` | multipart image → OCR + auto-language + digit repair + field extraction. Response is an NDJSON stream: live `{"ev":"status","step":...}` pipeline events, then the final result line |
| POST | `/api/validate` | fields → R1–R10 report (server-side truth) |
| POST | `/api/commit` | re-validates, seals record, appends to ledger (409 on hard failures) |
| POST | `/api/queue` | send flagged record to officer review queue |
| GET | `/api/records/:id/verify` | recompute + compare sealed hash |
| POST | `/api/records/:id/tamper` | demo: simulate unauthorized edit |
| POST | `/api/records/:id/restore` | demo: revert simulated edit |
| GET | `/api/ledger` | hash-linked blocks |
| POST | `/api/ledger/verify` | full chain recompute + break localization |
| POST | `/api/discs/:id/resolve` | close a review-queue item |
| POST | `/api/reset` | reseed the demo database |

## ✅ The 10 Validation Rules

| # | Rule | Catches |
|---|---|---|
| R1 | Khasra / survey-number format | Malformed or impossible plot numbers |
| R2 | Area sanity & unit conversion | Unparseable bigha/kanal/acre values |
| R3 | Area cross-check (text vs sq m) | OCR digit-swaps — printed vs computed area |
| R4 | Duplicate parcel ownership | Same khasra claimed twice |
| R5 | Mutation (inteqal) chain integrity | Vendors who never owned the land |
| R6 | Owner-name fuzzy consistency | Spelling drift across records |
| R7 | Date logic | Future dates, impossible sequences |
| R8 | Geo-reference check (Bhu-Naksha layer) | Parcels missing from the map layer |
| R9 | Encumbrance & lis pendens (e-Courts) | Land already under litigation |
| R10 | OCR confidence floor (HITL gate) | Garbage-in — a human reviews where they matter |

## 🧪 The Four Demo Documents (all real OCR)

| Sample | Document | Story |
|---|---|---|
| A | Jamabandi, Khanpur (Punjab) — clean | Straight-through PASS, all fields captured |
| B | Fard badar, Fatehgarh (Haryana) — faded ink | Same-owner WARN → human-in-the-loop |
| C | Sale deed, Raipur Rani — fraud test | **R4+R5 FAIL** — vendor died in 2019, "sold" in 2024; commit blocked |
| D | Mutation extract, Chhutmalpur (UP) — torn 1998 | **R9 FAIL** — parcel under lis pendens |

## 🔍 What's Real vs Simulated

| Component | Status |
|---|---|
| OCR (all documents, samples included) | **Real** — Tesseract 5 LSTM, server-side, dual-pass with digit repair |
| Language auto-detection | **Real** — script profiling + 8-script sweep |
| Validation rules R1–R10 | **Real** — computed per record |
| SHA-256 ledger + tamper detection | **Real** — Node crypto, persisted in SQLite |
| Database | **Real** — SQLite, survives restarts |
| Record/mutation/litigation **data** | Synthetic (disclosed in-app) — real land records cannot be used in a prototype |
| Bhu-Naksha geo layer | Synthetic village coordinates (production: DoLR map services) |

## 🛠 Tech Stack

- **Backend:** Node.js · Express · SQLite (sql.js) · Tesseract.js · Multer
- **Frontend:** Vanilla HTML/CSS/JS (no framework, no build step)
- **Security:** server-side hashing (Node crypto), server-side re-validation on commit, HTML-escaping on all rendered strings, upload type/size limits
- **Testing:** 107 assertions across 7 suites — OCR+mapper, validation engine, ledger lifecycle, API end-to-end, sample narratives, full-stack UI (jsdom), restart persistence (SIGKILL + reboot, data intact)

## 🗺 Production Roadmap

- Fine-tuned Indic OCR models for handwritten registers · OpenCV preprocessing for degraded scans
- Official DoLR ULPIN service + e-Courts + state LRMS connectors (REST)
- PostgreSQL + RBAC for multi-role departments · district-wise rollout
- PWA service worker for offline kiosk operation

## 📄 License

MIT — free to use, study, and build upon.

---

<div align="center">

**DIGITIZE · VALIDATE · VERIFY · TRUST**

</div>
