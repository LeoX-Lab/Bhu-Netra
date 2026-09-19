/* Field mapper: OCR text -> structured record fields.
 * Ported from the prototype with two changes:
 *  1. fields object is injected (no browser state coupling)
 *  2. landClass (land classification) field added per PS 26018 requirements
 * Everything else is byte-for-byte the original logic. */
const { normalizeDigits, areaMatches, sysOf, parseArea } = require('./units');

const FIELD_SCHEMA=[
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

const LOCS={
 khasra:'khasra|khasara|survey no|survey number|servey|खसरा|सर्वे नंबर|गाट|कित्ता|दाग|ਖਸਰਾ|ખસરા|দাগ|ଦାଗ|சர்வே|సర్వే|ಸಮೀಕ್ಷೆ|کھسرہ',
 khewat:'khewat|खाता|खेवट|ਖੇਵਟ|کھیوٹ|खाते',
 khatuni:'khatauni|khatouni|khatuni|खतौनी|ਖਤੌਨੀ|کھاتونی|খতিয়ান',
 village:'village|gram|mauja|মৌজা|मौजा|ग्राम|गाँव|गांव|गाव|ਪਿੰਡ|ગામ|கிராமம்|గ్రామం|ಹಳ್ಳಿ|ഗ്രാമം|गाउँ|موضع',
 district:'district|जनपद|जिला|ज़िला|जिल्हा|ਜ਼ਿਲ੍ਹਾ|ਜਿਲ੍ਹਾ|જિલ્લો|জেলা|மாவட்டம்|జిల్లా|ಜಿಲ್ಲೆ|ജില്ല|ଜିଲ୍ଲା|ضلع',
 tehsil:'tehsil|tahsil|taluk|taluka|mandal|तहसील|तालुका|ਤਹਿਸੀਲ|તાલુકો|তহসিল|வட்டம்|మండలం|తాలూకా|ತಾಲೂಕು|താലൂക്ക്|ତହସିଲ|تحصیل',
 owner:'owner|holder|vendee|khatedar|खातेदार|रायत|स्वामी|मालिक|मालक|ਮਾਲਕ|માલિક|মালিক|জমির মালিক|உரிமையாளர்|భూస్వామి|పట్టాదారు|ಭೂ ಒಡೆಯ|ഉടമസ്ഥൻ|ଧାରକ|जग्गा धनी|مالکان|مالک',
 father:'father|पिता|ਪਿਤਾ|પિતા|পিতা|தந்தை|తండ్రి|ತಂದೆ|പിതാവ്|ପିତା|والد',
 seller:'vendor|seller|विक्रेता|ਵਿਕਰੇਤਾ|বিক্রেতা|விற்பவர்|విక్రేత|ಮಾರಾಟಗಾರ|വിറ്റവർ|ବିକ୍ରେତା|بائع',
 mutation:'mutation|दाखिल खारिज|दाखिल|दाखल खारज|फेरफार|দাখিল|ਦਾਖਲ|દાખલ ખારજ|பட்டா மாற்றம்|పట్టా మార్పు|ಪಟ್ಟಾ ಪರಿವರ್ತನೆ|പേര് മാറ്റം|नामसारी|داخل',
 consideration:'(?:rs|inr|consideration)|मूल्य|ਮੁੱਲ|মূল্য|தொகை|మొత్తం|ಮೊತ್ತ|തുക',
 sqm:'(?:sq\\.?\\s*m|sqm)|वर्ग मीटर|वर्ग मि|ਵਰਗ ਮੀਟਰ|ચોરસ મીટર|ચો\\.?મી|বর্গ মিটার|சதுர மீட்டர்|ச\\.?மீ|చదరపు మీటర్లు|చ\\.?మీ|ಚದರ ಮೀಟರ್|ಚ\\.?ಮೀ|ചതുരശ്ര മീറ്റർ|ച\\.?മീ|ବର୍ଗ ମିଟର|مربع میٹر',
 landClass:'land classification|land class|land use|भूमि प्रकृति|भूमि प्रकार|जमीन का प्रकार|ज़मीन का प्रकार|भू-उपयोग|भूमि का उपयोग|लैंड क्लास',
 lat:'lat(?:itude)?|अक्षांश', lng:'long(?:itude)?|देशांतर'};

const HINDI_STATE={'उत्तर प्रदेश':'Uttar Pradesh','हरियाणा':'Haryana','पंजाब':'Punjab','राजस्थान':'Rajasthan','मध्य प्रदेश':'Madhya Pradesh','बिहार':'Bihar','उत्तराखंड':'Uttarakhand','उत्तराखण्ड':'Uttarakhand','हिमाचल प्रदेश':'Himachal Pradesh','छत्तीसगढ़':'Chhattisgarh','झारखंड':'Jharkhand','झारखण्ड':'Jharkhand','दिल्ली':'Delhi (NCT)','जम्मू और कश्मीर':'Jammu and Kashmir','आंध्र प्रदेश':'Andhra Pradesh','तेलंगाना':'Telangana','कर्नाटक':'Karnataka','केरल':'Kerala','तमिलनाडु':'Tamil Nadu','महाराष्ट्र':'Maharashtra','गुजरात':'Gujarat','ओडिशा':'Odisha','पश्चिम बंगाल':'West Bengal','असम':'Assam','मणिपुर':'Manipur','मेघालय':'Meghalaya','मिज़ोरम':'Mizoram','नागालैंड':'Nagaland','त्रिपुरा':'Tripura','गोवा':'Goa','सिक्किम':'Sikkim','चंडीगढ़':'Chandigarh','लद्दाख':'Ladakh'};

const NAME_STOP='(?:\\s+[sdw]\\/o\\s+|\\s+(?:पिता|पुत्र|पुत्री|पत्नी|ਪਿਤਾ|পিতা|தந்தை|తండ్రి|ತಂದೆ|പിതാവ്|ପିତା|s\\/o|d\\/o|w\\/o)(?=\\s|$))';

function emptyFields(){
  const f={};
  FIELD_SCHEMA.forEach(([k])=>f[k]={v:'',c:.5,edited:false,verified:false});
  return f;
}

function mapFieldsFromText(txt, fields){
  if(!fields) fields=emptyFields();
  if(!txt)return {fields, count:Object.keys(fields).filter(k=>fields[k].v).length};
  txt=normalizeDigits(String(txt));
  const CAP='([^\\n,;]{1,60})';
  const LOC_STOP=/^(?:ग्राम|गाँव|गांव|गाव|कोड|खाता|खसरा|खतौनी|खेवट|पटवारी|तहसील|जनपद|जिला|राज्य|निवास|हल्का|राजस्व|स्वामी|मालिक|खातेदार)$/;
  const cleanLoc=v=>{
    if(!v)return '';
    v=String(v).split(/[\(\[]/)[0].split('=')[0];
    const words=v.trim().split(/\s+/);const out=[];let sawIndic=false;
    for(const wd of words){
      const isIndic=/[\u0900-\u0D7F]/.test(wd);
      if(isIndic)sawIndic=true;
      if(LOC_STOP.test(wd)||/^(?:tehsil|tasil|tahsil|taluk|taluka|mandal|village|district|state|khewat|khatauni|khatuni|khasra|owner|holder|mutation|total|area|consideration|vendee|vendor|no|code|pin)?[.:]?$/i.test(wd))break;
      if(sawIndic&&/^[A-Za-z]{1,3}$/.test(wd))break;
      if(/^[|.*]+$/.test(wd))break;
      out.push(wd);
      if(out.join(' ').length>40)break;
    }
    return out.join(' ').replace(/[:.,;]+$/,'').trim();
  };
  const put=(k,v,c,extra)=>{if(v&&!(fields[k]&&fields[k].v))fields[k]=Object.assign({v:String(v),c:c||.85,edited:false,verified:false},extra||{});};
  const DIR_RE=/उत्तर|दक्षिण|पूर्व|पश्चिम|north|south|east|west|सीमा|boundary|शिवराम|सरकारी मार्ग/i;
  const LINES=txt.split('\n');
  let bndIdx=LINES.findIndex(l=>/सीमाओं|सीमा का|boundar/i.test(l));
  if(bndIdx<0)bndIdx=LINES.length;
  const isName=/[A-Za-z\u0900-\u0D7F]{2,}/;
  const scanLabel=(labels,opts)=>{
    opts=opts||{};let rx;
    try{rx=new RegExp('(?:'+labels+')(?:\\s*(?:का|की|के)\\s*)?(?:\\s*(?:no|no\\.|number|नाम|नं|नंबर|सं|संख्या|నం|ಸಂ|எண்))?\\s*[:\\-–]?\\s*'+CAP,'i');}catch(e){return '';}
    for(let li=0;li<LINES.length;li++){
      const ln=LINES[li];
      if(opts.skipDir&&(DIR_RE.test(ln)||li>=bndIdx))continue;
      const m=ln.match(rx);if(!m)continue;
      let v=m[1].trim().replace(/[:.,;]+$/,'').trim();
      if(opts.digit){
        const d=v.match(opts.dre||/\d{1,4}(?:\/\d{1,4}){0,2}/);if(!d)continue;v=d[0];
      }else{v=cleanLoc(v);}
      if(opts.nameLike){ if(!isName.test(v)||/विवरण|details|CHEER/i.test(v))continue; }
      if(v)return v;
    }
    return '';
  };
  const stM=txt.match(/(?:state|राज्य)\s*[:\-]?\s*([^\n,;]{2,40})/i);
  if(stM){const raw=stM[1].trim().replace(/[:.,;]+$/,'');
    const hit=Object.keys(HINDI_STATE).find(k=>raw.indexOf(k)>=0);
    if(hit)put('state',HINDI_STATE[hit],.88);else if(/^[A-Za-z ]+$/.test(raw))put('state',raw,.8);}
  put('district',scanLabel(LOCS.district),.84);
  put('tehsil',scanLabel(LOCS.tehsil),.83);
  put('village',scanLabel(LOCS.village),.84);
  put('khasra',scanLabel(LOCS.khasra,{digit:true,skipDir:true}),.86);
  put('khewat',scanLabel(LOCS.khewat,{digit:true,dre:/\d{1,4}/}),.78);
  put('khatuni',scanLabel(LOCS.khatuni,{digit:true,dre:/\d{1,4}/}),.78);
  let own=scanLabel(LOCS.owner,{nameLike:true});
  if(own)own=own.split(new RegExp(NAME_STOP,'i'))[0].replace(/\s+/g,' ').trim();
  put('owner',own,.86);
  put('father',scanLabel(LOCS.father,{nameLike:true}),.8);
  const so=txt.match(/[sdw]\/o\s+([A-Za-z .()]{3,40})/i);if(so)put('father',so[1].trim().replace(/[:.,;]+$/,''),.82);
  put('seller',scanLabel(LOCS.seller,{nameLike:true}).split(new RegExp(NAME_STOP,'i'))[0],.8);
  const dm=txt.match(/(\d{1,2})[-.\/](\d{1,2})[-.\/](\d{2,4})/);
  if(dm){let yr=dm[3];if(yr.length===2)yr=(+yr>30?'19':'20')+yr;put('docDate',yr+'-'+String(dm[2]).padStart(2,'0')+'-'+String(dm[1]).padStart(2,'0'),.84);}
  const low=txt.toLowerCase();
  let ms=[];try{ms=areaMatches(txt);}catch(e){}
  if(ms.length){const fam=sysOf(ms[0].unit);const famMs=ms.filter(x=>sysOf(x.unit)===fam).slice(0,3);put('areaStr',famMs.map(x=>x.raw).join(' '),.82);}
  put('mutationNo',scanLabel(LOCS.mutation,{digit:true,skipDir:true,dre:/\d{1,5}/}),.78);
  put('landClass',scanLabel(LOCS.landClass),.82);
  const cm=txt.match(/(?:rs\.?|₹|inr)\s*([\d.,]{3,})/i);if(cm)put('consideration',cm[1].replace(/[.,]$/,''),.84);
  const gm=low.match(new RegExp('(\\d[\\d.,]{1,9})\\s*(?:'+LOCS.sqm+')(?:eters?)?','i'));
  if(gm)put('areaSqM',gm[1].replace(/[.,]$/,''),.8);
  const dn=txt.match(/deed\s*(?:no|number)?\.?\s*[:\-]?\s*(\d{1,5}\s*\/\s*\d{2,4})/i);if(dn)put('deedNo',dn[1].replace(/\s+/g,''),.84);
  if(!(fields.areaSqM&&fields.areaSqM.v)&&(fields.areaStr&&fields.areaStr.v)){
    const computed=parseArea(fields.areaStr.v);
    if(computed)put('areaSqM',computed.toFixed(1),.8,{computed:true});
  }
  if(!(fields.docType&&fields.docType.v)){
    const DT=[[/बिक्री पत्र|deed of sale|sale deed|conveyance/i,'Registered Deed of Sale'],[/जमाबंदी|jamabandi/i,'Jamabandi (Record of Rights)'],[/फर्द|fard badar/i,'Fard (RoR extract)'],[/खतौनी|भू-?अभिलेख|khatauni/i,'Khatauni (RoR extract)'],[/7\s*\/\s*12|सात[\s-]*बारा|satbara/i,'Saat-Bara (7/12) extract'],[/पट्टा|chitta|பட்டா/i,'Patta / Chitta extract'],[/खतियान|khatian|khatiyan/i,'Khatian (RoR)'],[/दाखिल खारिज|mutation extract|intkal/i,'Mutation extract']];
    for(const pair of DT){if(pair[0].test(txt)){put('docType',pair[1],.9);break;}}
  }
  return {fields, count:Object.keys(fields).filter(k=>fields[k].v).length};
}

module.exports={FIELD_SCHEMA,LOCS,HINDI_STATE,NAME_STOP,mapFieldsFromText,emptyFields};
