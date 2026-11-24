
/* ---------- Sonofgod: secret fighter (unlocked with a code in Settings) ---------- */
var GOD_HASH='cd101ccf9ecf564d539048357c41401c8642fa9784c727fece6f6ad8f2df4090';
var godHold=false,godSpd=0,GOD_MAX=40;
function isGod(){return CH[chIdx]&&CH[chIdx].type==='god';}
function godOn(){return godHold&&isGod()&&state==='play'&&!fly;}
function charOK(i){return !CH[i].secret||godOK;}
function nextChar(d){var i=chIdx;for(var k=0;k<CH.length;k++){i=(i+d+CH.length)%CH.length;if(charOK(i))return i;}return chIdx;}
/* flight: called every frame from step(), returns true while flying */
function godFlyStep(){
  if(!godOn()){if(godSpd>0){godSpd=0;if(P.vy<-6)P.vy=-6;}return false;}
  godSpd=Math.min(GOD_MAX,Math.max(godSpd,4)+0.12+godSpd*0.012);
  P.vy=-godSpd;P.on=false;P.flip=false;P.coy=0;
  var n=godSpd>20?3:(godSpd>10?2:1);
  for(var i=0;i<n;i++)spawn('spark',P.x+rnd(-12,12),P.y+rnd(-4,10),rnd(-0.8,0.8),rnd(2,4)+godSpd*0.15,rnd(14,24),rnd(2,3.6),i%2?'#ffd53d':'#b57bff');
  if(t%6===0)spawn('ring',P.x,P.y-40,0,0,16,3,'#fff2a8');
  if(godSpd>=GOD_MAX&&t%20===0)shk=Math.max(shk,4);
  return true;
}
/* teleport: pick 30, 50 or 100 floors */
var teleEl=document.getElementById('tele');
/* gate art (Grok): each button gets a span that shows its ring from the atlas, a bit see-through */
(function(){
  var ids=['t30','t50','t100'],k=0.42,Wt=0,Ht=0,i;
  for(i=0;i<3;i++){var f=GATES.fr[i];Wt=Math.max(Wt,f[0]+f[2]);Ht=Math.max(Ht,f[3]);}
  function u(v){return 'calc(var(--u)*'+(v*k).toFixed(2)+')';}
  for(i=0;i<3;i++){
    var f=GATES.fr[i],b=document.getElementById(ids[i]),sp=document.createElement('span');sp.className='gimg';
    sp.style.left='calc(var(--u)*29 - '+u(f[4]).slice(5);sp.style.top='calc(var(--u)*29 - '+u(f[5]).slice(5);
    sp.style.width=u(f[2]);sp.style.height=u(f[3]);
    sp.style.backgroundImage="url('"+GATES.src+"')";sp.style.backgroundPosition=u(-f[0])+' 0';sp.style.backgroundSize=u(Wt)+' '+u(Ht);
    b.insertBefore(sp,b.firstChild);b.classList.add('art');
  }
})();
function openTele(){
  if(state!=='play'||fly||!isGod())return;
  godHold=false;state='tpick';keys.l=false;keys.r=false;jumpBuf=0;
  /* place 3 gates around the hero: left, above, right */
  var hx=clamp(P.x,130,W-130),hy=clamp(P.y-cam-60,170,H-200),pos=[[hx-86,hy+8],[hx,hy-74],[hx+86,hy+8]],ids=['t30','t50','t100'];
  for(var i=0;i<3;i++){var b=document.getElementById(ids[i]);b.style.left='calc(var(--u)*'+pos[i][0]+')';b.style.top='calc(var(--u)*'+pos[i][1]+')';}
  teleEl.style.setProperty('--hx',(P.x/W*100)+'%');teleEl.style.setProperty('--hy',((P.y-cam-45)/H*100)+'%');
  teleEl.classList.remove('hidden');syncTop();tone(880,0.12,'sine',0.03,1320);
}
function closeTele(n){
  if(state!=='tpick')return;
  teleEl.classList.add('hidden');state='play';last=0;acc=0;syncTop();
  if(n)startTele(n);
}
function startTele(n){
  fly={k:'tele',t:0,goal:floorsBest+n,n:n,moved:false};
  ensurePlats(fly.goal);var g=plats[fly.goal];g.x=WALL;g.w=W-2*WALL;
  P.vx=0;P.vy=0;P.flip=false;godSpd=0;
  tone(660,0.4,'sine',0.05,1320);tone(990,0.5,'triangle',0.03,1980,0.1);vib(30);
  pushPop('TELEPORT '+n+'!',W/2,P.y-140,'#ffd53d',34);
}
function stepTele(f){
  f.t++;P.vx=0;P.vy=0;P.on=false;
  if(f.t<34&&t%2===0)spawn('spark',P.x+rnd(-16,16),P.y-rnd(0,90),rnd(-0.6,0.6),-rnd(1,3),rnd(16,28),rnd(2,3.4),t%4?'#ffd53d':'#b57bff');
  if(f.t===34&&!f.moved){
    f.moved=true;var g=plats[f.goal];P.y=g.y;P.x=clamp(P.x,WALL+HW+6,W-WALL-HW-6);
    cam=P.y-H*0.58;flyFloors();shk=10;
    tone(1320,0.3,'sine',0.05,660);
    for(var i=0;i<26;i++){var a=Math.random()*Math.PI*2,s=rnd(1.5,5);spawn('spark',P.x,P.y-45,Math.cos(a)*s,Math.sin(a)*s,rnd(20,36),rnd(2.4,4),i%2?'#ffd53d':'#b57bff');}
    spawn('ring',P.x,P.y-45,0,0,30,8,'#fff2a8');
  }
  if(f.t>=68){P.y=plats[f.goal].y;endFly();return true;}
  return false;
}
function drawTele(){
  var f=fly,x=P.x,y=P.y-cam;
  if(!TELE.ok){ctx.save();ctx.globalAlpha=f.t<34?1-f.t/34:(f.t-34)/34;drawHero(x,y,P,tier,chIdx);ctx.restore();return;}
  var i=Math.min(7,Math.floor(f.t/8.5)),F=TELE.fr[i],u=0.5;
  ctx.save();ctx.translate(x,y);ctx.scale(P.dir,1);
  ctx.drawImage(TELE.img,F[0],F[1],F[2],F[3],-F[4]*u,-F[5]*u,F[2]*u,F[3]*u);
  ctx.restore();
}
/* secret code in Settings */
function hexOf(buf){var a=new Uint8Array(buf),s='';for(var i=0;i<a.length;i++)s+=('0'+a[i].toString(16)).slice(-2);return s;}
function tryCode(){
  var inp=document.getElementById('sCode'),msg=document.getElementById('sCodeMsg'),v=(inp.value||'').trim().toLowerCase();
  if(!v)return;
  if(!(window.crypto&&crypto.subtle&&window.TextEncoder)){msg.textContent='Code check not supported here';return;}
  crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)).then(function(h){
    if(hexOf(h)===GOD_HASH){
      godOK=true;try{localStorage.setItem('kitower_god','1');}catch(e){}
      for(var k=0;k<prev.length;k++)prev[k].btn.style.display=charOK(k)?'':'none';
      selectChar(6);inp.value='';msg.style.color='#ffd53d';msg.textContent='Sonofgod unlocked!';sfx.power();vib([40,30,80]);
    }else{msg.style.color='#ff6b8a';msg.textContent='Wrong code';tone(180,0.15,'square',0.03);}
  }).catch(function(){msg.textContent='Code check failed';});
}
