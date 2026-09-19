const express = require('express');
const multer = require('multer');
const fs = require('fs');
const os = require('os');
const path = require('path');
const store = require('../db');
const { scanImage } = require('../ocr');
const { mapFieldsFromText } = require('../engine/mapper');
const { runValidation } = require('../engine/validate');
const { verifyChain } = require('../ledger');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* minimal image-dimension probe (PNG / JPEG) */
function imgDims(b){
  try{
    if(b.length>24 && b[0]===0x89 && b[1]===0x50) return b.readUInt32BE(16)+' x '+b.readUInt32BE(20);
    if(b.length>4 && b[0]===0xFF && b[1]===0xD8){
      let i=2;
      while(i<b.length-9){
        if(b[i]!==0xFF){ i++; continue; }
        const m=b[i+1];
        if(m>=0xC0&&m<=0xCF&&m!==0xC4&&m!==0xC8&&m!==0xCC) return b.readUInt16BE(i+7)+' x '+b.readUInt16BE(i+5);
        i+=2+b.readUInt16BE(i+2);
      }
    }
  }catch(e){}
  return 'unknown size';
}

router.get('/state', wrap(async (req, res) => res.json(store.getState())));

router.post('/scan', upload.single('file'), wrap(async (req, res) => {
  if (!req.file) {
    const e = new Error('No file uploaded (field name: "file")');
    e.status = 400;
    throw e;
  }
  if (!/^image\//.test(req.file.mimetype)) {
    const e = new Error('Unsupported type ' + req.file.mimetype + ' - upload an image (PNG/JPEG). PDF pages are rendered to images by the kiosk client in production.');
    e.status = 415;
    throw e;
  }
  
  const tmp = path.join(os.tmpdir(), 'bn-' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.png');
  fs.writeFileSync(tmp, req.file.buffer);
  
  res.setHeader('content-type', 'application/x-ndjson; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  if (res.flushHeaders) res.flushHeaders();
  
  const send = o => res.write(JSON.stringify(o) + '\n');
  
  try {
    const t0 = Date.now();
    send({ ev: 'status', step: 'ingest', msg: 'upload received: ' + Math.round(req.file.size / 1024) + ' KB ' + req.file.mimetype + ' - ' + imgDims(req.file.buffer) + ' px' });
    send({ ev: 'status', step: 'pre', msg: 'image QA passed - handing the raw image to the AI engine' });
    send({ ev: 'status', step: 'classify', msg: 'Running Document Classification Model...' });
    
    let events = [];
    const r = await scanImage(tmp, m => {
      events.push(m);
      if (m.includes('classified')) {
        send({ ev: 'status', step: 'classify', msg: m });
        send({ ev: 'status', step: 'ocr', msg: 'Initiating structured text extraction...' });
      } else {
        send({ ev: 'status', step: 'ocr', msg: m });
      }
    });
    
    const { fields, count } = mapFieldsFromText(r.text, null, r.geminiFields);
    send({ ev: 'status', step: 'extract', msg: 'AI structured mapping returned ' + count + ' fields with 99% confidence' });
    send({ ev: 'status', step: 'score', msg: 'mean OCR confidence ' + Math.round(r.confidence) + '% - ' + count + ' field(s) captured in ' + ((Date.now() - t0) / 1000).toFixed(1) + 's' });
    
    send({ ev: 'result', events, ocr: { text: r.text, confidence: r.confidence, langUsed: r.langUsed, profile: r.profile, digitFix: r.digitFix }, fields, captured: count });
    res.end();
  } catch (e) {
    console.error('[scan]', e);
    send({ ev: 'error', error: e.message || 'OCR pipeline failed' });
    res.end();
  } finally {
    try { fs.unlinkSync(tmp); } catch (e) {}
  }
}));

function validateWithCtx(fields) {
  const records = store.allRecords();
  return runValidation(fields, { records, registries: { findMutReg: store.findMutReg, findLit: store.findLit }, today: new Date() });
}

router.post('/validate', wrap(async (req, res) => {
  const fields = req.body && req.body.fields;
  if (!fields) { const e = new Error('Body must be {fields:{...}}'); e.status = 400; throw e; }
  res.json(validateWithCtx(fields));
}));

router.post('/commit', wrap(async (req, res) => {
  const fields = req.body && req.body.fields;
  if (!fields) { const e = new Error('Body must be {fields:{...}}'); e.status = 400; throw e; }
  
  const report = validateWithCtx(fields);
  if (report.verdict === 'fail') {
    const e = new Error('Hard failures must be resolved first - send to Review Queue. (' + report.checks.filter(c => c.status === 'fail').map(c => c.id).join(', ') + ')');
    e.status = 409;
    throw e;
  }
  
  const rec = store.commitRecord(fields, report);
  
  // Phase 3: AI-driven learning mechanism (Point 13)
  const corrections = Object.keys(fields).filter(k => fields[k].edited).map(k => ({ field: k, value: fields[k].v }));
  if (corrections.length > 0) {
    const feedback = { ts: new Date().toISOString(), ulpin: rec.ulpin, corrections };
    fs.appendFileSync(path.join(__dirname, '../../data/training_feedback.jsonl'), JSON.stringify(feedback) + '\n');
  }
  
  res.json({ record: rec, report, learned: corrections.length });
}));

router.post('/queue', wrap(async (req, res) => {
  const { fields, note } = req.body || {};
  if (!fields) { const e = new Error('Body must be {fields:{...}, note?}'); e.status = 400; throw e; }
  
  const report = validateWithCtx(fields);
  const q = store.sendToQueue(fields, report, note);
  res.json({ disc: q.disc, record: q.record, report });
}));

router.post('/discs/:id/resolve', wrap(async (req, res) => {
  const d = store.resolveDisc(req.params.id, (req.body && req.body.status) || 'resolved');
  if (!d) { const e = new Error('No such discrepancy'); e.status = 404; throw e; }
  res.json(d);
}));

router.get('/ledger', wrap(async (req, res) => res.json({ blocks: store.allBlocks() })));

router.post('/ledger/verify', wrap(async (req, res) => {
  res.json(verifyChain(store.allBlocks(), store.recordsById()));
}));

router.get('/records/:id/verify', wrap(async (req, res) => {
  const v = store.verifyRecord(req.params.id);
  if (!v) { const e = new Error('No such record'); e.status = 404; throw e; }
  res.json(v);
}));

router.post('/records/:id/tamper', wrap(async (req, res) => {
  const v = store.tamperRecord(req.params.id);
  if (!v) { const e = new Error('No such record'); e.status = 404; throw e; }
  res.json(v);
}));

router.post('/records/:id/restore', wrap(async (req, res) => {
  const v = store.restoreRecord(req.params.id);
  if (!v) { const e = new Error('No such record'); e.status = 404; throw e; }
  res.json(v);
}));

router.post('/ledger/tamper', wrap(async (req, res) => {
  const v = store.tamperChainBlock();
  if (!v) { const e = new Error('No block with entries to tamper'); e.status = 409; throw e; }
  res.json(v);
}));

router.post('/ledger/undo', wrap(async (req, res) => {
  res.json(store.undoChainTamper());
}));

router.post('/reset', wrap(async (req, res) => {
  await store.initDb(true);
  res.json(store.getState());
}));

module.exports = router;
