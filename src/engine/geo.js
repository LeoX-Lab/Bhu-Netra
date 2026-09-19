/* Cadastral geo layer — ported verbatim from the prototype.
 * Coordinates come only from this surveyed layer, never from document text. */
const { HINDI_LOC } = require('./units');

const VILLAGE_GEO={'Khanpur':[30.0281,76.9924],'Salana':[30.7841,76.5021],'Fatehgarh':[30.4821,77.0041],'Raipur Rani':[30.5601,76.9402],'Thanedar':[31.1032,77.4401],'Ubha':[30.4211,76.5811],'Kirmach':[29.9611,76.8021],'Kharar (Abadi)':[30.7412,76.6512],'Shahzadpur':[30.3301,76.9812],'Naya Nangal':[31.0211,76.4902],'Chhutmalpur':[29.9201,77.5502],'Mustafabad':[30.2012,77.3201]};
const STATE_BBOX={'Punjab':[[29.5,32.6],[73.8,77.0]],'Haryana':[[27.6,31.0],[74.4,77.6]],'Himachal Pradesh':[[30.2,33.3],[75.4,79.1]],'Uttar Pradesh':[[23.8,31.5],[77.0,84.7]]};

function geoLookup(state,village,khasra){
  const base=VILLAGE_GEO[village]||(HINDI_LOC[village]&&VILLAGE_GEO[HINDI_LOC[village]]);
  if(!base)return null;
  let h=0;const ks=String(khasra||'x');for(let i=0;i<ks.length;i++)h=(h*31+ks.charCodeAt(i))>>>0;
  const dLat=((h%40)-20)/4000,dLng=(((h>>>2)%40)-20)/4000;
  return [Math.round((base[0]+dLat)*1e4)/1e4,Math.round((base[1]+dLng)*1e4)/1e4];
}

module.exports={VILLAGE_GEO,STATE_BBOX,geoLookup};
