/* Bhu-Netra backend — Express + SQLite + Tesseract OCR.
 * API:
 *   GET  /api/state                  records, blocks, activity, discs, stats
 *   POST /api/scan                   (multipart image) OCR + field extraction
 *   POST /api/validate               {fields} -> R1-R10 report (server-side truth)
 *   POST /api/commit                 {fields} -> re-validates, seals + ledgers
 *   POST /api/queue                  {fields, report, note} -> review queue
 *   POST /api/discs/:id/resolve      {status}
 *   GET  /api/ledger                 blocks
 *   POST /api/ledger/verify          full chain recompute
 *   GET  /api/records/:id/verify     seal check
 *   POST /api/records/:id/tamper     simulate unauthorized edit (demo)
 *   POST /api/reset                  reseed database
 */
const express = require('express');
const multer  = require('multer');
const fs = require('fs'); const os = require('os'); const path = require('path');
const store = require('./db');
const { scanImage } = require('./ocr');
const { mapFieldsFromText } = require('./engine/mapper');
const { runValidation } = require('./engine/validate');
const { verifyChain } = require('./ledger');

const app = express();
app.use(express.json({limit:'2mb'}));
const upload = multer({ storage: multer.memoryStorage(), limits:{fileSize:15*1024*1024} });

const wrap = fn => (req,res) => Promise.resolve(fn(req,res)).catch(e => {
  console.error('[api]', e);
  res.status(e.status||500).json({error:e.message||'internal error'});
});

app.get('/api/state', wrap(async (req,res)=>res.json(store.getState())));

app.post('/api/scan', upload.single('file'), wrap(async (req,res)=>{
  if(!req.file) { const e=new Error('No file uploaded (field name: "file")'); e.status=400; throw e; }
  if(!/^image\//.test(req.file.mimetype)){
    const e=new Error('Unsupported type '+req.file.mimetype+' - upload an image (PNG/JPEG). PDF pages are rendered to images by the kiosk client in production.');
    e.status=415; throw e;
  }
  const tmp=path.join(os.tmpdir(),'bn-'+Date.now()+'-'+Math.random().toString(36).slice(2)+'.png');
  fs.writeFileSync(tmp, req.file.buffer);
  try{
    const events=[];
    const r=await scanImage(tmp, m=>events.push(m));
    const {fields,count}=mapFieldsFromText(r.text, null);
    res.json({ events, ocr:{ text:r.text, confidence:r.confidence, langUsed:r.langUsed, profile:r.profile, digitFix:r.digitFix }, fields, captured:count });
  } finally { try{fs.unlinkSync(tmp);}catch(e){} }
}));

function validateWithCtx(fields){
  const records=store.allRecords();
  return runValidation(fields, { records, registries:{ findMutReg:store.findMutReg, findLit:store.findLit }, today:new Date() });
}

app.post('/api/validate', wrap(async (req,res)=>{
  const fields=req.body&&req.body.fields;
  if(!fields){ const e=new Error('Body must be {fields:{...}}'); e.status=400; throw e; }
  res.json(validateWithCtx(fields));
}));

app.post('/api/commit', wrap(async (req,res)=>{
  const fields=req.body&&req.body.fields;
  if(!fields){ const e=new Error('Body must be {fields:{...}}'); e.status=400; throw e; }
  const report=validateWithCtx(fields);            // server re-validates; client is never trusted
  if(report.verdict==='fail'){
    const e=new Error('Hard failures must be resolved first - send to Review Queue. ('+report.checks.filter(c=>c.status==='fail').map(c=>c.id).join(', ')+')');
    e.status=409; throw e;
  }
  const rec=store.commitRecord(fields, report);
  res.json({record:rec, report});
}));

app.post('/api/queue', wrap(async (req,res)=>{
  const {fields, note}=req.body||{};
  if(!fields){ const e=new Error('Body must be {fields:{...}, note?}'); e.status=400; throw e; }
  const report=validateWithCtx(fields);
  const q=store.sendToQueue(fields, report, note);
  res.json({disc:q.disc, record:q.record, report});
}));

app.post('/api/discs/:id/resolve', wrap(async (req,res)=>{
  const d=store.resolveDisc(req.params.id, (req.body&&req.body.status)||'resolved');
  if(!d){ const e=new Error('No such discrepancy'); e.status=404; throw e; }
  res.json(d);
}));

app.get('/api/ledger', wrap(async (req,res)=>res.json({blocks:store.allBlocks()})));

app.post('/api/ledger/verify', wrap(async (req,res)=>{
  res.json(verifyChain(store.allBlocks(), store.recordsById()));
}));

app.get('/api/records/:id/verify', wrap(async (req,res)=>{
  const v=store.verifyRecord(req.params.id);
  if(!v){ const e=new Error('No such record'); e.status=404; throw e; }
  res.json(v);
}));

app.post('/api/records/:id/tamper', wrap(async (req,res)=>{
  const v=store.tamperRecord(req.params.id);
  if(!v){ const e=new Error('No such record'); e.status=404; throw e; }
  res.json(v);
}));

app.post('/api/records/:id/restore', wrap(async (req,res)=>{
  const v=store.restoreRecord(req.params.id);
  if(!v){ const e=new Error('No such record'); e.status=404; throw e; }
  res.json(v);
}));

app.post('/api/ledger/tamper', wrap(async (req,res)=>{
  const v=store.tamperChainBlock();
  if(!v){ const e=new Error('No block with entries to tamper'); e.status=409; throw e; }
  res.json(v);
}));

app.post('/api/ledger/undo', wrap(async (req,res)=>{
  res.json(store.undoChainTamper());
}));

app.post('/api/reset', wrap(async (req,res)=>{
  await store.initDb(true);
  res.json(store.getState());
}));

app.use(express.static(path.join(__dirname,'..','public')));

const PORT=process.env.PORT||3000;
if(require.main===module){
  store.initDb().then(()=>{
    app.listen(PORT,'0.0.0.0',()=>console.log('Bhu-Netra backend listening on :'+PORT));
  }).catch(e=>{console.error('boot failed',e);process.exit(1);});
}
module.exports={app};
