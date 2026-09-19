/* t3: ledger chain — seed verify, commit, re-verify, tamper detection */
process.env.BN_DB = process.env.BN_DB || '/tmp/bn-t3.db'; // isolate from any running server
const store = require('../src/db');
const { verifyChain } = require('../src/ledger');
const { emptyFields } = require('../src/engine/mapper');
const { runValidation } = require('../src/engine/validate');

(async () => {
  await store.initDb(true); // fresh seed (data/bhunetra.db replaced)
  let pass=0, fail=0;
  const ok=(cond,msg)=>{ console.log(cond?'PASS':'FAIL', msg); cond?pass++:fail++; };

  // 1. seeded chain is valid
  let v=verifyChain(store.allBlocks(), store.recordsById());
  ok(v.valid===true, 'seeded chain verifies ('+store.allBlocks().length+' blocks)');
  ok(store.allRecords().length===12, '12 seeded records');

  // 2. commit a fresh record (the with-1s khatauni)
  const F=(x,c)=>({v:x,c:c||.85,edited:false,verified:false});
  const fields={ docType:F('Khatauni (RoR extract)',.9), state:F('Uttar Pradesh',.88), district:F('मेरठ',.84), tehsil:F('मावना',.83), village:F('सूरजपुर',.84), khasra:F('145',.86), owner:F('रामेश्वर सिंह',.86), father:F('रघुनाथ सिंह',.8), areaStr:F('1.75 एकड़',.82), areaSqM:F('7082.01',.8), landClass:F('कृषि',.82), docDate:F('2026-09-04') };
  const report=runValidation(fields,{records:store.allRecords(),registries:{findMutReg:store.findMutReg,findLit:store.findLit},today:new Date()});
  const rec=store.commitRecord(fields, report);
  ok(/^\d{14}$/.test(rec.ulpin), 'ULPIN generated: '+rec.ulpin);
  ok(rec.status==='validated' && rec.block>=1, 'sealed into block #'+rec.block);
  v=verifyChain(store.allBlocks(), store.recordsById());
  ok(v.valid===true, 'chain still valid after commit');

  // 3. record hash verify + tamper
  let rv=store.verifyRecord(rec.id);
  ok(rv.ok===true, 'record seal verifies');
  rv=store.tamperRecord(rec.id);
  ok(rv.ok===false, 'tamper detected at record level');
  v=verifyChain(store.allBlocks(), store.recordsById());
  ok(v.valid===false && v.brokenAt===rec.block, 'chain detects broken seal at block '+v.brokenAt);

  console.log(`RESULT: ${pass} pass, ${fail} fail`);
  store.closeDb();
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
