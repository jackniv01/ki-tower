var W=480,H=720,WALL=30,SP=96,HW=13;
var GRAV=0.5,MAXFALL=17,ACC=0.95,AACC=0.72,MAXV=7.4,J0=12.5,JK=1.15,COMBO_T=100;
var TIER_AT=[0,6,16,32],PWR=[1,1.06,1.13,1.2],MAXVM=[1,1.04,1.08,1.12];
var INK='#14102b',LW=1.5;

var CH=[
 {name:'Jacob',type:'warrior',skin:'#f6cfa3',skinS:'#d9a06f',top:'#1aa6a0',topS:'#0f7a76',pants:'#232a5c',pantsS:'#141a3d',boot:'#c2273d',bootS:'#8a1429',sash:'#d6336c',sashS:'#9c2250',trim:'#f4efe6',
  armU:'skin',armL:'skin',band:'#2a4fb8',bandS:'#1a3080',
  hair:['#1c1c33','#ffd53d','#45c8ff','#ff4f7b'],hairS:['#0c0c1c','#e09f00','#1f8fd0','#d02a55'],aura:['#ffffff','#ffd53d','#3fb8ff','#ff3d71'],iris:['#3a2410','#17b89a','#17b89a','#ff3d3d'],scarf:'#ff5b4a',scarfS:'#b82e2e'},
 {name:'Anna',type:'fighter',skin:'#f9d7b8',skinS:'#dba67c',top:'#f4f2ff',topS:'#b9bdf0',pants:'#6a2fb8',pantsS:'#431c7a',boot:'#ffd53d',bootS:'#c8981a',sash:'#ff4f9a',sashS:'#b82a6c',trim:'#ff4f9a',
  armU:'skin',armL:'skin',band:'#ff4f9a',bandS:'#b82a6c',
  hair:['#3b2a5e','#ff9ad5','#7cf3ff','#fff2a8'],hairS:['#231640','#d96aa8','#3cb5c8','#d9c36a'],aura:['#ffffff','#ff9ad5','#7cf3ff','#fff2a8'],iris:['#4a34a8','#d63384','#0a9fb8','#7a5cff']},
 {name:'Adam',type:'alien',skin:'#7fd66b',skinS:'#4ea040',top:'#5a2a8f',topS:'#3b1a66',pants:'#2a1450',pantsS:'#1a0c35',boot:'#ffd53d',bootS:'#c8981a',sash:'#ffd53d',sashS:'#c8981a',trim:'#ffd53d',
  armU:'#5a2a8f',armUS:'#3b1a66',armL:'#5a2a8f',armLS:'#3b1a66',band:'#ffd53d',bandS:'#c8981a',
  hair:['#8a4fd0','#ff9f1c','#ff3d71','#3fe0ff'],hairS:['#4d2490','#c46a00','#b01a4a','#1a9ab8'],aura:['#c9a0ff','#ff9f1c','#ff3d71','#3fe0ff'],iris:['#ff3d3d','#ff3d3d','#ffffff','#ffffff'],sclera:'#fff59d',scarf:'#ff9f1c',scarfS:'#c46a00'},
 {name:'Jonny',type:'robot',skin:'#c3cee0',skinS:'#7e8aa3',top:'#e8eef7',topS:'#9aa6bd',pants:'#4a5570',pantsS:'#2c3550',boot:'#ff4f4f',bootS:'#b02f2f',sash:'#3fe0ff',sashS:'#1a9ab8',trim:'#3fe0ff',
  armU:'#c3cee0',armUS:'#7e8aa3',armL:'#e8eef7',armLS:'#9aa6bd',band:'#3fe0ff',bandS:'#1a9ab8',
  hair:['#3fe0ff','#ffd53d','#ff4f7b','#b57bff'],hairS:['#1a9ab8','#c8981a','#b02a55','#7a4fc8'],aura:['#3fe0ff','#ffd53d','#ff4f7b','#b57bff'],iris:['#3fe0ff','#ffd53d','#ff4f7b','#b57bff']},
 {name:'Lior',type:'beast',skin:'#f5cba7',skinS:'#d89f78',top:'#c0283d',topS:'#8a1426',pants:'#2b2340',pantsS:'#1a1428',boot:'#ffb347',bootS:'#c97a1a',sash:'#ffd53d',sashS:'#c8981a',trim:'#ffd53d',
  armU:'#c0283d',armUS:'#8a1426',armL:'skin',band:'#ffd53d',bandS:'#c8981a',
  hair:['#e8e8ff','#ffb347','#ff5d8f','#7cf3ff'],hairS:['#a9aed8','#d9801f','#c23a68','#3cb5c8'],aura:['#ffffff','#ffb347','#ff5d8f','#7cf3ff'],iris:['#7a5cff','#d9801f','#c23a68','#0a9fb8'],tail:['#f09a45','#ffb347','#ff5d8f','#7cf3ff'],tailS:['#b8631f','#d9801f','#c23a68','#3cb5c8']},
 {name:'Daniella',type:'cat',skin:'#f6cfa3',skinS:'#d9a06f',top:'#4a2a7a',topS:'#2e1a52',pants:'#1a1424',pantsS:'#0c0a14',boot:'#5a2a8f',bootS:'#3b1a66',sash:'#a8e63d',sashS:'#6aa01a',trim:'#a8e63d',
  armU:'skin',armL:'skin',band:'#1a1424',bandS:'#0c0a14',
  hair:['#1a1424','#e8e8ff','#ffb347','#ff5d8f'],hairS:['#0c0a14','#a9aed8','#d9801f','#c23a68'],aura:['#a8e63d','#e8e8ff','#ffb347','#ff5d8f'],iris:['#3fae4a','#3fae4a','#3fae4a','#3fae4a']}
];

var ABIL={
 warrior:{name:'Monkey Leap',desc:'Grab the walls and jump from wall to wall, 4 times.',cd:480,col:'#ffe066',
   icon:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12.5" r="6.5"/><circle cx="4.5" cy="11" r="2.5"/><circle cx="19.5" cy="11" r="2.5"/><path d="M9 11.5h.01M15 11.5h.01"/><path d="M9.5 15.5q2.5 2 5 0"/></svg>'},
 fighter:{name:'Revive',desc:'Saves you from a fall by itself, then recharges.',cd:2400,col:'#ff6b8a',auto:true,
   icon:'<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M12 9.5v5M9.5 12h5"/></svg>'},
 alien:{name:'Vine Climb',desc:'Vines grow on the walls. Run into a wall to climb it.',cd:840,col:'#5fd35a',
   icon:'<svg viewBox="0 0 24 24"><path d="M5 19C5 10 11 5 19 5c0 8-5 14-14 14z"/><path d="M5 19l9-9"/></svg>'},
 robot:{name:'Green Haze',desc:'Ride a cloud of green smoke up for a few seconds.',cd:960,col:'#8fe39a',
   icon:'<svg viewBox="0 0 24 24"><path d="M12 21v-5"/><path d="M12 16c0-5 0-9 0-13 1.6 3.5 1.6 8.5 0 13z"/><path d="M12 16c-1.6-4-4.4-7-7.5-8.5 0.8 3.8 3.8 7 7.5 8.5z"/><path d="M12 16c1.6-4 4.4-7 7.5-8.5-0.8 3.8-3.8 7-7.5 8.5z"/><path d="M12 16c-2.6-1.4-5.6-1.8-8.5-1 2.2 1.6 5.4 1.8 8.5 1z"/><path d="M12 16c2.6-1.4 5.6-1.8 8.5-1-2.2 1.6-5.4 1.8-8.5 1z"/></svg>'},
 cat:{name:'Cat Jumps',desc:'Jump 3 extra times in mid-air, leaving glowing paw prints.',cd:600,col:'#a8e63d',
   icon:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="16" rx="4.6" ry="3.8"/><circle cx="6" cy="10.5" r="2"/><circle cx="9.6" cy="6.5" r="2"/><circle cx="14.4" cy="6.5" r="2"/><circle cx="18" cy="10.5" r="2"/></svg>'},
 beast:{name:'Fashion Wings',desc:'Sparkly wings: glide down slowly and jump again in the air.',cd:720,col:'#ff9ad5',
   icon:'<svg viewBox="0 0 24 24"><path d="M12 12C9 5 4 4 2.5 6.5 2 10 6 13 12 12zM12 12c3-7 8-8 9.5-5.5.5 3.5-3.5 6.5-9.5 5.5zM12 12c-3 3-6 6-4.5 8 2 1 4-3 4.5-8zM12 12c3 3 6 6 4.5 8-2 1-4-3-4.5-8z"/></svg>'}
};
var cv=document.getElementById('c'),ctx=cv.getContext('2d'),mainCtx=ctx;
var app=document.getElementById('app'),stage=document.getElementById('stage'),pad=document.getElementById('pad'),root=document.documentElement;
var menuEl=document.getElementById('menu'),overEl=document.getElementById('over'),nameEl=document.getElementById('name');
var scale=1,dpr=1;

function resize(){
  var touch=(window.matchMedia&&window.matchMedia('(pointer: coarse)').matches)||('ontouchstart' in window);
  root.classList.toggle('touch',!!touch);
  pad.style.display=touch?'flex':'none';
  var padH=touch?pad.offsetHeight:0;
  var aw=app.clientWidth,ah=app.clientHeight-padH;
  scale=Math.max(0.3,Math.min(aw/W,ah/H));
  dpr=Math.min(2,window.devicePixelRatio||1);
  var sw=Math.floor(W*scale),sh=Math.floor(H*scale);
  stage.style.width=sw+'px';stage.style.height=sh+'px';
  pad.style.width=sw+'px';
  cv.style.width=sw+'px';cv.style.height=sh+'px';
  cv.width=Math.round(sw*dpr);cv.height=Math.round(sh*dpr);
  root.style.setProperty('--u',(sw/W)+'px');
}
window.addEventListener('resize',resize);

/* ---------- helpers ---------- */
function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function rnd(a,b){return a+Math.random()*(b-a);}
function ss(a,b,x){var k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k);}
function hex2rgb(h){var n=parseInt(h.slice(1),16);return [n>>16&255,n>>8&255,n&255];}
function mix(a,b,t){var A=hex2rgb(a),B=hex2rgb(b);return '#'+((1<<24)+(Math.round(A[0]+(B[0]-A[0])*t)<<16)+(Math.round(A[1]+(B[1]-A[1])*t)<<8)+Math.round(A[2]+(B[2]-A[2])*t)).toString(16).slice(1);}
function rgba(h,a){var c=hex2rgb(h);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';}
function wrap(v,p){return ((v%p)+p)%p;}
function rr(x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}
function fmt(n){try{return Number(n).toLocaleString('en-US');}catch(e){return String(n);}}

/* ---------- sound ---------- */
var SET={vol:80,music:true,vib:true,shake:true,lite:false,big:false};
try{var _s=JSON.parse(localStorage.getItem('kitower_settings')||'null');if(_s&&typeof _s==='object'){for(var _k in SET)if(_k in _s)SET[_k]=_s[_k];}}catch(e){}
function saveSet(){try{localStorage.setItem('kitower_settings',JSON.stringify(SET));}catch(e){}}
function vib(ms){if(SET.vib&&navigator.vibrate){try{navigator.vibrate(ms);}catch(e){}}}
var AC=null,muted=false,BUS=null,VOICES=0;
try{muted=localStorage.getItem('kitower_muted')==='1';}catch(e){}
function actx(){
  if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{AC=new C();}catch(e){return null;}buildBus();}
  if(AC.state==='suspended'){try{AC.resume();}catch(e){}}
  return AC;
}
function buildBus(){
  var a=AC,m=a.createGain(),c=a.createDynamicsCompressor();
  c.threshold.value=-14;c.knee.value=10;c.ratio.value=4;c.attack.value=0.004;c.release.value=0.2;
  m.gain.value=SET.vol/100;m.connect(c);c.connect(a.destination);
  var s=a.createGain();s.gain.value=1;s.connect(m);
  var mu=a.createGain();mu.gain.value=0;mu.connect(m);
  var n=a.createBuffer(1,Math.floor(a.sampleRate*0.4),a.sampleRate),d=n.getChannelData(0);
  for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  BUS={master:m,sfx:s,mus:mu,noise:n};
}
function setVolNow(){if(BUS&&AC)BUS.master.gain.setTargetAtTime(SET.vol/100,AC.currentTime,0.03);}
/* one oscillator note; out = bus (sfx by default) */
function note(f0,dur,type,vol,f1,delay,out,atk){
  var a=AC;if(!a||!BUS)return;if(VOICES>40)return;
  var t0=a.currentTime+Math.max(0,delay||0),o=a.createOscillator(),g=a.createGain();
  o.type=type||'square';o.frequency.setValueAtTime(f0,t0);
  if(f1)o.frequency.exponentialRampToValueAtTime(f1,t0+dur);
  atk=atk||0.008;g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+atk);g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  o.connect(g);g.connect(out||BUS.sfx);o.start(t0);o.stop(t0+dur+0.03);
  VOICES++;o.onended=function(){VOICES--;try{g.disconnect();}catch(e){}};
}
/* short filtered noise burst (whoosh, hat, snare, thud) */
function noiz(dur,vol,ftype,freq,delay,out,f1){
  var a=AC;if(!a||!BUS)return;if(VOICES>40)return;
  var t0=a.currentTime+Math.max(0,delay||0),s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();
  s.buffer=BUS.noise;f.type=ftype||'highpass';f.frequency.setValueAtTime(freq||2000,t0);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t0+dur);
  g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+0.005);g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  s.connect(f);f.connect(g);g.connect(out||BUS.sfx);s.start(t0,Math.random()*0.15);s.stop(t0+dur+0.02);
  VOICES++;s.onended=function(){VOICES--;try{g.disconnect();}catch(e){}};
}
function tone(f0,dur,type,vol,f1,delay){if(muted)return;if(!actx())return;note(f0,dur,type,vol,f1,delay);}
function mtof(m){return 440*Math.pow(2,(m-69)/12);}
var PENTA=[0,3,5,7,10];
function pent(i){return 69+Math.floor(i/5)*12+PENTA[i%5];}
var sfx={
  jump:function(){if(muted||!actx())return;note(380,0.12,'triangle',0.09,820);note(760,0.08,'square',0.018,1300,0.01);},
  flip:function(){if(muted||!actx())return;noiz(0.28,0.05,'bandpass',900,0,0,3200);note(330,0.3,'triangle',0.04,990,0.04);},
  wall:function(){if(muted||!actx())return;noiz(0.16,0.08,'highpass',1800,0,0,5000);note(520,0.16,'square',0.035,1250);note(1046,0.12,'triangle',0.05,1568,0.05);},
  land:function(imp){if(muted||!actx())return;var k=clamp((imp||6)/14,0.35,1);note(160,0.12,'sine',0.16*k,52);noiz(0.05,0.05*k,'lowpass',900);},
  bounce:function(){if(muted||!actx())return;note(260,0.08,'square',0.03,420);noiz(0.05,0.03,'highpass',3000);},
  combo:function(n){
    if(muted||!actx())return;n=n||0;
    var base=Math.min(14,Math.floor(n/2)),k=Math.min(5,2+Math.floor(n/5)),v=Math.min(0.075,0.04+n*0.0018);
    for(var i=0;i<k;i++)note(mtof(pent(base+i)),0.11,'square',v,0,i*0.05);
    note(mtof(pent(base+k)),0.22,'triangle',v*1.2,0,k*0.05);
    if(n>=10)for(var j=0;j<3;j++)note(mtof(pent(base+k+2+j)+12),0.08,'sine',0.03,0,k*0.05+0.04+j*0.04);
    if(n>=20)noiz(0.35,0.04,'highpass',6000,k*0.05);
  },
  comboEnd:function(n){
    if(muted||!actx())return;var b=Math.min(8,Math.floor(n/4));
    [0,4,7,12].forEach(function(s,i){note(mtof(72+b+s),0.14,'square',0.045,0,i*0.06);});
    note(mtof(84+b),0.35,'triangle',0.06,0,0.26);noiz(0.3,0.03,'highpass',7000,0.26);
  },
  floor:function(){if(muted||!actx())return;note(1319,0.18,'triangle',0.06);note(1976,0.25,'sine',0.04,0,0.07);},
  power:function(){
    if(muted||!actx())return;noiz(0.6,0.06,'bandpass',400,0,0,6000);
    note(200,0.55,'sawtooth',0.04,1300);note(400,0.5,'square',0.025,1700,0.05);
    [72,76,79,84].forEach(function(m,i){note(mtof(m),0.3,'triangle',0.055,0,0.38+i*0.05);});
  },
  record:function(){
    if(muted||!actx())return;
    var seq=[[72,0],[76,0.12],[79,0.24],[84,0.36],[79,0.52],[84,0.64]];
    seq.forEach(function(s){note(mtof(s[0]),0.16,'square',0.05,0,s[1]);note(mtof(s[0]-12),0.16,'triangle',0.05,0,s[1]);});
    [84,88,91].forEach(function(m){note(mtof(m),0.9,'triangle',0.04,0,0.8,0,0.02);});
    for(var i=0;i<6;i++)note(mtof(96+PENTA[i%5]),0.08,'sine',0.025,0,0.85+i*0.06);
  },
  down:function(){
    if(muted||!actx())return;
    note(440,0.18,'square',0.05,0,0);note(392,0.18,'square',0.05,0,0.16);note(330,0.2,'square',0.05,0,0.32);
    note(262,0.6,'triangle',0.08,131,0.5);noiz(0.5,0.04,'lowpass',800,0.5,0,120);
  }
};
/* ---------- background music: layers fade in as you climb ---------- */
var MUS={on:false,next:0,step:0,lv:-1,gain:0};
var CH_ROOT=[45,41,48,43],CH_TONES=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]];
var LEAD=[[76,0,0,74,0,72,0,0,69,0,72,0,74,0,0,0],[72,0,0,0,69,0,72,0,77,0,76,0,72,0,0,0],[76,0,79,0,0,76,0,72,0,0,74,0,76,0,0,0],[74,0,0,71,0,74,0,79,0,0,78,0,74,0,0,0]];
function musI(){var f=floorsBest||0;return f>=1000?1.15:Math.min(1,f/700);}
function musStep(s,t0,I,dur){
  var t=Math.max(0,t0-AC.currentTime);
  var bar=Math.floor(s/16)%4,st=s%16,ch=CH_TONES[bar],out=BUS.mus;
  if(st===0)ch.forEach(function(m){note(mtof(m),dur*16*0.95,'triangle',0.035,0,t,out,0.25);});
  if(st===0||st===6||st===8||st===14)note(mtof(CH_ROOT[bar]),dur*(st===6||st===14?1.6:3),'triangle',0.16,0,t,out,0.01);
  var four=I>=0.5;
  if(st%8===0||(four&&st%4===0))note(150,0.13,'sine',I>=0.5?0.3:0.22,45,t,out,0.003);
  if(I>=0.07&&(st%4===2||(I>=0.4&&st%2===1)))noiz(0.04,st%4===2?0.05:0.025,'highpass',7000,t,out);
  if(I>=0.3&&(st===4||st===12)){noiz(0.14,0.09,'bandpass',1800,t,out);note(220,0.08,'triangle',0.05,140,t,out);}
  if(I>=0.14&&(I>=0.5||st%2===0)){var ai=Math.floor(st/(I>=0.5?1:2))%4,am=ch[ai%3]+12+(ai===3?12:0);note(mtof(am),dur*1.6,'square',I>=0.5?0.022:0.026,0,t,out);}
  if(I>=0.72){var lm=LEAD[bar][st];if(lm)note(mtof(lm+(I>1?12:0)),dur*2.6,'square',0.03,0,t,out,0.01);}
}
function musTick(){
  if(!AC||!BUS)return;
  var want=state==='play'&&!muted&&SET.music!==false,a=AC;
  var tg=want?0.55:0;if(tg!==MUS.gain){MUS.gain=tg;BUS.mus.gain.setTargetAtTime(tg,a.currentTime,want?0.4:0.12);}
  if(!want){MUS.on=false;return;}
  if(!MUS.on){MUS.on=true;MUS.next=a.currentTime+0.08;}
  var I=musI(),bpm=108+24*Math.min(1,I)+(I>1?10:0),dur=60/bpm/4;
  while(MUS.next<a.currentTime+0.15){musStep(MUS.step,MUS.next,I,dur);MUS.next+=dur;MUS.step++;}
}
setInterval(musTick,40);
function applyMute(){var b=document.getElementById('sSound');if(b)b.setAttribute('aria-checked',muted?'false':'true');}
function toggleMute(){muted=!muted;try{localStorage.setItem('kitower_muted',muted?'1':'0');}catch(e){}applyMute();if(!muted){actx();sfx.combo(0);}}
applyMute();

/* ---------- scores ---------- */
var memScores=[];
function loadScores(){try{var a=JSON.parse(localStorage.getItem('kitower_scores')||'[]');return Array.isArray(a)?a:memScores;}catch(e){return memScores;}}
function saveScores(a){memScores=a;try{localStorage.setItem('kitower_scores',JSON.stringify(a));}catch(e){}}
var playerName='',chIdx=0;
try{playerName=localStorage.getItem('kitower_name')||'';chIdx=clamp(parseInt(localStorage.getItem('kitower_char')||'0',10)||0,0,CH.length-1);}catch(e){}
nameEl.value=playerName;
/* ---------- shared scoreboard (Firebase Firestore, REST, no accounts) ---------- */
var FB_KEY='AIzaSyAsYyEcogB2vyxx2zId6rvE0oNgjlNujTk',FB_DOCS='projects/ki-tower/databases/(default)/documents';
var FB_URL='https://firestore.googleapis.com/v1/'+FB_DOCS;
var sharedList=null,sharedBusy=false,spN=0,gWish=[],spOk=0,spPend=[],playF=0;
var DEVID='';try{DEVID=localStorage.getItem('kitower_did')||'';if(!/^[a-z0-9]{10}$/.test(DEVID)){DEVID=Math.random().toString(36).slice(2,7)+Math.random().toString(36).slice(2,7);DEVID=(DEVID+'0000000000').slice(0,10);localStorage.setItem('kitower_did',DEVID);}}catch(e){DEVID='';}
function devKind(){var u=navigator.userAgent||'';if(/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&navigator.maxTouchPoints>1))return 'ios';if(/Android/.test(u))return 'android';return 'pc';}
function spMark(){spN++;spPend.push(floorsBest+20);}
function sanitizeEntry(e){if(!e||typeof e!=='object')return null;var s=Number(e.score),f=Number(e.floor);if(!isFinite(s)||!isFinite(f)||s<0||s>1e9)return null;return {id:Number(e.id)||0,name:String(e.name||'?').slice(0,14),score:Math.round(s),floor:Math.round(f),combo:Number(e.combo)||0};}
function fbInt(v){return v&&v.integerValue!=null?Number(v.integerValue):(v&&v.doubleValue!=null?Number(v.doubleValue):0);}
function fetchShared(){
  if(sharedBusy||typeof fetch!=='function')return;sharedBusy=true;
  fetch(FB_URL+':runQuery?key='+FB_KEY,{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({structuredQuery:{from:[{collectionId:'scores'}],orderBy:[{field:{fieldPath:'score'},direction:'DESCENDING'}],limit:50}})})
  .then(function(r){if(!r.ok)throw 0;return r.json();})
  .then(function(rows){
    var all=[];
    (rows||[]).forEach(function(r){var d=r&&r.document;if(!d||!d.fields)return;var f=d.fields;
      var m=/\/s(\d+)_[^\/]*$/.exec(d.name||'');
      var x=sanitizeEntry({id:m?Number(m[1]):0,name:f.name&&f.name.stringValue,score:fbInt(f.score),floor:fbInt(f.floor),combo:fbInt(f.combo)});if(x)all.push(x);});
    all.sort(function(a,b){return b.score-a.score;});
    sharedList=all.slice(0,50);refreshBoards();
  }).catch(function(){}).then(function(){sharedBusy=false;});
}
function initShared(){fetchShared();setInterval(function(){if(state!=='play')fetchShared();},45000);}
function pushShared(entry){
  if(!entry||typeof fetch!=='function')return;
  var nm=String(entry.name||'?').trim().slice(0,14)||'?';
  var id='s'+(entry.id||Date.now())+'_'+Math.random().toString(36).slice(2,8);
  var body={writes:[{update:{name:FB_DOCS+'/scores/'+id,fields:{name:{stringValue:nm},score:{integerValue:String(Math.max(0,Math.min(1e8,Math.round(entry.score||0))))},floor:{integerValue:String(Math.max(0,Math.min(1e5,Math.round(entry.floor||0))))},combo:{integerValue:String(Math.round(entry.combo||0))},char:{stringValue:String((CH[chIdx]&&CH[chIdx].name)||'?').slice(0,12)},sp:{integerValue:String(Math.min(9999,spN))},wish:{stringValue:gWish.join(',').slice(0,60)},spok:{integerValue:String(Math.min(9999,spOk))},dur:{integerValue:String(Math.min(36000,Math.round(playF/60)))},dev:{stringValue:devKind()},did:{stringValue:DEVID||'none'}}},
    updateTransforms:[{fieldPath:'ts',setToServerValue:'REQUEST_TIME'}],currentDocument:{exists:false}}]};
  if(sharedList){var x=sanitizeEntry(entry);if(x){sharedList.push(x);sharedList.sort(function(a,b){return b.score-a.score;});sharedList=sharedList.slice(0,50);refreshBoards();}}
  fetch(FB_URL+':commit?key='+FB_KEY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
  .then(function(){setTimeout(fetchShared,800);}).catch(function(){});
}
function refreshBoards(){
  try{
    if(state==='menu')renderBoard(document.getElementById('board1'),0,3);
    if(state==='over')renderBoard(document.getElementById('board2'),lastEntry,5);
    var sa=document.getElementById('scores');if(sa&&!sa.classList.contains('hidden'))renderBoard(document.getElementById('boardAll'),0,50);
  }catch(e){}
}
function renderBoard(el,hl,limit){
  el.textContent='';
  var h=el.previousElementSibling;if(h&&h.tagName==='H2')h.textContent=sharedList?'Top climbers – everyone':'Top climbers';
  var list=(sharedList||loadScores()).slice(0,limit||5);
  if(!list.length){var li=document.createElement('li');li.className='empty';li.textContent='No scores yet. Set the first record.';el.appendChild(li);return;}
  list.forEach(function(e,i){
    var li=document.createElement('li');if(hl&&e.id===hl)li.className='me';
    var a=document.createElement('span');a.className='rk';a.textContent=String(i+1);
    var b=document.createElement('span');b.className='nm';b.textContent=e.name;
    var c=document.createElement('span');c.className='fl';c.textContent=e.floor+' fl';
    var d=document.createElement('span');d.className='sc';d.textContent=fmt(e.score);
    li.appendChild(a);li.appendChild(b);li.appendChild(c);li.appendChild(d);el.appendChild(li);
  });
}

/* ---------- state ---------- */
var state='menu',plats=[],cam=0,P=null,parts=[],pops=[],trail=[],t=0,shk=0;
var floorsBest=0,lastFloor=0,score=0,combo=0,comboT=0,bestCombo=0,tier=0,started=false,fs=0,menuTier=0,jumpBuf=0,overReady=false,lastEntry=0;
var keys={l:false,r:false};
var stars=[];for(var si=0;si<90;si++)stars.push({x:Math.random()*W,y:Math.random()*H,s:Math.random()<0.2?3:2,c:Math.random()<0.2?'#ffe9a8':(Math.random()<0.3?'#bfe3ff':'#ffffff')});

function addPlat(){
  var f=plats.length,prev=plats[f-1],x,w,plk='m';
  if(f===0||f%50===0){x=WALL;w=W-2*WALL;}
  else{
    var base=Math.max(92,210-f*0.75);
    if(f%10===0)w=Math.min(300,base+90);
    else{var r=Math.random(),pk=prev.kind;
      if(r<0.25&&f>15&&pk!=='n'){w=base*rnd(0.5,0.72);plk='n';}
      else if(r<0.5){w=base*rnd(1.35,1.9);plk='w';}
      else{w=base*rnd(0.82,1.2);plk='m';}
      w=clamp(w,58,W-2*WALL-40);}
    var pc=prev.x+prev.w/2,c=pc+rnd(-160,160);
    x=Math.round(clamp(c-w/2,WALL+4,W-WALL-4-w));
  }
  plats.push({f:f,x:x,w:Math.round(w),y:-f*SP,seed:Math.random()*1000,kind:plk});
  maybeOrb(plats[f]);
}
function newHero(){return {x:W/2,y:0,vx:0,vy:0,on:true,dir:1,ph:0,sq:0,coy:7,trans:0,win:0,flip:false,fAge:0,fDur:1,flipAng:0,landAng:0,boosted:false,airT:0,tailT:0};}
function reset(){
  plats=[];for(var i=0;i<=14;i++)addPlat();
  P=newHero();
  cam=-(H-110);parts=[];pops=[];trail=[];shk=0;
  floorsBest=0;lastFloor=0;score=0;combo=0;comboT=0;bestCombo=0;tier=0;started=false;fs=0;jumpBuf=0;
  orbsWorld=[];lastOrbFloor=0;wishPower=false;wishShield=false;hiJump=1;dblUntil=0;magnet=false;buddy=null;celebT=0;abCD=0;specBuf=0;monkeyT=0;monkeyDir=1;vineT=0;cloudT=0;dashT=0;cling=0;monkeyN=0;wingT=0;wingJ=false;clingK='';catN=0;spN=0;gWish=[];spOk=0;spPend=[];playF=0;fly=null;clone=null;tinyT=0;giantT=0;triple=false;
}
function enterMenu(){
  reset();cam=-640;state='menu';
  menuEl.classList.remove('hidden');overEl.classList.add('hidden');pausedEl.classList.add('hidden');setEl.classList.add('hidden');syncTop();renderBoard(document.getElementById('board1'),0,3);
}
var askEl=document.getElementById('askName'),askIn=document.getElementById('askNameIn');
function askOpen(){return askEl&&!askEl.classList.contains('hidden');}
function showAskName(){askIn.value=nameEl.value;askEl.classList.remove('hidden');askIn.classList.remove('bad');setTimeout(function(){try{askIn.focus();}catch(e){}},60);}
function submitAskName(){
  var n=askIn.value.replace(/\s+/g,' ').trim();
  if(!n){askIn.classList.add('bad');try{askIn.focus();}catch(e){}return;}
  nameEl.value=n;playerName=n;try{localStorage.setItem('kitower_name',n);}catch(e){}
  askEl.classList.add('hidden');if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();window.scrollTo(0,0);
}
function startGame(){
  if(!nameEl.value.trim()){showAskName();return;}
  var n=nameEl.value.replace(/\s+/g,' ').trim();
  playerName=n||CH[chIdx].name;
  try{localStorage.setItem('kitower_name',n);}catch(e){}
  actx();
  reset();state='play';overReady=false;applyNextWishes();syncTop();
  menuEl.classList.add('hidden');overEl.classList.add('hidden');
  if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
}

function spawn(type,x,y,vx,vy,life,size,color,g){
  if(parts.length>(SET.lite?120:340))return;
  if(SET.lite&&type!=='ring'&&Math.random()<0.55)return;
  parts.push({type:type,x:x,y:y,vx:vx,vy:vy,life:life,max:life,size:size,color:color,g:g||0});
}
function pushPop(txt,x,y,color,size){pops.push({txt:txt,x:x,y:y,life:60,max:60,color:color,size:size||34});}
function tierFor(c){for(var i=3;i>=1;i--)if(c>=TIER_AT[i])return i;return 0;}
function auraCol(tr){return CH[chIdx].aura[tr];}

function powerUp(nt){
  tier=nt;P.trans=50;shk=22;sfx.power();vib(60);
  var col=auraCol(nt);
  spawn('ring',P.x,P.y-38,0,0,34,10,col);
  spawn('ring',P.x,P.y-38,0,0,48,6,'#ffffff');
  for(var i=0;i<30;i++){var a=Math.random()*Math.PI*2,s=rnd(1.5,5);spawn('spark',P.x,P.y-38,Math.cos(a)*s,Math.sin(a)*s-1,rnd(26,48),rnd(2.5,4.5),col);}
  pushPop(nt===3?'MAX POWER!':'POWER UP!',P.x,P.y-110,col,40);
}
function endCombo(){
  if(combo>=4){var b=combo*combo*mul()*(clone?2:1);score+=b;pushPop((clone?'Shadow combo +':'Combo +')+b,P.x,P.y-100,clone?'#c99cff':'#ffffff',30);sfx.comboEnd(combo);}
  combo=0;comboT=0;
  if(tier>0&&!wishPower){tier=0;spawn('ring',P.x,P.y-38,0,0,22,6,'#b8c2dd');}
}
function land(pl,impact){
  var skip=pl.f-lastFloor;
  if(pl.f>floorsBest){
    score+=(pl.f-floorsBest)*10*mul();floorsBest=pl.f;while(spPend.length&&floorsBest>=spPend[0]){spPend.shift();spOk++;}
    if(pl.f%10===0&&pl.f!==1000){P.win=60;pushPop('Floor '+pl.f+'!',P.x,P.y-105,'#ffd53d',36);sfx.floor();}
    if(pl.f===1000)celebrate();
  }
  if(skip>=2){
    combo+=skip;comboT=COMBO_T;if(combo>bestCombo)bestCombo=combo;
    var nt=wishPower?3:tierFor(combo);
    pushPop('x'+combo,P.x,P.y-90,tier>0||nt>0?auraCol(Math.max(tier,nt)):'#ffffff',34);
    sfx.combo(combo);
    if(nt>tier)powerUp(nt);
  }else if(combo>0){endCombo();}
  lastFloor=pl.f;P.boosted=false;P.airT=0;wingJ=true;
  P.sq=Math.min(1,0.35+impact/17*0.65);
  if(P.flip){P.flip=false;var a=P.flipAng%(Math.PI*2);if(a>Math.PI)a-=Math.PI*2;P.landAng=a;}
  if(impact>10)vib(12);
  if(impact>4){for(var i=0;i<8;i++)spawn('dust',P.x+rnd(-12,12),P.y-2,rnd(-1.8,1.8),rnd(-1,-0.1),rnd(16,26),rnd(3,6),'#e9e2d0',0.02);}
  sfx.land(impact);
}
var celebT=0;
function firework(x,y){
  var cols=['#ffd53d','#ff4f7b','#3fe0ff','#7dff9a','#c99cff','#ffffff'],c=cols[Math.floor(Math.random()*cols.length)];
  for(var i=0;i<34;i++){var a=i/34*Math.PI*2,s=rnd(2,4.5);spawn('spark',x,y,Math.cos(a)*s,Math.sin(a)*s,rnd(34,54),rnd(2.4,3.6),c,0.05);}
  spawn('ring',x,y,0,0,26,5,c);tone(rnd(500,900),0.25,'triangle',0.03,rnd(200,300));
}
function celebrate(){
  celebT=260;P.win=160;shk=18;vib([60,40,60,40,120]);sfx.power();
  pushPop('1000 FLOORS!',W/2,P.y-170,'#ffd53d',48);
  setTimeout(function(){if(state==='play')pushPop('LEGEND!',W/2,P.y-120,'#ffffff',40);},700);
  for(var i=0;i<4;i++)firework(rnd(80,W-80),cam+rnd(90,330));
}
function scrollSpeed(){var f=floorsBest;return f<=200?0.7+f*0.0095:2.6+Math.min(0.5,(f-200)*0.0012);}
function die(){
  endCombo();state='over';sfx.down();overReady=false;vib([80,60,120]);syncTop();
  var entry=null,rank=-1;
  if(score>0){
    entry={id:Date.now(),name:playerName,score:score,floor:floorsBest,combo:bestCombo};
    var list=loadScores();list.push(entry);list.sort(function(a,b){return b.score-a.score;});list=list.slice(0,50);saveScores(list);
    for(var i=0;i<list.length;i++){if(list[i].id===entry.id){rank=i;break;}}
  }
  lastEntry=entry?entry.id:0;
  if(entry)pushShared(entry);
  setTimeout(function(){showOver(rank);},500);
}
function countUp(el,target,dur,delay){
  var t0=performance.now()+delay;el.textContent='0';
  function f(now){
    if(now<t0){requestAnimationFrame(f);return;}
    var k=clamp((now-t0)/dur,0,1);
    el.textContent=fmt(Math.round(target*(1-Math.pow(1-k,3))));
    if(k<1)requestAnimationFrame(f);
  }
  requestAnimationFrame(f);
}
function showOver(rank){
  if(state!=='over')return;
  overEl.classList.remove('hidden');
  document.getElementById('rec').classList.toggle('hidden',rank!==0);if(rank===0)sfx.record();
  countUp(document.getElementById('sFloor'),floorsBest,700,0);
  countUp(document.getElementById('sScore'),score,900,150);
  countUp(document.getElementById('sCombo'),bestCombo,600,300);
  renderBoard(document.getElementById('board2'),lastEntry,5);
  setTimeout(function(){overReady=true;},350);
}

/* ---------- update ---------- */
function updateParts(){
  var i;
  for(i=parts.length-1;i>=0;i--){var q=parts[i];q.x+=q.vx;q.y+=q.vy;q.vy+=q.g;q.life--;if(q.life<=0)parts.splice(i,1);}
  for(i=pops.length-1;i>=0;i--){var o=pops[i];o.y-=0.6;o.life--;if(o.life<=0)pops.splice(i,1);}
  for(i=trail.length-1;i>=0;i--){trail[i].age++;if(trail[i].age>26)trail.splice(i,1);}
  if(shk>0)shk--;
}
function auraSparks(tr){
  if(tr>0&&t%5===0)spawn('spark',P.x+rnd(-16,16),P.y-rnd(5,70),rnd(-0.3,0.3),-rnd(0.6,1.6),30,2.2,auraCol(tr));
}
function menuStep(){
  t++;
  var nt=Math.floor(t/110)%4;
  if(nt!==menuTier){menuTier=nt;P.trans=nt>0?50:0;if(nt>0)spawn('ring',P.x,P.y-38,0,0,30,8,auraCol(nt));}
  if(P.trans>0)P.trans--;
  fs=0;auraSparks(menuTier);updateParts();
}
function step(){
  if(state==='menu'){menuStep();return;}
  t++;
  if(state==='over'){updateParts();return;}
  if(state==='wish'){stepWish();return;}
  if(state==='paused')return;
  playF++;
  if(fly){stepFly();return;}
  if(tinyT>0)tinyT--;if(giantT>0)giantT--;
  if(abCD>0)abCD--;
  if(specBuf>0){specBuf=0;useSpecial();}
  if(vineT>0)vineT--;if(dashT>0)dashT--;
  var ax=(keys.r?1:0)-(keys.l?1:0),mv=MAXV*MAXVM[tier]*(dashT>0?1.6:1);
  if(ax){var acc=(P.on?ACC:AACC)*(dashT>0?1.4:1);if(P.vx*ax<0)acc*=1.8;P.vx+=ax*acc;P.dir=ax;}else{P.vx*=P.on?0.68:0.985;}
  if(P.vx>mv)P.vx=mv;if(P.vx<-mv)P.vx=-mv;
  if(Math.abs(P.vx)<0.05&&!ax)P.vx=0;
  if(jumpBuf>0){jumpBuf--;}
  P.airT=P.on?0:P.airT+1;
  if(cloudT>0&&jumpBuf>0){cloudT=0;P.coy=1;}
  if(wingT>0)wingT--;
  if(catN>0&&jumpBuf>0&&!P.on&&P.coy<=0){catJump();}
  if(wingT>0&&jumpBuf>0&&!P.on&&P.coy<=0&&wingJ){wingJ=false;jumpBuf=0;P.vy=-J0*1.05*PWR[tier];P.flip=false;sfx.jump();for(var wi=0;wi<12;wi++)spawn('spark',P.x+rnd(-24,24),P.y-rnd(20,60),rnd(-1,1),rnd(0.5,2),rnd(18,30),2.4,wi%2?'#ff9ad5':'#ffe680');}
  if(jumpBuf>0&&(P.on||P.coy>0)){
    var wasCl=cling,wasK=clingK;P.vy=-(J0+Math.abs(P.vx)*JK)*PWR[tier]*jmul()*(dashT>0?1.12:1);if(cling){P.vx=-cling*(clingK==='m'?8.5:7.5);P.dir=-cling;if(clingK==='m'){P.vy=-J0*1.35*PWR[tier];monkeyN--;P.flip=true;P.fAge=0;P.fDur=Math.abs(P.vy)/GRAV*1.75;P.flipAng=0;sfx.wall();for(var mk=0;mk<10;mk++)spawn('spark',P.x-cling*HW*0+cling*HW,P.y-rnd(10,60),-cling*rnd(1,3),rnd(-2,1),20,2.6,'#ffe066');if(monkeyN<=0){monkeyN=0;abCD=ABIL.warrior.cd;}}cling=0;}P.on=false;P.coy=0;jumpBuf=0;P.sq=0;P.landAng=0;if(!wasCl)sfx.jump();else if(wasK!=='m')sfx.wall();
    var apex=P.vy*P.vy/(2*GRAV);
    if(apex>=SP*2){P.flip=true;P.fAge=0;P.fDur=Math.abs(P.vy)/GRAV*1.75;P.flipAng=0;sfx.flip();}
    for(var i=0;i<5;i++)spawn('dust',P.x+rnd(-8,8),P.y-2,rnd(-1.2,1.2),rnd(-0.7,-0.1),rnd(12,20),rnd(2,4),'#e9e2d0',0.02);
  }
  if(monkeyT>0){monkeyT++;P.vx=monkeyDir*15;P.vy*=0.6;P.dir=monkeyDir;if(t%2===0)spawn('spark',P.x,P.y-rnd(20,60),-monkeyDir*rnd(1,3),rnd(-0.5,0.5),16,2.2,'#ffe066');if(monkeyT>45)monkeyT=0;}
  P.x+=P.vx;
  var wl=P.x-HW<WALL?-1:(P.x+HW>W-WALL?1:0);cling=0;clingK='';
  if(wl&&monkeyN>0&&!P.on){P.x=wl<0?WALL+HW:W-WALL-HW;P.vx=0;cling=wl;clingK='m';P.coy=7;P.flip=false;P.dir=-wl;P.vy=Math.min(P.vy,2.4);if(t%8===0)spawn('spark',P.x+wl*HW,P.y-rnd(10,60),-wl*rnd(0.3,1),rnd(-0.5,0.5),14,2,'#ffe066');}
  else if(wl&&vineT>0&&!P.on){P.x=wl<0?WALL+HW:W-WALL-HW;P.vx=0;cling=wl;clingK='v';P.coy=7;P.flip=false;if(ax===wl)P.vy=Math.min(P.vy,-6.2);else P.vy=Math.min(P.vy,1.6);if(t%6===0)spawn('spark',P.x+wl*HW,P.y-rnd(10,60),-wl*rnd(0.3,1),rnd(-0.5,0.5),18,2.4,'#5fd35a');}
  if(P.x-HW<WALL){P.x=WALL+HW;if(P.vx<0){P.vx=-P.vx*0.9;sfx.bounce();for(var a=0;a<4;a++)spawn('spark',WALL,P.y-rnd(10,50),rnd(0.5,2),rnd(-1.5,0.5),14,2.5,'#ffffff');}}
  if(P.x+HW>W-WALL){P.x=W-WALL-HW;if(P.vx>0){P.vx=-P.vx*0.9;sfx.bounce();for(var b=0;b<4;b++)spawn('spark',W-WALL,P.y-rnd(10,50),-rnd(0.5,2),rnd(-1.5,0.5),14,2.5,'#ffffff');}}
  var py=P.y,wasOn=P.on;
  if(cloudT>0){cloudT--;P.vy+=(-2.6-P.vy)*0.12;P.flip=false;if(t%3===0)spawn('dust',P.x+rnd(-20,20),P.y+6,rnd(-0.7,0.7),rnd(0.3,1),rnd(26,40),rnd(5,9),t%2?'#b8e8b0':'#8fcf8f',-0.01);if(t%10===0)spawn('leaf',P.x+rnd(-18,18),P.y+4,rnd(-0.5,0.5),rnd(0.4,1),40,0.7,'#3fae4a');}
  else if(monkeyT>0){P.vy=Math.min(MAXFALL,P.vy+GRAV*0.3);}
  else if(!cling)P.vy=Math.min(MAXFALL,P.vy+GRAV);
  if(wingT>0&&P.vy>2.2)P.vy=2.2;
  P.y+=P.vy;P.on=false;
  if(P.vy>0){
    var fi=Math.round(-P.y/SP);
    for(var f=fi+1;f>=fi-1;f--){
      var pl=plats[f];if(!pl)continue;
      if(py<=pl.y+0.01&&P.y>=pl.y&&P.x+HW>pl.x+3&&P.x-HW<pl.x+pl.w-3){
        var impact=P.vy;P.y=pl.y;P.vy=0;P.on=true;
        if(!wasOn)land(pl,impact);
        break;
      }
    }
  }
  if(P.on)P.coy=7;else if(P.coy>0)P.coy--;
  if(P.flip){
    P.fAge++;var k=Math.min(1,P.fAge/P.fDur);P.flipAng=Math.PI*2*(k*k*(3-2*k));
    trail.push({x:P.x,y:P.y-34,age:0});
    if(k>=1){P.flip=false;P.flipAng=0;}
  }
  P.landAng*=0.55;if(Math.abs(P.landAng)<0.03)P.landAng=0;
  P.sq*=0.8;if(P.sq<0.02)P.sq=0;
  if(P.on)P.ph+=Math.abs(P.vx)*0.07;
  if(P.trans>0)P.trans--;
  if(P.win>0)P.win--;
  if(celebT>0){celebT--;if(celebT%18===0)firework(rnd(80,W-80),cam+rnd(90,330));}
  if(P.tailT>0)P.tailT--;
  if(P.on&&Math.abs(P.vx)>3&&t%6===0)spawn('dust',P.x-P.dir*8,P.y-2,rnd(-0.4,0.4),rnd(-0.6,-0.1),rnd(12,18),rnd(2,4),'#e9e2d0',0.02);
  auraSparks(tier);
  if(combo>0){comboT--;if(comboT<=0)endCombo();}
  if(floorsBest>=3)started=true;
  if(started)cam-=scrollSpeed();
  var target=P.y-H*0.42;if(target<cam)cam+=(target-cam)*0.2;
  fs+=(floorsBest-fs)*0.03;
  while((plats.length-1)*SP<-cam+320)addPlat();
  stepOrbs();stepBuddy();if(clone)cloneRec();
  updateParts();
  if(state==='play'&&P.y-cam>H+40){if(wishShield){wishShield=false;rescue();}else if(buddy&&!buddy.leave){buddySave();}else if(CH[chIdx].type==='fighter'&&abCD<=0){reviveSave();}else die();}
}
