/* Synthetic reference registries consumed by validation rules R4/R5/R9.
 * Ported verbatim from the prototype. In production these come from the
 * state LRMS / e-Courts feeds via connectors. */
const { locEq } = require('./units');

const LITIGATION=[ // e-Courts-style lis pendens feed (demo)
 {state:'Uttar Pradesh',district:'Saharanpur',tehsil:'Deoband',village:'Chhutmalpur',khasra:'334',caseNo:'CS-212/2021',court:'Civil Judge (SD), Deoband',note:'Suit for specific performance - 2018 transfer under challenge; parcel frozen.'},
 {state:'Haryana',district:'Ambala',tehsil:'Ambala Cantt',village:'Bharouli',khasra:'99/1',caseNo:'RSA-45/2019',court:'P&H High Court',note:'Partition suit pending among co-sharers.'}
];
const MUTREG=[ // mutation (inteqal) register extracts (demo)
 {state:'Haryana',district:'Panchkula',tehsil:'Raipur Rani',village:'Raipur Rani',khasra:'78/2/1',chain:[
   {holder:'Dhani Ram s/o Hukam Singh',from:1972,how:'inheritance',mutNo:'882'},
   {holder:'Mahipal Singh s/o Dhani Ram',from:2019,how:'inheritance',mutNo:'3320'}]},
 {state:'Haryana',district:'Ambala',tehsil:'Naraingarh',village:'Fatehgarh',khasra:'156/2',chain:[
   {holder:'Balbir Singh s/o Kartar Singh',from:1988,how:'purchase',mutNo:'990'},
   {holder:'Krishan Kumar s/o Om Prakash',from:2020,how:'sale deed 7712',mutNo:'7712'}]}
];
const findMutReg=(st,di,te,vi,kh)=>MUTREG.find(r=>r.state===st&&locEq(r.district,di)&&locEq(r.tehsil,te)&&locEq(r.village,vi)&&r.khasra===kh);
const findLit=(st,di,vi,kh)=>LITIGATION.find(r=>r.state===st&&locEq(r.district,di)&&locEq(r.village,vi)&&r.khasra===kh);

module.exports={LITIGATION,MUTREG,findMutReg,findLit};
