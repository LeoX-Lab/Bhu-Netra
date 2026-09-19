/* t2: validation engine on the mapped with-1s khatauni fields */
const { runValidation } = require('../src/engine/validate');
const { emptyFields } = require('../src/engine/mapper');
const { findMutReg, findLit } = require('../src/engine/registries');

// fields as mapped by t1 (kept in sync by t4 end-to-end test)
const F = (v,c)=>({v,c:c||.85,edited:false,verified:false});
const fields = {
  docType: F('Khatauni (RoR extract)',.9), docDate: F('2026-09-04'), state: F('Uttar Pradesh',.88),
  district: F('मेरठ',.84), tehsil: F('मावना',.83), village: F('सूरजपुर',.84),
  khasra: F('145',.86), khewat: F('27',.78), khatuni: F('271',.78),
  owner: F('रामेश्वर सिंह',.86), father: F('रघुनाथ सिंह',.8),
  areaStr: F('1.75 एकड़',.82), areaSqM: F('7082.01',.8), landClass: F('कृषि',.82),
  mutationNo: F('312',.78)
};
const records = [ { state:'Haryana', district:'Ambala', tehsil:'Naraingarh', village:'Fatehgarh', khasra:'156/2', owner:'Krishan Kumar', father:'Om Prakash', status:'validated', ulpin:'06070400880011'.slice(0,14), mutationType:'sale', mutationNo:'7712' } ];

const report = runValidation(fields, { records, registries:{findMutReg,findLit}, today:'2026-09-19' });
const byId = {}; report.checks.forEach(c=>byId[c.id]=c.status);
let pass=0, fail=0;
const expect = { R1:'pass', R2:'pass', R3:'pass', R4:'pass', R5:'pass', R6:'pass', R7:'pass', R8:'warn', R9:'pass', R10:'warn' };
for(const [id,st] of Object.entries(expect)){
  const ok = byId[id]===st;
  console.log(ok?'PASS':'FAIL', id, '=', byId[id], ok?'':'expected '+st);
  ok?pass++:fail++;
}
console.log('verdict:', report.verdict, '| score:', report.score, '| computedSqM:', report.computedSqM && report.computedSqM.toFixed(1));
const vOk = report.verdict==='warn' && Math.abs(report.computedSqM-7081.93)<2;
console.log(vOk?'PASS':'FAIL','verdict+computedSqM');
vOk?pass++:fail++;
console.log(`RESULT: ${pass} pass, ${fail} fail`);
process.exit(fail?1:0);
