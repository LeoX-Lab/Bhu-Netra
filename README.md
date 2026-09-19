<div align="center">

# भू-नेत्र · Bhu-Netra

### The eye on the land — Intelligent Land Record Digitization & Validation System

**Validates every land record *before* it enters the system, so nobody has to fight over it after.**

SIH 2026 · Problem Statement **SIH26018** · Theme: Smart Automation · Team **ZeroTrace**

[Live Demo](#-live-demo) · [How It Works](#-how-it-works) · [Validation Rules](#-the-10-validation-rules) · [Tech Stack](#-tech-stack)

</div>

---

## 📌 The Problem

- **66% of India's civil cases are land disputes** — the single largest category choking our courts.
- India has scanned crores of land records under **DILRMP** — but **a scan is not a record**. Someone still has to read it, type it, and *check* it.
- Today that checking is manual, inconsistent, or simply skipped: misspelled names enter the register, the same plot gets claimed twice, a deed is registered even though its vendor never owned the land.
- The dispute is discovered **years later — in court**.

**Bhu-Netra stops the dispute before the record.**

## 🎯 What Bhu-Netra Does

A single-file web application that turns any land document — khatauni, jamabandi, fard, 7/12, sale deed, in **9 Indian scripts** — into a validated, sealed digital record:

1. **Auto-language detection** — first pass Hindi + English; if no Devanagari is found, it sweeps Bengali, Gujarati, Punjabi, Odia, Tamil, Telugu, Kannada, Malayalam and keeps the higher-confidence result. **Zero operator settings.**
2. **Field extraction with per-field confidence** — every field carries a score; anything weak (<75%) is visibly flagged.
3. **Human-in-the-loop done right** — only weak *fields* go to the review queue, not whole documents. An operator corrects a few words instead of retyping a page.
4. **10 explainable validation rules** — from area cross-checks to duplicate-claim detection to litigation flags (see table below).
5. **ULPIN** — a Bhu-Aadhaar-format 14-digit parcel ID (jurisdiction segments + Luhn check digit).
6. **SHA-256 hash-linked integrity ledger** — every sealed record is chained to the previous one; any retroactive edit is **provably detectable** (tamper demo built in).
7. **Honest by design** — fields not present on the document are labelled *"not on scan — enter manually"* instead of being guessed.

## 🌐 Live Demo

| Option | How |
|---|---|
| **Hosted** | `https://<your-github-username>.github.io/<repo>/` *(enable GitHub Pages — see below)* |
| **Offline** | Download the HTML file → open in any browser. That's the whole install. |
| **From source** | `git clone` → open `index.html` — no build step, no dependencies to install |

> **Make the GitHub link work properly:** rename the file to `index.html` in the repo root, then **Settings → Pages → Deploy from branch → main / root**. Your demo link is then `https://<username>.github.io/<repo>/`. (A raw `github.com/.../file.html` link will *download*, not run.)

## 🖥 Screenshots

| Digitize & OCR | Validation | Integrity Ledger |
|---|---|---|
| *(add screenshot)* | *(add screenshot)* | *(add screenshot)* |

> Drop screenshots into a `docs/` folder in the repo and reference them as `docs/xyz.png`.

## ⚙️ How It Works

```
Scan/Image → Preprocess (Canvas) → OCR (Tesseract, Web Worker)
     → Auto-script detection → Field mapping (15-language label matcher)
     → Confidence gating → 10-rule validation engine
     → PASS: ULPIN + SHA-256 seal → hash-linked ledger
     → WARN/FAIL: review queue (officer adjudicates, with reasons)
```

Everything — OCR, hashing, validation, storage — runs **client-side in the browser**. No citizen data ever leaves the machine.

## ✅ The 10 Validation Rules

| # | Rule | Catches |
|---|---|---|
| R1 | Khasra / survey-number format | Malformed or impossible plot numbers |
| R2 | Area sanity & unit conversion | Bigha/kanal/acre values that don't parse |
| R3 | Area cross-check (text vs sq m) | OCR digit-swaps — printed vs computed area |
| R4 | Duplicate parcel ownership | Same khasra claimed twice |
| R5 | Mutation (inteqal) chain integrity | Vendors who never owned the land |
| R6 | Owner-name fuzzy consistency | Spelling drift across records |
| R7 | Date logic | Future dates, impossible sequences |
| R8 | Geo-reference check (Bhu-Naksha layer) | Parcels that don't exist on the map layer |
| R9 | Encumbrance & lis pendens (e-Courts) | Land already under litigation |
| R10 | OCR confidence floor (HITL gate) | Garbage-in — a human reviews exactly where they matter |

## 🛠 Tech Stack

**Zero framework. Zero backend. Zero build step. One file.**

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JS (single file, ~168 KB) — GoI design system, 7 views, 7 breakpoints, high-contrast mode |
| Backend | None — the browser is the backend: **Web Workers** (parallel OCR), **Web Crypto** (SHA-256), **localStorage** (persistence) |
| OCR | Tesseract.js 5 (WebAssembly) — 15 language packs, auto-script detection across 9 scripts |
| Image processing | HTML5 Canvas (grayscale/binarization pipeline) |
| Intelligence | Regex label mapping (15 languages) + hand-rolled fuzzy matching |
| Security | SHA-256 hash-linked integrity ledger, HTML-escaping on every external string |

*Why no framework?* One file runs off a pendrive, a WhatsApp forward, or a state portal link — nothing for a district IT cell to install or break, and nothing for an attacker to breach. At 7 views, a framework costs more than it saves.

## 📂 What's Inside

```
├── index.html                 ← the entire application (this file)
├── docs/                      ← screenshots (optional)
└── README.md
```

## 🎬 Demo Walkthrough (90 seconds)

1. **Dashboard** → live KPIs, validity donut, chain health
2. **Digitize** → run Sample B → watch the terminal narrate: script detection → extraction → confidence flags
3. **Validate** → the 10 rules light up; watch one weak field get caught
4. **Registry** → open a sealed record → **Verify Hash** (green) → **Simulate Edit** → **Verify Hash** (red)
5. **Queue** → fix the flagged field → re-validate → seal

## 🗺 Roadmap (Production Scale-Up Path)

- React frontend + FastAPI services for district-scale deployments
- OpenCV preprocessing + fine-tuned Indic vision models for degraded records
- PostgreSQL persistence + RBAC for multi-role departments
- Official DoLR ULPIN service integration + state-specific unit tables
- e-Courts / mutation-register live feed integrations
- PWA service worker for full offline kiosk operation

## ⚠️ Honest Limitations

- **Demo data is synthetic** — all records and documents are constructed; formats mirror real jamabandi/khatauni layouts.
- The OCR engine + font load from a CDN on **first use only** (then cached); samples, validation and the ledger run fully offline.
- The ULPIN mirrors the Bhu-Aadhaar **format**; the official ID comes from the DoLR service in production.
- Unit conversions use standard tables; state-specific bigha variants are a production configuration item.

## 🙏 Acknowledgements

- **Tesseract.js** & the Tesseract OCR project · **Noto Sans Devanagari** (Google/Noto)
- Department of Land Resources (DoLR), DILRMP & DILRMP 3.0 guidelines
- NIST FIPS 180-4 (SHA-256) · OWASP ASVS

## 📄 License

MIT — free to use, study, and build upon.

---

<div align="center">

**DIGITIZE · VALIDATE · VERIFY · TRUST**

*Bhu-Netra doesn't replace the revenue system — it makes sure the next record that enters it is one nobody will have to fight over.*

</div>
