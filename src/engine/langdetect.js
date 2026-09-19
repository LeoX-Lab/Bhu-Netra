/* Automatic OCR language detection — ported verbatim from the prototype. */
const LANG_DEFAULT='hin+eng';
const LANG_REGIONAL='ben+guj+pan+ori+tam+tel+kan+mal+eng';

function scriptProfile(txt){
  const t=String(txt||'');
  const count=re=>(t.match(re)||[]).length;
  const nonSpace=t.replace(/\s/g,'').length||1;
  const p={deva:count(/[\u0900-\u097F]/g),beng:count(/[\u0980-\u09FF]/g),guru:count(/[\u0A00-\u0A7F]/g),guj:count(/[\u0A80-\u0AFF]/g),ori:count(/[\u0B00-\u0B7F]/g),taml:count(/[\u0B80-\u0BFF]/g),telu:count(/[\u0C00-\u0C7F]/g),knda:count(/[\u0C80-\u0CFF]/g),mlym:count(/[\u0D00-\u0D7F]/g),latn:count(/[A-Za-z]/g)};
  p.devaRatio=p.deva/nonSpace;
  p.latnWords=(t.match(/[A-Za-z]{3,}/g)||[]).length;
  return p;
}

module.exports={LANG_DEFAULT,LANG_REGIONAL,scriptProfile};
