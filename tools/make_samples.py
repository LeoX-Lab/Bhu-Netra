#!/usr/bin/env python3
"""Generate the 4 Bhu-Netra sample documents as real images (public/samples/).
A: English jamabandi (clean)          -> straight-through pass
B: Bilingual fard badar (faded ink)   -> same-owner warn + HITL (weak fields)
C: English sale deed (fraud test)     -> R4/R5 fail (dead-man's deed)
D: Hindi mutation extract (torn 1998) -> R9 lis pendens + quality gate
All run REAL OCR through the backend - no precomputed transcripts.
"""
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

REG  = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts", "NotoSansDevanagari-Regular.ttf")
BOLD = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts", "NotoSansDevanagari-Bold.ttf")
LAT  = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
LATB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
import re, os

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "samples")
os.makedirs(OUT, exist_ok=True)

_fc = {}
def seg_font(dev, size, bold=False):
    key=(dev,size,bold)
    if key not in _fc:
        _fc[key]=ImageFont.truetype(BOLD if bold else REG if dev else (LATB if bold else LAT), size if dev else max(10,round(size*0.88)))
    return _fc[key]
def segs(t): return re.findall(r'[^\x00-\x7f]+|[\x00-\x7f]+', t)

class Doc:
    def __init__(self, W=1654, ink=(26,26,26), paper=(250,248,242), gray=(110,110,110)):
        self.W=W; self.ink=ink; self.paper=paper; self.gray=gray
        self.img=Image.new("RGB",(W,3200),paper); self.d=ImageDraw.Draw(self.img)
        self.y=0
    def mlen(self,t,s,b=False):
        w=0
        for s_ in segs(t): w+=self.d.textlength(s_,font=seg_font(any(ord(c)>127 for c in s_),s,b))
        return w
    def mdraw(self,x,by,t,s,b=False,fill=None):
        for s_ in segs(t):
            f=seg_font(any(ord(c)>127 for c in s_),s,b)
            self.d.text((x,by),s_,font=f,fill=fill or self.ink,anchor='ls')
            x+=self.d.textlength(s_,font=f)
        return x
    def center(self,by,t,s,b=False,fill=None):
        self.mdraw((self.W-self.mlen(t,s,b))/2,by,t,s,b,fill)
    def row(self,by,label,value,s=42,lx=230,lw=640,vx=910):
        lw_=self.mlen(label,s)
        self.mdraw(lx+lw_-lw_,by,label,s)
        self.mdraw(lx+lw_+25,by,":",s)
        self.mdraw(vx,by,value,s)

def build(cfg):
    D=Doc(ink=cfg.get('ink',(26,26,26)))
    W=D.W
    D.center(215,cfg['gov'],34)
    D.center(300,cfg['govSub'],30,fill=D.gray)
    D.d.line([(120,380),(W-120,380)],fill=D.ink,width=3)
    D.center(470,cfg['title'],cfg.get('titleSize',46),b=True)
    D.center(555,cfg['sub'],30,fill=D.gray)
    y=640
    LH=80
    for label,value in cfg['rows']:
        D.row(y,label,value); y+=LH
    if cfg.get('table'):
        y+=50
        heads,rows,tw=cfg['table']
        th,dr=66,84
        x0,x1=150,W-150
        D.d.rectangle([x0,y,x1,y+th+dr*len(rows)],outline=D.ink,width=2)
        cw=(x1-x0)//len(heads)
        for i,h in enumerate(heads):
            D.mdraw(x0+i*cw+26,y+48,h,34,b=True)
            if i: D.d.line([(x0+i*cw,y),(x0+i*cw,y+th+dr*len(rows))],fill=D.ink,width=2)
        D.d.line([(x0,y+th),(x1,y+th)],fill=D.ink,width=2)
        for ri,r in enumerate(rows):
            for ci,v in enumerate(r):
                D.mdraw(x0+ci*cw+26,y+th+58+ri*dr,v,38)
        y+=th+dr*len(rows)+60
    y+=40
    D.d.line([(120,y),(W-120,y)],fill=D.ink,width=2)
    D.mdraw(150,y+78,cfg['foot'],32)
    D.mdraw(150,y+140,cfg['foot2'],26,fill=D.gray)
    # stamp
    st=Image.new("RGBA",(340,340),(0,0,0,0)); sd=ImageDraw.Draw(st)
    sd.ellipse([8,8,332,332],outline=(90,90,90,175),width=4)
    for i,line in enumerate(cfg['stamp']):
        f=ImageFont.truetype(BOLD,33); bb=sd.textbbox((0,0),line,font=f)
        sd.text(((340-(bb[2]-bb[0]))/2,95+i*57),line,font=f,fill=(90,90,90,175))
    st=st.rotate(-14,expand=True,resample=Image.BICUBIC)
    D.img.paste(st,(W-450,y+20),st)
    return D.img.crop((0,0,W,y+520))

def fade(img):
    """faded ink: soften + noise + slight blur"""
    img=img.filter(ImageFilter.GaussianBlur(0.6))
    px=img.load()
    rnd=random.Random(42)
    for j in range(0,img.height,2):
        for i in range(0,img.width,2):
            r,g,b=px[i,j]
            if r<200:  # ink-ish
                n=rnd.randint(-38,38)
                px[i,j]=(max(120,min(210,r+70+n)),max(118,min(208,g+68+n)),max(112,min(202,b+64+n)))
    return img

def torn(img):
    """torn 1998 scan: rotate, heavy noise, tear off bottom-right corner"""
    img=img.rotate(1.6,expand=True,resample=Image.BICUBIC,fillcolor=(252,250,246))
    img=img.filter(ImageFilter.GaussianBlur(0.9))
    px=img.load(); rnd=random.Random(7)
    for j in range(img.height):
        for i in range(0,img.width,2):
            r,g,b=px[i,j]
            if r<210:
                n=rnd.randint(-55,30)
                px[i,j]=(max(95,min(220,r+55+n)),max(93,min(218,g+53+n)),max(88,min(214,b+50+n)))
    d=ImageDraw.Draw(img)
    # jagged tear: white polygon over bottom-right + a nick on the right edge
    W,H=img.size
    pts=[(W-330,H),(W-300,H-260),(W-360,H-430),(W-260,H-620),(W-340,H-780),(W,H-720),(W,H)]
    d.polygon(pts,fill=(252,250,246))
    pts2=[(W-90,520),(W-40,610),(W-140,700),(W-60,830)]
    d.line(pts2,fill=(252,250,246),width=46)
    return img

# ---------------- A: English jamabandi (clean) ----------------
A=build({
 'gov':'GOVERNMENT OF PUNJAB - DEPARTMENT OF REVENUE',
 'govSub':'पंजाब सरकार - राजस्व विभाग',
 'title':'JAMABANDI - RECORD OF RIGHTS', 'titleSize':44,
 'sub':'Year 2018-19 - Consolidation copy - Tehsil Dera Bassi',
 'rows':[
   ('State','Punjab'),
   ('District','S.A.S. Nagar'),
   ('Tehsil','Dera Bassi'),
   ('Village','Khanpur (Hadbast 214)'),
   ('Khewat no.','27'),
   ('Khatauni no.','41'),
   ('Khasra no.','305 - Chahi (canal irrigated)'),
   ('Owner','Harjeet Kaur d/o Gurmail Singh'),
   ('Total area','1 Kanal 12 Marla = 809.4 sqm'),
   ('Mutation','No. 5417 dated 12-03-2018 - inheritance'),
   ('Land classification','Chahi (canal irrigated)'),
 ],
 'table':(['Khasra','Khatoni','Owner','Father','Area (K-M-M)'],[['305','41','Harjeet Kaur','Gurmail Singh','1-0-12']],None),
 'foot':'Certified true copy - Halqa Patwari, Khanpur','foot2':'Computerized jamabandi extract - DILRMP portal format',
 'stamp':['HALQA PATWARI','KHANPUR','CERTIFIED']})

# ---------------- B: bilingual fard badar (faded) ----------------
B_cfg={
 'gov':'हरियाणा सरकार - राजस्व एवं आपदा प्रबंधन विभाग',
 'govSub':'GOVERNMENT OF HARYANA - REVENUE DEPARTMENT',
 'title':'फर्द बदर - नकल खतौनी',
 'sub':'FARD BADAR - Extract of Khatauni - Year 2020-21',
 'rows':[
   ('राज्य','हरियाणा'),
   ('जनपद','अंबाला'),
   ('तहसील','नरायणगढ़'),
   ('ग्राम','फतेहगढ़ (Hadbast 92)'),
   ('खेवट संख्या','18'),
   ('खतौनी संख्या','23'),
   ('खसरा संख्या','156/2'),
   ('स्वामी का नाम','Krishan Kumar s/o Om Prakash'),
   ('रकबा','3 एकड़ 2 कनाल (13152.4 वर्ग मीटर)'),
   ('दाखिल खारिज संख्या','7712 - बिक्री (sale)'),
   ('दाखिल दिनांक','04-07-2020'),
   ('भूमि प्रकृति','गैर मुआफ़ (Gair Mumkin)'),
 ],
 'table':(['खसरा','खतौनी','स्वामी','पिता','रकबा'],[['156/2','23','Krishan Kumar','Om Prakash','3-2-0']],None),
 'foot':'प्रमाणित प्रति - नायब तहसीलदार, नरायणगढ़','foot2':'Fard badar issued under Section 37 of the Punjab Land Revenue Act',
 'stamp':['भू-अभिलेख','AMBALA','HARYANA']}
B=fade(build(B_cfg))

# ---------------- C: sale deed (fraud test) ----------------
C=build({
 'gov':'GOVERNMENT OF HARYANA - REGISTRATION DEPARTMENT',
 'govSub':'हरियाणा सरकार - पंजीकरण विभाग',
 'title':'DEED OF SALE - बिक्री पत्र', 'titleSize':44,
 'sub':'Sub-Registrar Raipur Rani - Panchkula - e-GRAS fee paid',
 'rows':[
   ('State','Haryana'),
   ('District','Panchkula'),
   ('Tehsil','Raipur Rani'),
   ('Village','Raipur Rani'),
   ('Deed No.','1123 / 2024 - dated 22-02-2024'),
   ('Vendor','Dhani Ram s/o Hukam Singh'),
   ('Vendee','Ramesh Kumar s/o Hari Singh'),
   ('Khasra no.','78/2/1'),
   ('Area','6 Kanal = 3035.1 sqm'),
   ('Consideration','Rs. 9,75,000 (nine lakh seventy five thousand)'),
   ('Land classification','Barani (rain-fed)'),
 ],
 'table':(['Deed clause','Detail'],[['Property','Khasra 78/2/1, village Raipur Rani'],['Consideration','Rs. 9,75,000 paid in full']],None),
 'foot':'Presented for registration - Sub-Registrar Raipur Rani','foot2':'Registration fee paid via e-GRAS receipt 88214',
 'stamp':['SUB-REGISTRAR','RAIPUR RANI','PANCHKULA']})

# ---------------- D: mutation extract (torn 1998) ----------------
D=torn(build({
 'gov':'उत्तर प्रदेश सरकार - राजस्व विभाग',
 'govSub':'GOVERNMENT OF UTTAR PRADESH - REVENUE DEPARTMENT',
 'title':'अंश दान पर्चा - दाखिल खारिज',
 'sub':'MUTATION ORDER EXTRACT - Tehsil Deoband - Year 1998-99',
 'rows':[
   ('राज्य','उत्तर प्रदेश'),
   ('जनपद','सहारनपुर'),
   ('तहसील','देवबंद'),
   ('ग्राम','छुटमलपुर'),
   ('खसरा संख्या','334'),
   ('खातेदार का नाम','रामेश चंद्र'),
   ('पिता का नाम','छोटे लाल'),
   ('रकबा','1 बीघा 8 बिस्वा'),
   ('दाखिल खारिज संख्या','2214'),
   ('दाखिल दिनांक','14-05-1998'),
   ('भूमि प्रकृति','चाही (सिंचित)'),
 ],
 'table':(['खसरा','खातेदार','पिता','रकबा'],[['334','रामेश चंद्र','छोटे लाल','1-8']],None),
 'foot':'दाखिल खारिज आदेश - तहसीलदार, देवबंद','foot2':'Ansh dan (gift of share) mutation order extract',
 'stamp':['भू-अभिलेख','सहारनपुर','उ.प्र.']}))

for name,img in [('sampleA',A),('sampleB',B),('sampleC',C),('sampleD',D)]:
    p=f'{OUT}/{name}.png'; img.save(p,'PNG'); print('saved',p,img.size)
