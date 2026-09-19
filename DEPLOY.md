# Deploying Bhu-Netra

The app is a **Node.js server** — it needs a host that runs Node (not GitHub Pages / Netlify Drop / Vercel-static).

## Option 1 — Demo day laptop (most reliable) ⭐

```bash
npm install
npm start          # → http://localhost:3000
```

**Before the demo:** run one full scan (Sample A) while online — this downloads and caches the OCR language models. After that, the demo needs no internet at all.

## Option 2 — Render.com (free public URL for the PPT)

1. Push this folder to GitHub (see REPO steps below)
2. **render.com** → sign up with GitHub → **New + → Web Service**
3. Connect your `Bhu-Netra` repo — `render.yaml` in this repo pre-fills everything
4. Plan: **Free** → **Create Web Service**
5. ~3 min later you get `https://bhu-netra-xxxx.onrender.com` — put THIS on Slide 6 of the PPT

Free-tier note: the service sleeps after ~15 min idle; first load after sleep takes ~30 s. Wake it before the demo.

## Option 3 — Railway.app (alternative)

railway.app → New Project → Deploy from GitHub repo → it detects Node automatically → public URL in ~2 min. Free trial credit, no sleep.

## GitHub repo setup (replace the old single-file repo)

```bash
cd bhunetra
git init
git add .
git commit -m "Bhu-Netra full-stack: Express + SQLite + server-side OCR"
git branch -M main
git remote add origin https://github.com/leox-lab/Bhu-Netra.git
git push -f origin main        # -f replaces the old single-file content
```

`.gitignore` keeps `node_modules/` and `data/*.db` out of the repo. The database seeds itself on first boot.

## What NOT to push

Keep SIH prep material (Q&A docs, prompt files, judge-prep) out of the public repo — the repo should contain only the project.
