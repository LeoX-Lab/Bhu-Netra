/* SQLite persistence (sql.js — SQLite compiled to WASM, zero native build).
 * Schema: records | blocks | activity | discs | meta.
 * Seed data ported verbatim from the prototype (12 parcels, 3 sealed blocks,
 * activity feed, 3 review-queue discrepancies). */
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');
const { genULPIN, locEq } = require('./engine/units');
const { sha256hex, recordHashInput, blockInput } = require('./ledger');
const { findMutReg, findLit } = require('./engine/registries');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = process.env.BN_DB || path.join(DATA_DIR, 'bhunetra.db'); // BN_DB lets tests isolate
const rnd = n => Math.floor(Math.random() * n);
const rid = () => Math.random().toString(36).slice(2, 8);

const STATE_CODE = {'Punjab':'03','Haryana':'06','Himachal Pradesh':'02','Uttar Pradesh':'09','Chandigarh':'04'};

function mkSeedRecord(o){return Object.assign({khewat:'',khatuni:'',father:'',docType:'Jamabandi (RoR)',mutationNo:'',mutationType:'',mutationDate:'',landClass:'',lat:null,lng:null,avgConf:.96,checks:{pass:9,warn:1,fail:0},block:0},o);}

let db = null;

/* ---------------- low-level helpers ---------------- */
function run(sql, params){ db.prepare(sql).run(params||[]); }
function all(sql, params){
  const stmt=db.prepare(sql); stmt.bind(params||[]);
  const rows=[]; while(stmt.step())rows.push(stmt.getAsObject()); stmt.free();
  return rows;
}
function get(sql, params){ return all(sql,params)[0]||null; }
function persist(){ fs.writeFileSync(DB_PATH, Buffer.from(db.export())); }

/* ---------------- schema + seed ---------------- */
function createSchema(){
  db.run(`CREATE TABLE IF NOT EXISTS records(
    id TEXT PRIMARY KEY, ulpin TEXT, state TEXT, sc TEXT, district TEXT, dc TEXT,
    tehsil TEXT, tc TEXT, village TEXT, vc TEXT, khasra TEXT, khewat TEXT, khatuni TEXT,
    owner TEXT, father TEXT, seller TEXT, consideration TEXT, areaStr TEXT, areaSqM REAL,
    landClass TEXT, docType TEXT, docDate TEXT, mutationNo TEXT, mutationType TEXT,
    mutationDate TEXT, lat REAL, lng REAL, status TEXT, createdAt INTEGER, avgConf REAL,
    checks TEXT, block INTEGER, hash TEXT, tampered INTEGER DEFAULT 0, tamperedField TEXT, origValue REAL)`);
  db.run(`CREATE TABLE IF NOT EXISTS blocks(i INTEGER PRIMARY KEY, ts INTEGER, entries TEXT, prev TEXT, nonce TEXT, hash TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS activity(id INTEGER PRIMARY KEY AUTOINCREMENT, t INTEGER, ic TEXT, txt TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS discs(id TEXT PRIMARY KEY, sev TEXT, title TEXT, detail TEXT, ref TEXT, created INTEGER, status TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS meta(k TEXT PRIMARY KEY, v TEXT)`);
}

function seedRecords(){
  const now=Date.now(),DAY=864e5;
  const recs=[
   mkSeedRecord({id:'r1',state:'Punjab',sc:'03',district:'S.A.S. Nagar',dc:'52',tehsil:'Dera Bassi',tc:'11',village:'Khanpur',vc:'2070',khasra:'242/1',khewat:'27',khatuni:'41',owner:'Gurpreet Singh',father:'Harpal Singh',areaStr:'2 Kanal 8 Marla',areaSqM:1214.06,mutationNo:'5412',mutationType:'inheritance',mutationDate:'2016-11-02',docDate:'2016-11-02',lat:30.0281,lng:76.9924,status:'validated',createdAt:now-42*DAY,avgConf:.97}),
   mkSeedRecord({id:'r2',state:'Punjab',sc:'03',district:'Rupnagar',dc:'51',tehsil:'Morinda',tc:'08',village:'Salana',vc:'0291',khasra:'118',owner:'Balwinder Kaur',father:'Jarnail Singh (husband)',areaStr:'1 Acre 2 Kanal',areaSqM:6070.3,mutationNo:'3091',mutationType:'sale',mutationDate:'2014-02-18',docDate:'2014-02-10',lat:30.7841,lng:76.5021,status:'validated',createdAt:now-40*DAY,avgConf:.95}),
   mkSeedRecord({id:'r3',state:'Haryana',sc:'06',district:'Ambala',dc:'07',tehsil:'Naraingarh',tc:'04',village:'Fatehgarh',vc:'0088',khasra:'156/2',khewat:'18',khatuni:'23',owner:'Krishan Kumar',father:'Om Prakash',areaStr:'3 Acre 2 Kanal',areaSqM:13152.3,mutationNo:'7712',mutationType:'sale',mutationDate:'2020-07-04',docDate:'2020-07-04',lat:30.4821,lng:77.0041,status:'validated',createdAt:now-36*DAY,avgConf:.92}),
   mkSeedRecord({id:'r4',state:'Haryana',sc:'06',district:'Panchkula',dc:'06',tehsil:'Raipur Rani',tc:'09',village:'Raipur Rani',vc:'0312',khasra:'78/2/1',owner:'Mahipal Singh',father:'Dhani Ram',areaStr:'6 Kanal',areaSqM:3035.1,mutationNo:'3320',mutationType:'inheritance',mutationDate:'2019-04-11',docDate:'2019-04-11',lat:30.5601,lng:76.9402,status:'validated',createdAt:now-33*DAY,avgConf:.96}),
   mkSeedRecord({id:'r5',state:'Himachal Pradesh',sc:'02',district:'Shimla',dc:'33',tehsil:'Theog',tc:'07',village:'Thanedar',vc:'0455',khasra:'45/2',owner:'Meena Kanwar',father:'Lal Chand (husband)',areaStr:'2 Bigha 10 Biswa',areaSqM:7587.9,mutationNo:'1190',mutationType:'inheritance',mutationDate:'2009-09-30',docDate:'2009-09-30',lat:31.1032,lng:77.4401,status:'validated',createdAt:now-30*DAY,avgConf:.91}),
   mkSeedRecord({id:'r6',state:'Punjab',sc:'03',district:'Patiala',dc:'38',tehsil:'Rajpura',tc:'05',village:'Ubha',vc:'0180',khasra:'77/2',owner:'Manjit Singh',father:'Mohinder Singh',areaStr:'3 Acre',areaSqM:12140.6,mutationNo:'2205',mutationType:'sale',mutationDate:'2012-06-15',docDate:'2012-06-08',lat:30.4211,lng:76.5811,status:'validated',createdAt:now-27*DAY,avgConf:.94}),
   mkSeedRecord({id:'r7',state:'Haryana',sc:'06',district:'Kurukshetra',dc:'12',tehsil:'Thanesar',tc:'03',village:'Kirmach',vc:'0223',khasra:'201',owner:'Suresh Kumar',father:'Raghbir Singh',areaStr:'2 Acre 4 Kanal',areaSqM:10117.2,mutationNo:'1502',mutationType:'inheritance',mutationDate:'2011-01-20',docDate:'2011-01-20',lat:29.9611,lng:76.8021,status:'validated',createdAt:now-24*DAY,avgConf:.93}),
   mkSeedRecord({id:'r8',state:'Punjab',sc:'03',district:'S.A.S. Nagar',dc:'52',tehsil:'Kharar',tc:'13',village:'Kharar (Abadi)',vc:'2071',khasra:'902/1',owner:'Narinder Singh',father:'Ajaib Singh',areaStr:'1 Kanal 12 Marla',areaSqM:809.4,mutationNo:'6603',mutationType:'sale',mutationDate:'2021-08-19',docDate:'2021-08-19',lat:30.7412,lng:76.6512,status:'validated',createdAt:now-20*DAY,avgConf:.97}),
   mkSeedRecord({id:'r9',state:'Haryana',sc:'06',district:'Ambala',dc:'07',tehsil:'Barara',tc:'02',village:'Shahzadpur',vc:'0102',khasra:'44/3',owner:'Paramjeet Kaur',father:'Gurmail Singh (husband)',areaStr:'5 Acre',areaSqM:20234.3,mutationNo:'4410',mutationType:'inheritance',mutationDate:'2018-12-05',docDate:'2018-12-05',lat:30.3301,lng:76.9812,status:'validated',createdAt:now-16*DAY,avgConf:.95}),
   mkSeedRecord({id:'r10',state:'Punjab',sc:'03',district:'Rupnagar',dc:'51',tehsil:'Anandpur Sahib',tc:'10',village:'Naya Nangal',vc:'0299',khasra:'12/4',owner:'Davinder Singh',father:'Kehar Singh',areaStr:'4 Acre 6 Kanal',areaSqM:24281.2,mutationNo:'1877',mutationType:'sale',mutationDate:'2017-03-11',docDate:'2017-03-11',lat:31.0211,lng:76.4902,status:'validated',createdAt:now-12*DAY,avgConf:.94}),
   mkSeedRecord({id:'r11',state:'Uttar Pradesh',sc:'09',district:'Saharanpur',dc:'23',tehsil:'Deoband',tc:'06',village:'Chhutmalpur',vc:'1120',khasra:'334',owner:'Ramesh Chandra',father:'Chhote Lal',areaStr:'1 Bigha 8 Biswa',areaSqM:3541.0,mutationNo:'2214',mutationType:'gift (ansh dan)',mutationDate:'1998-05-14',docDate:'1998-05-14',lat:29.9201,lng:77.5502,status:'flagged',createdAt:now-8*DAY,avgConf:.71,checks:{pass:8,warn:1,fail:1}}),
   mkSeedRecord({id:'r12',state:'Haryana',sc:'06',district:'Yamunanagar',dc:'14',tehsil:'Jagadhri',tc:'08',village:'Mustafabad',vc:'0261',khasra:'55/1',owner:'Sandeep Kumar',father:'Raj Singh',areaStr:'2 Acre',areaSqM:8093.7,docDate:'2025-11-30',lat:30.2012,lng:77.3201,status:'pending',createdAt:now-2*DAY,avgConf:.58,checks:{pass:0,warn:0,fail:0}})
  ];
  return recs;
}

async function buildSeed(){
  const now=Date.now(),DAY=864e5;
  const recs=seedRecords();
  const seq={};
  recs.forEach(r=>{const key=r.sc+r.dc+r.tc+r.vc;seq[key]=(seq[key]||0)+1;r.ulpin=genULPIN(r.sc,r.dc,r.tc,r.vc,seq[key]);});
  recs.forEach(r=>{r.hash=sha256hex(recordHashInput(r)); insertRecord(r);});
  const acts=[
   {t:now-8*DAY,ic:'CRT',txt:'Ruling-feed sync: lis pendens matched khasra 334 (Chhutmalpur) - record flagged'},
   {t:now-7*DAY,ic:'HITL',txt:'Operator R. Sharma verified 3 low-confidence fields on fard 156/2 (Fatehgarh)'},
   {t:now-5*DAY,ic:'BLK',txt:'Block #3 sealed - 4 records anchored - hash 9f2c…e81a'},
   {t:now-3*DAY,ic:'VAL',txt:'10 records passed all validation checks this week'},
   {t:now-2*DAY,ic:'ING',txt:'Scanned bundle “Jagadhri lot 7” ingested (12 docs) - 1 below quality threshold'},
   {t:now-1*DAY,ic:'DUP',txt:'Duplicate-claim check blocked a deed on khasra 78/2/1 (vendor not in mutation chain)'}
  ];
  acts.forEach(a=>run('INSERT INTO activity(t,ic,txt) VALUES(?,?,?)',[a.t,a.ic,a.txt]));
  const discs=[
   {id:'d1',sev:'high',title:'Lis pendens - transfer frozen (khasra 334, Chhutmalpur)',detail:'e-Courts feed CS-212/2021: suit for specific performance pending since 2021. Record r11 flagged; no mutation may be registered until decree. Suggested action: annotate record, notify both parties.',ref:'r11',created:now-8*DAY,status:'open'},
   {id:'d2',sev:'med',title:'Owner-name spelling divergence - “Krishna Kumar” vs registry “Krishan Kumar”',detail:'Levenshtein distance 1 between deed spelling and registry khatauni. Fuzzy-match suggests adopting registry canonical spelling for khasra 156/2 (Fatehgarh). One-click resolution available.',ref:'r3',created:now-7*DAY,status:'open'},
   {id:'d3',sev:'low',title:'Scan below quality threshold - Mustafabad lot',detail:'Average OCR confidence 0.58 on record r12 (torn right edge, ink fade). Re-scan at kiosk advised before validation is attempted.',ref:'r12',created:now-2*DAY,status:'open'}
  ];
  discs.forEach(d=>run('INSERT INTO discs(id,sev,title,detail,ref,created,status) VALUES(?,?,?,?,?,?,?)',[d.id,d.sev,d.title,d.detail,d.ref,d.created,d.status]));
  // genesis + 3 sealed blocks (4 records each)
  const g={i:0,ts:now-45*DAY,entries:[],prev:'- GENESIS -',nonce:'00000',hash:''};
  g.hash=sha256hex(blockInput(g));
  insertBlock(g);
  for(let b=1;b<=3;b++){
    const blk={i:b,ts:now-(45-b*10)*DAY,entries:[],prev:getBlock(b-1).hash,nonce:String(10000+rnd(89999)),hash:''};
    for(let k=0;k<4;k++){const r=recs[(b-1)*4+k];r.block=b;run('UPDATE records SET block=? WHERE id=?',[b,r.id]);blk.entries.push({rid:r.id,ulpin:r.ulpin,h:sha256hex(recordHashInput(r))});}
    blk.hash=sha256hex(blockInput(blk));
    insertBlock(blk);
  }
  run('INSERT OR REPLACE INTO meta(k,v) VALUES(?,?)',['seededAt',String(now)]);
  persist();
}

/* ---------------- row mappers ---------------- */
function recFromRow(row){ const r={...row}; r.checks=JSON.parse(r.checks||'{}'); return r; }
function insertRecord(r){
  run(`INSERT INTO records(id,ulpin,state,sc,district,dc,tehsil,tc,village,vc,khasra,khewat,khatuni,owner,father,seller,consideration,areaStr,areaSqM,landClass,docType,docDate,mutationNo,mutationType,mutationDate,lat,lng,status,createdAt,avgConf,checks,block,hash)
       VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [r.id,r.ulpin||'',r.state,r.sc,r.district,r.dc,r.tehsil,r.tc,r.village,r.vc,r.khasra,r.khewat||'',r.khatuni||'',r.owner,r.father||'',r.seller||'',r.consideration||'',r.areaStr,r.areaSqM==null?null:r.areaSqM,r.landClass||'',r.docType,r.docDate||'',r.mutationNo||'',r.mutationType||'',r.mutationDate||'',r.lat==null?null:r.lat,r.lng==null?null:r.lng,r.status,r.createdAt,r.avgConf||0,JSON.stringify(r.checks||{}),r.block||0,r.hash||'']);
}
function insertBlock(b){ run('INSERT INTO blocks(i,ts,entries,prev,nonce,hash) VALUES(?,?,?,?,?,?)',[b.i,b.ts,JSON.stringify(b.entries),b.prev,b.nonce,b.hash]); }
function getBlock(i){ const r=get('SELECT * FROM blocks WHERE i=?',[i]); if(r)r.entries=JSON.parse(r.entries); return r; }
function allRecords(){ return all('SELECT * FROM records ORDER BY createdAt').map(recFromRow); }
function allBlocks(){ return all('SELECT * FROM blocks ORDER BY i').map(b=>({...b,entries:JSON.parse(b.entries)})); }
function recordsById(){ const m={}; allRecords().forEach(r=>m[r.id]=r); return m; }
function logActivity(ic,txt){ run('INSERT INTO activity(t,ic,txt) VALUES(?,?,?)',[Date.now(),ic,txt]); }

/* ---------------- domain operations ---------------- */
function deriveCodes(f, records){
  const sc=STATE_CODE[f.state]||'99';
  const exD=records.find(r=>r.district===f.district&&r.state===f.state);
  const dc=exD?exD.dc:'01';
  const exT=records.find(r=>r.district===f.district&&r.tehsil===f.tehsil);
  const tc=exT?exT.tc:'01';
  const exV=records.find(r=>r.district===f.district&&r.village===f.village);
  const vc=exV?exV.vc:'0001';
  return {sc,dc,tc,vc};
}

/* Seal a validated record: ULPIN + hash + ledger append. Mirrors prototype commit(). */
function commitRecord(fields, report, meta){
  const f={}; for(const k in fields)f[k]=fields[k].v;
  if(!f.owner||!f.khasra||!f.areaStr) throw new Error('Owner, khasra and area are required to seed a parcel.');
  const records=allRecords();
  const {sc,dc,tc,vc}=deriveCodes(f,records);
  const key=sc+dc+tc+vc; const seq=records.filter(r=>(r.sc+r.dc+r.tc+r.vc)===key).length+1;
  const rec=mkSeedRecord({id:'r'+rid(),state:f.state||'-',sc,district:f.district||'-',dc,tehsil:f.tehsil||'-',tc,village:f.village||'-',vc,
    khasra:f.khasra,khewat:f.khewat||'',khatuni:f.khatuni||'',owner:f.owner,father:f.father||'',seller:f.seller||'',consideration:f.consideration||'',
    landClass:f.landClass||'',areaStr:f.areaStr,areaSqM:f.areaSqM?parseFloat(String(f.areaSqM).replace(/,/g,'')):(report.computedSqM||null),
    docType:f.docType||'Unclassified record',docDate:f.docDate||'',mutationNo:f.mutationNo||'',mutationType:f.mutationType||'',mutationDate:f.mutationDate||'',
    lat:(report.geo?report.geo[0]:null),lng:(report.geo?report.geo[1]:null),
    status:'validated',createdAt:Date.now(),avgConf:+(report.avg||0).toFixed(3),
    checks:{pass:report.checks.filter(c=>c.status==='pass').length,warn:report.warns,fail:report.fails}});
  rec.ulpin=genULPIN(sc,dc,tc,vc,seq);
  rec.hash=sha256hex(recordHashInput(rec));
  let blk=allBlocks().pop();
  if(blk.entries.length>=4){
    blk={i:blk.i+1,ts:Date.now(),entries:[],prev:blk.hash,nonce:String(10000+rnd(89999)),hash:''};
    insertBlock(blk);
  }
  blk.ts=Date.now();
  blk.entries.push({rid:rec.id,ulpin:rec.ulpin,h:rec.hash});
  run('UPDATE blocks SET ts=?,entries=?,hash=? WHERE i=?',[blk.ts,JSON.stringify(blk.entries),sha256hex(blockInput(blk)),blk.i]);
  rec.block=blk.i;
  insertRecord(rec);
  logActivity('SEA','Sealed '+f.owner+' - khasra '+f.khasra+' - ULPIN '+rec.ulpin+' → block #'+blk.i);
  persist();
  return rec;
}

function verifyRecord(id){
  const r=get('SELECT * FROM records WHERE id=?',[id]); if(!r)return null;
  const rec=recFromRow(r);
  const current=sha256hex(recordHashInput(rec));
  return {ok:current===r.hash && !r.tampered, sealedHash:r.hash, currentHash:current,
    tamperedField:r.tampered?r.tamperedField:null, origValue:r.tampered?r.origValue:null,
    tamperedValue:r.tampered?rec[r.tamperedField]:null};
}
function tamperRecord(id){
  const r=get('SELECT * FROM records WHERE id=?',[id]); if(!r||!r.hash)return null;
  if(!r.tampered){
    const orig=r.areaSqM;
    run('UPDATE records SET areaSqM=?, tampered=1, tamperedField=?, origValue=? WHERE id=?',
      [Math.round(orig*1.137*10)/10,'areaSqM',orig,id]);
    logActivity('TAM','Simulated unauthorized edit on '+id+' - integrity seal now broken');
    persist();
  }
  return verifyRecord(id);
}
function restoreRecord(id){
  const r=get('SELECT * FROM records WHERE id=?',[id]); if(!r)return null;
  if(r.tampered){
    run('UPDATE records SET areaSqM=?, tampered=0, tamperedField=NULL, origValue=NULL WHERE id=?',[r.origValue,id]);
    logActivity('VAL','Record '+id+' restored to its sealed state');
    persist();
  }
  return verifyRecord(id);
}
function sendToQueue(fields, report, note){
  const f={}; for(const k in fields)f[k]=fields[k].v;
  const fails=report.checks.filter(c=>c.status==='fail');
  const first=fails[0];
  // pending record (mirrors prototype behaviour: queued docs appear in registry as pending)
  const rec=mkSeedRecord({id:'r'+rid(),state:f.state||'-',sc:'99',district:f.district||'-',dc:'01',
    tehsil:f.tehsil||'-',tc:'01',village:f.village||'-',vc:'0001',
    khasra:f.khasra||'-',owner:f.owner||'(unverified)',father:f.father||'',areaStr:f.areaStr||'-',
    areaSqM:f.areaSqM?parseFloat(String(f.areaSqM).replace(/,/g,'')):null,
    landClass:f.landClass||'',docType:f.docType||'Unclassified record',docDate:f.docDate||'',
    status:'pending',createdAt:Date.now(),avgConf:+(report.avg||0).toFixed(3),
    checks:{pass:report.checks.filter(c=>c.status==='pass').length,warn:report.warns,fail:report.fails}});
  rec.ulpin='-';
  insertRecord(rec);
  const stripTags=x=>String(x||'').replace(/<[^>]*>/g,'');
  const id='d'+rid();
  run('INSERT INTO discs(id,sev,title,detail,ref,created,status) VALUES(?,?,?,?,?,?,?)',
    [id, report.fails>1?'high':'med',
     first?first.name+' - '+stripTags(first.detail):'Validation discrepancies on scanned record',
     (fails.length?fails.map(c=>'['+c.id+'] '+stripTags(c.detail)).join(' - '):'Warnings exceeded threshold.')+'  | Auto-flagged by validation engine.',
     rec.id, Date.now(),'open']);
  logActivity('FLG','Auto-flagged: '+(first?first.id+' '+first.name:'low confidence')+' - sent to review queue');
  persist();
  return {disc:get('SELECT * FROM discs WHERE id=?',[id]), record:rec};
}
function resolveDisc(id,status){
  run('UPDATE discs SET status=? WHERE id=?',[status||'resolved',id]);
  logActivity('VAL','Review item '+id+' resolved ('+(status||'resolved')+')');
  persist();
  return get('SELECT * FROM discs WHERE id=?',[id]);
}

function getState(){
  const records=allRecords(), blocks=allBlocks();
  const val=records.filter(r=>r.status==='validated').length;
  const fl=records.filter(r=>r.status==='flagged').length;
  const pend=records.filter(r=>r.status==='pending').length;
  return {
    records, blocks,
    activity: all('SELECT * FROM activity ORDER BY t DESC LIMIT 60'),
    discs: all('SELECT * FROM discs ORDER BY created DESC'),
    stats:{ total:records.length, validated:val, flagged:fl, pending:pend,
      avgConf: records.length?records.reduce((a,r)=>a+(r.avgConf||0),0)/records.length:0 }
  };
}

async function initDb(fresh){
  const SQL=await initSqlJs();
  fs.mkdirSync(DATA_DIR,{recursive:true});
  if(fresh && fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
  if(fs.existsSync(DB_PATH)){ db=new SQL.Database(fs.readFileSync(DB_PATH)); createSchema(); return; }
  db=new SQL.Database(); createSchema(); await buildSeed();
}

function closeDb(){ if(db)db.close(); }

function getMeta(k){ const r=get('SELECT v FROM meta WHERE k=?',[k]); return r?r.v:null; }
function setMeta(k,v){ run('INSERT OR REPLACE INTO meta(k,v) VALUES(?,?)',[k,String(v)]); persist(); }
function tamperChainBlock(){
  const blocks=allBlocks();
  if(getMeta('chainTampered')!=null) return {already:true};
  let i=1+Math.max(0,rnd(blocks.length-1));
  let blk=blocks[i];
  while((!blk||!blk.entries.length)&&i>0){ i--; blk=blocks[i]; }
  if(!blk||!blk.entries.length) return null;
  const orig=JSON.stringify(blk.entries);
  const e=blk.entries[0];
  e.ulpin=(e.ulpin.slice(0,-2)+(9-+e.ulpin[12])+e.ulpin[13]);
  run('UPDATE blocks SET entries=?, tamperedOrig=? WHERE i=?',[JSON.stringify(blk.entries),orig,i]);
  setMeta('chainTampered',i);
  logActivity('TAM','Block #'+i+' silently edited - a stored ULPIN was altered after sealing');
  persist();
  return {block:i};
}
function undoChainTamper(){
  const i=getMeta('chainTampered');
  if(i==null) return {ok:false};
  const b=get('SELECT * FROM blocks WHERE i=?',[+i]);
  if(b&&b.tamperedOrig) run('UPDATE blocks SET entries=?, tamperedOrig=NULL WHERE i=?',[b.tamperedOrig,i]);
  setMeta('chainTampered','');
  run("DELETE FROM meta WHERE k='chainTampered'");
  logActivity('VAL','Chain restored - original block entries reinstated');
  persist();
  return {ok:true};
}

module.exports={initDb,getState,allRecords,allBlocks,recordsById,commitRecord,verifyRecord,tamperRecord,restoreRecord,sendToQueue,resolveDisc,logActivity,findMutReg,findLit,persist,closeDb,tamperChainBlock,undoChainTamper};
