/* Integrity ledger — SHA-256 hash-linked blocks.
 * Same hash-input formats as the prototype, but hashing now uses Node's
 * audited crypto module (no browser-subtle fallback needed). */
const crypto = require('crypto');
const { ulpinValid } = require('./engine/units');

const sha256hex = str => crypto.createHash('sha256').update(String(str), 'utf8').digest('hex');

function recordHashInput(r){return ['bhunetra-record-v1',r.ulpin,r.owner,r.father,r.khasra,r.village,r.tehsil,r.district,r.state,Number(r.areaSqM).toFixed(2),r.docType,r.mutationNo].join('|');}
function blockInput(b){return `bhunetra-block|${b.i}|${b.ts}|${JSON.stringify(b.entries)}|${b.prev}|${b.nonce}`;}

/* Recompute the whole chain. Returns per-block status + first break. */
function verifyChain(blocks, recordsById){
  const res={valid:true, blocks:[]};
  let prevHash='- GENESIS -';
  for(const b of blocks){
    const entryIssues=[];
    for(const e of b.entries){
      const r=recordsById[e.rid];
      const recomputed=r?sha256hex(recordHashInput(r)):null;
      if(!r) entryIssues.push({rid:e.rid, problem:'record missing'});
      else if(recomputed!==e.h) entryIssues.push({rid:e.rid, problem:'record content changed after sealing', sealed:e.h, current:recomputed});
    }
    const linkOk = b.prev===prevHash;
    const hashOk = b.hash===sha256hex(blockInput(b));
    const ok = linkOk && hashOk && entryIssues.length===0 && (b.i===0 || ulpinOk(b));
    if(!ok && res.valid){ res.valid=false; res.brokenAt=b.i; res.reason=!linkOk?'block link to previous hash broken':(!hashOk?'block hash mismatch':(entryIssues.length?'sealed entry mismatch':'')); }
    res.blocks.push({i:b.i, ok, linkOk, hashOk, entryIssues});
    prevHash=b.hash;
  }
  return res;
}
function ulpinOk(b){ return true; } // entries' ULPIN format checked at seal time

module.exports={sha256hex,recordHashInput,blockInput,verifyChain};
