/* t5: the 4 sample documents through REAL OCR -> intended demo narratives */
const { spawn } = require('child_process');
const fs = require('fs'); const path = require('path');
const PORT = 3902, BASE = 'http://127.0.0.1:'+PORT;
const S = f => path.join(__dirname,'..','public','samples',f);

async function scan(file){
  const fd=new FormData();
  fd.append('file', new Blob([fs.readFileSync(file)],{type:'image/png'}), 'doc.png');
  const r=await fetch(BASE+'/api/scan',{method:'POST',body:fd});
  if(!r.ok) throw new Error('scan failed '+file+': '+await r.text());
  const t=await r.text();
  return JSON.parse(t.trim().split('\n').pop());   // NDJSON: result is the last line
}
async function validate(fields){
  const r=await fetch(BASE+'/api/validate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({fields})});
  return r.json();
}

(async()=>{
  const srv=spawn('node',['src/server.js'],{cwd:path.join(__dirname,'..'),env:{...process.env,PORT:String(PORT),BN_DB:'/tmp/bn-t5.db'},stdio:'pipe'});
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  let ready=false; for(let i=0;i<40&&!ready;i++){await wait(250);try{const r=await fetch(BASE+'/api/state');if(r.ok)ready=true;}catch(e){}}
  if(!ready){console.error('server did not start');srv.kill();process.exit(1);}
  let pass=0, fail=0;
  const ok=(c,m)=>{console.log(c?'PASS':'FAIL',m);c?pass++:fail++;};
  const V=(fields)=>fields; // readability
  try{
    await (await fetch(BASE+'/api/reset',{method:'POST'})).json();

    // ---- A: clean jamabandi -> straight-through pass ----
    let a=await scan(S('sampleA.png'));
    const fa=a.fields;
    ok(fa.state.v==='Punjab'&&fa.village.v==='Khanpur'&&fa.tehsil.v==='Dera Bassi','A location: '+fa.state.v+'/'+fa.village.v+'/'+fa.tehsil.v);
    ok(fa.khasra.v==='305','A khasra='+fa.khasra.v);
    ok(fa.owner.v==='Harjeet Kaur'&&fa.father.v==='Gurmail Singh','A owner='+fa.owner.v+' d/o '+fa.father.v);
    ok(fa.areaStr.v.includes('1 Kanal 12 Marla'),'A areaStr='+JSON.stringify(fa.areaStr.v));
    ok(fa.areaSqM.v==='809.4','A areaSqM='+fa.areaSqM.v);
    ok(fa.mutationNo.v==='5417'&&fa.docDate.v==='2018-03-12','A mut='+fa.mutationNo.v+' date='+fa.docDate.v);
    ok(fa.docType.v.includes('Jamabandi'),'A docType='+fa.docType.v);
    ok((fa.landClass&&fa.landClass.v||'')!=='' ,'A landClass='+fa.landClass.v);
    let ra=await validate(fa); const bya={}; ra.checks.forEach(c=>bya[c.id]=c.status);
    ok(ra.verdict==='pass','A verdict='+ra.verdict+' (R8='+bya.R8+', R10='+bya.R10+')');
    ok(bya.R3==='pass'&&bya.R8==='pass','A R3/R8 pass');

    // ---- B: faded fard -> same-owner warn + HITL ----
    let b=await scan(S('sampleB.png'));
    const fb=b.fields;
    ok(fb.khasra.v==='156/2','B khasra='+fb.khasra.v);
    ok(fb.owner.v==='Krishan Kumar'&&fb.father.v==='Om Prakash','B owner='+fb.owner.v+' s/o '+fb.father.v);
    ok(fb.areaSqM.v==='13152.4','B areaSqM='+fb.areaSqM.v+' (digit-repair on faded doc)');
    ok(fb.mutationNo.v==='7712','B mutationNo='+fb.mutationNo.v);
    ok(fb.docType.v.includes('Fard'),'B docType='+fb.docType.v);
    ok(fb.state.v==='Haryana'&&(fb.village.v==='Fatehgarh'||fb.village.v==='फतेहगढ़'),'B village='+fb.village.v+' ('+fb.state.v+')');
    let rb=await validate(fb); const byb={}; rb.checks.forEach(c=>byb[c.id]=c.status);
    ok(byb.R4==='warn','B R4='+byb.R4+' (same-owner re-digitization)');
    ok(rb.verdict==='warn','B verdict='+rb.verdict+' -> HITL review');

    // ---- C: fraud deed -> R4+R5 fail ----
    let c=await scan(S('sampleC.png'));
    const fc=c.fields;
    ok(fc.khasra.v==='78/2/1','C khasra='+fc.khasra.v);
    ok(fc.seller.v==='Dhani Ram','C vendor='+fc.seller.v+' (the 1972 holder - dead man selling)');
    ok(fc.owner.v==='Ramesh Kumar','C vendee='+fc.owner.v);
    ok(fc.deedNo.v==='1123/2024'&&fc.docDate.v==='2024-02-22','C deedNo='+fc.deedNo.v+' date='+fc.docDate.v);
    ok((fc.consideration.v||'').replace(/[.,]/g,'').length>4,'C consideration='+fc.consideration.v);
    let rc=await validate(fc); const byc={}; rc.checks.forEach(c=>byc[c.id]=c.status);
    ok(byc.R4==='fail','C R4='+byc.R4+' (duplicate-claim conflict)');
    ok(byc.R5==='fail','C R5='+byc.R5+' (broken mutation chain)');
    ok(rc.verdict==='fail','C verdict=fail -> commit must be blocked');
    const cm=await fetch(BASE+'/api/commit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({fields:fc})});
    ok(cm.status===409,'C POST /api/commit blocked with 409');

    // ---- D: torn 1998 mutation -> lis pendens + quality ----
    let d=await scan(S('sampleD.png'));
    const fd2=d.fields;
    ok(fd2.khasra.v==='334','D khasra='+fd2.khasra.v);
    ok(fd2.owner.v==='रामेश चंद्र','D owner='+fd2.owner.v);
    ok(fd2.state.v==='Uttar Pradesh'&&fd2.village.v==='छुटमलपुर','D village='+fd2.village.v+' ('+fd2.state.v+')');
    let rd=await validate(fd2); const byd={}; rd.checks.forEach(c=>byd[c.id]=c.status);
    ok(byd.R9==='fail','D R9='+byd.R9+' (lis pendens - transfer frozen)');
    ok(rd.verdict==='fail','D verdict='+rd.verdict);
    ok(rd.avg<0.95,'D degraded quality shows: avg conf '+(rd.avg*100).toFixed(1)+'%');
  } finally { srv.kill(); }
  console.log(`RESULT: ${pass} pass, ${fail} fail`);
  process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
