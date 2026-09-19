/* Validation engine R1–R10 — ported from the prototype.
 * Decoupled from browser state: takes a fields object and a context
 * { records, registries, today }. Logic and thresholds are unchanged.
 * Detail strings intentionally keep their HTML markup (esc'd inputs) so the
 * frontend renders identically. */
const { parseArea, m2ToAcreKanal, lev, locEq, ACRE_M2, ulpinGroups } = require('./units');
const { geoLookup, STATE_BBOX } = require('./geo');

const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nIN=n=>Number(n).toLocaleString('en-IN');
const F_=(fields,k)=>fields&&fields[k]?String(fields[k].v||'').trim():'';
const effConf=fl=>fl.verified?.97:(fl.edited?.92:fl.c);
const fieldAvg=fields=>{const vs=Object.values(fields).filter(f=>f.v!==''&&f.v!=null);if(!vs.length)return 0;return vs.reduce((a,f)=>a+effConf(f),0)/vs.length;};
const minConf=fields=>{const vs=Object.values(fields).filter(f=>f.v!==''&&f.v!=null);return vs.length?Math.min(...vs.map(effConf)):0;};

function runValidation(fields, ctx){
  if(!fields)return null;
  ctx=ctx||{};
  const records=ctx.records||[];
  const { findMutReg, findLit }=ctx.registries||{};
  const F=k=>F_(fields,k);
  const out={computedSqM:null, geo:null};
  const checks=[];
  const isDeed=/deed|sale|बिक्री|bikri/i.test(F('docType'));
  // R1 khasra format
  {const k=F('khasra');let st,detail;
   if(!k){st='warn';detail='Khasra / survey number not read from document - operator entry required.';}
   else if(/^\d{1,4}(\/\d{1,4}){0,2}$/.test(k)){st='pass';detail=`“${k}” matches the standard khasra/survey format (nnn[/nn][/nn]).`;}
   else{st='fail';detail=`“${k}” violates khasra format (allowed: digits with up to 2 sub-parts, e.g. 78/2/1). Likely OCR segmentation error.`;}
   checks.push({id:'R1',name:'Khasra / survey-number format',status:st,detail,why:'Khasra numbers follow a strict grammar - deviations almost always indicate OCR misreads or forged documents.'});}
  // R2 area sanity
  {const parsed=parseArea(F('areaStr'));let st,detail;
   if(!F('areaStr')){st='warn';detail='Area not stated/read on document.';}
   else if(parsed==null){st='fail';detail=`Could not parse area “${F('areaStr')}” into known units (acre, kanal, marla, bigha, biswa, katha, chatak, guntha, cent, killa, are, ropani, hectare, sq m - incl. native-script forms).`;}
   else if(parsed<=0||parsed>200*ACRE_M2){st='fail';detail=`Parsed area ${nIN(Math.round(parsed))} m² outside plausible parcel range (0 – 200 acres).`;}
   else{st='pass';detail=`Parsed ${esc(F('areaStr'))} → <b>${nIN(Math.round(parsed))} m²</b> (${m2ToAcreKanal(parsed).trim()}). Within sane bounds.`;}
   checks.push({id:'R2',name:'Area sanity & unit conversion',status:st,detail,why:'Unit chaos (bigha/kanal/marla varies by state) is a top source of silent digitization errors.'});}
  // R3 area cross-check
  {const parsed=parseArea(F('areaStr')),sq=F('areaSqM')?parseFloat(F('areaSqM').replace(/,/g,'')):NaN;let st,detail,fix=null;
   if(!F('areaStr')||isNaN(sq)){st='warn';detail=F('areaStr')?'Secondary area (sq m) not stated on document - single-source only.':'Cannot cross-check: area text missing.';}
   else{const d=Math.abs(parsed-sq)/parsed;
     if(d<=0.02){st='pass';detail=`Printed figure ${nIN(Math.round(sq))} m² matches computed value ${nIN(Math.round(parsed))} m² (Δ ${(d*100).toFixed(1)}%).`;}
     else if(d<=0.10){st='warn';detail=`Printed ${nIN(Math.round(sq))} m² vs computed ${nIN(Math.round(parsed))} m² (Δ ${(d*100).toFixed(1)}%) - transcription tolerance exceeded.`;}
     else{st='fail';detail=`Printed figure <b>${nIN(Math.round(sq))} m²</b> conflicts with units “${esc(F('areaStr'))}” = <b>${nIN(Math.round(parsed))} m²</b> (Δ ${(d*100).toFixed(1)}%). Typical 1↔8 / 3↔8 digit confusion on faded scans.`;fix={k:'areaSqM',v:parsed.toFixed(1),label:'Accept engine value '+nIN(Math.round(parsed))+' m²'};}
     out.computedSqM=parsed;}
   checks.push({id:'R3',name:'Area cross-check (text vs sq m)',status:st,detail,why:'Two independent sources of the same fact must agree - this check catches both OCR error and tampered figures.',fix});}
  // R4 duplicate parcel / ownership conflict
  {const same=records.filter(r=>r.state===F('state')&&locEq(r.district,F('district'))&&locEq(r.village,F('village'))&&r.khasra===F('khasra')&&r.status!=='pending');
   let st,detail,fix=null;
   if(!F('khasra')){st='warn';detail='Cannot run duplicate check without khasra.';}
   else if(!same.length){st='pass';detail=`No existing record for khasra ${esc(F('khasra'))} in ${esc(F('village'))} - new parcel entry.`;}
   else{const r0=same[0];const d=lev(F('owner'),r0.owner);
     if(d===0){st='warn';detail=`Parcel already registered to <b>${esc(r0.owner)}</b> (ULPIN ${ulpinGroups(r0.ulpin)}). Same owner - likely a re-digitization of an existing record.`;}
     else if(d<=2){st='warn';detail=`Parcel registered to <b>${esc(r0.owner)}</b> (ULPIN ${ulpinGroups(r0.ulpin)}) - document reads “${esc(F('owner'))}” (Levenshtein ${d}). Probably the same person with a spelling variant.`;fix={k:'owner',v:r0.owner,label:'Adopt registry spelling “'+r0.owner+'”'};}
     else{st='fail';detail=`<b>Duplicate-claim conflict:</b> khasra ${esc(F('khasra'))}, ${esc(F('village'))} is already held by <b>${esc(r0.owner)}</b> (s/o ${esc(r0.father||'-')}, ULPIN ${ulpinGroups(r0.ulpin)}, ${esc(r0.mutationType||'')} ${esc(r0.mutationNo||'')}). Deed names a different owner with no linking mutation.`;}}
   checks.push({id:'R4',name:'Duplicate parcel ownership check',status:st,detail,why:'Double-sale / benami fraud lives on the same khasra being “sold” twice - instant cross-office lookup kills it.',fix});}
  // R5 mutation chain
  {const reg=findMutReg?findMutReg(F('state'),F('district'),F('tehsil'),F('village'),F('khasra')):null;
   let st,detail;
   if(!F('khasra')){st='warn';detail='Cannot verify chain without khasra.';}
   else if(!reg){st='pass';detail='No prior mutation register extract for this parcel in the feed - jamabandi consolidation accepted as seed.';}
   else{const last=reg.chain[reg.chain.length-1];
     const chainTxt=reg.chain.map(c=>c.holder+' ('+c.from+', '+c.how+(c.mutNo?', mut '+c.mutNo:'')+')').join(' → ');
     if(isDeed){const seller=F('seller')||F('owner');const dSeller=lev(seller.split(' s/o ')[0],last.holder.split(' s/o ')[0]);
       if(dSeller<=2){st='pass';detail=`Vendor “${esc(seller)}” matches the last registered holder in the inteqal chain: ${esc(chainTxt)}.`;}
       else{st='fail';detail=`<b>Broken mutation chain:</b> inteqal register holds ${esc(chainTxt)} - last holder is <b>${esc(last.holder)}</b>, but the deed vendor is <b>${esc(seller)}</b>. No registered transfer connects them; sale is not registerable.`;}}
     else{const dOwn=lev(F('owner'),last.holder.split(' s/o ')[0]);
       if(dOwn<=2){st='pass';detail=`Holder matches last entry of inteqal chain: ${esc(chainTxt)}.`;}
       else{st='warn';detail=`Document holder “${esc(F('owner'))}” differs from last chain holder <b>${esc(last.holder)}</b> (${esc(chainTxt)}) - verify inheritance linkage.`;}}}
   checks.push({id:'R5',name:'Mutation (inteqal) chain integrity',status:st,detail,why:'Ownership is a chain, not a snapshot. If the vendor is not the latest link, the deed is void or fraudulent.'});}
  // R6 name consistency (fuzzy)
  {const same=records.filter(r=>locEq(r.village,F('village'))&&r.khasra===F('khasra')&&r.status!=='pending');
   let st,detail,fix=null;
   if(!F('owner')){st='warn';detail='Owner name not extracted.';}
   else if(!same.length){st='pass';detail='New owner entry - no canonical spelling to compare against yet.';}
   else{const d=lev(F('owner'),same[0].owner);
     if(d===0){st='pass';detail=`Exact match with registry canonical spelling “${esc(same[0].owner)}”.`;}
     else if(d<=2){st='warn';detail=`“${esc(F('owner'))}” vs registry “${esc(same[0].owner)}” - Levenshtein distance ${d}. Minor OCR/transliteration drift.`;fix={k:'owner',v:same[0].owner,label:'Adopt canonical “'+same[0].owner+'”'};}
     else{st='pass';detail=`New owner “${esc(F('owner'))}” for this parcel (distance ${d} from ${esc(same[0].owner)}) - consistent with a transfer if R4/R5 accept it.`;}}
   checks.push({id:'R6',name:'Owner-name fuzzy consistency',status:st,detail,why:'Same person spelled 4 ways = 4 “owners” in a database. Unicode-aware fuzzy matching canonicalizes identity.',fix});}
  // R7 date logic
  {const d=F('docDate');let st,detail;const md=F('mutationDate');const dt=d?new Date(d):null;const today=ctx.today?new Date(ctx.today):new Date();
   if(!d||isNaN(dt)){st='warn';detail='Document date not read or invalid.';}
   else if(dt>today){st='fail';detail=`Document date ${d} is in the future - impossible.`;}
   else if(dt.getFullYear()<1900){st='fail';detail=`Document year ${dt.getFullYear()} predates systematic survey records.`;}
   else if(isDeed&&md&&new Date(md)<new Date(d)){st='fail';detail=`Mutation date ${md} precedes deed date ${d} - causality violation.`;}
   else{st='pass';detail=`Dates consistent (deed ${d}${md?', mutation '+md:''}).`;}
   checks.push({id:'R7',name:'Date logic',status:st,detail,why:'Future dates and mutation-before-deed sequences are classic backdating signatures.'});}
  // R8 geo-reference via cadastral map layer (never OCR-read from the document)
  {const g=geoLookup(F('state'),F('village'),F('khasra'));let st,detail;
   if(!g){st='warn';detail='Village not present in the surveyed map layer - parcel geo-referencing pending re-survey; ULPIN cannot be issued yet.';}
   else{
     out.geo=g;const la=g[0],ln=g[1];
     if(la<6||la>37||ln<68||ln>98){st='fail';detail=`Map-layer reference (${la.toFixed(4)}, ${ln.toFixed(4)}) falls outside India - geo-database corruption.`;}
     else{const bb=STATE_BBOX[F('state')];
       if(bb&&(la<bb[0][0]||la>bb[0][1]||ln<bb[1][0]||ln>bb[1][1])){st='warn';detail=`Map-layer reference (${la.toFixed(4)}, ${ln.toFixed(4)}) lies outside the bounding box of ${esc(F('state'))} - check the village-to-state mapping.`;}
       else{st='pass';detail=`Parcel geo-reference (${la.toFixed(4)}N, ${ln.toFixed(4)}E) resolved from the cadastral map layer (Bhu-Naksha) for village ${esc(F('village'))||'-'} - consistent with ${esc(F('state'))||'the state'}. ULPIN geo-base ready.`;}}}
   checks.push({id:'R8',name:'Geo-reference check (Bhu-Naksha layer)',status:st,detail,why:'ULPIN is lat/long-derived, but coordinates are never read from the record text (no RoR prints them) - they come from the surveyed cadastral map layer, so a forged document cannot smuggle in a wrong location.'});}
  // R9 encumbrance / lis pendens
  {const lit=findLit?findLit(F('state'),F('district'),F('village'),F('khasra')):null;
   let st,detail;
   if(lit){st='fail';detail=`<b>Lis pendens:</b> ${esc(lit.caseNo)} - ${esc(lit.court)}: ${esc(lit.note)} Transfer of this parcel is frozen until decree.`;}
   else{st='pass';detail='No encumbrance or pending litigation matched in the e-Courts feed.';}
   checks.push({id:'R9',name:'Encumbrance & lis pendens (e-Courts)',status:st,detail,why:'Section 52 TPA - buying a parcel under suit inherits the suit. One API call prevents a decade in court.'});}
  // R10 OCR confidence floor
  {const avg=fieldAvg(fields),mn=minConf(fields);let st,detail;
   const weak=Object.entries(fields).filter(([k,f])=>f.v!==''&&effConf(f)<.75).map(([k])=>k);
   if(mn<.62){st='fail';detail=`Weakest field at ${(mn*100).toFixed(0)}% - below the 62% floor. Manual verification or re-scan is mandatory before this record can seed the registry.`;}
   else if(avg<.85||mn<.75){st='warn';detail=`Average ${(avg*100).toFixed(1)}%, weakest ${(mn*100).toFixed(0)}%. Fields to verify: ${weak.map(w=>'<b>'+w+'</b>').join(', ')||'-'}. Click the ✓ next to a field once you have eyeballed it against the scan.`;}
   else{st='pass';detail=`Average ${(avg*100).toFixed(1)}%, minimum ${(mn*100).toFixed(0)}% - above thresholds.`;}
   checks.push({id:'R10',name:'OCR confidence floor (HITL gate)',status:st,detail,why:'Garbage-in is the #1 failure mode of digitization programs - confidence gating puts a human exactly where they matter.'});}
  const fails=checks.filter(c=>c.status==='fail').length,warns=checks.filter(c=>c.status==='warn').length;
  const score=Math.max(5,100-25*fails-8*warns);
  const verdict=fails>0?'fail':(warns>=2?'warn':'pass');
  return {checks,fails,warns,score,verdict,avg:fieldAvg(fields),ts:Date.now(),computedSqM:out.computedSqM,geo:out.geo};
}

module.exports={runValidation,effConf,fieldAvg,minConf};
