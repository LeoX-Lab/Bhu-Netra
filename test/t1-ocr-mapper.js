/* t1: OCR (dual-pass digit repair) + field mapper end-to-end */
const path = require('path');
const FIXTURE = path.join(__dirname, 'fixtures', 'khatauni-with-ones.png');
const { scanImage } = require('../src/ocr');
const { mapFieldsFromText } = require('../src/engine/mapper');

(async () => {
  const events = [];
  const r = await scanImage(FIXTURE, m => events.push(m));
  console.log('--- pipeline events ---');
  events.forEach(e => console.log('  ' + e));
  console.log('langUsed:', r.langUsed, '| confidence:', r.confidence.toFixed(1));
  console.log('digitFix:', JSON.stringify(r.digitFix));

  const { fields, count } = mapFieldsFromText(r.text, null);

  const expected = {
    state: 'Uttar Pradesh', district: 'मेरठ', tehsil: 'मावना', village: 'सूरजपुर',
    khewat: '27', khatuni: '271', khasra: '145', mutationNo: '312',
    owner: 'रामेश्वर सिंह', father: 'रघुनाथ सिंह',
    areaSqM: '7082.01', landClass: 'कृषि',
    docDate: '2026-09-04', docType: 'Khatauni (RoR extract)'
  };
  let pass = 0, fail = 0;
  console.log('\n--- field assertions ---');
  for (const [k, want] of Object.entries(expected)) {
    const got = fields[k] ? fields[k].v : '(missing)';
    const ok = got === want || (k === 'areaStr' ? got.includes(want) : false);
    console.log((ok ? 'PASS' : 'FAIL'), k, '=', JSON.stringify(got), ok ? '' : (' expected ' + JSON.stringify(want)));
    ok ? pass++ : fail++;
  }
  // areaStr: contains 1.75 and एकड़
  const as = fields.areaStr.v || '';
  const asOk = as.includes('1.75') && as.includes('एकड़');
  console.log((asOk ? 'PASS' : 'FAIL'), 'areaStr =', JSON.stringify(as));
  asOk ? pass++ : fail++;
  console.log(`\nRESULT: ${pass} pass, ${fail} fail (${count} fields captured)`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('ERROR', e); process.exit(1); });
