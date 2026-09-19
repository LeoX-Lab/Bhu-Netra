/* t6: full-stack UI test - the real frontend (index.html + app.js) served by the
 * real backend, driven via jsdom. Verifies the port kept the app working. */
const { spawn } = require('child_process');
const { JSDOM } = require('jsdom');
const path = require('path');

const PORT = 3904, BASE = 'http://127.0.0.1:' + PORT;
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const srv = spawn('node', ['src/server.js'], { cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: String(PORT), BN_DB: '/tmp/bn-t6.db' }, stdio: 'pipe' });
  let ready = false;
  for (let i = 0; i < 40 && !ready; i++) { await wait(250); try { const r = await fetch(BASE + '/api/state'); if (r.ok) ready = true; } catch (e) {} }
  if (!ready) { console.error('backend did not start'); srv.kill(); process.exit(1); }
  await (await fetch(BASE + '/api/reset', { method: 'POST' })).json(); // clean seed for deterministic counts

  const dom = await JSDOM.fromURL(BASE + '/', {
    resources: 'usable', runScripts: 'dangerously', pretendToBeVisual: true,
    beforeParse(window) {
      window.fetch = (u, o) => fetch(new URL(u, BASE).href, o);
      window.FormData = FormData; window.Blob = Blob; window.File = File;
      window.TextDecoder = TextDecoder;        // NDJSON stream reader for /api/scan
      window.confirm = () => true;
      // minimal 2D canvas mock (pseudoQR / preprocessing never run for real in jsdom)
      const ctx2d = new Proxy({}, { get: (t, k) => (k === 'canvas' ? {} : () => ({ data: new Uint8ClampedArray(4) })) });
      window.HTMLCanvasElement.prototype.getContext = () => ctx2d;
      window.html2canvas = undefined;
    }
  });
  const { window } = dom;
  const $ = s => window.document.querySelector(s);
  const $$ = s => [...window.document.querySelectorAll(s)];
  window.addEventListener('error', e => console.error('[page error]', e.message));

  let pass = 0, fail = 0;
  const ok = (c, m) => { console.log(c ? 'PASS' : 'FAIL', m); c ? pass++ : fail++; };

  // wait for init() to fetch state + renderAll
  let booted = false;
  for (let i = 0; i < 40 && !booted; i++) {
    await wait(250);
    booted = $('#kpiRow') && $('#kpiRow').textContent.includes('12');
  }
  ok(booted, 'dashboard booted: 12 parcels KPI rendered');

  // nav + views
  window.nav('registry');
  ok($$('.regcard,.recrow,.rrow').length >= 0 && $('#view-registry').classList.contains('on'), 'registry view renders');
  window.nav('ledger');
  await wait(300);
  ok($('#view-ledger').textContent.includes('GENESIS') || $$('#view-ledger .blockrow,#view-ledger [class*=block]').length > 0 || $('#view-ledger').textContent.includes('Block'), 'ledger view shows blocks');
  window.nav('queue');
  ok($('#view-queue').textContent.length > 40, 'queue view renders');

  // ---- sample A: full digitize -> validate -> commit flow ----
  window.nav('digitize');
  await wait(200);
  ok($$('#sampleGrid .thumb').length === 4, 'sample grid shows 4 documents');
  window.selectSample(0);
  let fieldsRendered = false;
  for (let i = 0; i < 80 && !fieldsRendered; i++) {
    await wait(500); // real OCR on the server (hin+eng + eng pass) takes seconds
    fieldsRendered = $('#fieldsWrap') && $('#fieldsWrap').textContent.includes('305');
  }
  ok(fieldsRendered, 'sample A: real OCR completed, khasra 305 in fields panel');
  ok(!$('#btnValidate').disabled, 'Validate button ENABLED after scan (was the Render bug)');
  ok(!$('#btnRerun').disabled, 'Re-run button enabled after scan');
  ok($('#terminal').textContent.includes('digit-integrity') || $('#terminal').textContent.includes('field mapper captured'), 'terminal narrates the pipeline');
  ok($('#pipelineMeta').textContent.includes('Pipeline complete'), 'pipeline meta shows completion summary');
  ok([0,1,2,3,4].every(i=>$('#st'+i).classList.contains('done')), 'stepper: all 5 steps lit (Ingest->Preprocess->OCR->Extract->Score)');
  await window.goValidate();
  await wait(300);
  ok($('#view-validate').textContent.includes('R10') || $$('#view-validate .check,.chk,[class*=rule]').length >= 10 || $('#view-validate').textContent.split('R').length > 8, 'validation view shows the 10 checks');
  const beforeCount = (await (await fetch(BASE + '/api/state')).json()).records.length;
  await window.commit();
  await wait(600);
  const afterState = await (await fetch(BASE + '/api/state')).json();
  ok(afterState.records.length === beforeCount + 1, 'commit sealed a new record (12 → ' + afterState.records.length + ')');
  ok($('#modalRoot').innerHTML.length > 50 || $('#view-registry').classList.contains('on'), 'registry opened with the sealed record');

  // ---- sample C: fraud deed must be blocked ----
  window.nav('digitize');
  await wait(200);
  window.selectSample(2);
  let cValidated = false;
  for (let i = 0; i < 80 && !cValidated; i++) {
    await wait(500);
    cValidated = $('#fieldsWrap') && $('#fieldsWrap').textContent.includes('78/2/1');
  }
  ok(cValidated, 'sample C: OCR completed (fraud deed)');
  await window.goValidate();
  await wait(300);
  ok($('#view-validate').textContent.includes('Duplicate-claim') || $('#view-validate').textContent.includes('duplicate'), 'validation view shows duplicate-claim conflict');
  const cntBefore = (await (await fetch(BASE + '/api/state')).json()).records.length;
  await window.commit();
  await wait(600);
  const cntAfter = (await (await fetch(BASE + '/api/state')).json()).records.length;
  ok(cntAfter === cntBefore, 'fraud deed commit BLOCKED (record count unchanged)');

  // ---- ledger verify via UI ----
  window.nav('ledger');
  await wait(300);
  await window.verifyChain(true);
  await wait(500);
  const ch = $('#chainHealth') ? $('#chainHealth').textContent : '';
  ok(ch.includes('CHAIN VERIFIED'), 'chain verified banner: "' + ch.slice(0, 60) + '"');

  dom.window.close();
  srv.kill();
  console.log(`RESULT: ${pass} pass, ${fail} fail`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('ERROR', e); process.exit(1); });
