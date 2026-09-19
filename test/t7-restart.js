/* t7: SQLite persistence — commit a record, SIGKILL the server, reboot, data survives */
const { spawn } = require('child_process');
const fs = require('fs'); const path = require('path');
const PORT = 3905, BASE = 'http://127.0.0.1:' + PORT;
const DB = '/tmp/bn-t7.db';
const wait = ms => new Promise(r => setTimeout(r, ms));
async function boot(){
  const srv = spawn('node', ['src/server.js'], { cwd: path.join(__dirname,'..'), env: { ...process.env, PORT:String(PORT), BN_DB:DB }, stdio:'pipe' });
  for(let i=0;i<40;i++){ await wait(250); try{ const r=await fetch(BASE+'/api/state'); if(r.ok) return srv; }catch(e){} }
  throw new Error('server failed to boot');
}
(async()=>{
  try{ fs.unlinkSync(DB); }catch(e){}
  let pass=0, fail=0; const ok=(c,m)=>{console.log(c?'PASS':'FAIL',m);c?pass++:fail++;};
  let srv = await boot();
  await (await fetch(BASE+'/api/reset',{method:'POST'})).json();
  const F=(x,c)=>({v:x,c:c||.85,edited:false,verified:false});
  const fields={state:F('Punjab'),district:F('S.A.S. Nagar'),tehsil:F('Dera Bassi'),village:F('Khanpur'),
    khasra:F('305/9'),owner:F('Test Persist Singh'),father:F('Restart Kumar'),areaStr:F('2 Kanal'),
    docType:F('Jamabandi (Record of Rights)')};
  const cm=await (await fetch(BASE+'/api/commit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({fields})})).json();
  ok(cm.record && /^\d{14}$/.test(cm.record.ulpin), 'record sealed pre-restart (ULPIN '+cm.record.ulpin+')');
  const id=cm.record.id;

  srv.kill('SIGKILL'); await wait(800);          // hard crash - no graceful shutdown
  srv = await boot();
  const st=await (await fetch(BASE+'/api/state')).json();
  ok(st.records.length===13, 'after hard restart: '+st.records.length+' records (12 seed + 1 committed)');
  ok(st.records.some(r=>r.id===id&&r.owner==='Test Persist Singh'), 'committed record survived SIGKILL + reboot');
  const lv=await (await fetch(BASE+'/api/ledger/verify',{method:'POST'})).json();
  ok(lv.valid===true, 'ledger chain still verifies after restart');
  srv.kill();
  console.log(`RESULT: ${pass} pass, ${fail} fail`);
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
