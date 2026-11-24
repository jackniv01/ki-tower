import base64,json,os
SETS=[(0,'ryo'),(1,'mika'),(2,'zorn'),(3,'bolt'),(4,'anna'),(5,'dani')]
loads=[]
for ci,n in SETS:
    if not os.path.exists(n+'.webp'):continue
    b=base64.b64encode(open(n+'.webp','rb').read()).decode()
    mk='null';hj='null'
    if os.path.exists(n+'_mask.webp'):
        mk="'data:image/webp;base64,"+base64.b64encode(open(n+'_mask.webp','rb').read()).decode()+"'";hj=open(n+'_hair.json').read()
    loads.append("loadSprite(%d,'data:image/webp;base64,%s',%s,%s,%s);"%(ci,b,open(n+'.json').read(),mk,hj))
js="""
/* ---------- sprite fighters (art made with Grok) ---------- */
var SPR_UNIT=2;
function loadSprite(ci,data,fr,mask,hair){
  var S={img:new Image(),fr:fr,tint:null},c=CH[ci];CH[ci].sprite=S;
  var mk=mask?new Image():null,n=0,need=mask?2:1;
  function done(){if(++n<need||!mk)return;try{S.tint=buildTints(S.img,mk,hair,c);}catch(e){S.tint=null;}}
  S.img.onload=done;S.img.src=data;if(mk){mk.onload=done;mk.src=mask;}
}
function buildTints(img,mk,hair,c){
  var w=img.naturalWidth,h=img.naturalHeight,cv0=document.createElement('canvas');cv0.width=w;cv0.height=h;
  var g=cv0.getContext('2d');g.drawImage(img,0,0);var base=g.getImageData(0,0,w,h);
  g.clearRect(0,0,w,h);g.drawImage(mk,0,0,w,h);var m=g.getImageData(0,0,w,h).data;
  var out=[null];
  for(var tr=1;tr<4;tr++){
    var cB=hex2rgb(c.hair[tr]),cD=hex2rgb(mix(c.hairS[tr],INK,0.35)),cL=hex2rgb(mix(c.hair[tr],'#ffffff',0.7));
    var id=new ImageData(new Uint8ClampedArray(base.data),w,h),d=id.data;
    for(var i=0;i<d.length;i+=4){
      var a=m[i]/255;if(a<0.02)continue;
      var v=Math.max(d[i],d[i+1],d[i+2])/255,k=(v-hair.lo)/(hair.hi-hair.lo);k=k<0?0:(k>1?1:k);
      var r,gg,b;
      if(k<0.5){var q=k*2;r=cD[0]+(cB[0]-cD[0])*q;gg=cD[1]+(cB[1]-cD[1])*q;b=cD[2]+(cB[2]-cD[2])*q;}
      else{var q2=(k-0.5)*2;r=cB[0]+(cL[0]-cB[0])*q2;gg=cB[1]+(cL[1]-cB[1])*q2;b=cB[2]+(cL[2]-cB[2])*q2;}
      d[i]=d[i]*(1-a)+r*a;d[i+1]=d[i+1]*(1-a)+gg*a;d[i+2]=d[i+2]*(1-a)+b*a;
    }
    var cv1=document.createElement('canvas');cv1.width=w;cv1.height=h;cv1.getContext('2d').putImageData(id,0,0);out.push(cv1);
  }
  return out;
}
@@LOADS@@
function sprReady(c){return c.sprite&&c.sprite.img.complete&&c.sprite.img.naturalWidth>0;}
function pingpong(n,rate){if(n<2)return 0;var k=Math.floor(t/rate)%(2*n-2);return k<n?k:2*n-2-k;}
function pick(a,i){return a[Math.max(0,Math.min(a.length-1,i))];}
function drawSprite(x,y,o,tr,ci){
  var c=CH[ci],S=c.sprite,F=S.fr,ex=exprOf(o),glow=tr>0||ex==='kiai',f,rot=0,sq=o.sq,jx=0,bob=0,ctr=false;
  if(ex==='kiai'){f=F.kiai[Math.floor(t/5)%F.kiai.length];if(F.kiai.length<2)jx=Math.sin(t*1.3)*0.8;}
  else if(ex==='win'){f=F.win[pingpong(F.win.length,7)];if(F.win.length<2)bob=-Math.abs(Math.sin(t*0.15))*3;}
  else if(ex==='flip'){f=F.flip&&F.flip.length?F.flip[0]:F.jump[0];rot=o.flipAng;ctr=true;}
  else if(ex==='jump')f=pick(F.jump,o.vy<-6?0:1);
  else if(ex==='fall')f=F.fall[Math.floor(t/5)%F.fall.length];
  else if(ex==='land')f=F.land[0];
  else if(ex==='run')f=F.run[Math.floor(o.ph/(Math.PI*2)*F.run.length*(F.run.length<4?2:1))%F.run.length];
  else{f=F.idle[pingpong(F.idle.length,9)];}
  ctx.save();ctx.translate(x+jx,y+bob);
  if(glow)drawAura(Math.max(1,tr),c,o);
  if(!o.flip&&o.landAng)rot=o.landAng;
  if(rot){ctx.translate(0,-44);ctx.rotate(rot*o.dir);ctx.translate(0,44);}
  var br=(ex==='idle'&&F.idle.length<2)?Math.sin(t*0.08)*0.012:0;
  ctx.scale(o.dir*(1+sq*0.12),1-sq*0.12+br);
  var u=1/SPR_UNIT,w=f[2]*u,h=f[3]*u,dx=-f[4]*u,dy=-f[5]*u;
  if(ctr){dx=-w/2;dy=-44-h/2;}
  if(glow){ctx.shadowColor=c.aura[Math.max(1,tr)];ctx.shadowBlur=16;}
  var IMG=(tr>0&&S.tint)?S.tint[tr]:S.img;
  ctx.drawImage(IMG,f[0],f[1],f[2],f[3],dx,dy,w,h);
  ctx.shadowBlur=0;
  if(o.trans>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=0.5*o.trans/50;ctx.drawImage(IMG,f[0],f[1],f[2],f[3],dx,dy,w,h);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
  ctx.restore();
}
""".replace('@@LOADS@@','\n'.join(loads))
open('/home/claude/kt/d3_sprites.js','w').write(js)
print('sets',len(loads),len(js))
