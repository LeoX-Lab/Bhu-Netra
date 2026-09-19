/* t4: full API end-to-end — boot server, scan -> validate -> commit -> verify -> tamper */
const { spawn } = require('child_process');
const fs = require('fs'); const path = require('path');

const PORT = 3901;
const BASE = 'http://127.0.0.1:'+PORT;

async function main(){
  const srv = spawn('node', ['src/server.js'], { cwd: path.join(__dirname,'..'), env:{...process.env,PORT:String(PORT),BN_DB:'/tmp/bn-t4.db'}, stdio:'pipe' });
  const wait = ms => new Promise(r=>setTimeout(r,ms));
  let ready=false, log='';
  for(let i=0;i<40 && !ready;i++){ await wait(250);
    try{ const r=await fetch(BASE+'/api/state'); if(r.ok) ready=true; }catch(e){ log+=e.message; } }
  if(!ready){ console.error('server did not start:', log); srv.kill(); process.exit(1); }
  let pass=0, fail=0;
  const ok=(cond,msg)=>{ console.log(cond?'PASS':'FAIL', msg); cond?pass++:fail++; };
  try{
    // 0. reset to clean seed (earlier tests may have committed/tampered)
    await (await fetch(BASE+'/api/reset',{method:'POST'})).json();
    // 1. state
    let st=await (await fetch(BASE+'/api/state')).json();
    ok(st.records.length===12 && st.blocks.length===4, 'GET /api/state: 12 records, 4 blocks, stats='+JSON.stringify(st.stats));

    // 2. scan (the with-1s khatauni that broke the old engine) - NDJSON stream, result is the last line
    const fd=new FormData();
    fd.append('file', new Blob([fs.readFileSync(path.join(__dirname,'fixtures','khatauni-with-ones.png'))],{type:'image/png'}), 'khatauni.png');
    const sres=await fetch(BASE+'/api/scan',{method:'POST',body:fd});
    const slines=(await sres.text()).trim().split('\n').map(l=>JSON.parse(l));
    ok(slines.some(l=>l.ev==='status'&&l.step==='ingest'), 'POST /api/scan: live step events streamed (ingest -> ocr -> extract -> score)');
    ok(slines[slines.length-1].ev==='result', 'POST /api/scan: NDJSON terminates with the result line');
    const scan=slines[slines.length-1];
    ok(scan.fields.khasra.v==='145', 'POST /api/scan: khasra='+scan.fields.khasra.v+' (was "45" in old engine)');
    ok(scan.fields.khatuni.v==='271', 'khatuni='+scan.fields.khatuni.v);
    ok(scan.fields.areaSqM.v==='7082.01', 'areaSqM='+scan.fields.areaSqM.v);
    ok(scan.fields.landClass.v==='कृषि', 'landClass='+scan.fields.landClass.v);
    ok(scan.ocr.digitFix && scan.ocr.digitFix.repairs.length>=3, 'digit repairs applied: '+scan.ocr.digitFix.repairs.map(r=>r.from+'→'+r.to).join(' '));

    // 3. validate
    let rep=await (await fetch(BASE+'/api/validate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({fields:scan.fields})})).json();
    ok(rep.verdict==='warn' && rep.checks.length===10, 'POST /api/validate: verdict='+rep.verdict+', 10 checks');
    const r3=rep.checks.find(c=>c.id==='R3');
    ok(r3.status==='pass', 'R3 area cross-check PASS on repaired digits');

    // 4. commit
    let cm=await (await fetch(BASE+'/api/commit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({fields:scan.fields})})).json();
    ok(cm.record && /^\d{14}$/.test(cm.record.ulpin), 'POST /api/commit: sealed, ULPIN='+cm.record.ulpin);
    const rid=cm.record.id;

    // 5. ledger verify (valid)
    let lv=await (await fetch(BASE+'/api/ledger/verify',{method:'POST'})).json();
    ok(lv.valid===true, 'POST /api/ledger/verify: chain valid');

    // 6. record verify -> tamper -> verify
    let rv=await (await fetch(BASE+'/api/records/'+rid+'/verify')).json();
    ok(rv.ok===true, 'record seal OK');
    rv=await (await fetch(BASE+'/api/records/'+rid+'/tamper',{method:'POST'})).json();
    ok(rv.ok===false, 'tamper detected (record-level)');
    lv=await (await fetch(BASE+'/api/ledger/verify',{method:'POST'})).json();
    ok(lv.valid===false, 'chain broken after tamper, at block '+lv.brokenAt);

    // 7. queue flow
    const q=await (await fetch(BASE+'/api/queue',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({fields:{...scan.fields, owner:{v:'Someone Else',c:.86,edited:false,verified:false}, khasra:{v:'156/2',c:.86,edited:false,verified:false}}, note:'duplicate test'})})).json();
    ok(q.disc && q.disc.id, 'POST /api/queue: disc '+q.disc.id+' ('+q.report.verdict+')');
    const rs=await (await fetch(BASE+'/api/discs/'+q.disc.id+'/resolve',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({status:'resolved'})})).json();
    ok(rs.status==='resolved', 'resolve disc');

    // 8. reset restores seed
    st=await (await fetch(BASE+'/api/reset',{method:'POST'})).json();
    ok(st.records.length===12, 'POST /api/reset: back to 12 records');
  } finally {
    srv.kill();
  }
  console.log(`RESULT: ${pass} pass, ${fail} fail`);
  process.exit(fail?1:0);
}
main().catch(e=>{console.error(e);process.exit(1);});
