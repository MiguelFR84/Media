// Generates juicio-ordinario-civil.mp4 using Playwright + browser MediaRecorder
// Usage: NODE_PATH=/opt/node22/lib/node_modules node make_video.js

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUTPUT = path.join(__dirname, 'juicio-ordinario-civil.mp4');
const W = 1280, H = 720;

const slides = [
  {
    type: 'cover',
    title: 'Juicio Ordinario Civil',
    subtitle: 'Proceso Civil — Ley de Enjuiciamiento Civil'
  },
  {
    phase: '01', color: '#e74c3c',
    title: 'Fase de Alegaciones',
    items: [
      { l: 1, t: 'Demanda' },
      { l: 2, t: 'Hechos · Fundamentos jurídicos · Petitum' },
      { l: 2, t: 'Documentos y dictámenes periciales' },
      { l: 1, t: 'Admisión a trámite' },
      { l: 1, t: 'Emplazamiento  (20 días hábiles)' },
      { l: 1, t: 'Contestación' },
      { l: 2, t: 'Allanamiento  ·  Oposición  ·  Reconvención' }
    ]
  },
  {
    phase: '02', color: '#e67e22',
    title: 'Audiencia Previa',
    items: [
      { l: 1, t: 'Intento de conciliación' },
      { l: 1, t: 'Examen procesal' },
      { l: 1, t: 'Fijación de hechos controvertidos' },
      { l: 1, t: 'Proposición y admisión de prueba' }
    ]
  },
  {
    phase: '03', color: '#27ae60',
    title: 'Juicio Oral',
    items: [
      { l: 1, t: 'Práctica de prueba admitida' },
      { l: 2, t: 'Interrogatorio de partes' },
      { l: 2, t: 'Prueba testifical' },
      { l: 2, t: 'Prueba pericial' },
      { l: 2, t: 'Prueba documental' },
      { l: 1, t: 'Conclusiones orales' }
    ]
  },
  {
    phase: '04', color: '#2980b9',
    title: 'Sentencia',
    items: [
      { l: 1, t: 'Plazo de redacción: 20 días' },
      { l: 1, t: 'Notificación a las partes' }
    ]
  },
  {
    phase: '05', color: '#8e44ad',
    title: 'Recursos',
    items: [
      { l: 1, t: 'Recurso de apelación  (plazo: 20 días)' },
      { l: 1, t: 'Recurso de casación' },
      { l: 1, t: 'Recurso extraordinario por infracción procesal' }
    ]
  },
  {
    phase: '06', color: '#16a085',
    title: 'Ejecución',
    items: [
      { l: 1, t: 'Título ejecutivo' },
      { l: 1, t: 'Despacho de ejecución' },
      { l: 1, t: 'Embargos y apremios' }
    ]
  }
];

const FPS = 15;
const COVER_FRAMES   = 3  * FPS;  // 3 s
const TITLE_FRAMES   = 1  * FPS;  // 1 s (title alone)
const ITEM_FRAMES    = 2  * FPS;  // 2 s per new item
const HOLD_FRAMES    = 2  * FPS;  // 2 s hold at end of slide

function totalFrames() {
  let n = COVER_FRAMES;
  for (const s of slides.slice(1)) {
    n += TITLE_FRAMES + s.items.length * ITEM_FRAMES + HOLD_FRAMES;
  }
  return n;
}

// ── HTML injected into the page ──────────────────────────────────────────────
const pageHTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;overflow:hidden;background:#000;width:${W}px;height:${H}px}
  canvas{display:block}
</style>
</head>
<body>
<canvas id="c" width="${W}" height="${H}"></canvas>
<script>
(function(){
const W=${W}, H=${H}, FPS=${FPS};
const COVER=${COVER_FRAMES}, TITLE=${TITLE_FRAMES}, ITEM=${ITEM_FRAMES}, HOLD=${HOLD_FRAMES};
const TOTAL=${totalFrames()};

const slides=${JSON.stringify(slides)};

const canvas=document.getElementById('c');
const ctx=canvas.getContext('2d');

// ── drawing helpers ──────────────────────────────────────────────────────────
function bg(accent){
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#0b1120');
  g.addColorStop(1,'#151f35');
  ctx.fillStyle=g;
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle=accent||'#d4af37';
  ctx.fillRect(0,0,W,5);
}

function wrapText(text,x,y,maxW,lineH){
  const words=text.split(' ');
  let line='';
  for(const w of words){
    const test=line?line+' '+w:w;
    if(ctx.measureText(test).width>maxW&&line){
      ctx.fillText(line,x,y);
      line=w; y+=lineH;
    } else { line=test; }
  }
  ctx.fillText(line,x,y);
  return y+lineH;
}

function drawCover(s){
  bg('#d4af37');
  // centre emblem lines
  ctx.strokeStyle='rgba(212,175,55,0.3)';
  ctx.lineWidth=1;
  for(let i=0;i<8;i++){
    ctx.beginPath();
    ctx.moveTo(W/2,H/2);
    const a=i*Math.PI/4;
    ctx.lineTo(W/2+Math.cos(a)*420,H/2+Math.sin(a)*420);
    ctx.stroke();
  }
  // title
  ctx.font='bold 70px sans-serif';
  ctx.fillStyle='#ffffff';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(s.title,W/2,H/2-55);
  // divider
  ctx.fillStyle='#d4af37';
  ctx.fillRect(W/2-220,H/2-5,440,3);
  // subtitle
  ctx.font='26px sans-serif';
  ctx.fillStyle='rgba(212,175,55,0.9)';
  ctx.fillText(s.subtitle,W/2,H/2+50);
  // bottom label
  ctx.font='18px sans-serif';
  ctx.fillStyle='rgba(255,255,255,0.3)';
  ctx.fillText('España · LEC 1/2000',W/2,H-36);
}

function drawPhase(s,n,fadeIn){
  bg(s.color);

  // phase badge
  const bw=140,bh=44,bx=60,by=52;
  ctx.fillStyle=s.color;
  ctx.beginPath();
  ctx.roundRect(bx,by,bw,bh,8);
  ctx.fill();
  ctx.font='bold 20px sans-serif';
  ctx.fillStyle='#fff';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText('FASE '+s.phase,bx+bw/2,by+bh/2);

  // title
  ctx.font='bold 54px sans-serif';
  ctx.fillStyle='#ffffff';
  ctx.textAlign='left';
  ctx.textBaseline='alphabetic';
  ctx.fillText(s.title,60,185);

  // separator
  ctx.fillStyle=s.color;
  ctx.fillRect(60,200,W-120,3);

  // items
  let y=255;
  const visibleItems=s.items.slice(0,n);
  for(let i=0;i<visibleItems.length;i++){
    const item=visibleItems[i];
    const alpha=(i===n-1)?fadeIn:1;
    const x=item.l===1?85:125;

    ctx.globalAlpha=alpha;

    // bullet
    if(item.l===1){
      ctx.fillStyle=s.color;
      ctx.beginPath();
      ctx.arc(x-22,y+13,6,0,Math.PI*2);
      ctx.fill();
    } else {
      ctx.fillStyle='#64748b';
      ctx.fillRect(x-26,y+11,10,3);
    }

    // text
    ctx.font=item.l===1?'bold 28px sans-serif':'24px sans-serif';
    ctx.fillStyle=item.l===1?'#f1f5f9':'#94a3b8';
    ctx.textAlign='left';
    ctx.textBaseline='top';
    ctx.fillText(item.t,x,y);
    ctx.globalAlpha=1;

    y+=item.l===1?48:40;
  }

  // progress dots at bottom
  const total=slides.length-1;
  const pi=parseInt(s.phase)-1;
  const dotW=Math.floor((W-120)/total)-8;
  for(let i=0;i<total;i++){
    ctx.fillStyle=i<pi?s.color:i===pi?s.color:'#1e293b';
    ctx.globalAlpha=i===pi?1:i<pi?0.5:1;
    ctx.beginPath();
    ctx.roundRect(60+i*(dotW+8),H-28,dotW,10,5);
    ctx.fill();
    ctx.globalAlpha=1;
  }
}

// ── animation state machine ──────────────────────────────────────────────────
let frame=0;

function getState(f){
  if(f<COVER) return {type:'cover'};
  f-=COVER;
  for(const s of slides.slice(1)){
    const slideFrames=TITLE+s.items.length*ITEM+HOLD;
    if(f<slideFrames){
      if(f<TITLE) return {type:'phase',s,n:0,fade:1};
      f-=TITLE;
      for(let i=0;i<s.items.length;i++){
        if(f<ITEM){
          const fade=Math.min(1,f/(ITEM*0.4));
          return {type:'phase',s,n:i+1,fade};
        }
        f-=ITEM;
      }
      return {type:'phase',s,n:s.items.length,fade:1};
    }
    f-=slideFrames;
  }
  return {type:'phase',s:slides[slides.length-1],n:slides[slides.length-1].items.length,fade:1};
}

function renderFrame(){
  const st=getState(frame);
  if(st.type==='cover') drawCover(slides[0]);
  else drawPhase(st.s,st.n,st.fade);
}

// ── MediaRecorder ────────────────────────────────────────────────────────────
const stream=canvas.captureStream(FPS);
const chunks=[];
const mr=new MediaRecorder(stream,{mimeType:'video/mp4',videoBitsPerSecond:2000000});
mr.ondataavailable=e=>{if(e.data&&e.data.size>0)chunks.push(e.data);};
mr.onstop=()=>{
  const blob=new Blob(chunks,{type:'video/mp4'});
  const fr=new FileReader();
  fr.onload=()=>{window._mp4b64=fr.result.split(',')[1];window._mp4done=true;};
  fr.readAsDataURL(blob);
};
mr.start(200);

let interval=null;
interval=setInterval(()=>{
  renderFrame();
  frame++;
  if(frame>=TOTAL){
    clearInterval(interval);
    mr.stop();
  }
},1000/FPS);

})();
</script>
</body>
</html>`;

// ── main ─────────────────────────────────────────────────────────────────────
(async () => {
  const total = totalFrames();
  const duration = (total / FPS).toFixed(1);
  console.log(`Generating ${duration}s video (${total} frames @ ${FPS}fps)…`);

  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(pageHTML, { waitUntil: 'domcontentloaded' });

  // Wait for recording to finish (add 3s buffer on top of video duration)
  const waitMs = (parseFloat(duration) + 3) * 1000;
  console.log(`Waiting ${(waitMs/1000).toFixed(0)}s for recording…`);
  // Forward browser console to Node stdout for debugging
  page.on('console', msg => console.log('[browser]', msg.text()));
  page.on('pageerror', err => console.error('[page error]', err.message));

  await page.waitForFunction(() => window._mp4done === true, null, { timeout: waitMs + 15000 });

  console.log('Recording done. Extracting data…');
  const b64 = await page.evaluate(() => window._mp4b64);
  await browser.close();

  const buf = Buffer.from(b64, 'base64');
  fs.writeFileSync(OUTPUT, buf);
  const mb = (buf.length / 1024 / 1024).toFixed(2);
  console.log(`Saved ${mb} MB → ${OUTPUT}`);
})().catch(err => { console.error(err); process.exit(1); });
