/* Bhu-Netra frontend - UI ported verbatim from the single-file prototype.
 * Engine work (OCR, mapping, validation, hashing, storage) now happens in the
 * Node.js backend; this file renders state from /api/* and sends actions back. */

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

const api = async (u, o) => {
  const r = await fetch(u, o);
  if (!r.ok) {
    let m; try { m = (await r.json()).error; } catch (e) { m = r.statusText; }
    const err = new Error(m || ('HTTP ' + r.status)); err.status = r.status; throw err;
  }
  return r.json();
};

window.handleRoleChange = (role) => {
  const isOfficer = role === 'officer';
  const c1 = $('#btnCommit'), c2 = $('#btnSealQuick');
  if (c1) { c1.disabled = !isOfficer; c1.title = isOfficer ? '' : 'Only Approving Officers can commit'; }
  if (c2) { c2.disabled = !isOfficer; c2.title = isOfficer ? '' : 'Only Approving Officers can seal'; }
};
window.exportGeoJSON = async () => {
  const d = await api('/api/registry');
  const fc = { type: 'FeatureCollection', features: d.map(r => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [parseFloat(r.f.longitude?.v || 77.209), parseFloat(r.f.latitude?.v || 28.613)] },
    properties: { ulpin: r.ulpin, owner: r.f.owner?.v, khasra: r.f.khasra?.v, state: r.f.state?.v, district: r.f.district?.v }
  }))};
  const b = new Blob([JSON.stringify(fc, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'dilrmp_export.geojson';
  a.click();
};

const jPOST = body => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
function saveState(){}            // persistence is server-side (SQLite)
const hashMode = () => 'SHA-256 (server-side)';

let S;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nIN=n=>Number(n).toLocaleString('en-IN');
const fmtDT=ts=>new Date(ts).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
const fmtD=ts=>new Date(ts).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const timeAgo=ts=>{const d=(Date.now()-ts)/1e3;if(d<60)return'just now';if(d<3600)return Math.floor(d/60)+' min ago';if(d<86400)return Math.floor(d/3600)+' h ago';return Math.floor(d/86400)+' d ago';};
const rid=()=>Math.random().toString(36).slice(2,8);
let __fs=13;
function fontReset(){__fs=13;document.documentElement.style.fontSize='13px';toast('Text size reset to normal','','info',1600);}
function __toggleHC(){document.body.classList.toggle('hc');toast('High contrast '+(document.body.classList.contains('hc')?'enabled':'disabled'),'This accessibility preference applies for the current session.','info',2600);}
function svcSearch(){const q=document.getElementById('gsearch').value.trim();if(!q){toast('Enter a search term','Type a ULPIN, khasra number or owner name to search the registry.','warn');return;}document.getElementById('regSearch').value=q;nav('registry');toast('Registry search',"Searching for '"+q+'\'','info',3000);}
function svcVerify(){document.getElementById('regSearch').value='';nav('registry');toast('Registry opened','Enter a ULPIN, khasra or owner name. Open any record to verify its integrity seal.','info',5000);}
function openPolicy(kind){const P={access:['Accessibility Statement','<p class="doc">This prototype follows accessibility guidelines inspired by GIGW 3.0: keyboard navigation across all modules, visible focus states, a skip-to-content link, adjustable text size (A- / A / A+) and a high-contrast viewing mode. All status information is conveyed by text labels, not colour alone.</p><p class="doc">The demonstration runs entirely in the browser; no personal data is collected or transmitted.</p>'],privacy:['Privacy Policy','<p class="doc">This is a demonstration prototype containing only synthetic data. No citizen data, Aadhaar numbers or live government records are stored, processed or transmitted. In a production deployment the system would comply with the Digital Personal Data Protection Act, 2023, with state data centres hosting all records and Aadhaar references stored only in masked, hashed form.</p>'],terms:['Terms &amp; Conditions','<p class="doc">Bhu-Netra is a prototype built for Smart India Hackathon 2026. It is not an official Government of India website and is not connected to any live land records database, ULPIN service or e-Courts feed. Validation outcomes shown here are illustrative and carry no legal standing. Record-of-rights and mutation data remain authoritative only in the official registers maintained by state revenue departments.</p>']};const c=P[kind];if(!c)return;$('#modalRoot').innerHTML='<div class="modal-ov" onclick="if(event.target===this)closeModal()"><div class="modal" style="max-width:620px"><button class="x" onclick="closeModal()">✕</button><h3 style="font-size:1.05rem">'+c[0]+'</h3><div style="margin-top:10px">'+c[1]+'</div><div class="small muted" style="margin-top:14px">Bhu-Netra demonstration prototype · 07 Sep 2026</div></div></div>';}
function fontAdj(d){__fs=Math.min(16,Math.max(11,__fs+d));document.documentElement.style.fontSize=__fs+'px';toast('Text size set to '+__fs+'px','','info',1600);}
const rnd=n=>Math.floor(Math.random()*n);

function toast(title,msg,type='ok',ms=4200){
  const t=document.createElement('div');t.className='toast '+(type==='ok'?'':type);
  t.innerHTML=`<b>${esc(title)}</b>${msg?esc(msg):''}`;
  $('#toasts').appendChild(t);
  setTimeout(()=>{t.style.transition='opacity .4s,transform .4s';t.style.opacity='0';t.style.transform='translateX(30px)';setTimeout(()=>t.remove(),420);},ms);
}
window.addEventListener('error',e=>{try{toast('Runtime error',(e.message||'unknown')+' - see console','err');}catch(_){}});


const m2ToAcreKanal=v=>{const marla=v/MARLA_M2;const acres=Math.floor(marla/160);const kanal=Math.floor((marla-acres*160)/20);const ml=Math.round(marla-acres*160-kanal*20);return (acres?acres+' A ':'')+(kanal?kanal+' K ':'')+(ml||(!acres&&!kanal)?ml+' M':'');};

function luhnDigit(digs){let s=0,dbl=true;for(let i=digs.length-1;i>=0;i--){let d=+digs[i];if(dbl){d*=2;if(d>9)d-=9;}s+=d;dbl=!dbl;}return String((10-(s%10))%10);}
function ulpinValid(u){return /^\d{14}$/.test(u)&&luhnDigit(u.slice(0,13))===u[13];}
function ulpinGroups(u){return u.slice(0,2)+'-'+u.slice(2,4)+'-'+u.slice(4,6)+'-'+u.slice(6,10)+'-'+u.slice(10,13)+'-'+u.slice(13);}



/* ---------------- sample scanned-document SVG generator ---------------- */
function paperSvg(cfg){
  const uid='f'+rid();
  const q=cfg.quality||'good';
  const paper=q==='bad'?'#efe7d2':q==='mid'?'#f4efe1':'#fbfaf4';
  const rot=q==='bad'?-2.1:q==='mid'?-1.2:-0.55;
  const parts=[];
  const rowsY0=126, rowH=27;
  let y=rowsY0+cfg.rows.length*rowH+8;
  let tbl='';
  if(cfg.table){
    const t=cfg.table, tw=400, tx=30, headH=20, rh=21;
    tbl+=`<rect x="${tx}" y="${y}" width="${tw}" height="${headH}" fill="#dde4ec"/>`;
    const cw=tw/t.head.length;
    t.head.forEach((h,i)=>{tbl+=`<text x="${tx+6+i*cw}" y="${y+14}" font-size="10" font-weight="700" fill="#1e293b">${h}</text>`;});
    y+=headH;
    t.rows.forEach((r,ri)=>{
      if(ri%2)tbl+=`<rect x="${tx}" y="${y}" width="${tw}" height="${rh}" fill="#f2f0e8"/>`;
      r.forEach((c,i)=>{tbl+=`<text x="${tx+6+i*cw}" y="${y+14}" font-size="10" fill="#334155">${c}</text>`;});
      tbl+=`<line x1="${tx}" y1="${y+rh}" x2="${tx+tw}" y2="${y+rh}" stroke="#9aa7b8" stroke-width=".5"/>`;
      y+=rh;
    });
    y+=10;
  }
  const sigY=y+34, H=sigY+118;
  const rowsSvg=cfg.rows.map((r,i)=>{
    const ry=rowsY0+i*rowH;
    return `<text x="30" y="${ry}" font-size="10.5" fill="#64748b">${r[0]}</text>`+
           `<text x="185" y="${ry}" font-size="11.5" font-weight="700" fill="#0f172a">${r[1]}</text>`+
           `<line x1="180" y1="${ry+4}" x2="430" y2="${ry+4}" stroke="#b6c2d1" stroke-width=".5" stroke-dasharray="2 2"/>`;
  }).join('');
  parts.push(
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 ${H}" role="img" aria-label="${esc(cfg.title)}">
<defs><filter id="${uid}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 ${q==='bad'?0.5:q==='mid'?0.32:0.18} 0"/></filter></defs>
<rect width="460" height="${H}" fill="${paper}"/>
<g transform="rotate(${rot} 230 ${H/2})">
  <rect x="14" y="14" width="432" height="${H-28}" fill="none" stroke="#31435c" stroke-width="1.6"/>
  <rect x="20" y="20" width="420" height="${H-40}" fill="none" stroke="#31435c" stroke-width=".5"/>
  <text x="230" y="44" text-anchor="middle" font-size="12" font-weight="800" letter-spacing="1" fill="#1e293b">${esc(cfg.gov)}</text>
  <text x="230" y="60" text-anchor="middle" font-size="9.5" fill="#64748b">${esc(cfg.govSub||'')}</text>
  <rect x="60" y="68" width="340" height="30" fill="#e8edf3"/>
  <text x="230" y="88" text-anchor="middle" font-size="13.5" font-weight="800" letter-spacing=".5" fill="#0f172a">${esc(cfg.title)}</text>
  <text x="230" y="112" text-anchor="middle" font-size="9.5" fill="#475569">${esc(cfg.sub||'')}</text>
  ${rowsSvg}
  ${tbl}
  <path d="M52 ${sigY+2} q10 -14 22 -2 q8 -10 20 0" stroke="#334155" fill="none" stroke-width="1.2"/>
  <line x1="30" y1="${sigY+14}" x2="170" y2="${sigY+14}" stroke="#334155" stroke-width=".7"/>
  <text x="30" y="${sigY+27}" font-size="9" fill="#64748b">${esc(cfg.sign||'Halqa Patwari / हलका पटवारी')}</text>
  <g transform="rotate(-13 358 ${sigY+30})" opacity=".62">
    <circle cx="358" cy="${sigY+30}" r="46" fill="none" stroke="#7c2d12" stroke-width="2.4"/>
    <circle cx="358" cy="${sigY+30}" r="33" fill="none" stroke="#7c2d12" stroke-width="1"/>
    <text x="358" y="${sigY+24}" text-anchor="middle" font-size="8.4" font-weight="800" fill="#7c2d12">${esc(cfg.stampL1||'')}</text>
    <text x="358" y="${sigY+35}" text-anchor="middle" font-size="8" fill="#7c2d12">${esc(cfg.stampL2||'')}</text>
    <text x="358" y="${sigY+44}" text-anchor="middle" font-size="7" fill="#7c2d12">${esc(cfg.stampL3||'')}</text>
  </g>
</g>
<rect width="460" height="${H}" filter="url(#${uid})" opacity="${q==='bad'?0.5:q==='mid'?0.34:0.16}"/>`);
  if(q!=='good'){parts.push(`<ellipse cx="370" cy="${H*0.16}" rx="58" ry="30" fill="#d8d0b4" opacity=".4"/><ellipse cx="90" cy="${H*0.86}" rx="40" ry="22" fill="#d8d0b4" opacity=".33"/>`);}
  if(q==='bad'){parts.push(`<polygon points="460,0 460,34 428,10" fill="${paper}"/><line x1="230" y1="0" x2="230" y2="${H}" stroke="#ffffff" stroke-width="3" opacity=".5"/>`);}
  parts.push('</svg>');
  return parts.join('');
}

/* ---------------- field schema ---------------- */

const FIELD_DEFS=[
 ['docType','Document type','दस्तावेज़ प्रकार'],
 ['docDate','Document date','दिनांक'],
 ['state','State','राज्य'],
 ['district','District','जिला'],
 ['tehsil','Tehsil','तहसील'],
 ['village','Village / mauja','गाँव'],
 ['khasra','Khasra / Survey / Gat / Dag no.','खसरा / सर्वे सं.'],
 ['khewat','Khewat no.','खेवट'],
 ['khatuni','Khatauni / Khatian no.','खतौनी / खतियान'],
 ['owner','Owner / holder','स्वामी / धारक'],
 ['father','Father / husband of','पिता / पति'],
 ['deedNo','Deed / document no. (deeds)','पंजी सं.'],
 ['seller','Vendor (sale deeds)','विक्रेता'],
 ['consideration','Consideration (₹)','विक्रय मूल्य'],
 ['areaStr','Area - as printed','रकबा (मूल)'],
 ['areaSqM','Area - sq m','वर्ग मीटर'],
 ['landClass','Land classification','भूमि प्रकृति'],
 ['mutationNo','Mutation no. (inteqal)','दाखिल खारिज सं.'],
 ['mutationDate','Mutation date','दाखिल खारिज दिनांक'],
 ['mutationType','Mutation type / mode of acquisition','प्रकार']
];


const SAMPLES=[
{
 id:'A',name:'Jamabandi - Khanpur (clean scan)',lang:'English',quality:'good',qTag:['good','Quality A'],
 docType:'Jamabandi (Record of Rights)',district:'S.A.S. Nagar',village:'Khanpur',
 svg:()=>paperSvg({gov:'GOVERNMENT OF PUNJAB - REVENUE DEPARTMENT',govSub:'पंजाब सरकार - राजस्व विभाग',title:'JAMABANDI - RECORD OF RIGHTS',sub:'Year 2018-19 - Consolidation copy - Tehsil Dera Bassi',
  rows:[['District / जिला','S.A.S. Nagar'],['Tehsil / तहसील','Dera Bassi'],['Village / गाँव','Khanpur (Hadbast 214)'],['Khewat / खेवट','27'],['Khatauni / खतौनी','41'],['Khasra / खसरा','305 - Chahi'],['Owner / स्वामी','Harjeet Kaur d/o Gurmail Singh'],['Area / रकबा','1 Kanal 12 Marla = 809.4 sq m'],['Mutation / दाखिल','No. 5417 - 12-03-2018 - Inheritance']],
  table:{head:['Khasra','Khatoni','Owner','Father','Area (K-M-M)'],rows:[['305','41','Harjeet Kaur','Gurmail Singh','1-0-12']]},
  stampL1:'HALQA PATWARI',stampL2:'KHANPUR / DERA BASSI',stampL3:'CERTIFIED TRUE COPY',sign:'Halqa Patwari, Khanpur',quality:'good'}),


 story:'Clean straight-through case - ~98% average confidence, no HITL needed, all 10 rule checks should pass.'
},
{
 id:'B',name:'Fard Badar - Fatehgarh (poor Hindi scan)',lang:'हिंदी',quality:'mid',qTag:['mid','Quality B - faded ink'],
 docType:'Fard Badar (Khatauni extract)',district:'Ambala',village:'Fatehgarh',
 svg:()=>paperSvg({gov:'हरियाणा सरकार - राजस्व एवं आपदा प्रबंधन विभाग',govSub:'GOVERNMENT OF HARYANA - REVENUE DEPARTMENT',title:'फर्द बदर - नकल खतौनी',sub:'FARD BADAR - Extract of Khatauni - Year 2020-21',
  rows:[['जिला / District','अंबाला (Ambala)'],['तहसील / Tehsil','नरायणगढ़'],['गाँव / Village','फतेहगढ़ (हदस्त 92)'],['खेवट / खतौनी','18 / 23'],['खसरा / Khasra','156/2'],['स्वामी का नाम','कृष्ण कुमार पुत्र ओम प्रकाश'],['रकबा / Area','3 एकड़ 2 कनाल - 13,152.4 व.मी.'],['दाखिल खारिज','सं. 7712 - 04-07-2020 - बिक्री']],
  table:{head:['खसरा','खतौनी','स्वामी','पिता','रकबा'],rows:[['156/2','23','कृष्ण कुमार','ओम प्रकाश','3-2-0']]},
  stampL1:'हलका पटवारी',stampL2:'फतेहगढ़ / नरायणगढ़',stampL3:'प्रमाणित नकल',sign:'Halqa Patwari, Fatehgarh',quality:'mid'}),


 story:'Noisy Hindi fard - the printed sq-m figure is mis-read (18,152 vs computed 13,152.4). Fix it via the engine suggestion (HITL), then re-run checks.'
},
{
 id:'C',name:'Sale Deed - Raipur Rani (fraud test)',lang:'English',quality:'good',qTag:['good','Quality A'],
 docType:'Registered Deed of Sale',district:'Panchkula',village:'Raipur Rani',
 svg:()=>paperSvg({gov:'GOVERNMENT OF HARYANA - REGISTRATION DEPARTMENT',govSub:'हरियाणा सरकार - पंजीकरण विभाग',title:'DEED OF SALE - BIKRI KRAY PATRA',sub:'Sub-Registrar Raipur Rani - District Panchkula - e-GRAS paid',
  rows:[['Deed No.','1123 / 2024 - dated 22-02-2024'],['Village / गाँव','Raipur Rani'],['Khasra / खसरा','78/2/1'],['Vendor (विक्रेता)','Rajender Kumar s/o Dhani Ram'],['Vendee (क्रेता)','Sunita Rani w/o Mahesh Kumar'],['Consideration','₹ 18,50,000 - eighteen lakh fifty thousand'],['Area / रकबा','4 Kanal = 2,023.4 sq m'],['Stamp duty','₹ 1,34,600 - paid via e-GRAS']],
  table:null,
  stampL1:'SUB-REGISTRAR',stampL2:'RAIPUR RANI',stampL3:'22 FEB 2024',sign:'Sub-Registrar, Raipur Rani',quality:'good'}),


 story:'Perfect scan - perfect fraud. Registry already holds khasra 78/2/1 under Mahipal Singh; the vendor is not in the mutation chain. Watch R4 + R5 fail.'
},
{
 id:'D',name:'Mutation extract - Chhutmalpur 1998 (torn)',lang:'हिंदी',quality:'bad',qTag:['bad','Quality C - torn'],
 docType:'Mutation extract (Ansh Dan)',district:'Saharanpur',village:'Chhutmalpur',
 svg:()=>paperSvg({gov:'उत्तर प्रदेश सरकार - राजस्व विभाग',govSub:'GOVERNMENT OF UTTAR PRADESH - REVENUE DEPARTMENT',title:'अंश दान पर्चा - दाखिल खारिज',sub:'MUTATION ORDER EXTRACT - Tehsil Deoband - Year 1998-99',
  rows:[['जिला','सहारनपुर'],['तहसील','देवबंद'],['गाँव','छुटमलपुर'],['खसरा','334'],['रकबा','1 बीघा 8 बिस्वा'],['दाखिल खारिज सं.','2214 - दिनांक 14-05-1998'],['अंशदाता','छोटे लाल'],['अंशग्रहीता','रमेश चंद्र पुत्र छोटे लाल']],
  table:{head:['खसरा','पूर्व स्वामी','वर्तमान स्वामी','रकबा'],rows:[['334','छोटे लाल','रमेश चंद्र','1-8']]},
  stampL1:'लेखपाल',stampL2:'देवबंद',stampL3:'पंजीकृत',sign:'Lekhpal, Deoband',quality:'bad'}),


 story:'Torn 1998 parcha with a lis-pendens case attached (CS-212/2021). Verify fields by hand (HITL) - the litigation flag (R9) will still correctly refuse the record.'
}
];

/* ================= navigation ================= */

const TITLES={dashboard:['Overview','Digitization and validation summary'],digitize:['Record Digitization','Image QA, OCR, field extraction and confidence scoring'],validate:['Validation Engine','Rule checks R1-R10 against the registry and reference feeds'],registry:['Records Registry','Parcel records indexed by ULPIN (Bhu-Aadhaar format)'],ledger:['Integrity Ledger','Hash-linked blocks sealing every committed record'],queue:['Review Queue','Discrepancies flagged by the validation engine'],pitch:['About / Help','Background, walkthrough and technical notes']};
function nav(v){
  $$('.navitem').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  $$('.view').forEach(s=>s.classList.toggle('on',s.id==='view-'+v));
  $('#pageTitle').textContent=TITLES[v][0];$('#pageSub').textContent=TITLES[v][1];
  if(v==='dashboard')renderDashboard();
  if(v==='registry')renderRegistry();
  if(v==='ledger')renderLedger();
  if(v==='queue')renderQueue();
  const cb=document.getElementById('crumb');if(cb)cb.textContent=TITLES[v][0];window.scrollTo({top:0});
}
function drawChakra(){
  const svg=$('#chakra');if(!svg)return;let s='<circle cx="17" cy="17" r="15.5" fill="none" stroke="#fdba74" stroke-width="2.4"/><circle cx="17" cy="17" r="2.6" fill="#fdba74"/>';
  for(let i=0;i<24;i++){const a=i*15*Math.PI/180,x1=17+3.6*Math.cos(a),y1=17+3.6*Math.sin(a),x2=17+14.2*Math.cos(a),y2=17+14.2*Math.sin(a);s+=`<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#fdba74" stroke-width="1"/>`;}
  svg.innerHTML=s;
}

/* ================= dashboard ================= */
function renderDashboard(){
  const rs=S.records,val=rs.filter(r=>r.status==='validated').length,fl=rs.filter(r=>r.status==='flagged').length,pend=rs.filter(r=>r.status==='pending').length;
  const avg=(rs.reduce((a,r)=>a+(r.avgConf||0),0)/rs.length*100);
  const ul=rs.filter(r=>r.ulpin&&r.status!=='pending').length;
  $('#kpiRow').innerHTML=[
    ['var(--indigo)',nIN(rs.length),'Parcels in registry','across '+new Set(rs.map(r=>r.district)).size+' districts'],
    ['var(--green)',nIN(val),'Validated & sealed','ULPIN issued, ledger-anchored'],
    ['var(--red)',nIN(fl),'Flagged for review','duplicate / litigation / quality'],
    ['var(--saffron)',avg.toFixed(1)+'%','Avg extraction confidence','OCR + NLP, post-HITL']
  ].map(k=>`<div class="kpi" style="--kc:${k[0]}"><div class="lbl">${k[2]}</div><div class="val">${k[1]}</div><div class="sub">${k[3]}</div></div>`).join('');
  // donut
  const total=rs.length||1,R=54,C=2*Math.PI*R;let off=0;
  const segs=[['var(--green)',val],['var(--red)',fl],['#eab308',pend]];
  let donut=`<svg width="150" height="150" viewBox="0 0 140 140"><circle cx="70" cy="70" r="${R}" fill="none" stroke="#eef2f6" stroke-width="17"/>`;
  segs.forEach(([col,n])=>{if(!n)return;const len=n/total*C;donut+=`<circle cx="70" cy="70" r="${R}" fill="none" stroke="${col}" stroke-width="17" stroke-dasharray="${(len-3).toFixed(1)} ${C}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 70 70)" stroke-linecap="round"/>`;off+=len;});
  donut+=`<text x="70" y="66" text-anchor="middle" font-size="24" font-weight="800" fill="#0f172a">${rs.length}</text><text x="70" y="84" text-anchor="middle" font-size="10" fill="#64748b">parcels</text></svg>`;
  $('#donutWrap').innerHTML=donut+`<div class="small" style="max-width:180px;line-height:1.8"><div><b>${val}</b> validated - sealed with ULPIN</div><div style="color:var(--red)"><b>${fl}</b> flagged - blocked from transfer</div><div style="color:#a16207"><b>${pend}</b> pending - in digitization</div><div class="muted mt" style="font-size:11px">ULPIN coverage: ${Math.round(ul/total*100)}% of parcels</div></div>`;
  $('#donutLegend').innerHTML=`<span><i style="background:var(--green)"></i>Validated</span><span><i style="background:var(--red)"></i>Flagged</span><span><i style="background:#eab308"></i>Pending</span>`;
  // district bars
  const byd={};rs.forEach(r=>byd[r.district]=(byd[r.district]||0)+1);
  const top=Object.entries(byd).sort((a,b)=>b[1]-a[1]).slice(0,6);const mx=Math.max(...top.map(t=>t[1]));
  $('#barWrap').innerHTML=top.map(([d,n])=>`<div class="flex" style="gap:10px;margin:9px 0"><div style="width:110px;font-size:12px;font-weight:600;color:#334155;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(d)}</div><div style="flex:1;height:14px;background:#eef2f6;border-radius:99px;overflow:hidden"><div style="width:${(n/mx*100).toFixed(0)}%;height:100%;border-radius:99px;background:linear-gradient(90deg,#fdba74,var(--saffron2));transition:width .6s"></div></div><div class="mono small" style="width:22px;text-align:right">${n}</div></div>`).join('');
  // activity
  $('#activityList').innerHTML=S.activity.slice(0,9).map(a=>`<li><span class="ic">${a.ic}</span><span style="flex:1">${esc(a.txt)}</span><span class="t">${timeAgo(a.t)}</span></li>`).join('');
  // ledger mini
  const last=S.blocks[S.blocks.length-1];
  $('#ledgerMini').innerHTML=`<div class="flex wrap"><span class="pill p-valid"><span class="okdot"></span>Chain healthy</span><span class="chip"><span class="dot" style="background:var(--green)"></span>${S.blocks.length} blocks</span><span class="chip"><span class="dot" style="background:var(--green)"></span>${S.blocks.reduce((a,b)=>a+b.entries.length,0)} sealed entries</span><span class="chip"><span class="dot" style="background:var(--indigo)"></span>${hashMode()}</span></div>
  <div class="mono small mt" style="background:#0b1220;color:#7dd3fc;border-radius:10px;padding:10px 13px;word-break:break-all">HEAD ▸ ${esc(last.hash)}</div>
  <button class="btn btn-sm mt" onclick="nav('ledger')">Open Ledger</button>`;
}

/* ================= digitize ================= */
function renderSamples(){
  $('#sampleGrid').innerHTML=SAMPLES.map((s,i)=>`<div class="thumb ${W&&W.src==='sample'&&W.idx===i?'sel':''}" onclick="selectSample(${i})"><div class="docprev">${s.svg()}</div><div class="tt">${esc(s.name)}</div><div class="tags"><span class="qtag ${s.qTag[0]==='good'?'good':s.qTag[0]==='mid'?'mid':'bad'}">${s.qTag[1]}</span><span class="qtag">${esc(s.lang)}</span><span class="qtag">Sample ${s.id}</span></div></div>`).join('');
}
function resetPipeline(){
  [0,1,2,3,4].forEach(i=>{const st=$('#st'+i);st.classList.remove('done','run');});
  $('#terminal').innerHTML='<div class="ln sys">Log initialized. Select a document to begin.</div>';
  $('#pipelineMeta').textContent='Idle - select a document to begin.';
  $('#fieldsWrap').innerHTML='<div class="note blue">Extraction results will appear here. Fields under <b>75% confidence</b> are highlighted for operator verification (HITL) before validation.</div>';
  $('#btnValidate').disabled=true;$('#btnRerun').disabled=true;
  $('#docChip').innerHTML='<span class="dot"></span>-';
}


let W=null, lastReport=null;
const STEPIDX={ingest:0,pre:1,classify:2,ocr:3,extract:4,score:5};
function stepTo(n){for(let i=0;i<6;i++){const st=$('#st'+i);if(st){st.classList.toggle('done',i<n);st.classList.toggle('run',i===n);}}}
/* /api/scan streams NDJSON progress lines while the pipeline runs; every
 * status event drives the stepper + terminal live, the result line resolves. */
async function apiScan(file,onEvent){
  const fd=new FormData();
  fd.append('file', file, 'doc.png');
  const r=await fetch('/api/scan',{method:'POST',body:fd});
  if(!r.ok){let m;try{m=(await r.json()).error;}catch(e){m=r.statusText;}throw new Error(m||('HTTP '+r.status));}
  const eat=(line)=>{const ev=JSON.parse(line);
    if(ev.ev==='status'){try{onEvent(ev);}catch(_){}}
    else if(ev.ev==='result'||ev.fields)return ev;
    else if(ev.ev==='error')throw new Error(ev.error||'OCR pipeline failed');
    return null;};
  if(!r.body||!r.body.getReader){          // non-streaming proxy fallback
    const lines=await r.text();let res=null;
    for(const l of lines.trim().split('\n')){if(!l)continue;const ev=eat(l);if(ev)res=ev;}
    if(!res)throw new Error('OCR stream ended without a result');
    return res;
  }
  const rd=r.body.getReader(),dec=new TextDecoder();let buf='',result=null;
  for(;;){
    const {done,value}=await rd.read();
    if(value)buf+=dec.decode(value,{stream:true});
    let i;
    while((i=buf.indexOf('\n'))>=0){
      const line=buf.slice(0,i).trim();buf=buf.slice(i+1);
      if(!line)continue;
      const ev=eat(line);if(ev)result=ev;
    }
    if(done)break;
  }
  if(!result)throw new Error('OCR stream ended without a result');
  return result;
}
function selectSample(i){
  const s=SAMPLES[i]; if(!s)return;
  W={src:'sample', idx:i, done:false, fields:{}, events:[]};
  renderSamples();
  resetPipeline();
  stepTo(0); $('#pipelineMeta').textContent='Fetching sample image…';
  $('#docPaper').className='docpaper';
  $('#docPaper').innerHTML=`<img src="samples/sample${s.id}.png" alt="${esc(s.name)}" style="width:100%;display:block">`;
  $('#docChip').innerHTML=`<span class="dot" style="background:var(--green)"></span>${esc(s.name)} - real OCR`;
  term('<span class="sys">▸ source</span> '+esc(s.name)+' ('+esc(s.lang)+') - the actual image is being sent to the OCR service…','sys');
  term('<span class="sys">▸ note</span> '+esc(s.story),'sys');
  (async()=>{
    try{
      const r=await fetch('samples/sample'+s.id+'.png');
      if(!r.ok) throw new Error('sample image missing ('+r.status+')');
      const blob=await r.blob();
      await runPipeline(blob);
    }catch(e){
      term('<span class="sys">▸ error</span> sample could not be loaded: '+esc(e.message)+' - use manual entry below','err');
      W.fields={};FIELD_DEFS.forEach(([k])=>W.fields[k]={v:'',c:.5,edited:false,verified:false});
      renderFields(true);
    }
  })();
}
function handleUpload(file){
  if(!file||!file.type||!file.type.startsWith('image/')){toast('Unsupported file','Please upload a JPG or PNG scan.','err');return;}
  const rd=new FileReader();
  rd.onload=()=>{
    W={src:'upload', idx:-1, name:file.name, done:false, fields:{}, events:[]};
    renderSamples(); resetPipeline();
    stepTo(0); $('#pipelineMeta').textContent='Uploading '+esc(file.name||'image')+'…';
    $('#docPaper').className='docpaper';
    $('#docPaper').innerHTML=`<img src="${rd.result}" alt="uploaded scan" style="width:100%;display:block">`;
    $('#docChip').innerHTML=`<span class="dot" style="background:var(--indigo)"></span>${esc(file.name)}`;
    term('<span class="sys">▸ source</span> upload received: '+esc(file.name||'image')+' ('+Math.round((file.size||0)/1024)+' KB) - sending to the OCR service…','sys');
    runPipeline(file);
  };
  rd.readAsDataURL(file);
}
async function runPipeline(file){
  file=file||(W&&W.__file);
  if(!file){toast('Nothing to scan','Select a sample document or upload a scan first.','warn');return;}
  if(W)W.__file=file;
  const t0=Date.now();
  try{
    const r=await apiScan(file,ev=>{
      const idx=STEPIDX[ev.step]!=null?STEPIDX[ev.step]:2;
      stepTo(idx);
      $('#pipelineMeta').textContent=ev.msg;
      term('<span class="sys">▸ '+esc(ev.step)+'</span> '+esc(ev.msg),'sys');
    });
    stepTo(6);
    $('#pipelineMeta').textContent='Pipeline complete - '+r.captured+' field(s) captured, mean OCR confidence '+Math.round(r.ocr.confidence)+'% in '+((Date.now()-t0)/1000).toFixed(1)+'s';
    if(r.ocr.digitFix&&r.ocr.digitFix.repairs.length)
      term('<span class="sys">▸ digit-integrity</span> '+r.ocr.digitFix.repairs.map(x=>esc(x.from)+'→<b>'+esc(x.to)+'</b>').join('  ')+'  (cross-read repair)','sys');
    W.__rawText=r.ocr.text;
    W.fields=r.fields;
    W.done=true;
    term('<span class="sys">▸ extract</span> field mapper captured '+r.captured+' field(s) from the OCR text - review them against the scan','sys');
    if(r.captured<=2)
      term('<span class="sys">▸ extract</span> few standard labels recognized - open the raw OCR panel below the fields and fill in manually','sys');
  }catch(e){
    term('<span class="sys">▸ error</span> OCR service failed: '+esc(e.message)+' - manual entry template loaded at the kiosk','err');
    toast('OCR unavailable', e.message+' - manual entry is available below.','warn',6000);
    W.fields={};FIELD_DEFS.forEach(([k])=>W.fields[k]={v:'',c:.5,edited:false,verified:false});
  }
  W.done=true;
  $('#btnValidate').disabled=false;$('#btnRerun').disabled=false;
  renderFields(true);
  updateBadges();
}

function term(html,cls){
  const t=$('#terminal');const d=document.createElement('div');d.className='ln '+(cls||'');d.innerHTML='<span class="ts">'+new Date().toLocaleTimeString('en-IN',{hour12:false})+'</span>'+html;t.appendChild(d);t.scrollTop=t.scrollHeight;
}

function rerunPipeline(){if(W)runPipeline();}
function effConf(fl){return fl?(fl.verified?.97:(fl.edited?.92:fl.c)):.5;}
function fieldAvg(){const vs=Object.values(W.fields).filter(f=>f.v!==''&&f.v!=null);if(!vs.length)return 0;return vs.reduce((a,f)=>a+effConf(f),0)/vs.length;}
function minConf(){const vs=Object.values(W.fields).filter(f=>f.v!==''&&f.v!=null);return vs.length?Math.min(...vs.map(effConf)):0;}

function renderFields(animate){
  if(!W||!W.fields){return;}
  const __isDeedDoc=/deed|sale|बिक्री|bikri/i.test(String((W.fields.docType&&W.fields.docType.v)||''));
  const __CORE=['docType','docDate','state','district','tehsil','village','khasra','owner','father','areaStr','areaSqM'];
  const __deedOnly=['seller','consideration','deedNo'],__rorOnly=['khewat','khatuni','mutationNo','mutationDate','mutationType'];
  const rows=FIELD_DEFS.filter(([k])=>W.fields[k]&&(W.fields[k].v!==''||__CORE.includes(k)||(__isDeedDoc?__deedOnly:__rorOnly).includes(k))).map(([k,label,sub])=>{
    const f=W.fields[k],c=effConf(f),cls=c<.62?'low':c<.75?'mid':'';
    return `<div class="fieldrow" id="fr_${k}">
      <div class="fl">${label}<span class="dev">${sub}</span></div>
      <div class="flex" style="gap:6px">
        <input class="${f.edited?'edited':''} ${c<.75?'lowconf':''}" data-k="${k}" value="${esc(f.v)}" placeholder="-" oninput="fieldEdit('${k}',this.value)" ${animate?'disabled style="display:none"':''}>
        <button class="btn btn-sm ${f.verified?'btn-green':''}" title="Mark field as operator-verified (conf → 97%)" onclick="verifyField('${k}')">${f.verified?'✓✓':'✓'}</button>
      </div>
      <div><div class="confbar"><i class="${cls}" style="width:0%"></i></div><div class="conftxt">${f.v===''?'not on scan - enter manually':(c*100).toFixed(0)+'%'+(f.computed?' - computed from units':f.verified?' - verified':f.edited?' - edited':'')}</div></div>
    </div>`;
  }).join('');
  $('#fieldsWrap').innerHTML=`<div style="display:grid;grid-template-columns:150px 1fr 120px;gap:10px;padding:4px 10px 6px" class="small muted"><div>Field</div><div>Value (editable - HITL)</div><div>Confidence</div></div>`+rows;
  if(W.__rawText){
    const __nFilled=Object.values(W.fields).filter(f=>f.v).length;
    $('#fieldsWrap').insertAdjacentHTML('beforeend','<details class="note blue" style="margin-top:10px"'+(__nFilled<=2?' open':'')+'><summary style="cursor:pointer;font-weight:600">Raw OCR output ('+W.__rawText.split('\n').filter(x=>x.trim()).length+' lines recognized) - click to view</summary><div class="mono small" style="white-space:pre-wrap;margin-top:6px;max-height:180px;overflow:auto;background:#fff;padding:8px;border:1px solid var(--bd2);border-radius:2px">'+esc(W.__rawText)+'</div></details>');
  }
  if(animate){
    const rws=$$('#fieldsWrap .fieldrow');
    let d=0;
    rws.forEach(r=>{r.style.opacity=0;setTimeout(()=>{if(!W||!W.fields)return;r.style.transition='opacity .3s';r.style.opacity=1;
      const inp=r.querySelector('input');if(inp){inp.style.display='';inp.disabled=false;}
      const bar=r.querySelector('.confbar i');if(bar&&inp)bar.style.width=(effConf(W.fields[inp.dataset.k])*100).toFixed(0)+'%';
    },d+=90);});
  }else{
    $$('#fieldsWrap .confbar i').forEach(b=>{const k=b.closest('.fieldrow').querySelector('input').dataset.k;b.style.width=(effConf(W.fields[k])*100).toFixed(0)+'%';});
  }
}
function fieldEdit(k,v){if(W&&W.fields[k]){W.fields[k].v=v;W.fields[k].edited=v!=='';const inp=document.querySelector('#fr_'+k+' input');if(inp){inp.classList.toggle('edited',v!=='');inp.classList.remove('lowconf');}const ct=document.querySelector('#fr_'+k+' .conftxt');if(ct)ct.innerHTML=(effConf(W.fields[k])*100).toFixed(0)+'% - edited';const bar=document.querySelector('#fr_'+k+' .confbar i');if(bar){bar.className=v===''?'low':'';bar.style.width=(effConf(W.fields[k])*100)+'%';}}}
function verifyField(k){if(!W||!W.fields[k])return;W.fields[k].verified=!W.fields[k].verified;renderFields(false);}

/* ================= validation engine ================= */


async function goValidate(silent){
  if(!W||!W.done){toast('Nothing to validate','Run the digitization pipeline first.','warn');return;}
  try{
    lastReport=await api('/api/validate', jPOST({fields:W.fields}));
  }catch(e){ toast('Validation failed', e.message, 'err'); return; }
  W.__computedSqM=lastReport.computedSqM; W.__geo=lastReport.geo;
  nav('validate'); renderValidation();
}
async function commit(){
  if(!W||!W.done||!lastReport){toast('Nothing to commit','Digitize and validate a document first.','warn');return;}
  try{
    const r=await api('/api/commit', jPOST({fields:W.fields}));
    const rec=r.record;
    W=null;lastReport=null;resetPipeline();
    S=await api('/api/state'); renderAll(); nav('registry'); openRecord(rec.id);
    toast('Record sealed','ULPIN '+ulpinGroups(rec.ulpin)+' - block #'+rec.block+' anchored','ok',6000);
    if(r.learned > 0) setTimeout(() => toast('AI Feedback Loop','Logged '+r.learned+' operator correction(s) for fine-tuning','info',6000), 1000);
  }catch(e){
    toast(e.status===409?'Commit blocked':'Commit failed', e.message, e.status===409?'err':'err',6500);
  }
}
async function sendToQueue(){
  if(!W||!W.done||!lastReport){toast('Nothing to queue','Digitize a document first.','warn');return;}
  try{
    const r=await api('/api/queue', jPOST({fields:W.fields}));
    W=null;lastReport=null;resetPipeline();
    S=await api('/api/state'); renderAll(); nav('queue');
    toast('Sent to Review Queue','Record '+(r.record?r.record.id:'')+' flagged for officer review.','warn');
  }catch(e){ toast('Queue failed', e.message, 'err'); }
}

function applyFix(k,v){if(!W||!W.fields[k])return;W.fields[k]={v:String(v),c:W.fields[k].c,edited:true,verified:false};renderFields(false);toast('Field corrected',k+' → '+v+' (operator-assisted fix)','ok');goValidate(true);}

function renderValidation(){
  if(!lastReport){$('#valEmpty').style.display='block';$('#valBody').style.display='none';return;}
  $('#valEmpty').style.display='none';$('#valBody').style.display='block';
  const s=W&&W.src==='sample'?SAMPLES[W.idx]:null;
  $('#valDocTitle').textContent=(s?s.name:'Uploaded scan - '+(W&&W.name||'manual entry'))+' - validation report';
  $('#valDocMeta').textContent=`Extracted ${Object.values(W.fields).filter(f=>f.v!=='').length} fields - avg confidence ${(lastReport.avg*100).toFixed(1)}% - ${new Date(lastReport.ts).toLocaleTimeString('en-IN')}`;
  const v=lastReport.verdict;
  const bmap={pass:['bn-pass','RESULT: PASS','All structural, cross-field and registry checks passed. The record may be sealed.'],warn:['bn-warn','RESULT: PASS WITH WARNINGS','Minor discrepancies found. Review the warnings below; apply suggested corrections or verify fields, then re-run.'],fail:['bn-fail','RESULT: FAIL','One or more hard checks failed. Sealing is blocked. The record can be sent to the Review Queue.']};
  $('#verdictBanner').innerHTML=`<div class="banner ${bmap[v][0]}"><div style="font-size:20px;font-weight:800">${v==='pass'?'✓':(v==='warn'?'!':'✕')}</div><div><div style="font-size:16px">${bmap[v][1]}</div><div style="font-weight:500;font-size:12.5px;opacity:.85">${bmap[v][2]}</div></div></div>`;
  $('#checksList').innerHTML=lastReport.checks.map(c=>{
    const ic=c.status==='pass'?'✓':c.status==='warn'?'!':'✕';
    const fix=c.fix?`<button class="btn btn-sm" style="margin-top:8px" onclick="applyFix('${c.fix.k}','${String(c.fix.v).replace(/'/g,"\\'")}')">Apply: ${esc(c.fix.label)}</button>`:'';
    return `<div class="check ${c.status}"><div class="sig">${ic}</div><div style="flex:1"><div class="ct">${c.name}<span class="rid">${c.id}</span><span class="pill ${c.status==='pass'?'p-valid':c.status==='warn'?'p-warnp':'p-flag'}">${c.status.toUpperCase()}</span></div><div class="cd">${c.detail}</div>${fix}<div class="why"><b>Why this check exists:</b> ${c.why}</div></div></div>`;
  }).join('');
  const risk=100-lastReport.score;const col=risk<25?'var(--green)':risk<55?'var(--amber)':'var(--red)';
  const frac=risk/100,C=2*Math.PI*52;
  $('#gaugeWrap').innerHTML=`<svg width="132" height="80" viewBox="0 0 132 80"><path d="M 12 72 A 54 54 0 0 1 120 72" fill="none" stroke="#eef2f6" stroke-width="13" stroke-linecap="round"/><path d="M 12 72 A 54 54 0 0 1 120 72" fill="none" stroke="${col}" stroke-width="13" stroke-linecap="round" stroke-dasharray="${(frac*C).toFixed(1)} ${C}"/><text x="66" y="62" text-anchor="middle" font-size="22" font-weight="800" fill="${col}">${risk}</text><text x="66" y="76" text-anchor="middle" font-size="9" fill="#64748b">risk / 100</text></svg>
  <div class="small" style="line-height:1.7"><div><b>${lastReport.checks.filter(c=>c.status==='pass').length}</b> passed - <b style="color:var(--amber)">${lastReport.warns}</b> warnings - <b style="color:var(--red)">${lastReport.fails}</b> failures</div><div class="muted">Integrity score ${lastReport.score}/100</div></div>`;
  $('#verdictChips').innerHTML=`<span class="pill ${v==='pass'?'p-valid':v==='warn'?'p-warnp':'p-flag'}">${v==='pass'?'Eligible for sealing':'Not eligible for sealing'}</span><span class="chip"><span class="dot" style="background:var(--indigo)"></span>10 rule checks (R1-R10)</span>`;
  const isOfficer = $('#rbacRole').value === 'officer';
  $('#btnCommit').disabled = lastReport.verdict === 'fail' || !isOfficer;
  $('#btnQueue').disabled=false;
}

/* ================= commit & seal ================= */

const stripTags=s=>String(s).replace(/<[^>]*>/g,'');

/* ================= pseudo-QR integrity seal ================= */
function simHash(s){let h=0;for(let i=0;i<s.length;i++)h=Math.imul(31,h)+s.charCodeAt(i)|0;return Math.abs(h).toString(16).padStart(8,'0').repeat(8);}
function pseudoQR(str){
  const h=simHash(str),N=21,cell=[];
  for(let y=0;y<N;y++){cell[y]=[];for(let x=0;x<N;x++)cell[y][x]=((parseInt(h[(y*N+x)%64],16)+((y*7+x*13)%16))%3===0)?1:0;}
  const finder=(ox,oy)=>{for(let y=0;y<7;y++)for(let x=0;x<7;x++){const ring=(x===0||x===6||y===0||y===6),core=(x>=2&&x<=4&&y>=2&&y<=4);cell[oy+y][ox+x]=ring||core?1:0;}};
  finder(0,0);finder(14,0);finder(0,14);
  for(let i=8;i<13;i++){cell[6][i]=i%2?0:1;cell[i][6]=i%2?0:1;}
  let s='<svg width="112" height="112" viewBox="0 0 105 105" shape-rendering="crispEdges" style="background:#fff;border-radius:8px">';
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(cell[y][x])s+='<rect x="'+(x*5)+'" y="'+(y*5)+'" width="5" height="5" fill="#0f172a"/>';
  return s+'</svg>';
}

/* ================= registry ================= */
function fillStateFilter(){
  const sel=$('#regState');const cur=sel.value;
  const sts=[...new Set(S.records.map(r=>r.state))];
  sel.innerHTML='<option value="">All states</option>'+sts.map(s=>'<option>'+esc(s)+'</option>').join('');
  sel.value=cur;
}
function renderRegistry(){
  fillStateFilter();
  const q=($('#regSearch').value||'').toLowerCase(),st=$('#regStatus').value,sta=$('#regState').value;
  const rows=S.records.filter(r=>{
    const hay=[r.ulpin,r.owner,r.khasra,r.village,r.tehsil,r.district,r.state].join(' ').toLowerCase();
    return (!q||hay.includes(q))&&(!st||r.status===st)&&(!sta||r.state===sta);
  }).sort((a,b)=>b.createdAt-a.createdAt);
  $('#regCount').innerHTML='<span class="dot" style="background:var(--green)"></span>'+rows.length+' records';
  $('#regBody').innerHTML=rows.map(r=>`<tr onclick="openRecord('${r.id}')">
    <td class="mono small"><b>${r.ulpin==='-'?'-':esc(ulpinGroups(r.ulpin))}</b></td>
    <td><b>${esc(r.owner)}</b>${r.father?'<div class="small muted">s/o - d/o '+esc(r.father)+'</div>':''}</td>
    <td class="mono">${esc(r.khasra)}</td>
    <td>${esc(r.village)}<div class="small muted">${esc(r.tehsil)}</div></td>
    <td>${esc(r.district)}<div class="small muted">${esc(r.state)}</div></td>
    <td class="small">${r.areaSqM?nIN(Math.round(r.areaSqM))+' m²':'-'}</td>
    <td><span class="pill ${r.status==='validated'?'p-valid':r.status==='flagged'?'p-flag':'p-pend'}">${r.status}</span>${r.tampered?' <span class="pill p-flag">TAMPERED</span>':''}</td>
    <td class="mono small">${r.block?'#'+r.block:'-'}</td>
    <td class="mono small">${Math.round((r.avgConf||0)*100)}%</td></tr>`).join('')||'<tr><td colspan="9" style="text-align:center;padding:30px" class="muted">No records match.</td></tr>';
}
function closeModal(){$('#modalRoot').innerHTML='';}
function openRecord(id,opts){
  const r=S.records.find(x=>x.id===id);if(!r)return;
  opts=opts||{};
  const det=FIELD_DEFS.filter(([k])=>r[k]!==undefined&&r[k]!==''&&r[k]!==null).map(([k,label])=>`<div style="padding:7px 0;border-bottom:1px dashed var(--line)"><div class="small muted">${label}</div><div style="font-weight:600">${esc(r[k])}</div></div>`).join('');
  const ulpinOk=r.ulpin!=='-'&&ulpinValid(r.ulpin);
  const geoLine=r.lat!=null?`<div style="padding:7px 0;border-bottom:1px dashed var(--bd)"><div class="small muted">Geo-reference (Bhu-Naksha cadastral layer)</div><div class="mono" style="font-weight:600">${(+r.lat).toFixed(4)}N&nbsp;&nbsp;${(+r.lng).toFixed(4)}E</div></div>`:'';
  $('#modalRoot').innerHTML=`<div class="modal-ov" onclick="if(event.target===this)closeModal()"><div class="modal">
    <button class="x" onclick="closeModal()">✕</button>
    <div class="flex sp wrap"><div><h3 style="font-size:18px">${esc(r.owner)} - ${esc(r.docType)}</h3>
      <div class="small muted">${esc(r.village)}, ${esc(r.tehsil)}, ${esc(r.district)} - ${esc(r.state)}</div></div>
      <div class="flex wrap">${opts.sealed?'<span class="pill p-valid">SEA SEALED</span>':''}<span class="pill ${r.status==='validated'?'p-valid':r.status==='flagged'?'p-flag':'p-pend'}">${r.status}</span></div></div>
    <div class="flex wrap mt">
      <span class="chip ${ulpinOk?'ok':'off'}"><span class="dot"></span>ULPIN ${esc(r.ulpin==='-'?'-':ulpinGroups(r.ulpin))} ${ulpinOk?'- Luhn ✓':''}</span>
      <span class="chip"><span class="dot" style="background:var(--indigo)"></span>Block ${r.block?'#'+r.block:'-'}</span>
      <span class="chip"><span class="dot" style="background:var(--saffron)"></span>conf ${Math.round((r.avgConf||0)*100)}%</span>
      <span class="chip"><span class="dot" style="background:var(--green)"></span>checks: ${(r.checks&&r.checks.pass)||'-'} pass / ${(r.checks&&r.checks.warn)||0} warn / ${(r.checks&&r.checks.fail)||0} fail</span>
      <span class="chip"><span class="dot" style="background:#94a3b8"></span>${fmtD(r.createdAt)}</span>
    </div>
    <div class="grid2 mt" style="gap:6px 22px">${geoLine}${det}</div>
    <div class="mt">
      <div class="small muted" style="margin-bottom:4px">Content hash (sealed at commit)</div>
      <div class="mono small" id="recHash" style="background:#0b1220;color:#7dd3fc;border-radius:10px;padding:10px 13px;word-break:break-all">${esc(r.hash||'(unsealed - pending records carry no hash)')}</div>
    </div>
    <div id="recVerify" class="mt"></div>
    <div class="mt" style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
      <div style="text-align:center">${r.hash?pseudoQR(r.ulpin+(r.hash||'')):''}<div class="small muted" style="margin-top:4px">Integrity seal</div></div>
      <div style="flex:1;min-width:220px">
        <div class="flex wrap">
          <button class="btn btn-green btn-sm" onclick="verifyRecord('${r.id}')">Verify Hash</button>
          ${r.hash?`<button class="btn btn-danger btn-sm" onclick="tamperRecord('${r.id}')">Test Tamper Detection</button>`:''}
          ${r.tampered?`<button class="btn btn-sm" onclick="restoreRecord('${r.id}')">Restore Original Value</button>`:''}
          <button class="btn btn-sm" onclick="exportRecord('${r.id}')">Export JSON</button>
        </div>
        <div class="note mt">Verify the hash, apply a silent edit, then verify again - the mismatch is detected and localized to the changed field.</div>
      </div>
    </div>
  </div></div>`;
}


async function verifyRecord(id){
  const r=S.records.find(x=>x.id===id);if(!r)return;
  const box=$('#recVerify');
  if(!r.hash){box.innerHTML='<div class="note">Pending record - nothing sealed yet. Validate and commit it first.</div>';return;}
  box.innerHTML='<div class="banner bn-pass" style="padding:10px 14px">⏳ Recomputing SHA-256 over canonical fields…</div>';
  let v; try{ v=await api('/api/records/'+id+'/verify'); }catch(e){ box.innerHTML='<div class="banner bn-fail">Verify failed: '+esc(e.message)+'</div>'; return; }
  if(v.ok){
    box.innerHTML=`<div class="banner bn-pass" style="padding:12px 16px">VAL <b>INTEGRITY VERIFIED</b> - recomputed hash matches the sealed hash exactly. Record is byte-identical to its sealed state.</div>`;
    toast('Integrity verified','Record '+r.id+' matches its sealed hash.','ok');
  }else{
    box.innerHTML=`<div class="banner bn-fail" style="padding:12px 16px"><b>TAMPERING DETECTED</b> - recomputed hash differs from sealed hash.${v.tamperedField?'<div class="small" style="margin-top:4px">Deviation localized to field: <b>'+esc(v.tamperedField)+'</b> (now '+esc(v.tamperedValue)+', sealed '+esc(v.origValue)+')</div>':''}<div class="mono small" style="margin-top:6px;word-break:break-all">sealed ▸ ${esc(v.sealedHash)}<br/>now&nbsp;&nbsp;&nbsp;▸ ${esc(v.currentHash)}</div></div>`;
    toast('Tampering detected','Hash mismatch on record '+r.id+'.','err');
  }
}
async function tamperRecord(id){
  const r=S.records.find(x=>x.id===id);if(!r||!r.hash)return;
  try{ await api('/api/records/'+id+'/tamper',{method:'POST'}); }catch(e){ toast('Tamper demo failed',e.message,'err'); return; }
  S=await api('/api/state'); renderRegistry(); openRecord(id);
  toast('Edit applied silently','The area field was changed after sealing. Run Verify Hash on the record to detect it.','warn',6000);
}
async function restoreRecord(id){
  try{ await api('/api/records/'+id+'/restore',{method:'POST'}); }catch(e){ toast('Restore failed',e.message,'err'); return; }
  S=await api('/api/state'); renderRegistry(); openRecord(id);
  toast('Original restored','Record reverted to its sealed state.','ok');
}

function exportRecord(id){
  const r=S.records.find(x=>x.id===id);if(!r)return;
  try{
    const blob=new Blob([JSON.stringify(r,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='bhunetra-'+(r.ulpin||r.id)+'.json';document.body.appendChild(a);a.click();a.remove();
    toast('Exported','Record JSON downloaded.');
  }catch(e){toast('Export unavailable in sandbox','Open the downloaded HTML file in a browser to export.','warn');}
}

/* ================= ledger ================= */
async function renderLedger(verify){
  const row=$('#blocksRow');
  row.innerHTML=S.blocks.map((b,i)=>{
    const bad=b.__bad,orph=b.__orphan;
    return (i>0?`<div class="linker ${bad||orph?'broken':''}">${bad||orph?'×':'→'}</div>`:'')+
    `<div class="block ${i===0?'gen':''} ${bad?'tampered':''}" ${bad||orph?'style="border-color:var(--red);'+(orph&&!bad?'background:#fff7f7;':'')+'"':''}>
      <div class="bh"><span>${i===0?'GENESIS':'BLOCK #'+i}</span><span class="small"><span class="okdot" style="background:${bad?'var(--red)':orph?'#f59e0b':'var(--green)'}"></span>${bad?'HASH MISMATCH':orph?'ORPHANED':'SEALED'}</span></div>
      <div class="hval">hash ▸ ${esc(b.hash.slice(0,28))}…<br>prev ▸ ${esc(String(b.prev).slice(0,28))}…</div>
      <div class="bmeta">${fmtDT(b.ts)}<br>${b.entries.length} entr${b.entries.length===1?'y':'ies'} - nonce ${esc(b.nonce)}${b.entries.length?'<br>'+b.entries.slice(0,2).map(e=>esc(ulpinGroups(e.ulpin))).join('<br>')+(b.entries.length>2?'<br>+'+(b.entries.length-2)+' more':''):''}</div>
    </div>`;
  }).join('');
  if(verify){await verifyChain(true);return;}
  $('#chainHealth').innerHTML='<div class="banner bn-pass" style="padding:11px 16px"><span class="okdot"></span>Chain state as stored - <b>'+S.blocks.length+' blocks</b>, '+S.blocks.reduce((a,b)=>a+b.entries.length,0)+' sealed record entries. Run <b>Verify entire chain</b> to recompute every hash.</div>';
}


async function verifyChain(show){
  let v; try{ v=await api('/api/ledger/verify',{method:'POST'}); }catch(e){ toast('Chain verify failed',e.message,'err'); return; }
  let firstBad=-1;
  v.blocks.forEach((b,idx)=>{
    const sb=S.blocks[idx];
    if(sb){ sb.__bad=!b.ok; sb.__orphan=false; }
    if(!b.ok&&firstBad<0)firstBad=idx;
  });
  if(firstBad>=0)for(let i=firstBad+1;i<S.blocks.length;i++)S.blocks[i].__orphan=true;
  const nBad=v.blocks.filter(b=>!b.ok).length,nOrph=firstBad>=0?S.blocks.length-1-firstBad:0;
  await renderLedger(0);
  if(!v.valid){
    $('#chainHealth').innerHTML=`<div class="banner bn-fail" style="padding:12px 16px"><b>CHAIN BROKEN</b> - ${nBad} block(s) fail hash re-computation${nOrph?', '+nOrph+' descendant block(s) orphaned':''}. The red block was modified after sealing; every descendant is now untrustworthy. <button class="btn btn-sm" style="margin-left:10px" onclick="undoChainTamper()">↺ Restore chain</button></div>`;
    if(show)toast('Chain verification failed','Tampered block detected - cascade shown in red.','err',6000);
  }else{
    $('#chainHealth').innerHTML=`<div class="banner bn-pass" style="padding:12px 16px">VAL <b>CHAIN VERIFIED</b> - recomputed ${S.blocks.length} block hashes with ${hashMode()}; every link matches. History is provably intact.</div>`;
    if(show)toast('Chain verified','All '+S.blocks.length+' blocks intact.','ok');
  }
}
async function tamperChainBlock(){
  if($('#btnTamperBlock').textContent!=='Test Tamper Detection'){undoChainTamper();return;}
  let r; try{ r=await api('/api/ledger/tamper',{method:'POST'}); }catch(e){ toast('Tamper demo failed',e.message,'err'); return; }
  S=await api('/api/state'); renderLedger();
  $('#btnTamperBlock').textContent='Restore Chain';
  toast('Block #'+(r.block!=null?r.block:'?')+' silently edited','A stored ULPIN was altered after sealing. Now run "Verify entire chain".','warn',6500);
}
async function undoChainTamper(){
  try{ await api('/api/ledger/undo',{method:'POST'}); }catch(e){ toast('Restore failed',e.message,'err'); return; }
  S=await api('/api/state');
  $('#btnTamperBlock').textContent='Test Tamper Detection';
  renderLedger();toast('Chain restored','Original entries reinstated - verify again.','ok');
}

/* ================= review queue ================= */
function renderQueue(){
  const open=S.discs.filter(d=>d.status==='open'),res=S.discs.filter(d=>d.status!=='open');
  $('#qBadge').textContent=open.length;$('#qBadge').style.display=open.length?'':'none';
  $('#queueStats').innerHTML=`<span class="pill p-flag">${open.filter(d=>d.sev==='high').length} high</span><span class="pill p-warnp">${open.filter(d=>d.sev==='med').length} medium</span><span class="pill p-pend">${open.filter(d=>d.sev==='low').length} low</span><span class="chip ok"><span class="dot"></span>${res.length} resolved</span>`;
  $('#queueList').innerHTML=S.discs.map(d=>{
    const r=S.records.find(x=>x.id===d.ref);
    return `<div class="disc ${d.sev} ${d.status!=='open'?'resolved':''}">
      <div class="dt"><span class="sev ${d.sev}">${d.sev}</span>${esc(d.title)}${d.status!=='open'?'<span class="pill p-valid">resolved</span>':''}</div>
      <div class="dd">${esc(d.detail)}</div>
      <div class="flex sp wrap">
        <span class="small muted">flagged ${timeAgo(d.created)}${r?' - record '+esc(r.id)+' ('+esc(r.village)+')':''}</span>
        ${d.status==='open'?`<span class="flex">
          ${r?`<button class="btn btn-sm" onclick="openRecord('${r.id}')">Open record</button>`:''}
          <button class="btn btn-sm btn-green" onclick="resolveDisc('${d.id}',true)">✓ Resolve</button>
          <button class="btn btn-sm btn-danger" onclick="resolveDisc('${d.id}',false)">✕ Reject claim</button></span>`:''}
      </div></div>`;
  }).join('')||'<div class="card" style="text-align:center;padding:40px">No pending items in the review queue.</div>';
}


async function resolveDisc(id){
  try{ await api('/api/discs/'+id+'/resolve', jPOST({status:'resolved'})); }catch(e){ toast('Resolve failed',e.message,'err'); return; }
  S=await api('/api/state'); renderAll(); if(document.querySelector('.view.on')&&document.getElementById('view-queue').classList.contains('on'))nav('queue');
  toast('Resolved','Review item closed and logged.','ok');
}

function updateBadges(){
  const open=S.discs.filter(d=>d.status==='open').length;
  $('#qBadge').textContent=open;$('#qBadge').style.display=open?'':'none';
}
function renderAll(){renderDashboard();renderSamples();renderRegistry();renderLedger();renderQueue();updateBadges();}


async function resetDemo(){
  if(!confirm('Reset all demo data to factory seed? This clears records you added.'))return;
  try{ S=await api('/api/reset',{method:'POST'}); }catch(e){ toast('Reset failed',e.message,'err'); return; }
  renderAll(); nav('dashboard');
  toast('Demo reset','Factory seed data restored (server database reseeded).','info');
}
async function init(){
  drawChakra();
  $('#chipEngine').className='chip ok';
  $('#chipEngineTxt').textContent='Engine: Server OCR (Gemini Vision AI, Node.js)';
  $('#chipEngine').title='Documents run Gemini Vision AI on the backend - samples included';
  $('#chipStore').className='chip ok';
  $('#chipStoreTxt').textContent='Storage: SQLite (server)';
  $('#chipStore').title='Records persist in the server database across reloads';
  setInterval(()=>{$('#clock').textContent=new Date().toLocaleTimeString('en-IN')+' IST';},1000);
  let __visits=42137+rnd(300);const __vb=document.getElementById('visits');if(__vb)__vb.textContent=String(__visits).padStart(7,'0');setInterval(()=>{__visits+=1+rnd(3);if(__vb)__vb.textContent=String(__visits).padStart(7,'0');},9000);
  $('#uploadInput').addEventListener('change',e=>{if(e.target.files&&e.target.files[0])handleUpload(e.target.files[0]);e.target.value='';});
  const dz=$('#dropZone');
  ['dragover','dragenter'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('drag');}));
  ['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('drag');}));
  dz.addEventListener('drop',e=>{if(e.dataTransfer.files&&e.dataTransfer.files[0])handleUpload(e.dataTransfer.files[0]);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  try{
    S=await api('/api/state');
  }catch(e){
    S={records:[],blocks:[],activity:[],discs:[],stats:{}};
    toast('Backend unreachable','Start the server (npm start) - showing empty state.','err',8000);
  }
  renderAll();
  setTimeout(()=>toast('Bhu-Netra ready','A demonstration walkthrough is available under About / Help.','info',7000),900);
}
init();
