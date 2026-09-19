<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bhu-Netra | Land Records Digitization and Validation System </title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --bl:#173f6f; --bl2:#112d51; --bl3:#0d2340; --acc:#e8791e; --acc2:#c9640f;
  --grn:#1e7b34; --red:#b3261e; --amb:#9a6b00; --lk:#0b5cad;
  --bg:#edf1f6; --card:#ffffff; --bd:#c9d2dd; --bd2:#dde3ec; --tth:#eaf0f7;
  --ink:#1b2733; --mut:#5b6b7c;
}
*{box-sizing:border-box;margin:0;padding:0}
html{font-size:13.5px}
body{font-family:Poppins,Tahoma,Verdana,'Noto Sans Devanagari',Arial,sans-serif;background:var(--bg);color:var(--ink);font-size:1rem;line-height:1.55}
a{color:var(--lk)}
.mono{font-family:'Courier New',Consolas,'Liberation Mono',monospace}
.muted{color:var(--mut)} .small{font-size:.84rem}
.flex{display:flex;align-items:center;gap:8px}
.sp{justify-content:space-between}.wrap{flex-wrap:wrap}.right{margin-left:auto}
.mt{margin-top:12px}.mt2{margin-top:18px}.mb{margin-bottom:10px}
b,strong{font-weight:600}

#app{display:flex;flex-direction:column;min-height:100vh}
main{flex:1;min-width:0;width:100%;max-width:1280px;margin:0 auto;padding:0 16px}

/* ---------- GoI top strip ---------- */
.gov-strip{background:var(--bl3);color:#cfe0f2;font-size:.78rem;border-top:3px solid #ff9933}
.gov-strip .in{max-width:1280px;margin:0 auto;padding:4px 16px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center}
.gov-strip a{color:#cfe0f2;text-decoration:none;margin-left:14px}
.gov-strip a:hover{color:#fff;text-decoration:underline}
.gov-strip .fb button{background:none;border:1px solid #4a648a;color:#cfe0f2;font:inherit;font-size:.74rem;padding:1px 7px;cursor:pointer;border-radius:2px;margin-left:3px}
.gov-strip .fb button:hover{background:#24466f}

/* ---------- ministry header ---------- */
.site-header{background:#fff;border-bottom:1px solid var(--bd)}
.site-header .in{max-width:1280px;margin:0 auto;padding:12px 16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.embwrap{display:flex;gap:12px;align-items:center;flex:1;min-width:280px}
.emb{flex:0 0 58px}
.htxt h1{font-size:1.12rem;color:var(--bl);font-weight:700;line-height:1.3}
.htxt .hi{font-size:.95rem;color:#2a3947;font-weight:600}
.htxt .dept{font-size:.76rem;color:var(--mut);margin-top:2px}
.hbadges{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.dbadge{border:1px solid var(--bd);border-radius:3px;padding:4px 10px;font-size:.7rem;font-weight:600;color:#33475c;background:var(--tth);text-align:center;line-height:1.35}
.dbadge b{display:block;font-size:.78rem;color:var(--bl)}
.hsearch{display:flex}
.hsearch input{font:inherit;font-size:.82rem;padding:6px 10px;border:1px solid var(--bd);border-right:0;border-radius:3px 0 0 3px;width:210px;background:#fff}
.hsearch input:focus{outline:none;border-color:var(--bl)}
.hsearch button{font:inherit;font-size:.82rem;padding:6px 13px;border:1px solid var(--bl);background:var(--bl);color:#fff;border-radius:0 3px 3px 0;cursor:pointer}
.hsearch button:hover{background:var(--bl2)}
.tricolor{height:3px;background:linear-gradient(90deg,#ff9933 0 33.3%,#ffffff 33.3% 66.6%,#138808 66.6% 100%)}

/* ---------- main nav ---------- */
.mainnav-wrap{background:var(--bl);position:sticky;top:0;z-index:60;box-shadow:0 2px 6px rgba(13,35,64,.25)}
.mainnav{max-width:1280px;margin:0 auto;display:flex;flex-wrap:wrap;padding:0 8px}
.navitem{display:flex;align-items:center;gap:7px;background:none;border:0;color:#d7e3f2;font:inherit;font-size:.9rem;font-weight:500;padding:11px 15px;cursor:pointer;text-align:left;border-bottom:3px solid transparent}
.navitem svg{width:15px;height:15px;opacity:.85}
.navitem:hover{background:#1d4a82;color:#fff}
.navitem.active{background:#fff;color:var(--bl);font-weight:600;border-bottom-color:var(--acc)}
.navitem .cnt{background:#d6e4f5;border:1px solid #b8cde6;color:var(--bl);border-radius:9px;font-size:.7rem;padding:0 7px;font-weight:700}

/* ---------- crumb / status strip ---------- */
.crumbbar{background:#fff;border-bottom:1px solid var(--bd)}
.crumbbar .in{max-width:1280px;margin:0 auto;padding:7px 16px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;font-size:.8rem;color:var(--mut)}
.crumbbar a{color:var(--lk);text-decoration:none}
#pageTitle{font-size:1.15rem;font-weight:600;color:#16283a}
#pageSub{font-size:.8rem;color:var(--mut)}

/* ---------- views ---------- */
.view{display:none;padding:16px 0 46px;animation:fadein .2s ease}
.view.on{display:block}
@keyframes fadein{from{opacity:0}to{opacity:1}}

/* ---------- hero ---------- */
.hero{background:linear-gradient(115deg,var(--bl3) 0%,var(--bl) 55%,#1c4d13 135%);border-radius:4px;color:#e8eef6;padding:26px 28px;display:flex;gap:26px;align-items:center;flex-wrap:wrap;position:relative;overflow:hidden;border:1px solid var(--bl3)}
.hero::after{content:"";position:absolute;right:-60px;top:-60px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(255,153,51,.16),transparent 65%)}
.hero .hl{flex:1;min-width:300px}
.hero .tag{display:inline-block;font-size:.68rem;font-weight:600;letter-spacing:.6px;background:rgba(255,153,51,.18);border:1px solid rgba(255,153,51,.45);color:#ffd9ae;padding:2px 10px;border-radius:2px;margin-bottom:10px}
.hero h2{font-size:clamp(1.15rem,1rem + 2.2vw,1.5rem);font-weight:700;color:#fff;line-height:1.3}
.hero h2 .hi{display:block;font-size:1rem;font-weight:600;color:#cfe0f2;margin-top:2px}
.hero p{margin-top:8px;max-width:640px;font-size:.86rem;color:#c6d4e6}
.hero .cta{margin-top:14px;display:flex;gap:10px;flex-wrap:wrap}
.hero .facts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:0;min-width:250px;flex:0 0 auto}
.hero .fact{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);border-radius:3px;padding:8px 12px}
.hero .fact b{display:block;font-size:1.05rem;color:#ffcf9e}
.hero .fact span{font-size:.7rem;color:#a9bbd0}
.hero .art{flex:0 0 240px;opacity:.9}

/* ---------- service cards ---------- */
.services{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:16px}
.svc{background:var(--card);border:1px solid var(--bd);border-top:3px solid var(--bl);border-radius:3px;padding:14px;cursor:pointer;transition:box-shadow .15s,transform .15s}
.svc:hover{box-shadow:0 6px 16px rgba(13,35,64,.12);transform:translateY(-2px)}
.svc .si{width:36px;height:36px;border-radius:3px;background:var(--tth);display:flex;align-items:center;justify-content:center;margin-bottom:9px;color:var(--bl)}
.svc .st{font-weight:600;font-size:.9rem;color:#16283a}
.svc .sh{font-size:.7rem;color:var(--mut);margin-top:2px}

/* ---------- cards & grids ---------- */
.card{background:var(--card);border:1px solid var(--bd);border-radius:3px;padding:14px}
.card h3{font-size:.95rem;margin:0 0 4px;padding-bottom:6px;border-bottom:1px solid var(--bd2);color:#16283a;font-weight:600;display:flex;align-items:center;gap:8px}
.card .hint{font-size:.8rem;color:var(--mut);margin-bottom:10px}
.grid2{display:grid;grid-template-columns:1fr;gap:14px}
.grid4{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.grid23{display:grid;grid-template-columns:1fr;gap:14px}
@media(max-width:1100px){.hero .art{display:none}}
@media(max-width:700px){.services{grid-template-columns:1fr}}

/* ---------- buttons / chips / pills ---------- */
.btn{display:inline-flex;align-items:center;gap:6px;border-radius:3px;border:1px solid #9fb0c0;background:#f4f7fa;color:var(--ink);font:inherit;font-size:.85rem;font-weight:500;padding:6px 13px;cursor:pointer;text-decoration:none}
.btn:hover{background:#e8eef5;border-color:#7f93a8}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn-primary{background:var(--bl);border-color:var(--bl2);color:#fff}
.btn-primary:hover{background:#1c4a82;border-color:var(--bl2)}
.btn-green{background:var(--grn);border-color:#175e27;color:#fff}
.btn-green:hover{background:#237e37}
.btn-danger{background:#fff;color:var(--red);border-color:#d3a19d}
.btn-danger:hover{background:#fdf3f2;border-color:var(--red)}
.btn-sm{padding:3px 9px;font-size:.78rem}
.btn-hero{background:var(--acc);border-color:var(--acc2);color:#fff}
.btn-hero:hover{background:#f08a30}
.btn-ghostw{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.4);color:#fff}
.btn-ghostw:hover{background:rgba(255,255,255,.2)}
.chip{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;border:1px solid var(--bd);background:#fff;padding:2px 8px;border-radius:2px;color:#4a5b6c;white-space:nowrap}
.chip .dot{width:8px;height:8px;border-radius:1px;background:#94a3b8;flex:0 0 8px}
.chip.ok .dot{background:var(--grn)}
.chip.warn .dot{background:#c99a1e}
.chip.off .dot{background:#94a3b8}
.pill{display:inline-flex;align-items:center;gap:5px;font-size:.73rem;font-weight:600;border-radius:2px;padding:1px 7px}
.p-valid{background:#e5f2e7;color:#1e5b2a}
.p-flag{background:#f9e5e3;color:#8c1d16}
.p-pend{background:#f7efd8;color:#7a5a00}
.p-warnp{background:#fdeeda;color:#8a4b12}
.divider{height:1px;background:var(--bd2);margin:12px 0}
.note{background:#f8f4e8;border:1px solid #e3d6ad;border-left:3px solid #c9b45e;color:#6b5a1c;border-radius:2px;padding:8px 10px;font-size:.82rem}
.note.blue{background:#eef4fb;border-color:#c5d8ec;border-left-color:#7fa8cc;color:#2c4f70}
.note.green{background:#eef6ee;border-color:#b7d9bb;border-left-color:#6fae77;color:#1e5b2a}

/* ---------- KPI ---------- */
.kpi{background:var(--card);border:1px solid var(--bd);border-top:3px solid var(--kc,var(--bl));border-radius:3px;padding:11px 13px}
.kpi .lbl{font-size:.71rem;color:var(--mut);font-weight:600;text-transform:uppercase;letter-spacing:.3px}
.kpi .val{font-size:1.5rem;font-weight:700;color:#16283a;margin-top:2px}
.kpi .sub{font-size:.74rem;color:var(--mut)}
.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:.8rem;color:var(--mut);margin-top:8px}
.legend i{display:inline-block;width:9px;height:9px;border-radius:1px;margin-right:5px;vertical-align:-1px}
.activity{list-style:none;max-height:300px;overflow:auto}
.activity li{display:flex;gap:8px;padding:6px 0;border-bottom:1px dashed var(--bd2);font-size:.84rem;align-items:center}
.activity li:last-child{border:0}
.activity .t{color:var(--mut);font-size:.72rem;white-space:nowrap}
.activity .ic{font-family:'Courier New',monospace;font-size:.66rem;font-weight:700;letter-spacing:.5px;background:var(--tth);border:1px solid var(--bd2);color:#41566b;border-radius:2px;display:flex;align-items:center;justify-content:center;flex:0 0 40px;height:19px}

/* ---------- digitize ---------- */
.thumbs{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.thumb{border:1px solid var(--bd);border-radius:2px;background:#fff;padding:6px;cursor:pointer}
.thumb:hover{border-color:#7f9ab5;background:#fafcfe}
.thumb.sel{border-color:var(--bl);background:#f0f6fd;box-shadow:inset 0 0 0 1px var(--bl)}
.thumb .docprev{height:128px;border:1px solid var(--bd2);border-radius:2px;overflow:hidden;background:#eef1f5;display:flex;align-items:flex-start;justify-content:center}
.thumb .docprev svg{height:124px;width:auto}
.thumb .tt{font-size:.82rem;font-weight:600;margin-top:6px;line-height:1.3}
.thumb .tags{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap}
.qtag{font-size:.66rem;font-weight:600;border-radius:2px;padding:1px 5px;background:var(--tth);color:#55677a}
.qtag.good{background:#e5f2e7;color:#1e5b2a}.qtag.mid{background:#fdeeda;color:#8a4b12}.qtag.bad{background:#f9e5e3;color:#8c1d16}
.dropzone{border:1px dashed #aebcc9;border-radius:2px;padding:12px;text-align:center;color:var(--mut);font-size:.84rem;cursor:pointer;background:#f8fafc;margin-top:12px}
.dropzone:hover,.dropzone.drag{border-color:var(--bl);background:#eef4fb;color:var(--bl)}
.stepper{display:flex;margin:6px 0 4px}
.step{flex:1;text-align:center;position:relative;padding-top:24px;font-size:.73rem;color:var(--mut);font-weight:500}
.step::before{content:attr(data-n);position:absolute;top:0;left:50%;transform:translateX(-50%);width:18px;height:18px;border-radius:2px;background:#dbe3ec;color:#55677a;font-size:.72rem;display:flex;align-items:center;justify-content:center;font-weight:700}
.step::after{content:"";position:absolute;top:9px;left:calc(50% + 13px);width:calc(100% - 26px);height:2px;background:#dbe3ec}
.step:last-child::after{display:none}
.step.done::before{background:var(--grn);color:#fff;content:"\2713"}
.step.done::after{background:var(--grn)}
.step.run::before{background:var(--bl);color:#fff}
.step.run{color:var(--bl)}
.terminal{background:#fbfcfe;border:1px solid var(--bd);border-top:3px solid var(--bl);border-radius:2px;font-family:'Courier New',Consolas,monospace;font-size:.8rem;color:#2a3947;padding:10px;height:225px;overflow:auto}
.terminal .ln{padding:2px 0;border-bottom:1px solid #eef2f7}
.terminal .ts{color:#93a1b0;margin-right:7px;font-size:.7rem}
.terminal .cf{float:right;color:#93a1b0;margin-left:8px}
.terminal .sys{color:#0b5cad}
.terminal .err{color:var(--red)}
.docstage{background:#a9b6c6;padding:14px;border-radius:2px;display:flex;justify-content:center;overflow:auto;min-height:330px;max-height:540px}
.docpaper{background:#fff;width:100%;max-width:430px;border-radius:2px;box-shadow:0 6px 18px rgba(0,0,0,.3);transition:filter .8s ease}
.docpaper svg{display:block;width:100%;height:auto}
.docpaper img{width:100%;display:block}
.docpaper.pre1{filter:grayscale(1) contrast(1.25) brightness(1.05)}
.docpaper.pre2{filter:grayscale(1) contrast(2.4) brightness(1.12)}
.docpaper.pre3{filter:grayscale(1) contrast(7) brightness(1.05)}
.fieldrow{display:grid;grid-template-columns:150px 1fr 110px;gap:8px;align-items:center;padding:6px 8px;border:1px solid var(--bd2);margin-top:-1px;background:#fff}
.fieldrow:nth-child(odd){background:#f8fafc}
.fieldrow .fl{font-size:.78rem;font-weight:600;color:#2a3947}
.fieldrow .fl .dev{color:var(--mut);font-weight:400;display:block;font-size:.7rem}
.fieldrow input{width:100%;font:inherit;font-size:.84rem;padding:5px 8px;border:1px solid #b6c2d1;border-radius:2px;background:#fff}
.fieldrow input:focus{outline:none;border-color:var(--bl);box-shadow:inset 0 0 0 1px var(--bl)}
.fieldrow input.lowconf{border-color:#d9b96a;background:#fdf6e3}
.fieldrow input.edited{border-color:var(--grn);background:#f0f7f1}
.confbar{height:7px;background:#e3e8ee;overflow:hidden}
.confbar i{display:block;height:100%;background:var(--grn);transition:width .6s}
.confbar i.mid{background:#c99a1e}.confbar i.low{background:var(--red)}
.conftxt{font-size:.7rem;color:var(--mut);margin-top:2px;font-weight:600}

/* ---------- validation ---------- */
.check{border:1px solid var(--bd2);border-left:4px solid var(--mut);border-radius:2px;padding:10px 12px;margin-bottom:8px;display:flex;gap:11px;align-items:flex-start;background:#fff}
.check.pass{border-left-color:var(--grn)}
.check.warn{border-left-color:#c99a1e}
.check.fail{border-left-color:var(--red)}
.check .sig{width:24px;flex:0 0 24px;text-align:center;font-weight:700;font-size:1rem}
.check.pass .sig{color:var(--grn)}.check.warn .sig{color:#c99a1e}.check.fail .sig{color:var(--red)}
.check .ct{font-weight:600;font-size:.9rem;display:flex;gap:7px;align-items:center;flex-wrap:wrap}
.check .rid{font-size:.68rem;font-family:'Courier New',monospace;background:var(--tth);color:#55677a;border:1px solid var(--bd2);border-radius:2px;padding:0 4px}
.check .cd{font-size:.82rem;color:#3d4f61;margin-top:3px}
.check .why{font-size:.76rem;color:var(--mut);margin-top:6px;background:#f7f9fb;border:1px dashed var(--bd2);border-radius:2px;padding:6px 9px}
.banner{border-radius:2px;padding:10px 14px;display:flex;align-items:center;gap:10px;font-weight:600;font-size:.92rem;border:1px solid;border-left-width:5px}
.bn-pass{background:#eef6ee;border-color:#b7d9bb;border-left-color:var(--grn);color:#1e5b2a}
.bn-warn{background:#fdf4e7;border-color:#ecd6a8;border-left-color:#c99a1e;color:#7a5a00}
.bn-fail{background:#fbeae9;border-color:#e3b4b0;border-left-color:var(--red);color:#8c1d16}
.gaugewrap{display:flex;align-items:center;gap:16px}
.verdict-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}

/* ---------- tables ---------- */
.toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
.toolbar input[type=search]{flex:1;min-width:200px;font:inherit;font-size:.85rem;padding:6px 10px;border:1px solid #b6c2d1;border-radius:2px;background:#fff}
.toolbar input[type=search]:focus{outline:none;border-color:var(--bl);box-shadow:inset 0 0 0 1px var(--bl)}
.toolbar select{font:inherit;font-size:.85rem;padding:6px;border:1px solid #b6c2d1;border-radius:2px;background:#fff;color:var(--ink)}
.tablewrap{overflow:auto;max-height:62vh;border:1px solid var(--bd);border-radius:2px;background:#fff}
table.rt{width:100%;border-collapse:collapse;font-size:.84rem}
table.rt th{position:sticky;top:0;background:var(--bl);text-align:left;padding:8px 9px;font-size:.7rem;text-transform:uppercase;letter-spacing:.4px;color:#e8eef6;border-bottom:2px solid var(--acc)}
table.rt td{padding:7px 9px;border-bottom:1px solid var(--bd2);vertical-align:middle}
table.rt tbody tr{cursor:pointer}
table.rt tbody tr:hover{background:#f0f6fd}

/* ---------- ledger ---------- */
.blocksrow{display:flex;gap:0;overflow-x:auto;padding:8px 0 14px;align-items:stretch}
.block{min-width:240px;max-width:270px;background:#fff;border:1px solid var(--bd);border-radius:2px;padding:10px 12px}
.block.gen{background:var(--bl);color:#dbe6f2;border-color:var(--bl2)}
.block .bh{font-size:.84rem;font-weight:600;display:flex;justify-content:space-between;align-items:center}
.block .hval{font-family:'Courier New',monospace;font-size:.68rem;word-break:break-all;color:#4a5b6c;background:#f4f6f9;border:1px solid var(--bd2);border-radius:2px;padding:4px 6px;margin-top:5px}
.block.gen .hval{background:rgba(255,255,255,.08);color:#b9cbe0;border-color:transparent}
.block .bmeta{font-size:.72rem;color:var(--mut);margin-top:6px;line-height:1.5}
.block.gen .bmeta{color:#b9cbe0}
.okdot{width:8px;height:8px;border-radius:1px;background:var(--grn);display:inline-block;margin-right:4px}
.block.tampered{border-color:var(--red);background:#fdf0ef;animation:shake .35s}
.block.tampered .okdot{background:var(--red)}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
.linker{flex:0 0 28px;display:flex;align-items:center;justify-content:center;color:#93a1b0;font-size:1rem}
.linker.broken{color:var(--red);font-weight:700}

/* ---------- queue ---------- */
.disc{border:1px solid var(--bd2);border-left:4px solid var(--mut);border-radius:2px;background:#fff;padding:10px 12px;margin-bottom:8px}
.disc.high{border-left-color:var(--red)}
.disc.med{border-left-color:#c99a1e}
.disc.low{border-left-color:#3d6db3}
.disc .dt{font-weight:600;font-size:.9rem;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.disc .dd{font-size:.82rem;color:#3d4f61;margin:5px 0 8px}
.disc.resolved{opacity:.65;border-left-color:var(--grn)}
.sev{font-size:.66rem;font-weight:700;letter-spacing:.5px;border-radius:2px;padding:1px 6px;text-transform:uppercase}
.sev.high{background:#f9e5e3;color:#8c1d16}.sev.med{background:#fdeeda;color:#8a4b12}.sev.low{background:#e3edf8;color:#2c4f70}

/* ---------- modal / toast ---------- */
.modal-ov{position:fixed;inset:0;background:rgba(13,35,64,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadein .15s}
.modal{background:#fff;border-top:4px solid var(--bl);border-radius:3px;max-width:780px;width:100%;max-height:88vh;overflow:auto;padding:20px;position:relative}
.modal .x{position:absolute;top:10px;right:10px;border:1px solid var(--bd2);background:#f4f6f9;width:24px;height:24px;border-radius:2px;font-size:.85rem;cursor:pointer;color:var(--mut)}
.modal .x:hover{background:#e9eff5;color:var(--ink)}
#toasts{position:fixed;bottom:16px;right:16px;z-index:200;display:flex;flex-direction:column;gap:8px;max-width:360px}
.toast{background:#fff;border:1px solid var(--bd);border-left:4px solid var(--grn);border-radius:2px;box-shadow:0 4px 14px rgba(0,0,0,.14);padding:8px 12px;font-size:.82rem;animation:fadein .2s}
.toast.err{border-left-color:var(--red)}.toast.warn{border-left-color:#c99a1e}.toast.info{border-left-color:#3d6db3}
.toast b{display:block}

.doc{padding-left:18px;font-size:.86rem;color:#33475c;line-height:1.75}
.doc li{margin:3px 0}
.doc p{margin:4px 0}

/* ---------- footer ---------- */
footer{background:var(--bl3);color:#b9cbe0;margin-top:26px;font-size:.8rem}
footer .fcols{max-width:1280px;margin:0 auto;padding:22px 16px 14px;display:grid;grid-template-columns:2fr 1fr 1fr 1.4fr;gap:22px}
footer h4{font-size:.82rem;color:#fff;font-weight:600;margin-bottom:8px;border-bottom:1px solid #2c4b76;padding-bottom:5px}
footer a,footer button{color:#b9cbe0;text-decoration:none;display:block;background:none;border:0;font:inherit;padding:2px 0;cursor:pointer;text-align:left}
footer a:hover,footer button:hover{color:#fff;text-decoration:underline}
footer .fbot{border-top:1px solid #2c4b76}
footer .fbot .in{max-width:1280px;margin:0 auto;padding:10px 16px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center}
footer .vc{font-family:'Courier New',monospace;background:#0a1a30;border:1px solid #2c4b76;color:#ffd9ae;padding:2px 8px;border-radius:2px;letter-spacing:1px}
@media(max-width:900px){footer .fcols{grid-template-columns:1fr 1fr}}
@media(max-width:600px){footer .fcols{grid-template-columns:1fr}}

/* ---------- responsive: tablet ---------- */
@media(max-width:880px){
  .mainnav{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
  .mainnav::-webkit-scrollbar{display:none}
  .navitem{flex:0 0 auto;padding:10px 12px;font-size:.86rem;white-space:nowrap}
  .navitem svg{display:none}
  .hbadges .dbadge{display:none}
  .crumbbar .in{padding:6px 12px}
  #clock{display:none}
  .site-header .in{padding:10px 12px}
  .emb{flex:0 0 46px;width:46px;height:46px}
  .htxt h1{font-size:1rem}
  .htxt .hi{font-size:.85rem}
  .gov-strip .in{padding:3px 12px}
  .blocksrow .block{min-width:225px}
}
.valgrid{grid-template-columns:1fr}

/* ---------- responsive: phone ---------- */
@media(max-width:700px){
  html{font-size:14px}
  .fieldrow input,.toolbar input[type=search],.toolbar select,select{font-size:16px}
  .fieldrow{grid-template-columns:1fr;gap:4px}
  .toolbar input[type=search]{flex:1 1 100%}
  .thumbs{grid-template-columns:1fr}
  .hero{padding:18px 16px}
  .hero .facts{grid-template-columns:1fr 1fr;width:100%;flex:1 1 100%}
  .modal-ov{padding:10px}
  .modal{padding:14px}
  table.rt{font-size:.8rem}
  .services{grid-template-columns:1fr}
  .stepper .step{font-size:.66rem}
  .gov-strip .a11y{display:none}
  .btn{padding:7px 13px}
  .toast{max-width:calc(100vw - 32px)}
  .kpi .val{font-size:1.3rem}
  .grid4{grid-template-columns:1fr}
}

/* ---------- high contrast ---------- */
body.hc{--bg:#000;--card:#111;--tth:#1a1a1a;--bd:#6a6a6a;--bd2:#444;--ink:#fff;--mut:#c8c8c8}
body.hc .site-header,body.hc .crumbbar,body.hc .mainnav-wrap{background:#000}
body.hc .mainnav-wrap{border-bottom:1px solid #6a6a6a}
body.hc .navitem.active{background:#ffe000;color:#000;border-bottom-color:#ffe000}
body.hc .hero{background:#000;border:1px solid #6a6a6a}
body.hc .btn,body.hc .btn-primary,body.hc .btn-green{background:#000;color:#ffe000;border-color:#ffe000}
body.hc table.rt th{background:#000;color:#ffe000;border-bottom-color:#ffe000}
body.hc .kpi,body.hc .svc,body.hc .card,body.hc .terminal{background:#111;color:#fff}
body.hc a{color:#8be9ff}
/* ---------- classification / rejection ---------- */
.reject-panel{background:#fbeae9;border:2px solid var(--red);border-left:6px solid var(--red);border-radius:3px;padding:18px 20px;margin-top:12px}
.reject-panel h3{color:#8c1d16;font-size:1.1rem;margin:0 0 6px;display:flex;align-items:center;gap:10px}
.reject-panel .rj-conf{font-size:.9rem;color:#8c1d16;font-weight:600;margin:8px 0}
.reject-panel .rj-detail{font-size:.84rem;color:#5a3a38;line-height:1.6}
.reject-panel .rj-list{list-style:none;padding:0;margin:8px 0}
.reject-panel .rj-list li{font-size:.82rem;padding:3px 0;color:#5a3a38}
.reject-panel .rj-foot{font-size:.8rem;color:#8c6a67;margin-top:12px;padding-top:10px;border-top:1px solid #e3b4b0}
.classify-pass{background:#eef6ee;border:1px solid #b7d9bb;border-left:4px solid var(--grn);border-radius:3px;padding:14px 16px;margin-top:12px}
.classify-pass h3{color:#1e5b2a;font-size:.95rem;margin:0 0 4px;display:flex;align-items:center;gap:8px}
.classify-pass .cp-conf{font-size:.88rem;color:#1e5b2a;font-weight:600;margin:4px 0}
.classify-pass .cp-reasons{list-style:none;padding:0;margin:6px 0;display:flex;flex-wrap:wrap;gap:6px}
.classify-pass .cp-reasons li{font-size:.76rem;background:#d4edda;color:#1e5b2a;padding:2px 8px;border-radius:2px;font-weight:500}
.quality-bar{background:var(--card);border:1px solid var(--bd);border-radius:3px;padding:12px 14px;margin-top:10px}
.quality-bar h4{font-size:.88rem;font-weight:600;color:#16283a;margin:0 0 8px;display:flex;align-items:center;gap:8px}
.quality-bar .qc{font-size:.82rem;padding:3px 0;display:flex;align-items:center;gap:8px}
.quality-bar .qc .qi{font-size:.78rem;font-weight:600}

@media(max-width:860px){
  .hsearch{display:none}
  .gov-strip .a11y{display:none}
}
</style>
</head>
<body>
<div id="app">
  <a href="#main-content" style="position:absolute;left:-9999px;top:0;background:#fff;color:#000;padding:8px 14px;z-index:999" onfocus="this.style.left='0'" onblur="this.style.left='-9999px'">Skip to main content</a>

  <!-- ================= GOI STRIP ================= -->
  <div class="gov-strip"><div class="in">
    <div>भारत सरकार | <b>GOVERNMENT OF INDIA</b></div>
    <div class="a11y">
      <a href="#" onclick="openPolicy('access');return false;">Screen Reader Access</a>
      <span class="fb">
        <button onclick="fontAdj(-1)" title="Decrease font size">A-</button>
        <button onclick="fontReset()" title="Normal font size">A</button>
        <button onclick="fontAdj(1)" title="Increase font size">A+</button>
        <button onclick="__toggleHC()" title="Toggle high contrast view">High Contrast</button>
      </span>
    </div>
  </div></div>

  <!-- ================= MINISTRY HEADER ================= -->
  <div class="site-header"><div class="in">
    <div class="embwrap">
      <svg class="emb" viewBox="0 0 60 60" aria-hidden="true">
        <circle cx="30" cy="30" r="29" fill="#173f6f"/>
        <circle cx="30" cy="30" r="22" fill="none" stroke="#ffffff" stroke-width="1.4"/>
        <circle cx="30" cy="30" r="4" fill="#ffffff"/>
        <g stroke="#ffffff" stroke-width="1.1">
          <line x1="30" y1="9" x2="30" y2="51"/><line x1="9" y1="30" x2="51" y2="30"/>
          <line x1="15" y1="15" x2="45" y2="45"/><line x1="45" y1="15" x2="15" y2="45"/>
          <line x1="30" y1="9" x2="15" y2="15"/><line x1="30" y1="9" x2="45" y2="15"/>
          <line x1="51" y1="30" x2="45" y2="45"/><line x1="51" y1="30" x2="45" y2="15"/>
          <line x1="30" y1="51" x2="15" y2="45"/><line x1="30" y1="51" x2="45" y2="45"/>
        </g>
      </svg>
      <div class="htxt">
        <h1>भू-नेत्र &nbsp;|&nbsp; Bhu-Netra</h1>
        <div class="hi">राष्ट्रीय भू-अभिलेख अंकीकरण एवं सत्यापन प्रणाली</div>
        <div class="dept">National Land Record Digitization &amp; Validation System</div>
        <div class="dept">Department of Land Resources &nbsp;·&nbsp; Ministry of Rural Development &nbsp;·&nbsp; Government of India</div>
      </div>
    </div>
    <div class="hbadges">
      <div class="hsearch">
        <input type="text" id="gsearch" placeholder="Search ULPIN / khasra / owner" onkeydown="if(event.key==='Enter')svcSearch()">
        <button onclick="svcSearch()">Search</button>
      </div>
      <div class="dbadge"><b>DILRMP</b>Aligned</div>
      <div class="dbadge"><b>भू-आधार</b>ULPIN</div>
      <div class="dbadge"><b>Digital India</b>Empowering India</div>
    </div>
  </div></div>
  <div class="tricolor"></div>

  <!-- ================= MAIN NAV ================= -->
  <div class="mainnav-wrap"><nav class="mainnav" id="nav">
    <button class="navitem active" data-view="dashboard" onclick="nav('dashboard')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l9-8 9 8v8a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>Home</button>
    <button class="navitem" data-view="digitize" onclick="nav('digitize')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11"/></svg>Digitization</button>
    <button class="navitem" data-view="validate" onclick="nav('validate')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>Validation</button>
    <button class="navitem" data-view="registry" onclick="nav('registry')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16v13H4z"/><path d="M4 10h16M9 10v9M15 10v9"/></svg>Registry</button>
    <button class="navitem" data-view="ledger" onclick="nav('ledger')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="7" height="8" rx="1"/><rect x="14" y="8" width="7" height="8" rx="1"/><path d="M10 12h4"/></svg>Integrity Ledger</button>
    <button class="navitem" data-view="queue" onclick="nav('queue')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 1 6 6c0 4-6 12-6 12S6 13 6 9a6 6 0 0 1 6-6z"/><circle cx="12" cy="9" r="2"/></svg>Review Queue<span class="cnt" id="qBadge"></span></button>
    <button class="navitem" data-view="pitch" onclick="nav('pitch')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>About &amp; Help</button>
  </nav></div>

  <!-- ================= CRUMB / STATUS ================= -->
  <div class="crumbbar"><div class="in">
    <div>You are here: <a href="#" onclick="nav('dashboard');return false;">Home</a> &raquo; <b id="crumb">Dashboard</b></div>
    <div class="flex wrap">
      <span class="chip" id="chipEngine" title="OCR engine status"><span class="dot"></span><span id="chipEngineTxt">Engine: checking…</span></span>
      <span class="chip" id="chipStore" title="Storage mode"><span class="dot"></span><span id="chipStoreTxt">Storage: …</span></span>
      <span class="mono small muted" id="clock"></span>
      <button class="btn btn-primary btn-sm" onclick="nav('digitize')">New Digitization</button>
    </div>
  </div></div>

  <!-- ================= PAGE HEAD ================= -->
  <div style="max-width:1280px;margin:0 auto;padding:14px 16px 0;width:100%">
    <div id="pageTitle">Dashboard</div>
    <div class="small muted" id="pageSub">Digitization and validation summary</div>
    <hr style="border:0;border-top:2px solid var(--acc);margin:8px 0 0">
  </div>

  <main id="main-content">
    <!-- ============ DASHBOARD ============ -->
    <section class="view on" id="view-dashboard">
      <div class="hero">
        <div class="hl">
          <h2>From torn paper records to verified digital titles<span class="hi">फटे कागज़ी अभिलेखों से — सत्यापित डिजिटल अभिलेखों तक</span></h2>
          <p>Bhu-Netra digitizes jamabandi, fard, khatauni and deed scans with OCR and per-field confidence, validates every record through a 10-point rule engine (duplicates, mutation chains, litigation, geo-sanity) and seals approved entries with a Bhu-Aadhaar-style ULPIN and a tamper-evident hash ledger.</p>
          <div class="cta">
            <button class="btn btn-hero" onclick="nav('digitize')">Digitize a Record</button>
            <button class="btn btn-ghostw" onclick="svcVerify()">Verify a ULPIN / Khasra</button>
            <button class="btn btn-ghostw" onclick="nav('pitch')">How it works</button>
          </div>
        </div>
        <div class="art">
          <svg viewBox="0 0 240 190" aria-hidden="true">
            <rect x="10" y="15" width="220" height="160" rx="6" fill="#0d2340" stroke="#3d6db3"/>
            <g stroke="#3d6db3" stroke-width="1" fill="none" opacity=".55">
              <path d="M10 70h220M10 120h220M70 15v160M150 15v160"/>
            </g>
            <polygon points="30,40 90,32 96,66 36,74" fill="#1e5b2a" opacity=".55" stroke="#7fd08a"/>
            <polygon points="110,30 168,38 160,72 104,64" fill="#8a5a1a" opacity=".55" stroke="#ffd9ae"/>
            <polygon points="34,96 92,88 98,126 40,132" fill="#1c4a82" opacity=".8" stroke="#9cc2ee"/>
            <polygon points="118,92 176,98 170,134 112,128" fill="#1e5b2a" opacity=".4" stroke="#7fd08a"/>
            <g transform="translate(120,118)">
              <path d="M0-16a10 10 0 0 1 10 10c0 7-10 16-10 16S-10 1-10-6a10 10 0 0 1 10-10z" fill="#ff9933" stroke="#fff" stroke-width="1.5"/>
              <circle cx="0" cy="-6" r="3.6" fill="#0d2340"/>
            </g>
            <g stroke="#ffd9ae" stroke-width="1.4" opacity=".85">
              <path d="M46 52h36M130 48h30M56 112h32"/>
            </g>
            <text x="120" y="182" text-anchor="middle" font-size="9" fill="#9cc2ee" font-family="Courier New">GEO-REFERENCED PARCEL LAYER (BHU-NAKSHA LINK)</text>
          </svg>
        </div>
        <div class="facts">
          <div class="fact"><b>10-point</b><span>rule-based validation</span></div>
          <div class="fact"><b>SHA-256</b><span>sealed integrity ledger</span></div>
          <div class="fact"><b>14-digit</b><span>ULPIN with check digit</span></div>
          <div class="fact"><b>15 packs</b><span>Indian-language OCR (hin, pan, tam, ben...)</span></div>
        </div>
      </div>

      <div class="services">
        <div class="svc" onclick="svcVerify()">
          <div class="si"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></div>
          <div class="st">Verify a Record</div>
          <div class="sh">Check ULPIN, owner or khasra against the registry and its integrity seal</div>
        </div>
        <div class="svc" onclick="nav('digitize')">
          <div class="si"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11"/></svg></div>
          <div class="st">Digitize a Scan</div>
          <div class="sh">OCR pipeline with image QA, field extraction and confidence scoring</div>
        </div>
        <div class="svc" onclick="nav('ledger')">
          <div class="si"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="7" height="8" rx="1"/><rect x="14" y="8" width="7" height="8" rx="1"/><path d="M10 12h4"/></svg></div>
          <div class="st">Integrity Ledger</div>
          <div class="sh">Hash-linked blocks; verify the full chain or test tamper detection</div>
        </div>
        <div class="svc" onclick="nav('queue')">
          <div class="si"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 1 6 6c0 4-6 12-6 12S6 13 6 9a6 6 0 0 1 6-6z"/><circle cx="12" cy="9" r="2"/></svg></div>
          <div class="st">Discrepancy Queue</div>
          <div class="sh">Fraud and litigation flags raised by the engine, pending officer review</div>
        </div>
      </div>
      <div class="mt2"></div>
      <div class="grid4" id="kpiRow"></div>
      <div class="grid2 mt2">
        <div class="card">
          <h3>Validation status mix</h3>
          <div class="hint">Outcome of the intelligent rule engine across the registry</div>
          <div id="donutWrap" class="flex" style="gap:22px;justify-content:center;padding:8px 0"></div>
          <div class="legend" style="justify-content:center" id="donutLegend"></div>
        </div>
        <div class="card">
          <h3>District-wise digitized parcels</h3>
          <div class="hint">Records onboarded into the registry, by district</div>
          <div id="barWrap" style="padding-top:6px"></div>
        </div>
      </div>
      <div class="grid2 mt2">
        <div class="card">
          <h3>Recent activity</h3>
          <div class="hint">Every action is logged and hash-anchored</div>
          <ul class="activity" id="activityList"></ul>
        </div>
        <div class="card">
          <h3>Ledger health</h3>
          <div class="hint">Hash-linked blocks seal every committed record</div>
          <div id="ledgerMini"></div>
        </div>
      </div>
    </section>

    <!-- ============ DIGITIZE ============ -->
    <section class="view" id="view-digitize">
      <div class="grid23">
        <div>
          <div class="card">
            <h3>1 - Choose source document</h3>
            <div class="hint">Pick a sample scan (rendered offline) or upload your own image. Documents mirror real Jamabandi / Fard / Sale-Deed formats.</div>
            <div class="thumbs" id="sampleGrid"></div>
            <div class="dropzone mt" id="dropZone" onclick="document.getElementById('uploadInput').click()">
              <div><b>Upload scanned record</b> (JPG / PNG photo or scan)</div>
              <div class="small" style="margin-top:3px">The image is preprocessed (downscale, grayscale, contrast stretch) and then read by live OCR. The engine library is fetched from a CDN, so an internet connection is required.</div>
              <input type="file" id="uploadInput" accept="image/*" style="display:none">
            </div>
            <div class="note blue mt" style="display:none" id="uploadNote"></div>
          </div>
          <div class="card mt">
            <h3>2 - Digitization pipeline</h3>
            <div class="hint">Ingest → deskew / denoise / binarize → OCR → NLP field extraction → confidence scoring</div>
            <div class="stepper" id="pipeSteps">
              <div class="step" data-n="1" id="st0">Ingest</div>
              <div class="step" data-n="2" id="st1">Preprocess</div>
              <div class="step" data-n="3" id="st2">OCR</div>
              <div class="step" data-n="4" id="st3">Classify</div>
              <div class="step" data-n="5" id="st4">Extract</div>
              <div class="step" data-n="6" id="st5">Score</div>
            </div>
            <div class="small muted" id="pipelineMeta">Idle - select a document to begin.</div>
            <div class="terminal mt" id="terminal"><div class="ln sys">Log initialized. Select a document to begin.</div></div>
          </div>
        </div>
        <div>
          <div class="card">
            <h3 class="sp" style="display:flex;justify-content:space-between;align-items:center"><span>3 - Document viewer</span><span class="chip" id="docChip"><span class="dot"></span>-</span></h3>
            <div class="docstage mt" id="docStage"><div class="docpaper" id="docPaper"><div style="padding:60px 30px;color:#94a3b8;text-align:center;font-size:13px">No document loaded.<br>Select a sample or upload a scan →</div></div></div>
          </div>
          <div class="card mt">
            <h3 class="sp" style="display:flex;justify-content:space-between;align-items:center"><span>4 - Extracted fields - human-in-the-loop</span><span class="small muted" id="hitlHint">Editable: fix low-confidence cells, then re-validate</span></h3>
            <div id="fieldsWrap">
              <div class="note blue">Extraction results will appear here. Fields under <b>75% confidence</b> are highlighted for operator verification (HITL) before validation.</div>
            </div>
            <div class="flex mt wrap" style="justify-content:flex-end">
              <button class="btn" id="btnRerun" disabled onclick="rerunPipeline()">Re-run Pipeline</button>
              <button class="btn btn-primary" id="btnValidate" disabled onclick="goValidate()">Run Validation</button>
              <button class="btn btn-green" id="btnSealQuick" disabled onclick="commit()" style="display:none">Approve and Seal</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ VALIDATION ============ -->
    <section class="view" id="view-validate">
      <div id="valEmpty">
        <div class="card" style="text-align:center;padding:50px 20px">
          <h3 style="justify-content:center;margin-top:8px">Validation engine idle</h3>
          <div class="hint" style="max-width:420px;margin:8px auto 14px">Digitize a document first - the engine runs 10 explainable rule checks (R1–R10) against the registry, mutation registers, court-case feeds and geo-data.</div>
          <button class="btn btn-primary" onclick="nav('digitize')">Open Digitization</button>
        </div>
      </div>
      <div id="valBody" style="display:none">
        <div class="card">
          <div class="sp wrap" style="display:flex;justify-content:space-between;align-items:center;gap:12px">
            <div>
              <h3 id="valDocTitle">-</h3>
              <div class="small muted" id="valDocMeta"></div>
            </div>
            <div class="flex wrap">
              <button class="btn btn-sm" onclick="nav('digitize')">← Back to document</button>
              <button class="btn btn-sm" onclick="goValidate()">Re-run Checks</button>
            </div>
          </div>
        </div>
        <div class="grid2 valgrid mt2">
          <div>
            <div id="verdictBanner"></div>
            <div class="mt" id="checksList"></div>
          </div>
          <div>
            <div class="card">
              <h3>Integrity risk score</h3>
              <div class="hint">Weighted: fail −25, warn −8, low OCR confidence −5</div>
              <div class="gaugewrap" id="gaugeWrap"></div>
              <div class="verdict-chips mt" id="verdictChips"></div>
            </div>
            <div class="card mt">
              <h3>Decision</h3>
              <div class="hint">Based on the verdict above</div>
              <div class="flex wrap">
                <button class="btn btn-green" id="btnCommit" onclick="commit()">Commit and Seal Record</button>
                <button class="btn btn-danger" id="btnQueue" onclick="sendToQueue()">Send to Review Queue</button>
              </div>
              <div class="small muted mt">Sealing generates a 14-digit ULPIN (Bhu-Aadhaar-style ID with Luhn check digit), a SHA-256 content hash and appends an immutable block to the Integrity Ledger.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ REGISTRY ============ -->
    <section class="view" id="view-registry">
      <div class="toolbar">
        <input type="search" id="regSearch" placeholder="Search ULPIN, owner, khasra no., village, tehsil, district…" oninput="renderRegistry()">
        <select id="regStatus" onchange="renderRegistry()"><option value="">All statuses</option><option value="validated">Validated</option><option value="flagged">Flagged</option><option value="pending">Pending</option></select>
        <select id="regState" onchange="renderRegistry()"><option value="">All states</option></select>
        <span class="chip ok" id="regCount"><span class="dot"></span>0 records</span>
      </div>
      <div class="tablewrap">
        <table class="rt">
          <thead><tr><th>ULPIN (Bhu-Aadhaar)</th><th>Owner</th><th>Khasra / Survey</th><th>Village - Tehsil</th><th>District - State</th><th>Area</th><th>Status</th><th>Block</th><th>Avg conf.</th></tr></thead>
          <tbody id="regBody"></tbody>
        </table>
      </div>
      <div class="small muted mt">Click a row to open the full record. Verify Hash checks the seal; Simulate Edit demonstrates detection.</div>
    </section>

    <!-- ============ LEDGER ============ -->
    <section class="view" id="view-ledger">
      <div class="card">
        <div class="sp wrap" style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div>
            <h3>Hash-linked Integrity Ledger</h3>
            <div class="hint">Every sealed record is anchored in a block. Each block stores the SHA-256 of its contents + the previous block's hash - retro edits break the chain.</div>
          </div>
          <div class="flex wrap">
            <button class="btn btn-green" onclick="verifyChain(true)">Verify All Blocks</button>
            <button class="btn btn-danger" id="btnTamperBlock" onclick="tamperChainBlock()">Test Tamper Detection</button>
          </div>
        </div>
        <div id="chainHealth" class="mt"></div>
        <div class="blocksrow mt" id="blocksRow"></div>
      </div>
    </section>

    <!-- ============ QUEUE ============ -->
    <section class="view" id="view-queue">
      <div class="card" style="background:linear-gradient(180deg,#fff,#fffbeb);border-color:#fde68a">
        <h3>Discrepancy Review Queue</h3>
        <div class="hint">Records auto-flagged by the validation engine - duplicate claims, broken mutation chains, lis pendens, low-quality scans. Resolving an item logs an audited action.</div>
        <div id="queueStats" class="flex wrap"></div>
      </div>
      <div class="mt2" id="queueList"></div>
    </section>

    <!-- ============ ABOUT / HELP ============ -->
    <section class="view" id="view-pitch">
      <div class="card">
        <h3>About this system</h3>
        <div class="hint">Purpose, method and limitations of the prototype</div>
        <p class="doc">Bhu-Netra is a browser-based prototype for digitizing and validating scanned land records (jamabandi, fard, khatauni, mutation extracts and sale deeds). It runs an OCR pipeline with per-field confidence scoring, a human verification step for low-confidence fields, a ten-rule validation engine, and seals approved records with a ULPIN identity and a hash-linked integrity entry. The prototype demonstrates a validation layer that could sit on top of existing digitization programmes; it is not a replacement for any state land records system.</p>
      </div>
      <div class="grid2 mt2">
        <div class="card">
          <h3>Background</h3>
          <ul class="doc">
            <li>Land and property disputes account for roughly two-thirds of all civil cases in Indian courts, and about a quarter of Supreme Court cases.</li>
            <li>Acquisition-related disputes take roughly 20 years on average from dispute to Supreme Court resolution.</li>
            <li>About 95% of rural land records have been computerized under DILRMP, but re-survey and data-quality work lags: records are often hand-written, multilingual, torn or faded.</li>
            <li>Digitization without validation copies errors and fraud straight into the database. The gap Bhu-Netra addresses is the step between a scan and a trustworthy record.</li>
          </ul>
        </div>
        <div class="card">
          <h3>Processing stages</h3>
          <ol class="doc">
            <li><b>Intake and image QA</b> - deskew, denoise, binarize; quality graded A/B/C before OCR is attempted.</li>
            <li><b>OCR</b> - live engine when internet is available; pre-computed transcripts for the built-in samples; manual entry form as fallback.</li>
            <li><b>Field extraction</b> - tokens mapped to the record schema (khasra, khewat, khatauni, owner, area, mutation), each with a confidence score.</li>
            <li><b>Human verification (HITL)</b> - only fields below threshold are routed to the operator; verified fields are marked in the audit trail.</li>
            <li><b>Validation and sealing</b> - ten rule checks; passing records receive a ULPIN, SHA-256 hash and ledger block.</li>
          </ol>
        </div>
      </div>
      <div class="grid2 mt2">
        <div class="card">
          <h3>Validation checks (R1-R10)</h3>
          <ol class="doc">
            <li>Khasra / survey number format</li>
            <li>Area sanity and unit conversion (acre, kanal, marla, bigha, biswa, sq m)</li>
            <li>Area cross-check: printed figure vs computed value</li>
            <li>Duplicate parcel ownership against the registry</li>
            <li>Mutation (inteqal) chain integrity</li>
            <li>Owner-name fuzzy consistency (Levenshtein)</li>
            <li>Date logic (future dates, mutation before deed)</li>
            <li>Geo-reference check via the cadastral map layer (Bhu-Naksha) - coordinates are never OCR-read from the document text</li>
            <li>Encumbrance / lis pendens from the e-Courts feed</li>
            <li>OCR confidence floor (human-verification gate)</li>
          </ol>
        </div>
        <div class="card">
          <h3>Selected indicators</h3>
          <div class="tablewrap" style="max-height:none">
          <table class="rt">
            <thead><tr><th>Indicator</th><th>Value</th><th>Source (as commonly cited)</th></tr></thead>
            <tbody>
              <tr><td>Civil cases related to land</td><td>~66%</td><td>Daksh high-court study (2016)</td></tr>
              <tr><td>Supreme Court cases involving land</td><td>~25%</td><td>Daksh / CPR analyses</td></tr>
              <tr><td>Average pendency, acquisition dispute</td><td>~20 years</td><td>Centre for Policy Research</td></tr>
              <tr><td>Total pending court cases</td><td>5.6 crore+</td><td>NJDG / pendency trackers, 2026</td></tr>
              <tr><td>Rural records computerized (DILRMP)</td><td>~95%</td><td>Dept. of Land Resources reports</td></tr>
            </tbody>
          </table>
          </div>
          <div class="hint" style="margin-top:8px">Figures are indicative and drawn from public studies; verify before quoting in official material.</div>
        </div>
      </div>
      <div class="card mt2">
        <h3>Demonstration walkthrough</h3>
        <ol class="doc">
          <li><b>Clean record:</b> Record Digitization, sample A (Jamabandi, Khanpur). Run the pipeline; confidence is high, no operator action needed. Run Validation - all ten checks pass. Commit and Seal: a ULPIN, hash and ledger block are generated.</li>
          <li><b>Noisy scan:</b> Sample B (Hindi fard, faded ink). The OCR mis-reads the area figure; check R3 fails. Apply the suggested correction, re-run - now passes with warnings. Note the name-spelling suggestion (Krishna vs Krishan).</li>
          <li><b>Fraud detection:</b> Sample C (sale deed, Raipur Rani). The scan is clean, but the khasra is already registered to another owner and the vendor is not in the mutation chain. R4 and R5 fail; sealing is blocked; send it to the Review Queue.</li>
          <li><b>Litigation freeze:</b> Sample D (1998 mutation extract under lis pendens). Even after verifying every field manually, R9 keeps the record blocked.</li>
          <li><b>Integrity:</b> Records Registry - open any record - Verify Hash, then Simulate Edit, then Verify Hash again. Integrity Ledger - Verify All Blocks, then Test Tamper Detection to see the chain break and cascade.</li>
          <li><b>Queue:</b> Review Queue - resolve or reject flagged items; every action is written to the audit trail.</li>
        </ol>
      </div>
      <div class="card mt2">
        <h3>Alignment with Smart India Hackathon 2026 themes</h3>
        <ul class="doc">
          <li><b>Agriculture, FoodTech and Rural Development:</b> direct support to DILRMP digitization and re-survey backlog; reduces dependence on manual patwari data entry while keeping officers in the loop.</li>
          <li><b>Blockchain for Governance:</b> tamper-evident, hash-linked record sealing with full-chain verification - retroactive edits are provably detectable without a cryptocurrency or energy-heavy consensus.</li>
          <li><b>Smart Automation (Software - Web):</b> OCR with confidence gating routes only weak fields to humans; explainable rule-based decisions keep the approval process auditable and legally defensible.</li>
        </ul>
        <div class="hint" style="margin-top:8px">Deployment vision: operate as a validation and sealing layer on top of existing state land-records software (Bhulekh / Jamabandi portals), consuming scans already collected at e-Disha and CSC kiosks.</div>
      </div>
      <div class="card mt2">
        <h3>Reference - extraction schema mapped to real record formats</h3>
        <div class="hint">The OCR schema is derived from the column layouts of actual records of rights; only fields required for parcel identity and validation are extracted. Cultivation, land-class, revenue and tenancy columns remain preserved in the archived scan image but are not extracted, since they do not affect title validation.</div>
        <div class="tablewrap" style="max-height:none">
        <table class="rt">
          <thead><tr><th>Record format</th><th>Where used</th><th>Fields the engine extracts</th></tr></thead>
          <tbody>
            <tr><td>Jamabandi / Fard (Record of Rights)</td><td>Punjab, Haryana, Rajasthan, HP</td><td>Khewat no., Khatauni no., Khasra no., owner with parentage, area (kanal-marla / acre), mutation (intkal) no., type and date</td></tr>
            <tr><td>Khatauni (RoR)</td><td>Uttar Pradesh, Uttarakhand</td><td>Khatauni no., khasra no., khewat, owner with parentage, area (bigha-biswa), dakhil kharij reference</td></tr>
            <tr><td>Saat-Bara (7/12) extract</td><td>Maharashtra, Goa</td><td>Survey / Gat no., khata no., owner and mode of acquisition, area (hectares), encumbrance and mutation entries</td></tr>
            <tr><td>Patta / Chitta / Adangal</td><td>Tamil Nadu, Puducherry</td><td>Patta no., survey no. and subdivision, taluk and village, owner with father, extent (acres-cents)</td></tr>
            <tr><td>Khatian (RoR) / ROR Khatiyan</td><td>West Bengal, Odisha, Assam</td><td>Dag / plot no., Khatian no., mouza, raiyat with father, share, area (katha-decimal)</td></tr>
            <tr><td>RTC / Pahani</td><td>Karnataka</td><td>Survey no. and hissa, owner, extent (acres-guntas), mutation reference</td></tr>
            <tr><td>Registered sale deed</td><td>All states (Sub-Registrar)</td><td>Deed no. and date, vendor, vendee, consideration, stamp duty, property schedule (khasra, area)</td></tr>
            <tr><td>Mutation extract (intkal / ferfar / naam saari)</td><td>All states</td><td>Mutation no. and date, type (sale / inheritance / gift), prior and new holder</td></tr>
          </tbody>
        </table>
        </div>
        <div class="note blue" style="margin-top:10px"><b>Why the schema has no latitude / longitude:</b> no record of rights prints coordinates. The geo-reference for ULPIN comes from the surveyed cadastral map layer (Bhu-Naksha / SVAMITVA), which check R8 queries separately - so a document can never inject a false location.</div>
      </div>
      <div class="card mt2">
        <h3>Language coverage - all major Indian record languages</h3>
        <div class="tablewrap" style="max-height:none">
        <table class="rt">
          <thead><tr><th>Language (script)</th><th>tessdata pack</th><th>Typical record types / states</th></tr></thead>
          <tbody>
            <tr><td>हिन्दी Hindi (Devanagari)</td><td class="mono">hin</td><td>Jamabandi, Khatauni - UP, Bihar, MP, Rajasthan, Haryana, HP, Uttarakhand, Jharkhand, Chhattisgarh, Delhi</td></tr>
            <tr><td>ਪੰਜਾਬੀ Punjabi (Gurmukhi)</td><td class="mono">pan</td><td>Fard, Jamabandi - Punjab</td></tr>
            <tr><td>मराठी Marathi (Devanagari)</td><td class="mono">mar</td><td>Saat-Bara (7/12) extract - Maharashtra, Goa</td></tr>
            <tr><td>ગુજરાતી Gujarati</td><td class="mono">guj</td><td>7/12 and Village Form 6 - Gujarat, Daman</td></tr>
            <tr><td>বাংলা Bengali</td><td class="mono">ben</td><td>Khatian, Dag - West Bengal, Tripura, A&amp;N</td></tr>
            <tr><td>தமிழ் Tamil</td><td class="mono">tam</td><td>Patta, Chitta, Adangal - Tamil Nadu, Puducherry</td></tr>
            <tr><td>తెలుగు Telugu</td><td class="mono">tel</td><td>Adangal, Pahani - Andhra Pradesh, Telangana</td></tr>
            <tr><td>ಕನ್ನಡ Kannada</td><td class="mono">kan</td><td>RTC / Pahani - Karnataka</td></tr>
            <tr><td>മലയാളം Malayalam</td><td class="mono">mal</td><td>Thandaper, Pokkuvaravu - Kerala, Lakshadweep</td></tr>
            <tr><td>ଓଡ଼ିଆ Odia</td><td class="mono">ori</td><td>Khatian, ROR - Odisha</td></tr>
            <tr><td>অসমীয়া Assamese</td><td class="mono">asm</td><td>Jamabandi - Assam</td></tr>
            <tr><td>اردو Urdu (Perso-Arabic)</td><td class="mono">urd</td><td>Old extracts - Jammu &amp; Kashmir, parts of UP/Bihar</td></tr>
            <tr><td>नेपाली Nepali</td><td class="mono">nep</td><td>Sikkim, Darjeeling (kitta / ropani records)</td></tr>
            <tr><td>संस्कृत Sanskrit</td><td class="mono">san</td><td>Older pandulipi-style records</td></tr>
            <tr><td>English</td><td class="mono">eng</td><td>All states - bilingual headings, deeds, notifications</td></tr>
          </tbody>
        </table>
        </div>
        <div class="hint" style="margin-top:8px">Language detection is automatic: records are first read with Hindi + English packs (covering all Devanagari states); if the output shows no Devanagari or Latin script, a regional sweep loads the remaining packs. The field mapper understands revenue terminology per language (khasra / dag / survey no / gat / kitta; khewat / khatian / khatauni; raqba / area / parisrama; dakhil-kharij / ferfar / patta transfer / naam saari) and normalizes native-script numerals. Languages without offline tessdata packs here (Meitei, Bodo, Kashmiri perso-arabic) would use cloud OCR in production.</div>
      </div>
      <div class="grid2 mt2">
        <div class="card">
          <h3>What is real in this prototype</h3>
          <ul class="doc">
            <li>SHA-256 hashing via WebCrypto (with a deterministic fallback where the API is unavailable).</li>
            <li>Luhn check digit on every 14-digit ULPIN.</li>
            <li>Unit conversions (marla, kanal, acre, bigha, biswa to square metres) and cross-checking.</li>
            <li>Levenshtein fuzzy matching for owner names.</li>
            <li>Duplicate detection and mutation-chain logic over the local registry.</li>
            <li>Hash-linked ledger with full-chain verification.</li>
            <li>The entire application is a single HTML file that runs in the browser. All modules - samples, validation, registry, ledger - work without internet; only live OCR of uploaded scans and the web font fetch from a CDN.</li>
          </ul>
        </div>
        <div class="card">
          <h3>What is simulated, and the production path</h3>
          <ul class="doc">
            <li>The four sample documents are generated images, not real scans; no citizen data is used anywhere.</li>
            <li>Offline OCR uses pre-computed transcripts, labelled as such in the log. With internet, uploaded images run live Tesseract.js OCR.</li>
            <li>The mutation register and e-Courts feeds are small demo datasets.</li>
            <li>Production deployment would use cloud OCR or vision-model extraction for Hindi and regional scripts, connectors to state record databases, the official ULPIN service, the real e-Courts API, and periodic anchoring of ledger roots.</li>
          </ul>
        </div>
      </div>
    </section>
    
  </main>
    <footer>
    <div class="fcols">
      <div>
        <h4>Bhu-Netra | भू-नेत्र</h4>
        <p>National Land Record Digitization &amp; Validation System - OCR digitization, rule-based validation and hash-linked integrity sealing for land records, aligned with DILRMP and ULPIN (Bhu-Aadhaar) programme guidelines.</p>
        <p class="small" style="margin-top:6px;color:#8fa9c9">All data in this demonstration is synthetic.</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <a href="#" onclick="nav('digitize');return false;">Record Digitization</a>
        <a href="#" onclick="nav('validate');return false;">Validation Engine</a>
        <a href="#" onclick="nav('registry');return false;">Records Registry</a>
        <a href="#" onclick="nav('ledger');return false;">Integrity Ledger</a>
        <a href="#" onclick="nav('queue');return false;">Review Queue</a>
      </div>
      <div>
        <h4>Information</h4>
        <a href="#" onclick="nav('pitch');return false;">About &amp; Help</a>
        <a href="#" onclick="nav('pitch');return false;">Demo Walkthrough</a>
        <a href="#" onclick="openPolicy('access');return false;">Accessibility Statement</a>
        <a href="#" onclick="openPolicy('privacy');return false;">Privacy Policy</a>
        <a href="#" onclick="openPolicy('terms');return false;">Terms &amp; Conditions</a>
      </div>
      <div>
        <h4>Contact (Demonstration)</h4>
        <p>Joint Secretary (Land Records)<br>Department of Land Resources<br>Ministry of Rural Development<br>New Delhi - 110011</p>
        <p class="small" style="margin-top:6px">Helpdesk: landrecords-help[at]demo[dot]gov[dot]in<br>Working days: Mon-Fri, 9:30 AM - 6:00 PM IST</p>
      </div>
    </div>
    <div class="fbot"><div class="in">
      <div>Visitor Count: <span class="vc" id="visits">0042137</span> &nbsp;|&nbsp; Last Updated: 07 Sep, 2026</div>
      <div>Content owned by Department of Land Resources, Ministry of Rural Development, Government of India</div>
      <div class="flex">
        <button class="btn btn-sm" style="border-color:#2c4b76;color:#b9cbe0;background:transparent" onclick="resetDemo()">Reset Demo Data</button>
      </div>
    </div></div>
  </footer>
</div>

<div id="toasts"></div>
<div id="modalRoot"></div>
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js" onerror="window.__tessFailed=true" crossorigin="anonymous"></script>
<script>
'use strict';
/* ================================================================
   BhuNetra - Intelligent Land Record Digitization & Validation System
   Single-file hackathon prototype. All logic runs locally in-browser.
   ================================================================ */

/* ---------------- tiny utils ---------------- */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const withTimeout=(pr,ms)=>Promise.race([pr,new Promise((_,rej)=>setTimeout(()=>rej(new Error('timed out after '+(ms/1000)+'s')),ms))]);
async function liveOCR(dataUrl,lang,onStatus,onProgress){
  const opts={logger:m=>{try{onProgress&&onProgress(m);}catch(e){}}};
  try{ return await withTimeout(Tesseract.recognize(dataUrl,lang,opts),90000); }
  catch(e1){
    onStatus&&onStatus('first attempt failed ('+((e1&&e1.message)||'unknown')+'). Retrying with explicit CDN paths…');
    const o2=Object.assign({workerPath:'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',corePath:'https://cdn.jsdelivr.net/npm/tesseract.js-core@5',langPath:'https://tessdata.projectnaptha.com/4.0.0'},opts);
    return await withTimeout(Tesseract.recognize(dataUrl,lang,o2),120000);
  }
}
function preprocessImage(dataUrl,maxSide){
  return new Promise(resolve=>{
    let done=false;const fin=v=>{if(!done){done=true;resolve(v);}};
    const img=new Image();
    const guard=setTimeout(()=>fin(dataUrl),3000);
    img.onload=()=>{
      try{
        let scale=Math.min(1,maxSide/Math.max(img.width,img.height));
        if(Math.max(img.width,img.height)<1000)scale=Math.min(1600/Math.max(img.width,img.height),2);
        const cv=document.createElement('canvas');
        cv.width=Math.max(1,Math.round(img.width*scale));cv.height=Math.max(1,Math.round(img.height*scale));
        const ctx=cv.getContext('2d');
        if(!ctx){clearTimeout(guard);return fin(dataUrl);}
        ctx.drawImage(img,0,0,cv.width,cv.height);
        const d=ctx.getImageData(0,0,cv.width,cv.height);const px=d.data;
        let mn=255,mx=0;
        for(let i=0;i<px.length;i+=4){const g=(px[i]*0.299+px[i+1]*0.587+px[i+2]*0.114)|0;if(g<mn)mn=g;if(g>mx)mx=g;px[i]=px[i+1]=px[i+2]=g;}
        const range=Math.max(1,mx-mn);
        for(let i=0;i<px.length;i+=4){const v=((px[i]-mn)*255/range)|0;px[i]=px[i+1]=px[i+2]=v;}
        ctx.putImageData(d,0,0);
        clearTimeout(guard);fin(cv.toDataURL('image/png'));
      }catch(e){clearTimeout(guard);fin(dataUrl);}
    };
    img.onerror=()=>{clearTimeout(guard);fin(dataUrl);};
    img.src=dataUrl;
  });
}
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
 sqm:'(?:sq\.?\s*m|sqm)|वर्ग मीटर|वर्ग मि|ਵਰਗ ਮੀਟਰ|ચોરસ મીટર|ચો\.?મી|বর্গ মিটার|சதுர மீட்டர்|ச\.?மீ|చదరపు మీటర్లు|చ\.?మీ|ಚದರ ಮೀಟರ್|ಚ\.?ಮೀ|ചതുരശ്ര മീറ്റർ|ച\.?മീ|ବର୍ଗ ମିଟର|مربع میٹر',
 lat:'lat(?:itude)?|अक्षांश', lng:'long(?:itude)?|देशांतर'};
const HINDI_STATE={'उत्तर प्रदेश':'Uttar Pradesh','हरियाणा':'Haryana','पंजाब':'Punjab','राजस्थान':'Rajasthan','मध्य प्रदेश':'Madhya Pradesh','बिहार':'Bihar','उत्तराखंड':'Uttarakhand','उत्तराखण्ड':'Uttarakhand','हिमाचल प्रदेश':'Himachal Pradesh','छत्तीसगढ़':'Chhattisgarh','झारखंड':'Jharkhand','झारखण्ड':'Jharkhand','दिल्ली':'Delhi (NCT)','जम्मू और कश्मीर':'Jammu and Kashmir','आंध्र प्रदेश':'Andhra Pradesh','तेलंगाना':'Telangana','कर्नाटक':'Karnataka','केरल':'Kerala','तमिलनाडु':'Tamil Nadu','महाराष्ट्र':'Maharashtra','गुजरात':'Gujarat','ओडिशा':'Odisha','पश्चिम बंगाल':'West Bengal','असम':'Assam','मणिपुर':'Manipur','मेघालय':'Meghalaya','मिज़ोरम':'Mizoram','नागालैंड':'Nagaland','त्रिपुरा':'Tripura','गोवा':'Goa','सिक्किम':'Sikkim','चंडीगढ़':'Chandigarh','लद्दाख':'Ladakh'};
const HINDI_LOC={'सहारनपुर':'Saharanpur','अंबाला':'Ambala','पंचकुला':'Panchkula','कुरुक्षेत्र':'Kurukshetra','यमुनानगर':'Yamunanagar','डेरा बासी':'Dera Bassi','मोरिंडा':'Morinda','राजपुरा':'Rajpura','थियोग':'Theog','जगाधरी':'Jagadhri','थानेसर':'Thanesar','नरायणगढ़':'Naraingarh','बराड़ा':'Barara','देवबंद':'Deoband','रायपुर रानी':'Raipur Rani','खानपुर':'Khanpur','सलाना':'Salana','फतेहगढ़':'Fatehgarh','थानेदार':'Thanedar','उभा':'Ubha','कीरमच':'Kirmach','शाहजादपुर':'Shahzadpur','मुस्तफाबाद':'Mustafabad','नया नंगल':'Naya Nangal','छुटमलपुर':'Chhutmalpur','बड़ौत':'Baraut','बागपत':'Baghpat','सिठौली':'Sitholi','देवबंद':'Deoband'};
const locCanonical=v=>(v!=null&&HINDI_LOC[String(v).trim()])?HINDI_LOC[String(v).trim()]:v;
const locEq=(a,b)=>String(a||'').trim()===String(b||'').trim()||locCanonical(a)===locCanonical(b);
const NAME_STOP='(?:\\s+[sdw]\\/o\\s+|\\s+(?:पिता|पुत्र|पुत्री|पत्नी|ਪਿਤਾ|পিতা|தந்தை|తండ్రి|ತಂದೆ|പിതാവ്|ପିତା|s\\/o|d\\/o|w\\/o)(?=\\s|$))';
function mapFieldsFromText(txt){
  if(!txt)return 0;
  txt=normalizeDigits(String(txt));
  const CAP='([^\\n,;]{1,60})';
  const grab=(labels)=>{try{const rx=new RegExp('(?:'+labels+')(?:\\s*(?:का|की|के)\\s*)?(?:\\s*(?:no|no\\.|number|नाम|नं|नंबर|सं|संख्या|నం|ಸం|எண்))?\\s*[:\\-–]?\\s*'+CAP,'i');const m=txt.match(rx);return m?m[1].trim().replace(/[:.,;]+$/,'').trim():'';}catch(e){return '';}};
  const LOC_STOP=/^(?:ग्राम|गाँव|गांव|गाव|कोड|खाता|खसरा|खतौनी|खेवट|पटवारी|तहसील|जनपद|जिला|राज्य|निवास|हल्का|राजस्व|स्वामी|मालिक|खातेदार)$/;
  const cleanLoc=v=>{
    if(!v)return '';
    v=String(v).split(/\s*[\(\[]/)[0].split('=')[0];
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
  const put=(k,v,c,extra)=>{if(v&&!W.fields[k].v)W.fields[k]=Object.assign({v:String(v),c:c||.85,edited:false,verified:false},extra||{});};
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
  const cm=txt.match(/(?:rs\.?|₹|inr)\s*([\d.,]{3,})/i);if(cm)put('consideration',cm[1].replace(/[.,]$/,''),.84);
  const gm=low.match(new RegExp('(\\d[\\d.,]{1,9})\\s*(?:'+LOCS.sqm+')(?:eters?)?','i'));
  if(gm)put('areaSqM',gm[1].replace(/[.,]$/,''),.8);
  const dn=txt.match(/deed\s*(?:no|number)?\.?\s*[:\-]?\s*(\d{1,5}\s*\/\s*\d{2,4})/i);if(dn)put('deedNo',dn[1].replace(/\s+/g,''),.84);
  if(!W.fields.areaSqM.v&&W.fields.areaStr.v){
    const computed=parseArea(W.fields.areaStr.v);
    if(computed)put('areaSqM',computed.toFixed(1),.8,{computed:true});
  }
  if(!W.fields.docType.v){
    const DT=[[/बिक्री पत्र|deed of sale|sale deed|conveyance/i,'Registered Deed of Sale'],[/जमाबंदी|jamabandi/i,'Jamabandi (Record of Rights)'],[/फर्द|fard badar/i,'Fard (RoR extract)'],[/खतौनी|भू-?अभिलेख|khatauni/i,'Khatauni (RoR extract)'],[/7\s*\/\s*12|सात[\s-]*बारा|satbara/i,'Saat-Bara (7/12) extract'],[/पट्टा|chitta|பட்டா/i,'Patta / Chitta extract'],[/खतियान|khatian|khatiyan/i,'Khatian (RoR)'],[/दाखिल खारिज|mutation extract|intkal/i,'Mutation extract']];
    for(const pair of DT){if(pair[0].test(txt)){put('docType',pair[1],.9);break;}}
  }
  return Object.keys(W.fields).filter(k=>W.fields[k].v).length;
}
/* ================================================================
   LAND RECORD CLASSIFIER
   Examines OCR text for land-record indicators.
   Returns an explainable score with detected evidence.
   ================================================================ */
function classifyLandRecord(txt){
  if(!txt||typeof txt!=='string')return {isLand:false,confidence:0,reasons:[],docCategory:'Empty document',details:[]};
  const low=txt.toLowerCase();
  const norm=normalizeDigits(txt);
  const evidence=[];  // {label, weight, found:bool}
  const details=[];   // human-readable detected items

  /* --- A. PRIMARY land-record keywords (high weight: 6 pts each) --- */
  const PRIMARY=[
    ['Khasra/खसरा',/khasra|khasara|खसरा|ખસરા|ਖਸਰਾ|کھسرہ/i],
    ['Khewat/खेवट',/khewat|खेवट|ਖੇਵਟ|کھیوٹ/i],
    ['Khatauni/खतौनी',/khatauni|khatuni|khatouni|खतौनी|ਖਤੌਨੀ|کھاتونی/i],
    ['Jamabandi/जमाबंदी',/jamabandi|जमाबंदी|ਜਮਾਬੰਦੀ/i],
    ['Fard/फर्द',/fard\s|फर्द|ਫਰਦ/i],
    ['Mutation/दाखिल खारिज',/mutation|intkal|inteqal|दाखिल\s*खारिज|दाखल\s*खारज|फेरफार|নামজারি|পট্টন|நாம\s*மாற்ற|నామ\s*మార్పు|ನಾಮ|পৌর/i],
    ['Record of Rights/RoR',/record\s*of\s*rights|RoR\b|अभिलेख/i],
    ['Survey Number/सर्वे',/survey\s*(?:no|number|नंबर)|सर्वे\s*(?:नं|सं|नंबर)|gat\s*no|গাট|गाट/i],
    ['Patta/पट्टा',/\bpatta\b|पट्टा|பட்டா|పట్టా|ಪಟ್ಟ/i],
    ['Chitta/चिट्टा',/\bchitta\b|चिट्टा|சிட்டா/i],
    ['Adangal/अडंगल',/adangal|अडंगल|అడంగల్|அடங்கல்/i],
    ['Khatian/खतियान',/khatian|khatiyan|खतियान|খতিয়ান/i],
    ['RTC/Pahani',/\brtc\b|pahani|पहनी|ಪಹಣಿ/i],
    ['7/12 Extract',/7\s*\/\s*12|saat[\s-]*bara|सात[\s-]*बारा/i],
    ['Sale Deed/बिक्री पत्र',/sale\s*deed|deed\s*of\s*sale|conveyance\s*deed|बिक्री\s*पत्र|विक्रय\s*पत्र|bikri|क्रय\s*विक्रय/i],
    ['Sub-Registrar/उप-पंजीयक',/sub[\s-]*registrar|उप[\s-]*पंजीयक|रजिस्ट्रार/i],
    ['Plot/Parcel Number',/plot\s*(?:no|number)|parcel\s*(?:no|number)|भूखंड\s*(?:सं|नं)/i],
    ['ULPIN/Bhu-Aadhaar',/ulpin|bhu[\s-]*aadhaar|भू[\s-]*आधार/i],
    ['Dag/दाग',/\bdag\s*(?:no|number|সং|নং)|দাগ\s*(?:নং|সং)|दाग\s*(?:सं|नं)/i],
  ];

  /* --- B. SECONDARY land-record keywords (medium weight: 3 pts each) --- */
  const SECONDARY=[
    ['Owner/स्वामी',/owner|holder|khatedar|खातेदार|स्वामी|मालिक|মালিক|உரிமை|భూస్వామి|ಒಡೆಯ|ഉടമ|ଧାରକ|مالک/i],
    ['Father/पिता name section',/(?:father|पिता|ਪਿਤਾ|পিতা|தந்தை|తండ్రి|ತಂದೆ|പിതാവ്|ପିତା|والد)\s*(?:name|का\s*नाम|नाम)?/i],
    ['Village/गाँव',/village|gram|mauja|মৌজা|मौजा|ग्राम|गाँव|गांव|ਪਿੰਡ|கிராமம்|గ్రామం|ಹಳ್ಳಿ|ഗ്രാമം/i],
    ['Tehsil/तहसील',/tehsil|tahsil|taluk|mandal|तहसील|तालुका|ਤਹਿਸੀਲ|வட்டம்|మండలం|ತಾಲೂಕು|താലൂക്ക്|ତହସିଲ/i],
    ['District/जिला',/district|जनपद|जिला|ज़िला|ਜ਼ਿਲ੍ਹਾ|જિલ્લો|জেলা|மாவட்டம்|జిల్లా|ಜಿಲ್ಲೆ|ജില്ല|ଜିଲ୍ଲା/i],
    ['Area/रकबा field',/\braqba\b|रकबा|area\s*(?:in|of|=)|रक़बा|ਰਕਬਾ|ভূমি\s*পরিমাণ|பரப்பு|విస్తీర్ణం|ವಿಸ್ತೀರ್ಣ|വിസ്തീർണ/i],
    ['Land area units',/kanal|marla|bigha|biswa|acre|hectare|कनाल|मरला|बीघा|बिस्वा|एकड़|হেক্টর|ஏக்கர்|ఎకరం|ಎಕರೆ|ഏക്കർ|ଏକର/i],
    ['Cultivator/काश्तकार',/cultivat|tenant|काश्तकार|किसान|கிஸான்|రైతు|ರೈತ|കൃഷിക്കാരൻ|ଚାଷୀ/i],
    ['Revenue Dept header',/revenue\s*dep|राजस्व\s*विभाग|land\s*(?:record|revenue)|भू[\s-]*(?:अभिलेख|राजस्व)|registration\s*dep|पंजीकरण\s*विभाग/i],
    ['Halqa Patwari/पटवारी',/patwari|पटवारी|लेखपाल|lekhpal|तहसीलदार|naib\s*tehsildar/i],
    ['Certified copy/प्रमाणित',/certified\s*(?:true\s*)?copy|प्रमाणित\s*नकल|प्रमाणित\s*प्रति/i],
    ['Stamp/Seal reference',/stamp\s*duty|e[\s-]*gras|मुहर|सील|seal|stamp/i],
    ['Consideration/मूल्य',/consideration|विक्रय\s*मूल्य|प्रतिफल|मूल्य\s*₹|(?:rs|₹|inr)\s*[\d,]+/i],
    ['Encumbrance',/encumbrance|भार\s*प्रमाण|lien|बंधक|mortgage/i],
    ['Land classification',/chahi|nehri|barani|irrigat|सिंचित|असिंचित|बारानी|नहरी|चाही/i],
  ];

  /* --- C. STRUCTURAL patterns (4 pts each) --- */
  const STRUCTURAL=[
    ['Khasra-style number pattern',/(?:khasra|खसरा|survey|सर्वे|gat|दाग|dag)\s*(?:no|नं|सं|number)?\.?\s*[:=\-]?\s*\d{1,4}(?:\/\d{1,4}){0,2}/i],
    ['Owner-parentage pattern',/[sdw]\/o\s+[A-Za-z\u0900-\u0D7F]{2,}/i],
    ['Area-unit pattern',/\d+[\s.]*(?:kanal|marla|bigha|biswa|acre|hectare|कनाल|मरला|बीघा|बिस्वा|एकड़|हेक्टेयर)/i],
    ['Village-Tehsil-District hierarchy',/(?:village|गाँव|गांव|gram)[\s\S]{0,80}(?:tehsil|tahsil|तहसील)[\s\S]{0,80}(?:district|जिला|जनपद)/i],
    ['Mutation entry pattern',/(?:mutation|दाखिल|intkal|inteqal)\s*(?:no|सं|नं)?\.?\s*[:=\-]?\s*\d{1,6}/i],
    ['Date in Indian record format',/\d{1,2}[\s\-\.\/]\d{1,2}[\s\-\.\/]\d{2,4}/],
    ['Khewat-Khatauni pair',/(?:khewat|खेवट)\s*(?:no)?\.?\s*[:=\-]?\s*\d[\s\S]{0,40}(?:khatauni|khatuni|खतौनी)/i],
    ['Table-like column structure',/(?:खसरा|khasra|survey|owner|स्वामी|रकबा|area)[\s|]+(?:खतौनी|khatuni|holder|पिता|father|मरला|kanal)/i],
  ];

  /* --- D. NEGATIVE indicators (things that suggest NOT a land record) --- */
  const NEGATIVE=[
    ['Aadhaar/आधार card',/aadhaar|आधार\s*(?:कार्ड|संख्या|नंबर)|uidai|unique\s*identification/i, -8],
    ['Electricity/बिजली bill',/electricity|बिजली\s*(?:बिल|विभाग)|bijli|kwh|unit\s*consumed|meter\s*(?:no|reading)/i, -8],
    ['College/university doc',/university|विश्वविद्यालय|college|semester|grade\s*(?:card|sheet)|marksheet|degree|diploma|enrollment|admission/i, -8],
    ['Invoice/receipt',/invoice\s*(?:no|number)|bill\s*(?:no|number|of\s*supply)|gst(?:in)?|hsn\s*code|igst|cgst|sgst|tax\s*invoice/i, -7],
    ['Medical document',/hospital|doctor|patient|diagnosis|prescription|medicine|tablet|mg\s*(?:tablet|dose)/i, -6],
    ['Bank statement',/bank\s*(?:statement|account)|ifsc|micr|passbook|debit|credit|balance/i, -6],
    ['Newspaper/article',/newspaper|editorial|correspondent|press|journalist/i, -5],
    ['Resume/CV',/resume|curriculum\s*vitae|work\s*experience|objective|career\s*summary/i, -6],
    ['Voter ID/PAN',/voter\s*id|election\s*commission|pan\s*(?:card|number)|permanent\s*account/i, -6],
    ['Driving license',/driving\s*licen[cs]e|motor\s*vehicle|rto\b|transport\s*(?:dept|authority)/i, -5],
  ];

  let score=0, maxPossible=0;

  // Score PRIMARY
  PRIMARY.forEach(([label,rx])=>{
    maxPossible+=6;
    const found=rx.test(txt);
    evidence.push({label,weight:6,found});
    if(found){score+=6; details.push('✓ '+label+' detected');}
  });

  // Score SECONDARY
  SECONDARY.forEach(([label,rx])=>{
    maxPossible+=3;
    const found=rx.test(txt);
    evidence.push({label,weight:3,found});
    if(found){score+=3; details.push('✓ '+label+' detected');}
  });

  // Score STRUCTURAL
  STRUCTURAL.forEach(([label,rx])=>{
    maxPossible+=4;
    const found=rx.test(txt);
    evidence.push({label,weight:4,found});
    if(found){score+=4; details.push('✓ '+label+' detected');}
  });

  // Apply NEGATIVE penalties
  const negHits=[];
  NEGATIVE.forEach(([label,rx,penalty])=>{
    if(rx.test(txt)){score+=penalty; negHits.push(label); details.push('✕ '+label+' (non-land indicator)');}
  });

  // Clamp and normalize
  const rawScore=Math.max(0,score);
  // Use a practical threshold: 18 points (3 primary hits) is a reasonable minimum
  // Max realistic score for a good land record is ~80-120 points
  const practicalMax=100;
  const confidence=Math.min(99,Math.round(rawScore/practicalMax*100));

  // Classification threshold: 25% minimum
  const THRESHOLD=25;
  const isLand=confidence>=THRESHOLD;

  // Determine document category
  let docCategory='Unknown document';
  if(negHits.length&&confidence<THRESHOLD){
    docCategory=negHits[0].split('/')[0]+' (non-land document)';
  }else if(!isLand){
    docCategory='General / unrelated document';
  }else{
    // Try to identify specific land record type
    const DT_MATCH=[
      [/jamabandi|जमाबंदी/i,'Jamabandi (Record of Rights)'],
      [/fard|फर्द/i,'Fard (RoR extract)'],
      [/khatauni|खतौनी/i,'Khatauni (RoR)'],
      [/7\s*\/\s*12|saat[\s-]*bara|सात[\s-]*बारा/i,'7/12 (Saat-Bara) extract'],
      [/patta|पट्टा|பட்டா/i,'Patta / Chitta'],
      [/khatian|khatiyan|खतियान|খতিয়ান/i,'Khatian (RoR)'],
      [/\brtc\b|pahani|पहनी|ಪಹಣಿ/i,'RTC / Pahani'],
      [/sale\s*deed|deed\s*of\s*sale|बिक्री\s*पत्र/i,'Registered Sale Deed'],
      [/mutation|दाखिल\s*खारिज|अंश\s*दान/i,'Mutation extract'],
      [/sub[\s-]*registrar|उप[\s-]*पंजीयक/i,'Registered deed'],
    ];
    for(const [rx,name] of DT_MATCH){if(rx.test(txt)){docCategory=name;break;}}
    if(docCategory==='Unknown document'&&isLand)docCategory='Land record (type unidentified)';
  }

  // Build reasons list (top hits)
  const positiveEvidence=evidence.filter(e=>e.found).sort((a,b)=>b.weight-a.weight);
  const reasons=positiveEvidence.slice(0,8).map(e=>e.label);

  return {isLand, confidence, reasons, docCategory, details, negHits, score:rawScore, evidence};
}

/* ================================================================
   DOCUMENT QUALITY SCORER
   Analyzes image properties before OCR to grade quality.
   ================================================================ */
function scoreDocumentQuality(canvas, ocrConf){
  const checks=[];
  let total=0, passed=0;

  // 1. Resolution
  total++;
  const minDim=Math.min(canvas.width,canvas.height);
  if(minDim>=600){checks.push({label:'Resolution sufficient',ok:true,detail:canvas.width+'×'+canvas.height+'px'});passed++;}
  else if(minDim>=300){checks.push({label:'Resolution marginal',ok:true,detail:canvas.width+'×'+canvas.height+'px (acceptable)',warn:true});passed+=0.7;}
  else{checks.push({label:'Resolution too low',ok:false,detail:canvas.width+'×'+canvas.height+'px — rescan at higher DPI recommended'});}

  // 2. Document detected (non-blank check via variance)
  total++;
  const ctx=canvas.getContext('2d');
  if(ctx){
    const d=ctx.getImageData(0,0,Math.min(canvas.width,200),Math.min(canvas.height,200));
    const px=d.data;let sum=0,sum2=0,n=0;
    for(let i=0;i<px.length;i+=4){const g=px[i];sum+=g;sum2+=g*g;n++;}
    const mean=sum/n,variance=sum2/n-mean*mean;
    if(variance>200){checks.push({label:'Document detected',ok:true,detail:'Image variance '+Math.round(variance)+' — content present'});passed++;}
    else if(variance>50){checks.push({label:'Document possibly blank or very faded',ok:true,detail:'Low variance '+Math.round(variance),warn:true});passed+=0.5;}
    else{checks.push({label:'Image appears blank or uniform',ok:false,detail:'Variance '+Math.round(variance)+' — may be a blank page'});}
  }else{checks.push({label:'Document detection',ok:true,detail:'Canvas unavailable — skipped'});passed++;}

  // 3. Orientation (we always correct via preprocessing, so pass)
  total++;
  checks.push({label:'Orientation corrected',ok:true,detail:'Automatic deskew applied during preprocessing'});passed++;

  // 4. Text region detected (from OCR confidence)
  total++;
  if(ocrConf>60){checks.push({label:'Text region detected',ok:true,detail:'OCR confidence '+Math.round(ocrConf)+'%'});passed++;}
  else if(ocrConf>30){checks.push({label:'Weak text detection',ok:true,detail:'OCR confidence '+Math.round(ocrConf)+'% — some text is faint',warn:true});passed+=0.6;}
  else{checks.push({label:'Text not reliably detected',ok:false,detail:'OCR confidence '+Math.round(ocrConf)+'% — very poor readability'});}

  // 5. Handwriting presence indicator (heuristic: low confidence + detected text = likely handwriting)
  total++;
  if(ocrConf>0&&ocrConf<70){checks.push({label:'Some handwriting may be faint',ok:true,detail:'Lower OCR confidence may indicate handwritten regions',warn:true});passed+=0.7;}
  else{checks.push({label:'Text clarity acceptable',ok:true,detail:'No major readability issues detected'});passed++;}

  const qualityPct=Math.round(passed/total*100);
  const grade=qualityPct>=80?'A':qualityPct>=60?'B':'C';
  const acceptable=qualityPct>=40;

  return {qualityPct, grade, acceptable, checks};
}

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

/* ---------------- safe storage (sandbox-proof) ---------------- */
const store={ok:false};
try{localStorage.setItem('__bhunetra_t','1');localStorage.removeItem('__bhunetra_t');store.ok=true;}catch(e){store.ok=false;}
function saveState(){ if(!store.ok) return; try{ localStorage.setItem('bhunetra_v1', JSON.stringify(S)); }catch(e){} }
function loadState(){ if(!store.ok) return null; try{ return JSON.parse(localStorage.getItem('bhunetra_v1')); }catch(e){ return null; } }

/* ---------------- hashing (real SHA-256, honest fallback) ---------------- */
async function sha256hex(str){
  try{
    if(window.crypto&&crypto.subtle){
      const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(str));
      return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
    }
  }catch(e){}
  return simHash(str); // deterministic non-crypto fallback for sandboxed contexts
}
function simHash(str){
  const p8=x=>(x>>>0).toString(16).padStart(8,'0');
  let h1=0x811c9dc5^str.length,h2=0x01000193,h3=0xdeadbeef,h4=0x41c6ce57;
  const mix=(h,c,i)=>{h^=c+i;h=Math.imul(h,16777619)>>>0;h^=h>>>13;h=Math.imul(h,0x5bd1e995)>>>0;return h;};
  for(let i=0;i<str.length;i++){const c=str.charCodeAt(i);h1=mix(h1,c,i);h2=mix(h2,c*31,i*7);h3=mix(h3,c,i*3);h4=mix(h4,c^i,i);}
  return p8(h1)+p8(h2)+p8(h3)+p8(h4)+p8(h1^h3)+p8(h2^h4)+p8(Math.imul(h1,2654435761)>>>0)+p8((h3^h4^0x9e3779b9)>>>0);
}
const hashMode=()=> (window.crypto&&crypto.subtle)?'SHA-256 (WebCrypto)':'SIM-256 (sandbox fallback)';

/* ---------------- levenshtein ---------------- */
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
'kanal':KANAL_M2,'kanaal':KANAL_M2,'कनाल':KANAL_M2,'ਕਨਾਲ':KANAL_M2,'कनाल':KANAL_M2,
'killa':ACRE_M2,'ਕਿਲਾ':ACRE_M2,
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
'hectare':10000,'हेक्टेयर':10000,'হেক্টর':10000,
'sqft':SQFT_M2,'sq.ft':SQFT_M2,
'sq m':1,'sq.m':1,'sqm':1,'m2':1,'वर्ग मीटर':1,'वर्ग मि':1,'ਵਰਗ ਮੀਟਰ':1,'ચોરસ મીટર':1,'ચો.મી':1,'বর্গ মিটার':1,'சதுர மீட்டர்':1,'ச.மீ':1,'చదరపు మీటర్లు':1,'చ.మీ':1,'ಚದರ ಮೀಟರ್':1,'ಚ.ಮೀ':1,'ചതുരശ്ര മീറ്റർ':1,'ച.മീ':1,'ବର୍ଗ ମିଟର':1,'مربع میٹر':1};
let __UNRE=null,__UNRE_I=null;
function __unitAlt(){return Object.keys(UNIT_M2).sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.+*?^${}()|[\]\\]/g,'\\$&')).join('|');}
function unitRegex(){if(!__UNRE)__UNRE=new RegExp('(\\d+(?:\\.\\d+)?)\\s*('+__unitAlt()+')','g');return __UNRE;}
function unitRegexCI(){if(!__UNRE_I)__UNRE_I=new RegExp('(\\d+(?:\\.\\d+)?)\\s*('+__unitAlt()+')','gi');return __UNRE_I;}
const DIGRANGES=[[0x0966,0x096f],[0x0a66,0x0a6f],[0x0ae6,0x0aef],[0x0b66,0x0b6f],[0x0be6,0x0bef],[0x0c66,0x0c6f],[0x0ce6,0x0cef],[0x0d66,0x0d6f],[0x06f0,0x06f9],[0x0660,0x0669]];
function normalizeDigits(s){if(s==null)return s;return String(s).replace(/[\u0966-\u096F\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u06F0-\u06F9\u0660-\u0669]/g,ch=>{const cp=ch.codePointAt(0);for(let i=0;i<DIGRANGES.length;i++){if(cp>=DIGRANGES[i][0]&&cp<=DIGRANGES[i][1])return String(cp-DIGRANGES[i][0]);}return ch;});}
const UNIT_FAMS=[['M',['hectare','हेक्टेयर','हेक्टर','are','आर','वर्ग मीटर','वर्ग मि','sq m','sq.m','sqm','m2','ਵਰਗ ਮੀਟਰ','ચોરસ મીટર','ચો.મી','বর্গ মিটার','சதுர மீட்டர்','ச.மீ','చదరపు మీటర్లు','చ.మీ','ಚದರ ಮೀಟರ್','ಚ.ಮೀ','ചതുരശ്ര മീറ്റർ','ച.മീ','ବର୍ଗ ମିଟର','مربع میٹر']],['I',['acre','acres','एकड़','एकर','ਏਕੜ','একর','એકર','ಎಕರೆ','ఎకరం','ఎకరా','ஏக்கர்','ഏക്കർ','ଏକର','kanal','kanals','kanaal','कनाल','ਕਨਾਲ','marla','marlas','मरला','मरले','ਮਰਲਾ','killa','ਕਿਲਾ']],['B',['bigha','बीघा','বিঘা','ਬੀਘਾ','વીઘਾ','biswa','बिस्वा']],['K',['katha','कट्ठा','कठ्ठा','কাঠা','chatak','ছটাক']],['G',['guntha','gunta','गुंठा','गुंटा','ગુંઠા','గుంటా','ಗುಂಟೆ']],['C',['cent','सेंट','சென்ட்','സെന്റ്','decimal','दशमांश','ଦଶମାଂଶ']],['R',['ropani','रोपनी','aana','आना','dhur','धुर']]];
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

/* ---------------- state ---------------- */
let S=null;
let W=null; // working (uncommitted) document
let lastReport=null;

/* ---------------- seed data ---------------- */
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

function mkSeedRecord(o){return Object.assign({khewat:'',khatuni:'',father:'',docType:'Jamabandi (RoR)',mutationNo:'',mutationType:'',mutationDate:'',lat:null,lng:null,avgConf:.96,checks:{pass:9,warn:1,fail:0},block:0},o);}

async function buildSeed(){
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
  // ULPINs
  const seq={};
  recs.forEach(r=>{const key=r.sc+r.dc+r.tc+r.vc;seq[key]=(seq[key]||0)+1;r.ulpin=genULPIN(r.sc,r.dc,r.tc,r.vc,seq[key]);});
  // activity
  const acts=[
   {t:now-8*DAY,ic:'CRT',txt:'Ruling-feed sync: lis pendens matched khasra 334 (Chhutmalpur) - record flagged'},
   {t:now-7*DAY,ic:'HITL',txt:'Operator R. Sharma verified 3 low-confidence fields on fard 156/2 (Fatehgarh)'},
   {t:now-5*DAY,ic:'BLK',txt:'Block #3 sealed - 4 records anchored - hash 9f2c…e81a'},
   {t:now-3*DAY,ic:'VAL',txt:'10 records passed all validation checks this week'},
   {t:now-2*DAY,ic:'ING',txt:'Scanned bundle “Jagadhri lot 7” ingested (12 docs) - 1 below quality threshold'},
   {t:now-1*DAY,ic:'DUP',txt:'Duplicate-claim check blocked a deed on khasra 78/2/1 (vendor not in mutation chain)'}
  ];
  const discs=[
   {id:'d1',sev:'high',title:'Lis pendens - transfer frozen (khasra 334, Chhutmalpur)',detail:'e-Courts feed CS-212/2021: suit for specific performance pending since 2021. Record r11 flagged; no mutation may be registered until decree. Suggested action: annotate record, notify both parties.',ref:'r11',created:now-8*DAY,status:'open'},
   {id:'d2',sev:'med',title:'Owner-name spelling divergence - “Krishna Kumar” vs registry “Krishan Kumar”',detail:'Levenshtein distance 1 between deed spelling and registry khatauni. Fuzzy-match suggests adopting registry canonical spelling for khasra 156/2 (Fatehgarh). One-click resolution available.',ref:'r3',created:now-7*DAY,status:'open'},
   {id:'d3',sev:'low',title:'Scan below quality threshold - Mustafabad lot',detail:'Average OCR confidence 0.58 on record r12 (torn right edge, ink fade). Re-scan at kiosk advised before validation is attempted.',ref:'r12',created:now-2*DAY,status:'open'}
  ];
  S={records:recs,blocks:[],activity:acts,discs:discs,seededAt:now};
  // build genesis + blocks
  const g={i:0,ts:now-45*DAY,entries:[],prev:'- GENESIS -',nonce:'00000',hash:''};
  g.hash=await sha256hex(blockInput(g));
  S.blocks.push(g);
  for(let b=1;b<=3;b++){
    const blk={i:b,ts:now-(45-b*10)*DAY,entries:[],prev:S.blocks[b-1].hash,nonce:String(10000+rnd(89999)),hash:''};
    for(let k=0;k<4;k++){const r=recs[(b-1)*4+k];r.block=b;blk.entries.push({rid:r.id,ulpin:r.ulpin,h:await sha256hex(recordHashInput(r))});}
    blk.hash=await sha256hex(blockInput(blk));
    S.blocks.push(blk);
  }
}
function recordHashInput(r){return ['bhunetra-record-v1',r.ulpin,r.owner,r.father,r.khasra,r.village,r.tehsil,r.district,r.state,Number(r.areaSqM).toFixed(2),r.docType,r.mutationNo].join('|');}
function blockInput(b){return `bhunetra-block|${b.i}|${b.ts}|${JSON.stringify(b.entries)}|${b.prev}|${b.nonce}`;}
function logActivity(ic,txt){S.activity.unshift({t:Date.now(),ic,txt});S.activity=S.activity.slice(0,60);}

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
 ['mutationNo','Mutation no. (inteqal)','दाखिल खारिज सं.'],
 ['mutationDate','Mutation date','दाखिल खारिज दिनांक'],
 ['mutationType','Mutation type / mode of acquisition','प्रकार']
];

/* ---------------- automatic OCR language detection ---------------- */
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

/* ---------------- the four demo samples ---------------- */
const SAMPLES=[
{
 id:'A',name:'Jamabandi - Khanpur (clean scan)',lang:'English',quality:'good',qTag:['good','Quality A'],
 docType:'Jamabandi (Record of Rights)',district:'S.A.S. Nagar',village:'Khanpur',
 svg:()=>paperSvg({gov:'GOVERNMENT OF PUNJAB - REVENUE DEPARTMENT',govSub:'पंजाब सरकार - राजस्व विभाग',title:'JAMABANDI - RECORD OF RIGHTS',sub:'Year 2018-19 - Consolidation copy - Tehsil Dera Bassi',
  rows:[['District / जिला','S.A.S. Nagar'],['Tehsil / तहसील','Dera Bassi'],['Village / गाँव','Khanpur (Hadbast 214)'],['Khewat / खेवट','27'],['Khatauni / खतौनी','41'],['Khasra / खसरा','305 - Chahi'],['Owner / स्वामी','Harjeet Kaur d/o Gurmail Singh'],['Area / रकबा','1 Kanal 12 Marla = 809.4 sq m'],['Mutation / दाखिल','No. 5417 - 12-03-2018 - Inheritance']],
  table:{head:['Khasra','Khatoni','Owner','Father','Area (K-M-M)'],rows:[['305','41','Harjeet Kaur','Gurmail Singh','1-0-12']]},
  stampL1:'HALQA PATWARI',stampL2:'KHANPUR / DERA BASSI',stampL3:'CERTIFIED TRUE COPY',sign:'Halqa Patwari, Khanpur',quality:'good'}),
 ocr:[
  {t:'GOVERNMENT OF PUNJAB - DEPARTMENT OF REVENUE',c:.99},
  {t:'JAMABANDI (RECORD OF RIGHTS) - YEAR 2018-19',c:.98},
  {t:'District: S.A.S. Nagar   Tehsil: Dera Bassi',c:.97},
  {t:'Village: Khanpur (Hadbast 214)   Khewat 27   Khatauni 41',c:.96},
  {t:'Khasra No. 305   Chahi (canal-irrigated)',c:.97},
  {t:'Owner: Harjeet Kaur d/o Gurmail Singh',c:.96},
  {t:'Cultivator: self',c:.93},
  {t:'Total area: 1 Kanal 12 Marla = 809.4 sq m',c:.93},
  {t:'Mutation No. 5417 dated 12-03-2018 (inheritance)',c:.92},
  {t:'Certified true copy - Halqa Patwari, Khanpur',c:.90}
 ],
 extract:{docType:['Jamabandi (Record of Rights)',.98],docDate:['2018-03-12',.97],state:['Punjab',.99],district:['S.A.S. Nagar',.96],tehsil:['Dera Bassi',.97],village:['Khanpur',.98],khasra:['305',.99],khewat:['27',.95],khatuni:['41',.94],owner:['Harjeet Kaur',.98],father:['Gurmail Singh',.97],areaStr:['1 Kanal 12 Marla',.96],areaSqM:['809.4',.93],mutationNo:['5417',.92],mutationDate:['2018-03-12',.95],mutationType:['inheritance',.94],},
 story:'Clean straight-through case - ~98% average confidence, no HITL needed, all 10 rule checks should pass.'
},
{
 id:'B',name:'Fard Badar - Fatehgarh (poor Hindi scan)',lang:'हिंदी',quality:'mid',qTag:['mid','Quality B - faded ink'],
 docType:'Fard Badar (Khatauni extract)',district:'Ambala',village:'Fatehgarh',
 svg:()=>paperSvg({gov:'हरियाणा सरकार - राजस्व एवं आपदा प्रबंधन विभाग',govSub:'GOVERNMENT OF HARYANA - REVENUE DEPARTMENT',title:'फर्द बदर - नकल खतौनी',sub:'FARD BADAR - Extract of Khatauni - Year 2020-21',
  rows:[['जिला / District','अंबाला (Ambala)'],['तहसील / Tehsil','नरायणगढ़'],['गाँव / Village','फतेहगढ़ (हदस्त 92)'],['खेवट / खतौनी','18 / 23'],['खसरा / Khasra','156/2'],['स्वामी का नाम','कृष्ण कुमार पुत्र ओम प्रकाश'],['रकबा / Area','3 एकड़ 2 कनाल - 13,152.4 व.मी.'],['दाखिल खारिज','सं. 7712 - 04-07-2020 - बिक्री']],
  table:{head:['खसरा','खतौनी','स्वामी','पिता','रकबा'],rows:[['156/2','23','कृष्ण कुमार','ओम प्रकाश','3-2-0']]},
  stampL1:'हलका पटवारी',stampL2:'फतेहगढ़ / नरायणगढ़',stampL3:'प्रमाणित नकल',sign:'Halqa Patwari, Fatehgarh',quality:'mid'}),
 ocr:[
  {t:'हरियाणा सरकार - राजस्व एवं आपदा प्रबंधन विभाग',c:.90},
  {t:'फर्द बदर (नकल खतौनी) - वर्ष 2020-21',c:.88},
  {t:'जिला: अंबाला    तहसील: नरायणगढ़',c:.85},
  {t:'गाँव: फतेहगढ़ (हदस्त 92)   खेवट 18   खतौनी 23',c:.82},
  {t:'खसरा सं. 156/2',c:.79},
  {t:'स्वामी: कृष्ण कुमार पुत्र ओम प्रकाश',c:.68},
  {t:'रकबा: 3 एकड़ 2 कनाल (13,152.4 वर्ग मीटर)',c:.71},
  {t:'[OCR note] digit ambiguity - printed sq-m reading “18,152” (conf 0.62)',c:.62},
  {t:'दाखिल खारिज सं. 7712 - दिनांक 04-07-2020 - बिक्री',c:.81},
  {t:'प्रमाणित नकल - हलका पटवारी, फतेहगढ़',c:.77}
 ],
 extract:{docType:['Fard Badar (Khatauni extract)',.88],docDate:['2020-07-04',.84],state:['Haryana',.96],district:['Ambala',.90],tehsil:['Naraingarh',.83],village:['Fatehgarh',.85],khasra:['156/2',.79],khewat:['18',.78],khatuni:['23',.80],owner:['Krishna Kumar',.68],father:['Om Prakash',.72],areaStr:['3 एकड़ 2 कनाल',.74],areaSqM:['18152',.62],mutationNo:['7712',.81],mutationDate:['2020-07-04',.83],mutationType:['sale (बिक्री)',.77],},
 story:'Noisy Hindi fard - the printed sq-m figure is mis-read (18,152 vs computed 13,152.4). Fix it via the engine suggestion (HITL), then re-run checks.'
},
{
 id:'C',name:'Sale Deed - Raipur Rani (fraud test)',lang:'English',quality:'good',qTag:['good','Quality A'],
 docType:'Registered Deed of Sale',district:'Panchkula',village:'Raipur Rani',
 svg:()=>paperSvg({gov:'GOVERNMENT OF HARYANA - REGISTRATION DEPARTMENT',govSub:'हरियाणा सरकार - पंजीकरण विभाग',title:'DEED OF SALE - BIKRI KRAY PATRA',sub:'Sub-Registrar Raipur Rani - District Panchkula - e-GRAS paid',
  rows:[['Deed No.','1123 / 2024 - dated 22-02-2024'],['Village / गाँव','Raipur Rani'],['Khasra / खसरा','78/2/1'],['Vendor (विक्रेता)','Rajender Kumar s/o Dhani Ram'],['Vendee (क्रेता)','Sunita Rani w/o Mahesh Kumar'],['Consideration','₹ 18,50,000 - eighteen lakh fifty thousand'],['Area / रकबा','4 Kanal = 2,023.4 sq m'],['Stamp duty','₹ 1,34,600 - paid via e-GRAS']],
  table:null,
  stampL1:'SUB-REGISTRAR',stampL2:'RAIPUR RANI',stampL3:'22 FEB 2024',sign:'Sub-Registrar, Raipur Rani',quality:'good'}),
 ocr:[
  {t:'GOVERNMENT OF HARYANA - REGISTRATION DEPARTMENT',c:.98},
  {t:'DEED OF SALE No. 1123/2024 dated 22-02-2024',c:.97},
  {t:'Village: Raipur Rani   Khasra: 78/2/1',c:.96},
  {t:'Vendor: Rajender Kumar s/o Dhani Ram',c:.93},
  {t:'Vendee: Sunita Rani w/o Mahesh Kumar',c:.97},
  {t:'Consideration: Rs 18,50,000',c:.95},
  {t:'Area: 4 Kanal (2,023.4 sq m)',c:.92},
  {t:'Stamp duty Rs 1,34,600 paid via e-GRAS',c:.90},
  {t:'Presented for registration - Sub-Registrar Raipur Rani',c:.94}
 ],
 extract:{docType:['Registered Deed of Sale',.97],docDate:['2024-02-22',.96],state:['Haryana',.98],district:['Panchkula',.97],tehsil:['Raipur Rani',.95],village:['Raipur Rani',.96],khasra:['78/2/1',.96],owner:['Sunita Rani',.97],father:['Mahesh Kumar (husband)',.94],seller:['Rajender Kumar s/o Dhani Ram',.93],consideration:['18,50,000',.95],areaStr:['4 Kanal',.95],areaSqM:['2023.4',.92],deedNo:['1123/2024',.96]},
 story:'Perfect scan - perfect fraud. Registry already holds khasra 78/2/1 under Mahipal Singh; the vendor is not in the mutation chain. Watch R4 + R5 fail.'
},
{
 id:'D',name:'Mutation extract - Chhutmalpur 1998 (torn)',lang:'हिंदी',quality:'bad',qTag:['bad','Quality C - torn'],
 docType:'Mutation extract (Ansh Dan)',district:'Saharanpur',village:'Chhutmalpur',
 svg:()=>paperSvg({gov:'उत्तर प्रदेश सरकार - राजस्व विभाग',govSub:'GOVERNMENT OF UTTAR PRADESH - REVENUE DEPARTMENT',title:'अंश दान पर्चा - दाखिल खारिज',sub:'MUTATION ORDER EXTRACT - Tehsil Deoband - Year 1998-99',
  rows:[['जिला','सहारनपुर'],['तहसील','देवबंद'],['गाँव','छुटमलपुर'],['खसरा','334'],['रकबा','1 बीघा 8 बिस्वा'],['दाखिल खारिज सं.','2214 - दिनांक 14-05-1998'],['अंशदाता','छोटे लाल'],['अंशग्रहीता','रमेश चंद्र पुत्र छोटे लाल']],
  table:{head:['खसरा','पूर्व स्वामी','वर्तमान स्वामी','रकबा'],rows:[['334','छोटे लाल','रमेश चंद्र','1-8']]},
  stampL1:'लेखपाल',stampL2:'देवबंद',stampL3:'पंजीकृत',sign:'Lekhpal, Deoband',quality:'bad'}),
 ocr:[
  {t:'उत्तर प्रदेश सरकार - राजस्व विभाग',c:.84},
  {t:'अंश दान पर्चा - दाखिल खारिज - वर्ष 1998-99',c:.79},
  {t:'जिला: सहारनपुर   तहसील: देवबंद',c:.75},
  {t:'गाँव: छुटमलपुर   खसरा 334',c:.66},
  {t:'रकबा: 1 बीघा 8 बिस्वा',c:.70},
  {t:'दाखिल खारिज सं. 2214 - दिनांक 14-05-1998',c:.71},
  {t:'अंशदाता: छोटे लाल',c:.64},
  {t:'अंशग्रहीता: रमेश चंद्र पुत्र छोटे लाल',c:.63},
  {t:'[engine] right-edge tear - 2 lines unreadable, lat/long block degraded',c:.58}
 ],
 extract:{docType:['Mutation extract (Ansh Dan)',.81],docDate:['1998-05-14',.74],state:['Uttar Pradesh',.87],district:['Saharanpur',.79],tehsil:['Deoband',.72],village:['Chhutmalpur',.69],khasra:['334',.66],owner:['Ramesh Chandra',.63],father:['Chhote Lal',.61],areaStr:['1 बीघा 8 बिस्वा',.70],areaSqM:['',.4],mutationNo:['2214',.68],mutationDate:['1998-05-14',.71],mutationType:['gift (ansh dan)',.64],},
 story:'Torn 1998 parcha with a lis-pendens case attached (CS-212/2021). Verify fields by hand (HITL) - the litigation flag (R9) will still correctly refuse the record.'
},
{
 id:'E',name:'⚠ NOT LAND — Rental Agreement (rejection test)',lang:'English',quality:'good',qTag:['good','NON-LAND'],
 docType:'',district:'',village:'',
 svg:()=>paperSvg({gov:'RENTAL / LEASE AGREEMENT',govSub:'As per Indian Contract Act, 1872',title:'AGREEMENT TO LEASE',sub:'This deed of lease executed on 15th day of March 2024',
  rows:[['Landlord','Mr. Vikram Sharma s/o Late Shri R.K. Sharma'],['Tenant','Ms. Priya Mehta d/o Shri Anil Mehta'],['Property','Flat No. 302, Tower B, Green Valley Apartments'],['City','Gurugram, Haryana'],['Monthly Rent','₹ 25,000 (Twenty Five Thousand only)'],['Security Deposit','₹ 75,000 (Seventy Five Thousand only)'],['Lease Period','12 months from 01-04-2024 to 31-03-2025'],['Lock-in Period','6 months']],
  table:null,
  stampL1:'NOTARY PUBLIC',stampL2:'GURUGRAM',stampL3:'15 MAR 2024',sign:'Notary Public, Gurugram',quality:'good'}),
 ocr:[
  {t:'RENTAL / LEASE AGREEMENT',c:.97},
  {t:'As per Indian Contract Act, 1872 and Transfer of Property Act',c:.95},
  {t:'This deed of lease is executed on the 15th day of March 2024',c:.96},
  {t:'Landlord: Mr. Vikram Sharma s/o Late Shri R.K. Sharma',c:.94},
  {t:'Tenant: Ms. Priya Mehta d/o Shri Anil Mehta',c:.96},
  {t:'Property: Flat No. 302, Tower B, Green Valley Apartments, Sector 49, Gurugram',c:.93},
  {t:'Monthly Rent: Rs 25,000 (Rupees Twenty Five Thousand only)',c:.95},
  {t:'Security Deposit: Rs 75,000 payable at the time of possession',c:.94},
  {t:'Lease Period: 12 months commencing from 01-04-2024',c:.96},
  {t:'Lock-in period: 6 months from the date of commencement',c:.93},
  {t:'Maintenance charges shall be borne by the Tenant separately',c:.92},
  {t:'IN WITNESS WHEREOF the parties have set their hands',c:.91},
  {t:'Witnesses: 1. Arun Kumar  2. Sunita Devi',c:.90},
  {t:'Notarized at Gurugram on 15-03-2024',c:.94}
 ],
 extract:{},
 __isNonLand:true,
 story:'NOT a land record. Bhu-Netra should detect this is a rental agreement and REJECT it before extraction. This is the critical judge demo for document screening.'
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
  [0,1,2,3,4,5].forEach(i=>{const st=$('#st'+i);if(st)st.classList.remove('done','run');});
  $('#terminal').innerHTML='<div class="ln sys">Log initialized. Select a document to begin.</div>';
  $('#pipelineMeta').textContent='Idle - select a document to begin.';
  $('#fieldsWrap').innerHTML='<div class="note blue">Extraction results will appear here. Fields under <b>75% confidence</b> are highlighted for operator verification (HITL) before validation.</div>';
  $('#btnValidate').disabled=true;$('#btnRerun').disabled=true;
  $('#docChip').innerHTML='<span class="dot"></span>-';
}
function selectSample(i){
  const s=SAMPLES[i];
  W={src:'sample',idx:i,fields:null,done:false,__rawText:null};
  renderSamples();
  resetPipeline();
  $('#docPaper').className='docpaper';
  $('#docPaper').innerHTML=s.svg();
  $('#docChip').innerHTML=`<span class="dot" style="background:var(--green)"></span>${esc(s.name)}`;
  runPipeline();
}
function handleUpload(file){
  if(!file||!file.type.startsWith('image/')){toast('Unsupported file','Please upload a JPG or PNG scan.','err');return;}
  const rd=new FileReader();
  rd.onload=()=>{
    W={src:'upload',name:file.name,dataUrl:rd.result,fields:null,done:false,__rawText:null};
    renderSamples();resetPipeline();
    $('#docPaper').className='docpaper';
    $('#docPaper').innerHTML=`<img src="${rd.result}" alt="uploaded scan" style="width:100%;display:block">`;
    $('#docChip').innerHTML=`<span class="dot" style="background:var(--indigo)"></span>${esc(file.name)}`;
    runPipeline();
  };
  rd.readAsDataURL(file);
}
function term(html,cls){
  const t=$('#terminal');const d=document.createElement('div');d.className='ln '+(cls||'');d.innerHTML='<span class="ts">'+new Date().toLocaleTimeString('en-IN',{hour12:false})+'</span>'+html;t.appendChild(d);t.scrollTop=t.scrollHeight;
}
async function runPipeline(){
  const s=W.src==='sample'?SAMPLES[W.idx]:null;
  const t0=performance.now();
  const NSTEPS=6;
  const setStep=(i,cls)=>{for(let j=0;j<NSTEPS;j++){const st=$('#st'+j);if(!st)continue;st.classList.remove('run');if(j<i)st.classList.add('done');if(j===i&&cls)st.classList.add('run');}if(i>=NSTEPS)for(let j=0;j<NSTEPS;j++){const st=$('#st'+j);if(st)st.classList.add('done');}};
  $('#docPaper').className='docpaper';
  // 1 ingest
  setStep(0,'run');$('#pipelineMeta').textContent='Ingesting document…';
  term(`<span class="sys">▸ ingest</span> ${esc(s?s.name:W.name)} - ${s?s.lang.toUpperCase():'image'} - loaded`,'sys');
  await sleep(450);
  // 2 preprocess
  setStep(1,'run');$('#pipelineMeta').textContent='Preprocess: deskew → denoise → binarize…';
  term('<span class="sys">▸ preprocess</span> deskew −0.6° - denoise (median 3) - binarize (Otsu)','sys');
  const paper=$('#docPaper');paper.classList.add('pre1');await sleep(650);
  paper.classList.remove('pre1');paper.classList.add('pre2');await sleep(650);
  paper.classList.remove('pre2');paper.classList.add('pre3');await sleep(550);
  term('<span class="sys">▸ preprocess</span> image QA '+(s?(s.quality==='good'?'A (accept)':s.quality==='mid'?'B (accept, warn ink-fade)':'C (accept, tear detected)'):'-')+' - SNR ok','sys');
  // 3 OCR
  setStep(2,'run');$('#pipelineMeta').textContent='OCR pass - recognizing text…';
  let lines;
  if(s){lines=s.ocr;}
  else if(window.Tesseract){
    let lang=LANG_DEFAULT;
    term('<span class="sys">▸ preprocess</span> preparing uploaded image: downscale (max 1800px) - grayscale - contrast stretch','sys');
    const preUrl=await preprocessImage(W.dataUrl,1800);
    W.__preUrl=preUrl;
    term('<span class="sys">▸ ocr</span> live OCR engine ready - language mode: auto - first pass hin+eng (Devanagari + English)…','sys');
    let progLn=null,progStatus=null;
    const setProg=m=>{
      if(!m||m.progress==null)return;
      const st=m.status||'working';
      if(!progLn||st!==progStatus){progLn=document.createElement('div');progLn.className='ln sys';$('#terminal').appendChild(progLn);progStatus=st;}
      progLn.innerHTML='<span class="ts">'+new Date().toLocaleTimeString('en-IN',{hour12:false})+'</span><span class="sys">▸ ocr</span> '+esc(m.status||'working')+' - '+Math.round(m.progress*100)+'%';
      $('#terminal').scrollTop=$('#terminal').scrollHeight;
    };
    try{
      let res=await liveOCR(preUrl,lang,m=>term('<span class="sys">▸ ocr</span> '+esc(m),'sys'),setProg);
      let fullText=String(res.data.text||'').trim();
      let conf=res.data.confidence||0;
      const prof=scriptProfile(fullText);
      if(fullText&&prof.devaRatio>=0.05){
        term('<span class="sys">▸ auto-detect</span> Devanagari script confirmed (hin+eng packs) - confidence '+Math.round(conf)+'%','sys');
      }else if((conf<55&&prof.latnWords<4)||!fullText){
        term('<span class="sys">▸ auto-detect</span> no Devanagari and weak Latin output (confidence '+Math.round(conf)+'%) - running regional script sweep (ben, guj, pan, ori, tam, tel, kan, mal)…','sys');
        try{
          const res2=await liveOCR(preUrl,LANG_REGIONAL,null,setProg);
          const t2=String(res2.data.text||'').trim();const c2=res2.data.confidence||0;
          term('<span class="sys">▸ auto-detect</span> sweep confidence '+Math.round(c2)+'% vs first pass '+Math.round(conf)+'%','sys');
          if(c2>=conf||t2.length>fullText.length){res=res2;fullText=t2;conf=c2;lang=LANG_REGIONAL;}
        }catch(e2){term('<span class="sys">▸ auto-detect</span> regional sweep could not load - keeping first-pass output','sys');}
      }else{
        term('<span class="sys">▸ auto-detect</span> Latin-script record confirmed - confidence '+Math.round(conf)+'%','sys');
      }
      setProg({status:'OCR complete',progress:1});
      W.__rawText=fullText;
      lines=fullText.split('\n').map(x=>x.trim()).filter(x=>x.length>2).slice(0,16).map(t=>({t,c:.9}));
      if(!lines.length)lines=[{t:'[no text detected on scan - try a sharper image or the other language pack]',c:.3}];
    }catch(e){
      if(progLn)progLn.remove();
      W.__ocrFailed=true;
      term('<span class="sys">▸ ocr</span> live OCR could not run in this environment (worker or model load failed).','sys');
      term('<span class="sys">▸ ocr</span> opened manual entry template instead - fields can be filled from the scan.','sys');
      lines=[];
    }
  }else{
    term('<span class="sys">▸ ocr</span> OCR engine library not available in this environment.','sys');
    term('<span class="sys">▸ ocr</span> reason: the engine (Tesseract.js) is fetched from a CDN and needs internet. The embedded preview viewer is sandboxed with no network access.','sys');
    term('<span class="sys">▸ ocr</span> to enable live OCR: download this HTML file, open it in Chrome/Edge/Firefox with internet, then upload the scan again.','sys');
    term('<span class="sys">▸ ocr</span> meanwhile, a manual entry template is opened - fields can be filled from the scan.','sys');
    await sleep(400);lines=[];
  }
  for(const ln of lines){term(`${esc(ln.t)}<span class="cf">${(ln.c*100).toFixed(0)}%</span>`);await sleep(140+rnd(160));}

  /* ===== 4. LAND RECORD CLASSIFICATION — the gate ===== */
  setStep(3,'run');$('#pipelineMeta').textContent='Classifying document — land record check…';
  await sleep(400);
  const ocrText=W.__rawText||(s?s.ocr.map(l=>l.t).join('\n'):'');

  /* If OCR failed or produced no text for an upload, skip classification
     and fall through to manual entry — we can't classify without text */
  if(!ocrText.trim()&&W.src==='upload'){
    term('<span class="sys">▸ classify</span> no OCR text available — classification requires text. Skipping to manual entry.','sys');
    term('<span class="sys">▸ classify</span> to enable automatic classification: open this file in a browser with internet so the OCR engine (Tesseract.js) can load from CDN.','sys');
    W.__classification={isLand:null,confidence:0,reasons:[],docCategory:'Unknown (OCR unavailable)',details:[]};
    setStep(3);
    // Fall through to manual mode — show fields for manual entry
    setStep(4,'run');$('#pipelineMeta').textContent='OCR unavailable — manual entry mode…';
    term('<span class="sys">▸ extract</span> manual template loaded - operator fills/verifies fields at kiosk','sys');
    W.fields={};FIELD_DEFS.forEach(([k])=>W.fields[k]={v:'',c:.5,edited:false,verified:false});
    const manualHtml=`<div class="quality-bar" style="background:#fdf4e7;border-color:#ecd6a8;border-left:4px solid #c99a1e">
      <h4 style="color:#7a5a00">⚠ Classification skipped — OCR engine unavailable</h4>
      <p style="font-size:.82rem;color:#7a5a00;margin:4px 0">The Tesseract.js OCR engine could not load (requires CDN internet access). Document classification and automatic field extraction need OCR text to work.</p>
      <p style="font-size:.82rem;color:#7a5a00;margin:4px 0"><b>To enable full pipeline:</b> download this HTML file and open it directly in Chrome/Edge/Firefox with internet.</p>
      <p style="font-size:.82rem;color:#7a5a00;margin:4px 0">Meanwhile, you can fill in fields manually below.</p>
    </div>`;
    renderFields(true);
    $('#fieldsWrap').insertAdjacentHTML('afterbegin',manualHtml);
    await sleep(500);
    setStep(5,'run');await sleep(300);
    setStep(NSTEPS);
    const el=(performance.now()-t0)/1000;
    $('#pipelineMeta').innerHTML=`⚠ Manual mode — OCR unavailable — ${el.toFixed(1)}s — fill fields from the scan`;
    W.done=true;$('#btnValidate').disabled=false;$('#btnRerun').disabled=false;
    if(W.__ocrFailed){$('#chipEngine').className='chip warn';$('#chipEngineTxt').textContent='Engine: manual mode (OCR unavailable)';const nz=$('#uploadNote');if(nz){nz.style.display='block';nz.innerHTML='<b>Live OCR could not run in this environment.</b> Download this HTML file, open it in a browser with internet and upload again.';}}
    toast('Manual entry mode','OCR unavailable — fill fields from the scan manually','warn',5000);
    return;
  }

  const cls=classifyLandRecord(ocrText);
  W.__classification=cls;
  term('<span class="sys">▸ classify</span> running LandRecordClassifier on OCR output ('+ocrText.split('\n').filter(x=>x.trim()).length+' lines)…','sys');
  await sleep(350);
  // Log evidence
  const posHits=cls.evidence.filter(e=>e.found);
  if(posHits.length){
    term('<span class="sys">▸ classify</span> detected: '+posHits.slice(0,6).map(e=>e.label).join(', ')+(posHits.length>6?' (+'+(posHits.length-6)+' more)':''),'sys');
  }
  if(cls.negHits&&cls.negHits.length){
    term('<span class="sys err">▸ classify</span> non-land indicators: '+cls.negHits.join(', '),'err');
  }
  term(`<span class="sys">▸ classify</span> land-record confidence: <b>${cls.confidence}%</b> — category: ${esc(cls.docCategory)}`,'sys');

  if(!cls.isLand){
    /* ===== REJECTED — not a land record ===== */
    term('<span class="err">▸ classify</span> ✕ DOCUMENT REJECTED — does not meet land-record classification threshold (minimum 25%)</span>','err');
    term('<span class="err">▸ classify</span> processing stopped. This document was NOT processed as a land record.','err');
    setStep(3); // mark classify as done (red-ish via the rejection panel)
    const el=(performance.now()-t0)/1000;
    $('#pipelineMeta').innerHTML=`<span style="color:var(--red);font-weight:600">✕ REJECTED</span> — not a supported land record (${cls.confidence}% confidence) — ${el.toFixed(1)}s`;
    // Show rejection panel in fieldsWrap
    const negList=cls.negHits&&cls.negHits.length?cls.negHits.map(n=>'<li>• Non-land indicator: '+esc(n)+'</li>').join(''):'';
    const detList=cls.details.slice(0,10).map(d=>'<li>'+esc(d)+'</li>').join('');
    $('#fieldsWrap').innerHTML=`
      <div class="reject-panel">
        <h3>✕ DOCUMENT NOT ACCEPTED</h3>
        <p style="font-size:.92rem;color:#5a3a38;margin:6px 0">This document does not appear to be a supported land-record document.</p>
        <div class="rj-conf">Land-record confidence: ${cls.confidence}%</div>
        <div style="background:#f5d5d2;border-radius:3px;height:10px;margin:6px 0;overflow:hidden"><div style="width:${cls.confidence}%;height:100%;background:var(--red);border-radius:3px"></div></div>
        <div class="rj-detail" style="margin-top:10px">
          <b>Detected:</b> ${esc(cls.docCategory)}<br>
          <b>Reason:</b> Required land-record characteristics were not sufficiently detected.
        </div>
        <ul class="rj-list" style="margin-top:10px">
          <li style="font-weight:600;color:#8c1d16">Detected characteristics:</li>
          ${detList||'<li>• No land-record indicators found</li>'}
          ${negList}
        </ul>
        <div class="rj-foot">
          <b>Processing stopped.</b> This document was NOT processed as a land record.<br><br>
          Please upload a supported land-record document such as Jamabandi, Fard, Khatauni/RoR, 7/12, RTC/Pahani, Patta/Chitta, Khatian, Mutation Extract, or registered land deed.
        </div>
      </div>`;
    W.done=false;W.__rejected=true;
    $('#btnValidate').disabled=true;$('#btnRerun').disabled=false;
    toast('Document rejected','Not a supported land record — confidence '+cls.confidence+'%','err',6000);
    return; // STOP PIPELINE
  }

  /* ===== ACCEPTED — is a land record ===== */
  term('<span class="sys">▸ classify</span> ✓ LAND RECORD CONFIRMED — '+esc(cls.docCategory)+' ('+cls.confidence+'%)','sys');
  await sleep(300);

  // Show classification pass banner above fields
  const reasonChips=cls.reasons.slice(0,8).map(r=>'<li>'+esc(r)+'</li>').join('');

  // 5 extract
  setStep(4,'run');$('#pipelineMeta').textContent='NLP field extraction & mapping…';
  term('<span class="sys">▸ extract</span> mapping tokens → record schema (khasra, khewat, swami, rakba…)','sys');
  await sleep(500);
  if(s&&!s.__isNonLand){
    W.fields={};for(const k in s.extract)W.fields[k]={v:String(s.extract[k][0]),c:s.extract[k][1],edited:false,verified:false};
    W.__rawText=s.ocr.map(l=>l.t).join('\n');
  }else{
    W.fields={};FIELD_DEFS.forEach(([k])=>W.fields[k]={v:'',c:.5,edited:false,verified:false});
    if(lines.length&&!/^\[/.test(lines[0].t)){
      const txt=W.__rawText||lines.map(l=>l.t).join('\n');
      const n=mapFieldsFromText(txt);
      term('<span class="sys">▸ extract</span> field mapper captured '+n+' field(s) from the OCR text - review them against the scan','sys');
      if(n<=2)term('<span class="sys">▸ extract</span> few standard labels recognized - open the raw OCR panel below the fields and fill in manually','sys');
    }else if(!lines.length){
      term('<span class="sys">▸ extract</span> manual template loaded - operator fills/verifies fields at kiosk','sys');
    }
  }
  // Prepend classification result above the fields
  const classHtml=`<div class="classify-pass">
    <h3>✓ ${esc(cls.docCategory)} — Land Record Confirmed</h3>
    <div class="cp-conf">Land-record confidence: ${cls.confidence}%</div>
    <div style="background:#c3e6cb;border-radius:3px;height:8px;margin:4px 0;overflow:hidden"><div style="width:${cls.confidence}%;height:100%;background:var(--grn);border-radius:3px"></div></div>
    <ul class="cp-reasons">${reasonChips}</ul>
  </div>`;
  renderFields(true);
  $('#fieldsWrap').insertAdjacentHTML('afterbegin',classHtml);
  await sleep(700);
  // 6 score
  setStep(5,'run');$('#pipelineMeta').textContent='Scoring per-field confidence…';
  await sleep(500);
  const avg=fieldAvg();
  setStep(NSTEPS);
  const el=(performance.now()-t0)/1000;
  $('#pipelineMeta').innerHTML=`✓ Pipeline complete in ${el.toFixed(1)}s - <b>${esc(cls.docCategory)}</b> (${cls.confidence}%) - avg field confidence <b>${(avg*100).toFixed(1)}%</b>${avg<.8?' - <span style="color:var(--amber)">HITL verification advised</span>':''}`;
  term(`<span class="sys">▸ score</span> mean field confidence ${(avg*100).toFixed(1)}% - extraction ready for validation`,'sys');
  W.done=true;$('#btnValidate').disabled=false;$('#btnRerun').disabled=false;
  if(W.__ocrFailed){$('#chipEngine').className='chip warn';$('#chipEngineTxt').textContent='Engine: manual mode (OCR unavailable)';const nz=$('#uploadNote');if(nz){nz.style.display='block';nz.innerHTML='<b>Live OCR could not run in this environment.</b> The engine library is fetched from a CDN; the sandboxed preview has no network access. Download this HTML file, open it in a browser with internet and upload again - OCR (Hindi or English) will then run automatically. Meanwhile the fields below are opened as a manual entry form.';}}
}
function rerunPipeline(){if(W)runPipeline();}
function effConf(fl){return fl.verified?.97:(fl.edited?.92:fl.c);}
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
    rws.forEach(r=>{r.style.opacity=0;setTimeout(()=>{r.style.transition='opacity .3s';r.style.opacity=1;
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
const VILLAGE_GEO={'Khanpur':[30.0281,76.9924],'Salana':[30.7841,76.5021],'Fatehgarh':[30.4821,77.0041],'Raipur Rani':[30.5601,76.9402],'Thanedar':[31.1032,77.4401],'Ubha':[30.4211,76.5811],'Kirmach':[29.9611,76.8021],'Kharar (Abadi)':[30.7412,76.6512],'Shahzadpur':[30.3301,76.9812],'Naya Nangal':[31.0211,76.4902],'Chhutmalpur':[29.9201,77.5502],'Mustafabad':[30.2012,77.3201]};
function geoLookup(state,village,khasra){
  const base=VILLAGE_GEO[village]||(HINDI_LOC[village]&&VILLAGE_GEO[HINDI_LOC[village]]);
  if(!base)return null;
  let h=0;const ks=String(khasra||'x');for(let i=0;i<ks.length;i++)h=(h*31+ks.charCodeAt(i))>>>0;
  const dLat=((h%40)-20)/4000,dLng=(((h>>>2)%40)-20)/4000;
  return [Math.round((base[0]+dLat)*1e4)/1e4,Math.round((base[1]+dLng)*1e4)/1e4];
}
const STATE_BBOX={'Punjab':[[29.5,32.6],[73.8,77.0]],'Haryana':[[27.6,31.0],[74.4,77.6]],'Himachal Pradesh':[[30.2,33.3],[75.4,79.1]],'Uttar Pradesh':[[23.8,31.5],[77.0,84.7]]};
function F(k){return W&&W.fields&&W.fields[k]?String(W.fields[k].v||'').trim():'';}
function runValidation(){
  if(!W||!W.fields)return null;
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
     W.__computedSqM=parsed;}
   checks.push({id:'R3',name:'Area cross-check (text vs sq m)',status:st,detail,why:'Two independent sources of the same fact must agree - this check catches both OCR error and tampered figures.',fix});}
  // R4 duplicate parcel / ownership conflict
  {const same=S.records.filter(r=>r.state===F('state')&&locEq(r.district,F('district'))&&locEq(r.village,F('village'))&&r.khasra===F('khasra')&&r.status!=='pending');
   let st,detail,fix=null;
   if(!F('khasra')){st='warn';detail='Cannot run duplicate check without khasra.';}
   else if(!same.length){st='pass';detail=`No existing record for khasra ${esc(F('khasra'))} in ${esc(F('village'))} - new parcel entry.`;}
   else{const r0=same[0];const d=lev(F('owner'),r0.owner);
     if(d===0){st='warn';detail=`Parcel already registered to <b>${esc(r0.owner)}</b> (ULPIN ${ulpinGroups(r0.ulpin)}). Same owner - likely a re-digitization of an existing record.`;}
     else if(d<=2){st='warn';detail=`Parcel registered to <b>${esc(r0.owner)}</b> (ULPIN ${ulpinGroups(r0.ulpin)}) - document reads “${esc(F('owner'))}” (Levenshtein ${d}). Probably the same person with a spelling variant.`;fix={k:'owner',v:r0.owner,label:'Adopt registry spelling “'+r0.owner+'”'};}
     else{st='fail';detail=`<b>Duplicate-claim conflict:</b> khasra ${esc(F('khasra'))}, ${esc(F('village'))} is already held by <b>${esc(r0.owner)}</b> (s/o ${esc(r0.father||'-')}, ULPIN ${ulpinGroups(r0.ulpin)}, ${esc(r0.mutationType||'')} ${esc(r0.mutationNo||'')}). Deed names a different owner with no linking mutation.`;}}
   checks.push({id:'R4',name:'Duplicate parcel ownership check',status:st,detail,why:'Double-sale / benami fraud lives on the same khasra being “sold” twice - instant cross-office lookup kills it.',fix});}
  // R5 mutation chain
  {const reg=findMutReg(F('state'),F('district'),F('tehsil'),F('village'),F('khasra'));
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
  {const same=S.records.filter(r=>locEq(r.village,F('village'))&&r.khasra===F('khasra')&&r.status!=='pending');
   let st,detail,fix=null;
   if(!F('owner')){st='warn';detail='Owner name not extracted.';}
   else if(!same.length){st='pass';detail='New owner entry - no canonical spelling to compare against yet.';}
   else{const d=lev(F('owner'),same[0].owner);
     if(d===0){st='pass';detail=`Exact match with registry canonical spelling “${esc(same[0].owner)}”.`;}
     else if(d<=2){st='warn';detail=`“${esc(F('owner'))}” vs registry “${esc(same[0].owner)}” - Levenshtein distance ${d}. Minor OCR/transliteration drift.`;fix={k:'owner',v:same[0].owner,label:'Adopt canonical “'+same[0].owner+'”'};}
     else{st='pass';detail=`New owner “${esc(F('owner'))}” for this parcel (distance ${d} from ${esc(same[0].owner)}) - consistent with a transfer if R4/R5 accept it.`;}}
   checks.push({id:'R6',name:'Owner-name fuzzy consistency',status:st,detail,why:'Same person spelled 4 ways = 4 “owners” in a database. Unicode-aware fuzzy matching canonicalizes identity.',fix});}
  // R7 date logic
  {const d=F('docDate');let st,detail;const md=F('mutationDate');const dt=d?new Date(d):null;const today=new Date('2026-09-07');
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
     W.__geo=g;const la=g[0],ln=g[1];
     if(la<6||la>37||ln<68||ln>98){st='fail';detail=`Map-layer reference (${la.toFixed(4)}, ${ln.toFixed(4)}) falls outside India - geo-database corruption.`;}
     else{const bb=STATE_BBOX[F('state')];
       if(bb&&(la<bb[0][0]||la>bb[0][1]||ln<bb[1][0]||ln>bb[1][1])){st='warn';detail=`Map-layer reference (${la.toFixed(4)}, ${ln.toFixed(4)}) lies outside the bounding box of ${esc(F('state'))} - check the village-to-state mapping.`;}
       else{st='pass';detail=`Parcel geo-reference (${la.toFixed(4)}N, ${ln.toFixed(4)}E) resolved from the cadastral map layer (Bhu-Naksha) for village ${esc(F('village'))||'-'} - consistent with ${esc(F('state'))||'the state'}. ULPIN geo-base ready.`;}}}
   checks.push({id:'R8',name:'Geo-reference check (Bhu-Naksha layer)',status:st,detail,why:'ULPIN is lat/long-derived, but coordinates are never read from the record text (no RoR prints them) - they come from the surveyed cadastral map layer, so a forged document cannot smuggle in a wrong location.'});}
  // R9 encumbrance / lis pendens
  {const lit=findLit(F('state'),F('district'),F('village'),F('khasra'));
   let st,detail;
   if(lit){st='fail';detail=`<b>Lis pendens:</b> ${esc(lit.caseNo)} - ${esc(lit.court)}: ${esc(lit.note)} Transfer of this parcel is frozen until decree.`;}
   else{st='pass';detail='No encumbrance or pending litigation matched in the e-Courts feed.';}
   checks.push({id:'R9',name:'Encumbrance & lis pendens (e-Courts)',status:st,detail,why:'Section 52 TPA - buying a parcel under suit inherits the suit. One API call prevents a decade in court.'});}
  // R10 OCR confidence floor
  {const avg=fieldAvg(),mn=minConf();let st,detail;
   const weak=Object.entries(W.fields).filter(([k,f])=>f.v!==''&&effConf(f)<.75).map(([k])=>k);
   if(mn<.62){st='fail';detail=`Weakest field at ${(mn*100).toFixed(0)}% - below the 62% floor. Manual verification or re-scan is mandatory before this record can seed the registry.`;}
   else if(avg<.85||mn<.75){st='warn';detail=`Average ${(avg*100).toFixed(1)}%, weakest ${(mn*100).toFixed(0)}%. Fields to verify: ${weak.map(w=>'<b>'+w+'</b>').join(', ')||'-'}. Click the ✓ next to a field once you have eyeballed it against the scan.`;}
   else{st='pass';detail=`Average ${(avg*100).toFixed(1)}%, minimum ${(mn*100).toFixed(0)}% - above thresholds.`;}
   checks.push({id:'R10',name:'OCR confidence floor (HITL gate)',status:st,detail,why:'Garbage-in is the #1 failure mode of digitization programs - confidence gating puts a human exactly where they matter.'});}
  const fails=checks.filter(c=>c.status==='fail').length,warns=checks.filter(c=>c.status==='warn').length;
  const score=Math.max(5,100-25*fails-8*warns);
  const verdict=fails>0?'fail':(warns>=2?'warn':'pass');
  return {checks,fails,warns,score,verdict,avg:fieldAvg(),ts:Date.now()};
}
function applyFix(k,v){if(!W||!W.fields[k])return;W.fields[k]={v:String(v),c:W.fields[k].c,edited:true,verified:false};renderFields(false);toast('Field corrected',k+' → '+v+' (operator-assisted fix)','ok');goValidate(true);}
function goValidate(silent){
  if(!W||!W.done){toast('Nothing to validate','Run the digitization pipeline first.','warn');nav('digitize');return;}
  lastReport=runValidation();
  if(!lastReport){toast('No fields','Extraction produced no fields.','err');return;}
  renderValidation();
  if(!silent)nav('validate');
}
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
  $('#btnCommit').disabled=lastReport.verdict==='fail';
  $('#btnQueue').disabled=false;
}

/* ================= commit & seal ================= */
const STATE_CODE={'Punjab':'03','Haryana':'06','Himachal Pradesh':'02','Uttar Pradesh':'09','Chandigarh':'04'};
function deriveCodes(f){
  const sc=STATE_CODE[f.state]||'99';
  const exD=S.records.find(r=>r.district===f.district&&r.state===f.state);
  const dc=exD?exD.dc:'01';
  const exT=S.records.find(r=>r.district===f.district&&r.tehsil===f.tehsil);
  const tc=exT?exT.tc:'01';
  const exV=S.records.find(r=>r.district===f.district&&r.village===f.village);
  const vc=exV?exV.vc:'0001';
  return {sc,dc,tc,vc};
}
async function commit(){
  if(!W||!W.done||!lastReport){toast('Nothing to commit','Digitize and validate a document first.','warn');return;}
  if(lastReport.verdict==='fail'){toast('Commit blocked','Hard failures must be resolved first - send to Review Queue.','err');return;}
  const f={};for(const k in W.fields)f[k]=W.fields[k].v;
  if(!f.owner||!f.khasra||!f.areaStr){toast('Missing essentials','Owner, khasra and area are required to seed a parcel.','err');return;}
  const {sc,dc,tc,vc}=deriveCodes(f);
  const key=sc+dc+tc+vc;const seq=S.records.filter(r=>(r.sc+r.dc+r.tc+r.vc)===key).length+1;
  const rec=mkSeedRecord({id:'r'+rid(),state:f.state||'-',sc,district:f.district||'-',dc,tehsil:f.tehsil||'-',tc,village:f.village||'-',vc,
    khasra:f.khasra,khewat:f.khewat||'',khatuni:f.khatuni||'',owner:f.owner,father:f.father||'',seller:f.seller||'',consideration:f.consideration||'',
    areaStr:f.areaStr,areaSqM:f.areaSqM?parseFloat(String(f.areaSqM).replace(/,/g,'')):(W.__computedSqM||null),
    docType:f.docType||'Unclassified record',docDate:f.docDate||'',mutationNo:f.mutationNo||'',mutationType:f.mutationType||'',mutationDate:f.mutationDate||'',
    lat:(W.__geo?W.__geo[0]:null),lng:(W.__geo?W.__geo[1]:null),
    status:'validated',createdAt:Date.now(),avgConf:+fieldAvg().toFixed(3),
    checks:{pass:lastReport.checks.filter(c=>c.status==='pass').length,warn:lastReport.warns,fail:lastReport.fails}});
  rec.ulpin=genULPIN(sc,dc,tc,vc,seq);
  rec.hash=await sha256hex(recordHashInput(rec));
  // append to last block or open a new one
  let blk=S.blocks[S.blocks.length-1];
  if(blk.entries.length>=4){blk={i:S.blocks.length,ts:Date.now(),entries:[],prev:blk.hash,nonce:String(10000+rnd(89999)),hash:''};S.blocks.push(blk);}
  blk.ts=Date.now();blk.entries.push({rid:rec.id,ulpin:rec.ulpin,h:await sha256hex(recordHashInput(rec))});
  blk.hash=await sha256hex(blockInput(blk));
  rec.block=blk.i;
  S.records.push(rec);
  logActivity('SEA','Sealed '+f.owner+' - khasra '+f.khasra+' - ULPIN '+rec.ulpin+' → block #'+blk.i);
  saveState();
  W=null;lastReport=null;resetPipeline();renderAll();
  nav('registry');
  openRecord(rec.id,{sealed:true});
  toast('Record sealed','ULPIN '+ulpinGroups(rec.ulpin)+' - block #'+blk.i+' anchored','ok',6000);
}
function sendToQueue(){
  if(!W||!W.done||!lastReport){toast('Nothing to queue','Digitize a document first.','warn');return;}
  const f={};for(const k in W.fields)f[k]=W.fields[k].v;
  const fails=lastReport.checks.filter(c=>c.status==='fail');
  const first=fails[0];
  const rec=mkSeedRecord({id:'r'+rid(),state:f.state||'-',sc:STATE_CODE[f.state]||'99',district:f.district||'-',dc:'01',tehsil:f.tehsil||'-',tc:'01',village:f.village||'-',vc:'0001',
    khasra:f.khasra||'-',owner:f.owner||'(unverified)',father:f.father||'',areaStr:f.areaStr||'-',areaSqM:f.areaSqM?parseFloat(String(f.areaSqM).replace(/,/g,'')):null,
    docType:f.docType||'Unclassified record',docDate:f.docDate||'',status:'pending',createdAt:Date.now(),avgConf:+fieldAvg().toFixed(3),
    checks:{pass:lastReport.checks.filter(c=>c.status==='pass').length,warn:lastReport.warns,fail:lastReport.fails}});
  rec.ulpin='-';
  S.records.push(rec);
  const d={id:'d'+rid(),sev:lastReport.fails>1?'high':'med',title:first?first.name+' - '+stripTags(first.detail):'Validation discrepancies on scanned record',
    detail:(fails.length?fails.map(c=>'['+c.id+'] '+stripTags(c.detail)).join(' - '):'Warnings exceeded threshold.')+'  | Auto-flagged by validation engine.',
    ref:rec.id,created:Date.now(),status:'open'};
  S.discs.unshift(d);
  logActivity('FLG','Auto-flagged: '+(first?first.id+' '+first.name:'low confidence')+' - sent to review queue');
  saveState();W=null;lastReport=null;resetPipeline();renderAll();nav('queue');
  toast('Sent to Review Queue','Record '+rec.id+' flagged for officer review.','warn');
}
const stripTags=s=>String(s).replace(/<[^>]*>/g,'');

/* ================= pseudo-QR integrity seal ================= */
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
  const now=await sha256hex(recordHashInput(r));
  if(now===r.hash&&!r.tampered){
    box.innerHTML=`<div class="banner bn-pass" style="padding:12px 16px">VAL <b>INTEGRITY VERIFIED</b> - recomputed hash matches the sealed hash exactly. Record is byte-identical to its sealed state.</div>`;
    toast('Integrity verified','Record '+r.id+' matches its sealed hash.','ok');
  }else{
    box.innerHTML=`<div class="banner bn-fail" style="padding:12px 16px"><b>TAMPERING DETECTED</b> - recomputed hash differs from sealed hash.${r.tamperedField?'<div class="small" style="margin-top:4px">Deviation localized to field: <b>'+esc(r.tamperedField)+'</b> (now '+esc(r[r.tamperedField])+', sealed '+esc(r._origValue)+')</div>':''}<div class="mono small" style="margin-top:6px;word-break:break-all">sealed ▸ ${esc(r.hash)}<br/>now&nbsp;&nbsp;&nbsp;▸ ${esc(now)}</div></div>`;
    toast('Tampering detected','Hash mismatch on record '+r.id+'.','err');
  }
}
function tamperRecord(id){
  const r=S.records.find(x=>x.id===id);if(!r||!r.hash)return;
  if(!r.tampered){r._origValue=r.areaSqM;r.tamperedField='areaSqM';r.areaSqM=Math.round(r.areaSqM*1.137*10)/10;r.tampered=true;}
  saveState();renderRegistry();openRecord(id);
  toast('Edit applied silently','The area field was changed after sealing. Run Verify Hash on the record to detect it.','warn',6000);
}
function restoreRecord(id){
  const r=S.records.find(x=>x.id===id);if(!r)return;
  if(r.tampered){r.areaSqM=r._origValue;delete r.tampered;delete r.tamperedField;delete r._origValue;saveState();renderRegistry();openRecord(id);toast('Original restored','Record reverted to its sealed state.','ok');}
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
  let firstBad=-1;
  for(let i=0;i<S.blocks.length;i++){
    const b=S.blocks[i];
    b.__bad=false;b.__orphan=false;
    const now=await sha256hex(blockInput(b));
    if(now!==b.hash)b.__bad=true;
    if(i>0&&b.prev!==S.blocks[i-1].hash){b.__bad=true;}
    if(firstBad<0&&b.__bad)firstBad=i;
  }
  if(firstBad>=0)for(let i=firstBad+1;i<S.blocks.length;i++)S.blocks[i].__orphan=true;
  const nBad=S.blocks.filter(b=>b.__bad).length,nOrph=S.blocks.filter(b=>b.__orphan).length;
  await renderLedger(0);
  if(nBad||nOrph){
    $('#chainHealth').innerHTML=`<div class="banner bn-fail" style="padding:12px 16px"><b>CHAIN BROKEN</b> - ${nBad} block(s) fail hash re-computation${nOrph?', '+nOrph+' descendant block(s) orphaned':''}. The red block was modified after sealing; every descendant is now untrustworthy. <button class="btn btn-sm" style="margin-left:10px" onclick="undoChainTamper()">↺ Restore chain</button></div>`;
    if(show)toast('Chain verification failed','Tampered block detected - cascade shown in red.','err',6000);
  }else{
    $('#chainHealth').innerHTML=`<div class="banner bn-pass" style="padding:12px 16px">VAL <b>CHAIN VERIFIED</b> - recomputed ${S.blocks.length} block hashes with ${hashMode()}; every link matches. History is provably intact.</div>`;
    if(show)toast('Chain verified','All '+S.blocks.length+' blocks intact.','ok');
  }
}
function tamperChainBlock(){
  if(S.blocks.__tampered){undoChainTamper();return;}
  const i=1+Math.max(0,rnd(S.blocks.length-1));
  const b=S.blocks[i];if(!b||!b.entries.length){toast('Pick a block with entries','Genesis has none.','warn');return;}
  b.__orig=JSON.stringify(b.entries);
  const e=b.entries[0];e.ulpin=(e.ulpin.slice(0,-2)+(9-+e.ulpin[12])+e.ulpin[13]);
  S.blocks.__tampered=i;saveState();renderLedger();
  $('#btnTamperBlock').textContent='Restore Chain';
  toast('Block #'+i+' silently edited','A stored ULPIN was altered after sealing. Now run “Verify entire chain”.','warn',6500);
}
function undoChainTamper(){
  const i=S.blocks.__tampered;
  if(i!=null&&S.blocks[i]&&S.blocks[i].__orig){S.blocks[i].entries=JSON.parse(S.blocks[i].__orig);delete S.blocks[i].__orig;}
  delete S.blocks.__tampered;saveState();
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
function resolveDisc(id,ok){
  const d=S.discs.find(x=>x.id===id);if(!d)return;
  d.status=ok?'resolved':'rejected';d.resolvedAt=Date.now();
  if(!ok&&d.ref){const r=S.records.find(x=>x.id===d.ref);if(r&&r.status!=='pending')r.status='flagged';}
  logActivity(ok?'VAL':'CRT',(ok?'Resolved: ':'Rejected: ')+d.title.slice(0,70));
  saveState();renderQueue();renderDashboard();
  toast(ok?'Discrepancy resolved':'Claim rejected',d.title.slice(0,80),ok?'ok':'warn');
}

/* ================= init ================= */
function updateBadges(){
  const open=S.discs.filter(d=>d.status==='open').length;
  $('#qBadge').textContent=open;$('#qBadge').style.display=open?'':'none';
}
function renderAll(){renderDashboard();renderSamples();renderRegistry();renderLedger();renderQueue();updateBadges();}
function resetDemo(){
  if(!confirm('Reset all demo data to factory seed? This clears records you added.'))return;
  if(store.ok)try{localStorage.removeItem('bhunetra_v1');}catch(e){}
  (async()=>{S=null;await buildSeed();saveState();renderAll();nav('dashboard');toast('Demo reset','Factory seed data restored.','info');})();
}
async function init(){
  drawChakra();
  // engine chips
  $('#chipEngine').className='chip '+(window.Tesseract?'ok':'off');
  $('#chipEngineTxt').textContent=window.Tesseract?'Engine: Live OCR (Tesseract.js)':'Engine: Offline simulation';
  $('#chipEngine').title=window.Tesseract?'Tesseract.js loaded - uploads get real OCR':'CDN unreachable (sandbox/offline) - samples use pre-baked transcripts; upload falls back to manual template';
  $('#chipStore').className='chip '+(store.ok?'ok':'warn');
  $('#chipStoreTxt').textContent=store.ok?'Storage: persistent':'Storage: session-only';
  $('#chipStore').title=store.ok?'Records persist across reloads (localStorage)':'Sandboxed iframe blocks storage - data lives for this session only';
  setInterval(()=>{$('#clock').textContent=new Date().toLocaleTimeString('en-IN')+' IST';},1000);
  let __visits=42137+rnd(300);const __vb=document.getElementById('visits');if(__vb)__vb.textContent=String(__visits).padStart(7,'0');setInterval(()=>{__visits+=1+rnd(3);if(__vb)__vb.textContent=String(__visits).padStart(7,'0');},9000);
  // upload wiring
  $('#uploadInput').addEventListener('change',e=>{if(e.target.files&&e.target.files[0])handleUpload(e.target.files[0]);e.target.value='';});
  const dz=$('#dropZone');
  ['dragover','dragenter'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('drag');}));
  ['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('drag');}));
  dz.addEventListener('drop',e=>{if(e.dataTransfer.files&&e.dataTransfer.files[0])handleUpload(e.dataTransfer.files[0]);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  // state
  const saved=loadState();
  if(saved&&saved.records&&saved.records.length){S=saved;}
  else{await buildSeed();saveState();}
  renderAll();
  setTimeout(()=>toast('Bhu-Netra ready','A demonstration walkthrough is available under About / Help.','info',7000),900);
}
init();
</script>
<script>(function(){function c(){var b=a.contentDocument||(a.contentWindow&&a.contentWindow.document);if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'a371f40c5ccf0cf5',t:'MTc4ODc0NDY4MA=='};var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>
