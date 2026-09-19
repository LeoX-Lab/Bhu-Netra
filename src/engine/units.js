/* Measurement units, digit normalization, ULPIN — ported verbatim from the
 * Bhu-Netra prototype (single-file build). Do not alter conversion constants. */
function lev(a,b){
  a=a.toLowerCase().trim();b=b.toLowerCase().trim();
  if(a===b)return 0;
  const m=a.length,n=b.length;if(!m)return n;if(!n)return m;
  let prev=Array.from({length:n+1},(_,j)=>j),cur=new Array(n+1);
  for(let i=1;i<=m;i++){cur[0]=i;
    for(let j=1;j<=n;j++){cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));}
    [prev,cur]=[cur,prev];
  }
  return prev[n];
}

/* ---------------- measurement units (indicative values) ---------------- */
const MARLA_M2=25.2929, KANAL_M2=MARLA_M2*20, ACRE_M2=MARLA_M2*160, BIGHA_M2=2529.29, BISWA_M2=BIGHA_M2/20, SQFT_M2=0.09290304;
const KATHA_M2=66.8903,CHATAK_M2=4.181,GUNTA_M2=101.171,CENT_M2=40.4686,ROpani_M2=508.737,AANA_M2=31.796,DHUR_M2=16.9297,ARE_M2=100;
const UNIT_M2={'marla':MARLA_M2,'मरला':MARLA_M2,'मरले':MARLA_M2,'ਮਰਲਾ':MARLA_M2,
'kanal':KANAL_M2,'kanaal':KANAL_M2,'कनाल':KANAL_M2,'ਕਨਾਲ':KANAL_M2,
'killa':ACRE_M2,'ਕਿੱਲਾ':ACRE_M2,'ਕਿਲਾ':ACRE_M2,
'acre':ACRE_M2,'acres':ACRE_M2,'एकड़':ACRE_M2,'एकर':ACRE_M2,'ਏਕੜ':ACRE_M2,'একর':ACRE_M2,'એકર':ACRE_M2,'ಎಕರೆ':ACRE_M2,'ఎకరం':ACRE_M2,'ఎకరా':ACRE_M2,'ஏக்கர்':ACRE_M2,'ഏക്കർ':ACRE_M2,'ଏକର':ACRE_M2,
'bigha':BIGHA_M2,'बीघा':BIGHA_M2,'বিঘা':BIGHA_M2,'ਬੀਘਾ':BIGHA_M2,'વીઘા':BIGHA_M2,
'biswa':BISWA_M2,'बिस्वा':BISWA_M2,
'katha':KATHA_M2,'कट्ठा':KATHA_M2,'कठ्ठा':KATHA_M2,'কাঠা':KATHA_M2,
'chatak':CHATAK_M2,'ছটাক':CHATAK_M2,
'guntha':GUNTA_M2,'गुंठा':GUNTA_M2,'ગુંઠા':GUNTA_M2,'gunta':GUNTA_M2,'गुंटा':GUNTA_M2,'గుంటా':GUNTA_M2,'ಗುಂಟೆ':GUNTA_M2,
'cent':CENT_M2,'सेंट':CENT_M2,'சென்ட்':CENT_M2,'സെന്റ്':CENT_M2,
'are':ARE_M2,'आर':ARE_M2,
'ropani':ROpani_M2,'रोपनी':ROpani_M2,'aana':AANA_M2,'आना':AANA_M2,'dhur':DHUR_M2,'धुर':DHUR_M2,
'decimal':CENT_M2,'दशमांश':CENT_M2,'ଦଶମାଂଶ':CENT_M2,
'hectare':10000,'हेक्टेयर':10000,'हेक्टर':10000,'হেক্টর':10000,
'sqft':SQFT_M2,'sq.ft':SQFT_M2,
'sq m':1,'sq.m':1,'sqm':1,'m2':1,'वर्ग मीटर':1,'वर्ग मि':1,'ਵਰਗ ਮੀਟਰ':1,'ચોરસ મીટર':1,'ચો.મી':1,'বর্গ মিটার':1,'சதுர மீட்டர்':1,'ச.மீ':1,'చదరపు మీటర్లు':1,'చ.మీ':1,'ಚದರ ಮೀಟರ್':1,'ಚ.ಮೀ':1,'ചതുരശ്ര മീറ്റർ':1,'ച.മീ':1,'ବର୍ଗ ମିଟର':1,'مربع میٹر':1};
let __UNRE=null,__UNRE_I=null;
function __unitAlt(){return Object.keys(UNIT_M2).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.+*?^${}()|[\]\\]/g,'\\$&')).join('|');}
function unitRegex(){if(!__UNRE)__UNRE=new RegExp('(\\d+(?:\\.\\d+)?)\\s*('+__unitAlt()+')','g');return __UNRE;}
function unitRegexCI(){if(!__UNRE_I)__UNRE_I=new RegExp('(\\d+(?:\\.\\d+)?)\\s*('+__unitAlt()+')','gi');return __UNRE_I;}
const DIGRANGES=[[0x0966,0x096f],[0x0a66,0x0a6f],[0x0ae6,0x0aef],[0x0b66,0x0b6f],[0x0be6,0x0bef],[0x0c66,0x0c6f],[0x0ce6,0x0cef],[0x0d66,0x0d6f],[0x06f0,0x06f9],[0x0660,0x0669]];
function normalizeDigits(s){if(s==null)return s;return String(s).replace(/[\u0966-\u096F\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u06F0-\u06F9\u0660-\u0669]/g,ch=>{const cp=ch.codePointAt(0);for(let i=0;i<DIGRANGES.length;i++){if(cp>=DIGRANGES[i][0]&&cp<=DIGRANGES[i][1])return String(cp-DIGRANGES[i][0]);}return ch;});}
const UNIT_FAMS=[['M',['hectare','हेक्टेयर','हेक्टर','are','आर','वर्ग मीटर','वर्ग मि','sq m','sq.m','sqm','m2','ਵਰਗ ਮੀਟਰ','ચોરસ મીટર','ચો.મી','বর্গ মিটার','சதுர மீட்டர்','ச.மீ','చదరపు మీటర్లు','చ.మీ','ಚದರ ಮೀಟರ್','ಚ.ಮೀ','ചതുരശ്ര മീറ്റർ','ച.മീ','ବର୍ଗ ମିଟର','مربع میٹر']],['I',['acre','acres','एकड़','एकर','ਏਕੜ','একর','એકર','ಎಕರೆ','ఎకరం','ఎకరా','ஏக்கர்','ഏക്കർ','ଏକର','kanal','kanals','kanaal','कनाल','ਕਨਾਲ','marla','marlas','मरला','मरले','ਮਰਲਾ','killa','ਕਿੱਲਾ','ਕਿਲਾ']],['B',['bigha','बीघा','বিঘা','ਬੀਘਾ','વીઘા','biswa','बिस्वा']],['K',['katha','कट्ठा','कठ्ठा','কাঠা','chatak','ছটাক']],['G',['guntha','gunta','गुंठा','गुंटा','ગુંઠા','గుంటా','ಗುಂಟೆ']],['C',['cent','सेंट','சென்ட்','സെന്റ്','decimal','दशमांश','ଦଶମାଂଶ']],['R',['ropani','रोपनी','aana','आना','dhur','धुर']]];
let __SYSOF=null;
function sysOf(u){if(!__SYSOF){__SYSOF={};UNIT_FAMS.forEach(f=>f[1].forEach(k=>__SYSOF[k]=f[0]));}return __SYSOF[u];}
function areaMatches(str){
  const out=[];const re=unitRegexCI();let m;
  while((m=re.exec(str))){
    if(/^0\d+$/.test(m[1]))continue; // leading-zero integer = truncated decimal (OCR ate the '2' of '2.02')
    let u=m[2];const ul=u.toLowerCase(),un=u.replace(/\s+/g,' ');
    if(UNIT_M2[u]===undefined)u=(UNIT_M2[ul]!==undefined?ul:(UNIT_M2[un]!==undefined?un:ul));
    if(UNIT_M2[u]!==undefined)out.push({raw:m[0].replace(/\s+/g,' ').trim(),num:parseFloat(m[1]),unit:u});
  }
  return out;
}
function parseArea(str){
  if(str==null)return null;str=normalizeDigits(String(str).toLowerCase().replace(/,/g,''));
  const ms=areaMatches(str);
  if(!ms.length)return null;
  const fam=sysOf(ms[0].unit);
  let tot=0,used=false;
  ms.forEach(x=>{if(sysOf(x.unit)===fam){tot+=x.num*UNIT_M2[x.unit];used=true;}});
  return used?tot:null;
}
const m2ToAcreKanal=v=>{const marla=v/MARLA_M2;const acres=Math.floor(marla/160);const kanal=Math.floor((marla-acres*160)/20);const ml=Math.round(marla-acres*160-kanal*20);return (acres?acres+' A ':'')+(kanal?kanal+' K ':'')+(ml||(!acres&&!kanal)?ml+' M':'');};

/* ---------------- ULPIN (Bhu-Aadhaar-style) ---------------- */
function luhnDigit(digs){let s=0,dbl=true;for(let i=digs.length-1;i>=0;i--){let d=+digs[i];if(dbl){d*=2;if(d>9)d-=9;}s+=d;dbl=!dbl;}return String((10-(s%10))%10);}
function genULPIN(st,dist,teh,vill,parcelSeq){
  const p3=String(parcelSeq).padStart(3,'0').slice(-3);
  const body=st+dist+teh+vill+p3; // 13 digits
  return body+luhnDigit(body);    // 14 digits
}
function ulpinGroups(u){return u.slice(0,2)+'-'+u.slice(2,4)+'-'+u.slice(4,6)+'-'+u.slice(6,10)+'-'+u.slice(10,13)+'-'+u.slice(13);}
function ulpinValid(u){return /^\d{14}$/.test(u)&&luhnDigit(u.slice(0,13))===u[13];}

/* ---------------- Hindi location canonicalization ---------------- */
const HINDI_LOC={'सहारनपुर':'Saharanpur','अंबाला':'Ambala','पंचकुला':'Panchkula','कुरुक्षेत्र':'Kurukshetra','यमुनानगर':'Yamunanagar','डेरा बासी':'Dera Bassi','मोरिंडा':'Morinda','राजपुरा':'Rajpura','थियोग':'Theog','जगाधरी':'Jagadhari','थानेसर':'Thanesar','नरायणगढ़':'Naraingarh','बराड़ा':'Barara','देवबंद':'Deoband','रायपुर रानी':'Raipur Rani','खानपुर':'Khanpur','सलाना':'Salana','फतेहगढ़':'Fatehgarh','थानेदार':'Thanedar','उभा':'Ubha','कीरमच':'Kirmach','शाहजादपुर':'Shahzadpur','मुस्तफाबाद':'Mustafabad','नया नंगल':'Naya Nangal','छुटमलपुर':'Chhutmalpur','बड़ौत':'Baraut','बागपत':'Bagpat','सिठौली':'Sitholi'};
const locCanonical=v=>(v!=null&&HINDI_LOC[String(v).trim()])?HINDI_LOC[String(v).trim()]:v;
const locEq=(a,b)=>String(a||'').trim()===String(b||'').trim()||locCanonical(a)===locCanonical(b);

module.exports={lev,MARLA_M2,KANAL_M2,ACRE_M2,BIGHA_M2,UNIT_M2,normalizeDigits,sysOf,areaMatches,parseArea,m2ToAcreKanal,luhnDigit,genULPIN,ulpinGroups,ulpinValid,HINDI_LOC,locCanonical,locEq};
