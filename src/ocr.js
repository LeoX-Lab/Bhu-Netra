/* OCR service: auto language detection + dual-pass digit repair.
 *
 * Why dual-pass: Tesseract's Devanagari (hin) model reliably misreads the
 * Latin digit '1' - as a danda (।), as a Devanagari letter (उ), as another
 * Devanagari digit (३), or drops it ("145" -> "45", "13152.30" -> "352.30").
 * Verified against tessdata fast AND best models. Fix: run the primary pass
 * (hin+eng, or a regional sweep), then an eng-only pass; eng reads digits
 * reliably. Numeric tokens are matched by geometry and repaired from the eng
 * pass - but ONLY where the failure signature matches (a '1' the primary
 * lost), never a blind overwrite. Missing digits are re-inserted by geometry.
 */
const { createWorker } = require('tesseract.js');
const { LANG_DEFAULT, LANG_REGIONAL, scriptProfile } = require('./engine/langdetect');
const { normalizeDigits } = require('./engine/units');

async function runPass(imageInput, lang) {
  const worker = await createWorker(lang, 1, { logger: () => {} });
  try {
    const { data } = await worker.recognize(imageInput);
    const lines = (data.lines || []).map(l => ({
      text: l.text,
      bbox: l.bbox,
      words: (l.words || []).map(w => ({ text: w.text, conf: w.confidence, bbox: w.bbox }))
    }));
    return { lines, text: String(data.text || ''), confidence: data.confidence || 0 };
  } finally {
    await worker.terminate();
  }
}

/* ---------- geometry helpers ---------- */
/* intersection-over-MIN with a vertical line gate. Robust to eng passes that
 * inflate a word bbox by merging neighbouring junk - IoU breaks there (a 3-digit
 * token inside a 6-token-wide box scores <0.3 on IoU but 1.0 here). */
function matchScore(a, b) {
  const xInt = Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0));
  const yInt = Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
  if (!xInt || !yInt) return 0;
  const hA = a.y1 - a.y0, hB = b.y1 - b.y0;
  if (yInt / Math.min(hA, hB) < 0.5) return 0;   // different text lines
  const inter = xInt * yInt;
  const areaA = (a.x1 - a.x0) * hA, areaB = (b.x1 - b.x0) * hB;
  return inter / Math.min(areaA, areaB);         // 1.0 = smaller box inside larger
}
const hasLetters = t => /[A-Za-z\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/.test(String(t).replace(/[\u0966-\u096F]/g, ''));
const pureDigits = t => /^[\d.,\/\-–:()\[\]]+$/.test(t) && /\d/.test(t);
const singleDevaChar = t => /^[\u0900-\u097F]$/.test(t);      // e.g. '1' misread as 'उ'
const hasDevaDigits = t => /[\u0966-\u096F]/.test(t);          // e.g. '१' for '1'
const dandaArt = p => /[।॥|]/.test(p);

/* Digit-repair candidate: pure digit/punct runs (incl. Devanagari-digit forms),
 * single Devanagari characters, or danda artifacts. Real words stay untouched. */
function repairCandidate(rawText){
  if (hasLetters(rawText)) return singleDevaChar(rawText) || hasDevaDigits(rawText);
  return /\d/.test(rawText) || dandaArt(rawText) || hasDevaDigits(rawText);
}
const oneLost = (p, e) => e.includes('1') && !p.includes('1');

function mergeDigitFix(primaryLines, engLines) {
  const repairs = [], insertions = [];
  const engNum = [];
  for (const ln of engLines) for (const w of ln.words) if (pureDigits(w.text)) engNum.push(w);

  // Pass 1: repair digit tokens from the best-matching eng token.
  // One repair per eng token (highest score) so fragmented numbers like
  // "23 / 2024" (from "1123/2024") are not double-repaired.
  const cand = [];
  for (const ln of primaryLines) {
    for (const w of ln.words) {
      if (!repairCandidate(w.text)) continue;
      const norm = normalizeDigits(w.text);
      let best = -1, bs = 0;
      for (let ei = 0; ei < engNum.length; ei++) {
        const s = matchScore(w.bbox, engNum[ei].bbox);
        if (s > bs) { bs = s; best = ei; }
      }
      if (best >= 0 && bs >= 0.60) cand.push({ w, ln, ei: best, bs, norm });
    }
  }
  const perEng = new Map();
  for (const c of cand) { const prev = perEng.get(c.ei); if (!prev || c.bs > prev.bs) perEng.set(c.ei, c); }
  const drop = new Set();
  for (const c of [...perEng.values()]) {
    const e = engNum[c.ei], target = e.text;
    if (target === c.norm || target === c.w.text) continue;
    if (oneLost(c.norm, target) || dandaArt(c.w.text) || hasDevaDigits(c.w.text)) {
      repairs.push({ from: c.w.text, to: target });
      c.w.text = target;
      // absorb numeric fragments the repair made redundant ("23 1123/2024" -> "1123/2024")
      const ws = c.ln.words, idx = ws.indexOf(c.w);
      for (const j of [idx - 1, idx + 1]) {
        const nb = ws[j];
        if (nb && nb !== c.w && pureDigits(nb.text) && nb.text.length <= 3 && target.includes(nb.text)) drop.add(nb);
      }
    }
  }

  // Pass 2: re-insert '1'-containing digit runs the primary pass dropped entirely
  for (const e of engNum) {
    if (!e.text.includes('1')) continue;           // only the known drop-failure mode
    let bs = 0;
    for (const ln of primaryLines) for (const w of ln.words) {
      if (drop.has(w)) continue;
      const s = matchScore(w.bbox, e.bbox);
      if (s > bs) bs = s;
    }
    if (bs >= 0.25) continue;                       // already represented in primary
    const ey = (e.bbox.y0 + e.bbox.y1) / 2;
    let target = null, bd = Infinity;
    for (const ln of primaryLines) {
      if (!ln.bbox) continue;
      const ly = (ln.bbox.y0 + ln.bbox.y1) / 2;
      const d = Math.abs(ly - ey);
      const withinX = e.bbox.x1 >= ln.bbox.x0 - 60 && e.bbox.x0 <= ln.bbox.x1 + 60;
      if (withinX && d < bd) { bd = d; target = ln; }
    }
    if (target && bd < (e.bbox.y1 - e.bbox.y0) * 2.5) {
      const words = target.words.filter(w => w.bbox && !drop.has(w));
      let at = words.findIndex(w => w.bbox.x0 > e.bbox.x0);
      if (at < 0) at = words.length;
      words.splice(at, 0, { text: e.text, conf: e.conf, bbox: e.bbox });
      target.words = words;
      insertions.push(e.text);
    }
  }

  // Rebuild line texts from (repaired) words
  for (const ln of primaryLines) {
    if (ln.words && ln.words.length) {
      ln.words = ln.words.filter(w => w.text !== '' && !drop.has(w));
      ln.text = ln.words.map(w => w.text).join(' ');
    }
  }
  return { repairs, insertions };
}

/* ---------- main entry ---------- */
async function scanImage(imageInput, onStatus) {
  const say = m => { try { onStatus && onStatus(m); } catch (e) {} };

  say('primary pass: Hindi + English (hin+eng)');
  const p1 = await runPass(imageInput, LANG_DEFAULT);
  let result = p1, langUsed = LANG_DEFAULT;
  const prof = scriptProfile(p1.text);

  if (prof.devaRatio >= 0.05) {
    say('Devanagari script confirmed (ratio ' + (prof.devaRatio * 100).toFixed(1) + '%) - keeping hin+eng output');
  } else if ((p1.confidence < 55 && prof.latnWords < 4) || !p1.text.trim()) {
    say('no Devanagari and weak Latin output - running regional script sweep (ben, guj, pan, ori, tam, tel, kan, mal)');
    const p2 = await runPass(imageInput, LANG_REGIONAL);
    if (p2.confidence >= p1.confidence || p2.text.trim().length > p1.text.trim().length) {
      result = p2; langUsed = LANG_REGIONAL;
      say('sweep confidence ' + Math.round(p2.confidence) + '% vs first pass ' + Math.round(p1.confidence) + '% - sweep kept');
    } else {
      say('first pass kept (confidence ' + Math.round(p1.confidence) + '%)');
    }
  } else {
    say('Latin-script record confirmed - confidence ' + Math.round(p1.confidence) + '%');
  }

  // Digit repair pass (eng reads digits the Devanagari model mangles)
  let digitFix = null;
  if (/\d/.test(result.text)) {
    say('digit-integrity pass: eng cross-read for numeric tokens');
    const pe = await runPass(imageInput, 'eng');
    digitFix = mergeDigitFix(result.lines, pe.lines);
    result.text = result.lines.map(l => l.text).join('\n');
    say('digit repair: ' + digitFix.repairs.length + ' token(s) repaired, ' + digitFix.insertions.length + ' re-inserted');
  }

  return {
    text: result.text,
    lines: result.lines.map(l => ({ text: l.text, words: l.words })),
    confidence: result.confidence,
    langUsed,
    profile: prof,
    digitFix
  };
}

module.exports = { scanImage, runPass, mergeDigitFix };
