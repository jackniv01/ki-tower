
/* ---------- characters: detailed anime style ---------- */
function exprOf(o){
  if(o===P&&godSpd>0)return 'kiai';
  if(o.trans>0)return 'kiai';
  if(o.win>0)return 'win';
  if(o.flip)return 'flip';
  if(!o.on)return o.vy<0?'jump':(o.vy>9?'fall':'jump');
  if(o.sq>0.35)return 'land';
  if(Math.abs(o.vx)>1.5)return 'run';
  return 'idle';
}
function cA(c,k,back){var v=c[k],r=v==='skin'?c.skin:v;return back?mix(r,INK,0.14):r;}
function cS(c,k,back){var v=c[k],r=v==='skin'?c.skinS:c[k+'S'];return back?mix(r,INK,0.14):r;}
function ik(x0,y0,x1,y1,L1,L2,s){
  var dx=x1-x0,dy=y1-y0,d=Math.sqrt(dx*dx+dy*dy)||0.01;
  d=Math.min(d,L1+L2-0.01);var ux=dx/(Math.sqrt(dx*dx+dy*dy)||0.01),uy=dy/(Math.sqrt(dx*dx+dy*dy)||0.01);
  var a=(L1*L1-L2*L2+d*d)/(2*d),h=Math.sqrt(Math.max(0,L1*L1-a*a));
  return [x0+ux*a-uy*h*s,y0+uy*a+ux*h*s];
}
function line2(a,b){ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
function limb3(a,j,b,w0,w1,base,shade,dv){
  ctx.lineCap='round';ctx.lineJoin='round';
  var segs=[[a,j,w0],[j,b,w1]],s,q,o;
  ctx.strokeStyle=INK;for(s=0;s<2;s++){q=segs[s];ctx.lineWidth=q[2]+2.6;line2(q[0],q[1]);}
  ctx.strokeStyle=shade;for(s=0;s<2;s++){q=segs[s];ctx.lineWidth=q[2];line2(q[0],q[1]);}
  ctx.strokeStyle=base;for(s=0;s<2;s++){q=segs[s];o=q[2]*0.2;ctx.lineWidth=q[2]*0.58;line2([q[0][0]-o*dv,q[0][1]-o],[q[1][0]-o*dv,q[1][1]-o]);}
  ctx.strokeStyle='rgba(255,255,255,0.55)';for(s=0;s<2;s++){q=segs[s];o=q[2]*0.32;ctx.lineWidth=Math.max(0.8,q[2]*0.14);line2([q[0][0]-o*dv,q[0][1]-o],[q[1][0]-o*dv,q[1][1]-o]);}
}
function fist(x,y,r,base,shade,dv){
  celH(circ(x,y,r),base,shade,dv,1.2);
  ctx.strokeStyle=rgba(INK,0.5);ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(x+r*0.2,y-r*0.6);ctx.lineTo(x+r*0.5,y+r*0.2);ctx.stroke();
}
function band(e,h,col,colS,w){
  var a=[e[0]+(h[0]-e[0])*0.66,e[1]+(h[1]-e[1])*0.66],b=[e[0]+(h[0]-e[0])*0.86,e[1]+(h[1]-e[1])*0.86];
  ctx.lineCap='butt';ctx.strokeStyle=INK;ctx.lineWidth=w+2.4;line2(a,b);ctx.strokeStyle=colS;ctx.lineWidth=w;line2(a,b);
  ctx.strokeStyle=col;ctx.lineWidth=w*0.5;line2([a[0]-0.6,a[1]-0.6],[b[0]-0.6,b[1]-0.6]);ctx.lineCap='round';
}
function boot(c,fx,fy,dv,back){
  var b=back?mix(c.boot,INK,0.14):c.boot,bs=back?mix(c.bootS,INK,0.14):c.bootS;
  var pth=function(){ctx.beginPath();ctx.moveTo(fx-4.5,fy-10);ctx.lineTo(fx+3.5,fy-10);ctx.quadraticCurveTo(fx+4,fy-4.5,fx+8.5,fy-3.5);ctx.quadraticCurveTo(fx+11.5,fy-2.5,fx+10.5,fy+0.8);ctx.lineTo(fx-5.5,fy+0.8);ctx.quadraticCurveTo(fx-6.5,fy-4.5,fx-4.5,fy-10);ctx.closePath();};
  celH(pth,b,bs,dv,1.6);
  ctx.strokeStyle=INK;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(fx-5.3,fy+0.4);ctx.lineTo(fx+10.3,fy+0.4);ctx.stroke();
  celH(function(){rr(fx-5.5,fy-13,10,4.2,2);},c.trim,mix(c.trim,INK,0.35),dv,1);
  ctx.fillStyle='rgba(255,255,255,0.85)';ctx.beginPath();ctx.ellipse(fx+5.5,fy-4.6,1.8,0.8,-0.3,0,Math.PI*2);ctx.fill();
}
function leg(c,hx,hy,ft,dv,back,tp){
  var hip=[hx,hy],ank=[ft[0],ft[1]-7],kn=ik(hip[0],hip[1],ank[0],ank[1],18,17,-1);
  limb3(hip,kn,ank,7.4,6.2,back?mix(c.pants,INK,0.14):c.pants,back?mix(c.pantsS,INK,0.14):c.pantsS,dv);
  if(tp==='robot'){celH(circ(kn[0],kn[1],3),'#9aa6bd','#5c6680',dv,1);}
  else{ctx.strokeStyle=rgba(INK,0.35);ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(kn[0]-2,kn[1]+1.5);ctx.quadraticCurveTo(kn[0]+1,kn[1]+3.5,kn[0]+3,kn[1]+1);ctx.stroke();}
  boot(c,ft[0],ft[1],dv,back);
}
function arm(c,sx,sy,h,dv,front,tr){
  var back=!front,sh=[sx,sy],el=ik(sx,sy,h[0],h[1],12,11.5,1);
  limb3(sh,el,h,5.6,4.8,cA(c,'armU',back),cS(c,'armU',back),dv);
  if(c.type==='robot'){celH(circ(el[0],el[1],2.6),'#9aa6bd','#5c6680',dv,1);}
  ctx.lineCap='round';ctx.strokeStyle=cS(c,'armL',back);ctx.lineWidth=4.8;line2(el,h);
  ctx.strokeStyle=cA(c,'armL',back);ctx.lineWidth=2.8;line2([el[0]-0.9*dv,el[1]-0.9],[h[0]-0.9*dv,h[1]-0.9]);
  ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=0.8;line2([el[0]-1.6*dv,el[1]-1.6],[h[0]-1.6*dv,h[1]-1.6]);
  band(el,h,back?mix(c.band,INK,0.14):c.band,back?mix(c.bandS,INK,0.14):c.bandS,6.2);
  var hc=c.type==='robot'?'#e8eef7':(c.type==='alien'?'#7fd66b':c.skin),hs=c.type==='robot'?'#9aa6bd':(c.type==='alien'?'#4ea040':c.skinS);
  fist(h[0],h[1],3.5,back?mix(hc,INK,0.14):hc,back?mix(hs,INK,0.14):hs,dv);
  if(c.type==='warrior'){celH(function(){ctx.beginPath();ctx.ellipse(sx-0.3,sy+2.2,3.8,4.4,0.25,0,Math.PI*2);},back?mix(c.top,INK,0.14):c.top,back?mix(c.topS,INK,0.14):c.topS,dv,1.4);}
  if(c.type==='fighter'&&front){celH(function(){ctx.beginPath();ctx.ellipse(sx,sy+1.5,4.4,4,0.2,0,Math.PI*2);},c.sash,c.sashS,dv,1.2);}
  if(c.type==='alien'){celH(function(){ctx.beginPath();ctx.ellipse(sx-0.5,sy+0.5,6.4,4.6,-0.2,0,Math.PI*2);},back?'#d9b02a':'#ffd53d',back?'#a07a10':'#c8981a',dv,1.6);
    ctx.strokeStyle=rgba(INK,0.4);ctx.lineWidth=0.8;ctx.beginPath();ctx.ellipse(sx-0.5,sy+0.5,4,2.6,-0.2,0,Math.PI*2);ctx.stroke();}
}
function torsoPath(){ctx.beginPath();ctx.moveTo(-6.5,0);ctx.lineTo(-8,-13);ctx.quadraticCurveTo(-9,-25,-3.5,-26.5);ctx.lineTo(5.5,-26.5);ctx.quadraticCurveTo(10.5,-25,9.5,-13);ctx.lineTo(7.5,0);ctx.closePath();}
function torso(c,dv,tr){
  var tp=c.type;
  celH(function(){rr(-7,-3,15,8,3);},c.pants,c.pantsS,dv,1.4);
  if(tp==='robot'){
    celH(function(){ctx.beginPath();ctx.moveTo(-6,-1);ctx.lineTo(-8.5,-14);ctx.quadraticCurveTo(-9.5,-26,-3,-27);ctx.lineTo(5,-27);ctx.quadraticCurveTo(11,-26,10,-14);ctx.lineTo(7,-1);ctx.closePath();},c.top,c.topS,dv,2.4);
    ctx.strokeStyle=rgba(INK,0.4);ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(-8,-12);ctx.lineTo(9.5,-12);ctx.moveTo(-4,-27);ctx.lineTo(-5,-19);ctx.moveTo(6,-27);ctx.lineTo(7,-19);ctx.moveTo(-6,-6);ctx.lineTo(7,-6);ctx.stroke();
    var gc=c.hair[tr];ctx.save();ctx.globalCompositeOperation='lighter';glowDot(1,-19,10,gc,0.7);ctx.restore();
    celH(circ(1,-19,3.8),gc,mix(gc,INK,0.35),dv,1);ctx.fillStyle='#ffffff';ctx.fillRect(-0.4,-20.6,1.4,1.4);
    celH(function(){rr(-7.5,-4,16,4,2);},c.sash,c.sashS,dv,1);
  }else if(tp==='alien'){
    celH(torsoPath,c.top,c.topS,dv,2.4);
    celH(function(){ctx.beginPath();ctx.moveTo(-7,-24.5);ctx.lineTo(8.5,-24.5);ctx.lineTo(8,-12);ctx.lineTo(1,-8);ctx.lineTo(-6.5,-12);ctx.closePath();},'#ffd53d','#c8981a',dv,2);
    ctx.strokeStyle=rgba(INK,0.45);ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(1,-24);ctx.lineTo(1,-9);ctx.moveTo(-6,-17);ctx.lineTo(8,-17);ctx.stroke();
    ctx.save();ctx.globalCompositeOperation='lighter';glowDot(1,-17,7,'#ff3d3d',0.7);ctx.restore();
    celH(circ(1,-17,2.4),'#ff4a4a','#a01a2a',dv,0.8);
    celH(function(){rr(-7,-4,15,4.5,1.5);},c.sash,c.sashS,dv,1);
  }else if(tp==='fighter'){
    celH(torsoPath,c.top,c.topS,dv,2.4);
    ctx.fillStyle=c.pants;ctx.beginPath();ctx.moveTo(-8,-13);ctx.lineTo(-7.2,-4);ctx.lineTo(-4,-4);ctx.lineTo(-5,-15);ctx.closePath();ctx.fill();
    ctx.strokeStyle=c.trim;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-3,-26.3);ctx.quadraticCurveTo(1.5,-21,5.5,-26.3);ctx.stroke();
    ctx.strokeStyle=INK;ctx.lineWidth=0.9;ctx.stroke();
    ctx.strokeStyle=rgba('#6a5cc0',0.45);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-2,-20);ctx.quadraticCurveTo(-4,-14,-2,-8);ctx.moveTo(5,-19);ctx.quadraticCurveTo(7,-14,5,-8);ctx.stroke();
    ctx.save();ctx.translate(2,-15);ctx.rotate(Math.PI/4);celH(function(){rr(-2.2,-2.2,4.4,4.4,0.8);},c.trim,c.sashS,dv,0.8);ctx.restore();
    celH(function(){rr(-7.5,-5,16.5,5,2);},c.sash,c.sashS,dv,1.2);
    celH(circ(6.5,-2.5,2.2),c.sash,c.sashS,dv,0.8);
  }else if(tp==='beast'){
    celH(torsoPath,c.top,c.topS,dv,2.4);
    ctx.fillStyle='#2b2340';ctx.beginPath();ctx.moveTo(-1,-26.3);ctx.lineTo(5,-26.3);ctx.lineTo(3,-20);ctx.closePath();ctx.fill();
    ctx.strokeStyle=c.trim;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(2.6,-20);ctx.lineTo(2.6,-4);ctx.stroke();
    ctx.strokeStyle=INK;ctx.lineWidth=0.7;ctx.stroke();
    ctx.fillStyle=c.trim;for(var z=-18;z<-5;z+=3){ctx.fillRect(1.8,z,1.6,0.9);}
    celH(function(){ctx.beginPath();ctx.moveTo(-4,-26.5);ctx.lineTo(-1,-26.5);ctx.lineTo(1.5,-19);ctx.lineTo(-2.5,-22);ctx.closePath();},c.trim,c.sashS,dv,0.8);
    celH(function(){ctx.beginPath();ctx.moveTo(4.5,-26.5);ctx.lineTo(7.5,-26.5);ctx.lineTo(4.5,-20);ctx.closePath();},c.trim,c.sashS,dv,0.8);
    ctx.strokeStyle=rgba(INK,0.3);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-3.5,-17);ctx.quadraticCurveTo(-5.5,-12,-3.5,-7);ctx.stroke();
    celH(function(){rr(-7.5,-5,16.5,4.5,1.5);},'#3a2f22','#1f180f',dv,1);
    celH(function(){rr(0.5,-5.5,4.5,5.5,1);},c.trim,c.sashS,dv,0.8);
  }else{
    celH(torsoPath,c.top,c.topS,dv,2.4);
    ctx.fillStyle=c.trim;ctx.beginPath();ctx.moveTo(-0.5,-26.4);ctx.lineTo(6,-26.4);ctx.lineTo(3,-16);ctx.closePath();ctx.fill();
    ctx.strokeStyle=INK;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-1.5,-26.4);ctx.lineTo(3,-15.5);ctx.lineTo(7,-26.4);ctx.stroke();
    ctx.strokeStyle=rgba(INK,0.3);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-4,-22);ctx.quadraticCurveTo(-6,-15,-4,-8);ctx.moveTo(6,-14);ctx.quadraticCurveTo(7.5,-10,6.5,-6);ctx.stroke();
    celH(circ(-3,-14,3.2),'#ffffff','#d8d2c4',dv,0.8);
    ctx.fillStyle=c.boot;ctx.beginPath();ctx.moveTo(-2.4,-16.2);ctx.lineTo(-4.2,-13.6);ctx.lineTo(-2.8,-13.6);ctx.lineTo(-3.6,-11.6);ctx.lineTo(-1.6,-14.4);ctx.lineTo(-3,-14.4);ctx.closePath();ctx.fill();
    celH(function(){rr(-7.5,-5,16.5,5,2);},c.sash,c.sashS,dv,1.2);
    celH(circ(6.5,-2.5,2.4),c.sash,c.sashS,dv,0.8);
  }
}

/* ---------- face ---------- */
function eyeA(x,y,c,tr,ex,back,glow,dv){
  var rx=back?1.4:1.95,ry=2.8;
  ctx.lineCap='round';ctx.lineJoin='round';
  if(ex==='win'){ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-rx,y+0.8);ctx.quadraticCurveTo(x+0.2,y-ry*0.9,x+rx*1.2,y+0.8);ctx.stroke();return;}
  if(ex==='flip'){ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-rx,y-1.4);ctx.lineTo(x+rx,y+0.3);ctx.lineTo(x-rx*0.6,y+1.9);ctx.stroke();return;}
  if(ex==='land'||(ex==='idle'&&t%170<6)){ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-rx,y+0.6);ctx.quadraticCurveTo(x,y+1.6,x+rx*1.2,y+0.4);ctx.stroke();ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(x+rx*1.2,y+0.4);ctx.lineTo(x+rx*1.6,y-0.2);ctx.stroke();return;}
  if(ex==='jump')ry*=1.1;if(ex==='run'||ex==='kiai')ry*=0.82;if(ex==='fall')ry*=1.18;
  var shape=function(){ctx.beginPath();ctx.moveTo(x-rx,y-ry*0.35);ctx.quadraticCurveTo(x-rx*0.2,y-ry*1.05,x+rx*1.05,y-ry*0.75);ctx.quadraticCurveTo(x+rx*1.2,y+ry*0.6,x+rx*0.2,y+ry);ctx.quadraticCurveTo(x-rx*1.05,y+ry*0.8,x-rx,y-ry*0.35);ctx.closePath();};
  shape();ctx.fillStyle=c.sclera||'#ffffff';ctx.fill();
  ctx.save();shape();ctx.clip();
  var ic=glow?c.aura[Math.max(1,tr)]:c.iris[tr],ix=x+rx*0.22,iy=y+ry*0.12,irx=rx*0.8,iry=ry*0.84;
  if(ex==='fall'){irx*=0.7;iry*=0.7;}
  ctx.beginPath();ctx.ellipse(ix,iy,irx,iry,0,0,Math.PI*2);ctx.fillStyle=glow?mix(ic,'#ffffff',0.2):ic;ctx.fill();
  ctx.beginPath();ctx.ellipse(ix,iy+iry*0.5,irx*0.85,iry*0.48,0,0,Math.PI*2);ctx.fillStyle=mix(ic,'#ffffff',0.5);ctx.fill();
  if(c.type==='alien'){ctx.fillStyle=INK;ctx.fillRect(ix-0.45,iy-iry,0.9,iry*2);}
  else{ctx.beginPath();ctx.ellipse(ix,iy-iry*0.08,irx*0.42,iry*0.5,0,0,Math.PI*2);ctx.fillStyle=glow?'#ffffff':'#120c22';ctx.fill();}
  ctx.fillStyle='rgba(20,16,43,0.28)';ctx.fillRect(x-rx*1.6,y-ry*1.3,rx*3.4,ry*0.62);
  ctx.restore();
  if(glow){ctx.save();ctx.globalCompositeOperation='lighter';glowDot(ix,iy,5,ic,0.6);ctx.restore();}
  ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(ix-irx*0.3,iy-iry*0.38,Math.max(0.55,irx*0.36),0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(ix+irx*0.38,iy+iry*0.36,Math.max(0.3,irx*0.17),0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-rx*1.05,y-ry*0.3);ctx.quadraticCurveTo(x-rx*0.2,y-ry*1.1,x+rx*1.15,y-ry*0.78);ctx.lineTo(x+rx*1.65,y-ry*0.5);ctx.stroke();
  ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(x-rx*0.3,y+ry*0.98);ctx.quadraticCurveTo(x+rx*0.5,y+ry*1.05,x+rx*0.95,y+ry*0.6);ctx.stroke();
}
function brow(x,y,rx,mode,inner){
  ctx.strokeStyle=INK;ctx.lineWidth=1.3;ctx.lineCap='round';ctx.beginPath();
  var l=x-rx*1.1,r=x+rx*1.3,iy=0,oy=0;
  if(mode==='angry'){iy=1.4;oy=-0.8;}else if(mode==='worry'){iy=-1.2;oy=0.4;}else if(mode==='happy'){iy=-0.6;oy=-0.6;}
  var ly=inner<0?y+iy:y+oy,ry2=inner<0?y+oy:y+iy;
  ctx.moveTo(l,ly);ctx.quadraticCurveTo(x,Math.min(ly,ry2)-(mode==='happy'?1.2:0.4),r,ry2);ctx.stroke();
}
function mouth(ex,tr){
  var mx=4.4,my=6.6;ctx.strokeStyle=INK;ctx.lineWidth=1.1;ctx.lineCap='round';
  if(ex==='kiai'||ex==='flip'){ctx.beginPath();ctx.moveTo(mx-2.6,my-1.4);ctx.lineTo(mx+2.4,my-1.6);ctx.quadraticCurveTo(mx+2.2,my+2.8,mx,my+2.6);ctx.quadraticCurveTo(mx-2.6,my+2.4,mx-2.6,my-1.4);ctx.closePath();ctx.fillStyle='#7a1d2d';ctx.fill();ctx.stroke();ctx.fillStyle='#ffffff';ctx.fillRect(mx-2.1,my-1.3,4.2,1.1);ctx.fillStyle='#ff7a8a';ctx.beginPath();ctx.ellipse(mx,my+1.7,1.4,0.7,0,0,Math.PI*2);ctx.fill();}
  else if(ex==='win'){ctx.beginPath();ctx.moveTo(mx-2.4,my-0.6);ctx.quadraticCurveTo(mx,my+3.6,mx+2.4,my-0.8);ctx.closePath();ctx.fillStyle='#7a1d2d';ctx.fill();ctx.stroke();ctx.fillStyle='#ffffff';ctx.fillRect(mx-1.8,my-0.6,3.6,0.9);}
  else if(ex==='fall'){ctx.beginPath();ctx.ellipse(mx,my+0.8,1.4,1.9,0,0,Math.PI*2);ctx.fillStyle='#7a1d2d';ctx.fill();ctx.stroke();}
  else if(ex==='jump'){ctx.beginPath();ctx.ellipse(mx,my+0.4,1.2,0.9,0,0,Math.PI*2);ctx.fillStyle='#7a1d2d';ctx.fill();ctx.stroke();}
  else if(ex==='run'){ctx.beginPath();ctx.moveTo(mx-1.8,my+0.2);ctx.lineTo(mx+1.8,my-0.3);ctx.stroke();}
  else{ctx.beginPath();ctx.moveTo(mx-1.4,my);ctx.quadraticCurveTo(mx,my+0.6,mx+1.6,my-0.2);ctx.stroke();}
}
function skull(){ctx.beginPath();ctx.moveTo(-7.8,1.5);ctx.arc(0,-0.5,8,Math.PI*0.96,Math.PI*2.03);ctx.quadraticCurveTo(8.6,4.5,6.8,7.4);ctx.quadraticCurveTo(4.6,9.8,2,9.9);ctx.quadraticCurveTo(-3,9.3,-6.2,5.6);ctx.closePath();}
function faceAll(c,tr,ex,dv,glow){
  var mode=(ex==='win')?'happy':(ex==='fall'?'worry':((ex==='run'||ex==='kiai'||ex==='flip'||tr>0)?'angry':'calm'));
  var ry=ex==='jump'?3.1:2.8;
  eyeA(-0.6,1.6,c,tr,ex,true,glow,dv);eyeA(4.6,1.6,c,tr,ex,false,glow,dv);
  brow(-0.6,1.6-ry-1.8,1.4,mode,1);brow(4.6,1.6-ry-1.9,1.95,mode,-1);
  ctx.strokeStyle=c.skinS;ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(7.7,3);ctx.lineTo(8.3,4.4);ctx.lineTo(7.5,4.6);ctx.stroke();
  if(c.type==='fighter'||c.type==='beast'){ctx.fillStyle='rgba(255,120,150,0.35)';ctx.beginPath();ctx.ellipse(5.6,5,1.8,0.9,0,0,Math.PI*2);ctx.fill();}
  mouth(ex,tr);
}

/* ---------- hair, one style per fighter ---------- */
function hairSpikes(spk,R,s,sweep,bangs){
  ctx.beginPath();
  for(var k=0;k<spk.length;k++){
    var a=spk[k][0]*Math.PI/180,hw=spk[k][2]*Math.PI/180,L=R+spk[k][1]*s,ta=a+sweep;
    var bx0=Math.cos(a+hw)*R,by0=-Math.sin(a+hw)*R-0.5,bx1=Math.cos(a-hw)*R,by1=-Math.sin(a-hw)*R-0.5;
    if(k===0)ctx.moveTo(bx0,by0);else ctx.lineTo(bx0,by0);
    ctx.quadraticCurveTo(Math.cos(ta+hw*0.3)*L*0.7,-Math.sin(ta+hw*0.3)*L*0.7-0.5,Math.cos(ta)*L,-Math.sin(ta)*L-0.5);
    ctx.quadraticCurveTo(Math.cos(ta-hw*0.6)*L*0.75,-Math.sin(ta-hw*0.6)*L*0.75-0.5,bx1,by1);
  }
  for(var b=0;b<bangs.length;b++)ctx.lineTo(bangs[b][0],bangs[b][1]);
  ctx.closePath();
}
function hairShine(r,a0,a1,w){
  ctx.save();ctx.strokeStyle='rgba(255,255,255,0.85)';ctx.lineWidth=w||1.6;ctx.lineCap='round';
  ctx.beginPath();ctx.arc(0,-0.5,r,a0,a1);ctx.stroke();
  ctx.lineWidth=0.9;ctx.globalAlpha*=0.7;ctx.beginPath();ctx.arc(0,-0.5,r-2.2,a0+0.15,a0+(a1-a0)*0.55);ctx.stroke();ctx.restore();
}
function hairGrow(o,tr){var s=1+tr*0.16+((!o.on&&o.vy<0)?0.08:0);if(o.trans>0)s*=1+0.3*Math.sin(Math.min(1,o.trans/50)*Math.PI);return s;}
function backHair(c,tr,o){
  var tp=c.type;
  if(tp==='fighter'){flow(-5.5,-6,6,26,9,c.hair[tr],c.hairS[tr],o,2.1,1.3);flow(-7,-3,4,12,3.2,c.sash,c.sashS,o,1.4,0.6);}
  if(tp==='beast'){flow(-6,-2,6,26,13,c.hair[tr],c.hairS[tr],o,1.7,1.6);}
  if(tp==='warrior'){var s=hairGrow(o,tr);cel(function(){hairSpikes([[208,9,15],[188,12,15],[168,13,14]],8.2,s,0.22,[[-6,4]]);},mix(c.hair[tr],INK,0.15),mix(c.hairS[tr],INK,0.15),1,2,1.3);}
}
function frontHair(c,tr,o,dv){
  var tp=c.type,s=hairGrow(o,tr),sw=clamp(o.vx*o.dir*0.02,-0.2,0.25)+(o.on?0:0.1);
  if(tp==='warrior'){
    var hp=function(){hairSpikes([[172,12,15],[146,16,15],[120,19,15],[94,18,14],[67,14,14],[42,8,13]],8.6,s,0.16+sw,[[8.4,-2],[7,1.6],[5.6,-2.2],[3.8,0.8],[2.2,-3],[0.2,-0.4],[-1.8,-3.4],[-4.6,-1],[-7.2,2.6]]);};
    cel(hp,c.hair[tr],c.hairS[tr],dv,2.8,1.3);rim(hp,'#ffffff',dv,0.7,0.35);
    hairShine(6.2,Math.PI*1.12,Math.PI*1.55,1.7);
    ctx.save();ctx.strokeStyle='rgba(255,255,255,0.55)';ctx.lineWidth=1;ctx.beginPath();
    [120,94].forEach(function(ag){var a=(ag+10)*Math.PI/180;ctx.moveTo(Math.cos(a)*9.5,-Math.sin(a)*9.5);ctx.lineTo(Math.cos(a)*(11+8*s),-Math.sin(a)*(11+8*s));});ctx.stroke();ctx.restore();
  }else if(tp==='fighter'||tp==='beast'){
    if(tp==='beast'){
      [[-4.5,-6.5,-9,-19+(-2*s),-1,-8.5],[2,-8,4.5,-21-(2*s),7,-7]].forEach(function(e,i){
        var ep=function(){ctx.beginPath();ctx.moveTo(e[0],e[1]);ctx.quadraticCurveTo(e[0]-1+i*1,(e[1]+e[3])/2,e[2],e[3]);ctx.quadraticCurveTo((e[2]+e[4])/2+2,(e[3]+e[5])/2,e[4],e[5]);ctx.closePath();};
        cel(ep,c.hair[tr],c.hairS[tr],dv,1.6,1.2);
        ctx.fillStyle='#ffb3c7';ctx.beginPath();ctx.moveTo(e[0]+1.2,e[1]-0.5);ctx.lineTo(e[2]+(i?0.6:1),e[3]+4);ctx.lineTo(e[4]-1.4,e[5]-0.6);ctx.closePath();ctx.fill();
      });
    }
    var cap=function(){ctx.beginPath();ctx.moveTo(-8.6,5);ctx.arc(0,-0.5,9,Math.PI*0.92,Math.PI*2.03);ctx.lineTo(8.6,-0.5);ctx.lineTo(7.2,2.6);ctx.lineTo(6,-1.8);ctx.lineTo(4.4,1.6);ctx.lineTo(2.8,-2.4);ctx.lineTo(1,0.6);ctx.lineTo(-0.8,-2.8);ctx.lineTo(-3,0);ctx.lineTo(-4.6,-1.6);ctx.lineTo(-5.4,6);ctx.lineTo(-6,11);ctx.lineTo(-8,8);ctx.closePath();};
    cel(cap,c.hair[tr],c.hairS[tr],dv,2.4,1.3);rim(cap,'#ffffff',dv,0.7,0.4);
    hairShine(6.6,Math.PI*1.1,Math.PI*1.6,1.7);
    if(tp==='fighter'){ctx.lineCap='round';ctx.strokeStyle=INK;ctx.lineWidth=4.4;ctx.beginPath();ctx.arc(0,-0.5,8.4,Math.PI*1.06,Math.PI*1.78);ctx.stroke();ctx.strokeStyle=c.sash;ctx.lineWidth=2.6;ctx.stroke();ctx.strokeStyle='rgba(255,255,255,0.6)';ctx.lineWidth=0.8;ctx.beginPath();ctx.arc(0,-0.5,8.9,Math.PI*1.12,Math.PI*1.5);ctx.stroke();}
  }else if(tp==='alien'){
    var fin=function(){ctx.beginPath();ctx.moveTo(-2,-7.5);ctx.quadraticCurveTo(-9,-12*s,-17*s,-17*s);ctx.quadraticCurveTo(-11,-9,-7,-4);ctx.closePath();};
    var fin2=function(){ctx.beginPath();ctx.moveTo(3,-8);ctx.quadraticCurveTo(-3,-17*s,-11*s,-23*s);ctx.quadraticCurveTo(-5,-12,-2,-6.5);ctx.closePath();};
    cel(fin,c.hair[tr],c.hairS[tr],dv,1.8,1.3);rim(fin,'#ffffff',dv,0.9,0.6);
    cel(fin2,c.hair[tr],c.hairS[tr],dv,1.8,1.3);rim(fin2,'#ffffff',dv,0.9,0.7);
    ctx.strokeStyle=INK;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(4,-8);ctx.quadraticCurveTo(6,-13,9,-15.5);ctx.stroke();
    celH(circ(9.3,-16,1.8),c.hair[tr],c.hairS[tr],dv,0.6);
  }
}
function robotHead(c,tr,ex,dv){
  var gc=c.hair[tr];
  var fin=function(){ctx.beginPath();ctx.moveTo(-7,-6);ctx.quadraticCurveTo(-5,-15,1,-17);ctx.quadraticCurveTo(-1,-12,3,-8);ctx.closePath();};
  ctx.save();ctx.globalCompositeOperation='lighter';glowDot(-2,-11,9,gc,0.5);ctx.restore();
  cel(fin,gc,mix(gc,INK,0.35),dv,1.4,1.2);
  var hd=function(){rr(-8.6,-9,17.6,18,6);};
  celH(hd,c.skin,c.skinS,dv,2.4);
  ctx.strokeStyle=rgba(INK,0.35);ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(-8,-1);ctx.lineTo(-3,-1);ctx.stroke();
  celH(circ(-4,2,3.2),'#9aa6bd','#5c6680',dv,1);ctx.fillStyle=gc;ctx.beginPath();ctx.arc(-4,2,1.1,0,Math.PI*2);ctx.fill();
  rr(-1.5,-4,10.5,7,3);ctx.fillStyle='#0b1626';ctx.fill();ctx.lineWidth=1.2;ctx.strokeStyle=INK;ctx.stroke();
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=gc;ctx.strokeStyle=gc;ctx.lineWidth=1.6;ctx.lineCap='round';
  if(ex==='flip'||ex==='kiai'){ctx.beginPath();ctx.moveTo(0.5,-2.2);ctx.lineTo(3,-0.5);ctx.lineTo(0.5,1.2);ctx.moveTo(4.5,-2.2);ctx.lineTo(7,-0.5);ctx.lineTo(4.5,1.2);ctx.stroke();}
  else if(ex==='win'){ctx.beginPath();ctx.arc(1.8,0.6,1.7,Math.PI*1.1,Math.PI*1.9);ctx.arc(6,0.6,1.7,Math.PI*1.1,Math.PI*1.9);ctx.stroke();}
  else if(ex==='land'||(ex==='idle'&&t%170<6)){ctx.fillRect(0,-0.4,3.4,1);ctx.fillRect(4.4,-0.4,3.4,1);}
  else if(ex==='fall'){ctx.beginPath();ctx.arc(1.8,-0.5,1.6,0,Math.PI*2);ctx.arc(6,-0.5,1.6,0,Math.PI*2);ctx.fill();}
  else{var hh=ex==='jump'?3.2:(ex==='run'?1.6:2.4);ctx.fillRect(0,-0.5-hh/2,3.4,hh);ctx.fillRect(4.4,-0.5-hh/2,3.4,hh);}
  glowDot(4,-0.5,7,gc,0.35);ctx.restore();
  ctx.fillStyle='rgba(255,255,255,0.55)';ctx.fillRect(-0.4,-3.2,3,0.8);
  ctx.strokeStyle=INK;ctx.lineWidth=0.9;ctx.beginPath();for(var g=2;g<=7;g+=1.6){ctx.moveTo(g,5.5);ctx.lineTo(g,7.5);}ctx.stroke();
  ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-1,-9);ctx.lineTo(-3,-16);ctx.stroke();
  ctx.beginPath();ctx.arc(-3.2,-17.2,1.8,0,Math.PI*2);ctx.fillStyle=(Math.floor(t/18)%2||tr>0)?gc:c.skinS;ctx.fill();ctx.lineWidth=1;ctx.stroke();
}
function headAll(c,tr,ex,dv,o,glow){
  ctx.save();ctx.scale(0.9,0.9);
  if(c.type==='robot'){robotHead(c,tr,ex,dv);ctx.restore();return;}
  if(c.type==='alien'){celH(function(){ctx.beginPath();ctx.moveTo(-4,1);ctx.lineTo(-12,-4);ctx.lineTo(-5,-2);ctx.closePath();},c.skin,c.skinS,dv,1);}
  celH(skull,c.skin,c.skinS,dv,2.2);
  if(c.type==='alien'){ctx.fillStyle=c.skinS;[[-4,-4,1.3],[-5.5,-1,0.9],[-2.5,-6.2,0.8]].forEach(function(p){ctx.beginPath();ctx.arc(p[0],p[1],p[2],0,Math.PI*2);ctx.fill();});}
  else{celH(function(){ctx.beginPath();ctx.ellipse(-2.6,2.4,1.9,2.6,0,0,Math.PI*2);},c.skin,c.skinS,dv,0.8);}
  ctx.fillStyle=rgba(c.skinS,0.6);ctx.beginPath();ctx.moveTo(-5,6);ctx.quadraticCurveTo(0,9.4,5.5,8.2);ctx.quadraticCurveTo(1,10.6,-4,8);ctx.closePath();ctx.fill();
  faceAll(c,tr,ex,dv,glow);
  frontHair(c,tr,o,dv);
  ctx.restore();
}

/* ---------- poses ---------- */
function pose(o,ex){
  var p={hy:-41,lean:0.03,tilt:0,ff:[5,0],bf:[-5,0],fh:[7,-5],bh:[-6,-5]};
  if(ex==='idle'){var b=Math.sin(t*0.08);p.hy=-41+b*0.5;p.fh=[7,-5+b*0.7];p.bh=[-6,-5-b*0.7];p.tilt=b*0.03;}
  else if(ex==='run'){
    var s=Math.min(1,Math.abs(o.vx)/5),sn=Math.sin(o.ph),cs=Math.cos(o.ph);
    p.hy=-41+Math.abs(sn)*1.8*s-s;p.lean=0.22*s;p.tilt=-0.1*s;
    p.ff=[2+sn*13*s,-Math.max(0,cs)*10*s];p.bf=[-2-sn*13*s,-Math.max(0,-cs)*10*s];
    p.fh=[7-sn*11*s,-11+Math.abs(sn)*2];p.bh=[-4+sn*11*s,-11];
  }else if(ex==='jump'){p.hy=-43;p.lean=0.06;p.tilt=-0.12;p.ff=[8,-17];p.bf=[-5,-4];p.fh=[15,-34];p.bh=[-9,-45];}
  else if(ex==='fall'){var f=Math.sin(t*0.35);p.hy=-41;p.lean=-0.06;p.tilt=0.12;p.ff=[6+f*2,-2];p.bf=[-5-f*2,0];p.fh=[18,-33+f*3];p.bh=[-17,-32-f*3];}
  else if(ex==='flip'){p.hy=-34;p.lean=0.35;p.tilt=0.2;p.ff=[11,-21];p.bf=[6,-17];p.fh=[13,-8];p.bh=[9,-5];}
  else if(ex==='kiai'){var q=Math.sin(t*0.9)*0.6;p.hy=-36;p.lean=-0.12;p.tilt=-0.3;p.ff=[13,0];p.bf=[-13,0];p.fh=[10+q,-3];p.bh=[-9-q,-3];}
  else if(ex==='win'){p.hy=-41;p.lean=0;p.tilt=-0.14;p.fh=[12,-12];p.bh=[-5,-46];}
  else if(ex==='land'){var c2=o.sq;p.hy=-41+c2*11;p.lean=0.2*c2;p.tilt=0.12*c2;p.ff=[9,0];p.bf=[-8,0];p.fh=[12,-10];p.bh=[-11,-9];}
  return p;
}

function drawAura(tr,c,o){
  var col=c.aura[Math.max(1,tr)],pu=0.85+0.15*Math.sin(t*0.12),r=44+tr*9;
  ctx.save();ctx.globalCompositeOperation='lighter';
  if(o.on){ctx.globalAlpha=0.35;ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(0,1,26+tr*5,4.5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
  ctx.translate(0,-40);ctx.scale(0.72,1.2);
  var g=ctx.createRadialGradient(0,0,4,0,0,r);g.addColorStop(0,rgba(col,0.35*pu));g.addColorStop(0.6,rgba(col,0.14*pu));g.addColorStop(1,rgba(col,0));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.6;ctx.beginPath();
  for(var i=0;i<=30;i++){var a=i/30*Math.PI*2,n=1+0.08*Math.sin(a*6+t*0.25)+0.05*Math.sin(a*11-t*0.4),rr2=r*0.62*n,px=Math.cos(a)*rr2,py=Math.sin(a)*rr2;if(py<0)py*=1.1+0.15*Math.max(0,Math.sin(a*5+t*0.3));if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}
  ctx.closePath();ctx.stroke();
  ctx.restore();
}
function drawHero(x,y,o,tr,ci){
  if(sprReady(CH[ci])){drawSprite(x,y,o,tr,ci);return;}
  var c=CH[ci],dv=o.dir,ex=exprOf(o),tp=c.type,glow=tr>0||ex==='kiai';
  ctx.save();ctx.translate(x,y);
  if(glow)drawAura(Math.max(1,tr),c,o);
  var ang=o.flip?o.flipAng:o.landAng;
  if(ang){ctx.translate(0,-42);ctx.rotate(ang*dv);ctx.translate(0,42);}
  ctx.scale(dv*(1+o.sq*0.15),1-o.sq*0.15);
  var p=pose(o,ex);
  if(tp==='beast'){var te=flow(-5,p.hy+1,7,32,13,c.tail[tr],c.tailS[tr],o,0.8+(o.tailT>0?t*0.4:0),-1.1);celH(circ(te[0],te[1],4.4),'#ffffff','#d8dcf0',dv,1);}
  ctx.save();ctx.translate(0,p.hy);ctx.rotate(p.lean);
  if(tp==='alien')flow(-3,-25,6,34,15,c.scarf,c.scarfS,o,0.4,1.1);
  if(tp==='warrior')flow(-3,-27,5,24,6,c.scarf,c.scarfS,o,0.2,0.3);
  if(tp==='warrior'||tp==='fighter')flow(-6,-2,4,12,4.4,c.sash,c.sashS,o,1.2,0.8);
  ctx.save();ctx.translate(2,-35);ctx.rotate(p.tilt);ctx.scale(0.9,0.9);backHair(c,tr,o);ctx.restore();
  arm(c,-2,-24,p.bh,dv,false,tr);
  ctx.restore();
  leg(c,-2,p.hy,p.bf,dv,true,tp);
  leg(c,2,p.hy,p.ff,dv,false,tp);
  ctx.save();ctx.translate(0,p.hy);ctx.rotate(p.lean);
  torso(c,dv,tr);
  limb3([1,-25],[1.5,-28],[2,-31],4.6,4.6,tp==='robot'?'#9aa6bd':c.skin,tp==='robot'?'#5c6680':c.skinS,dv);
  if(tp==='warrior'){ctx.lineCap='round';ctx.strokeStyle=INK;ctx.lineWidth=6.6;ctx.beginPath();ctx.moveTo(-3.5,-26.5);ctx.quadraticCurveTo(1.5,-24,6,-26.5);ctx.stroke();ctx.strokeStyle=c.scarf;ctx.lineWidth=4.2;ctx.stroke();ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-2.5,-27.6);ctx.quadraticCurveTo(1.5,-25.6,5,-27.6);ctx.stroke();}
  ctx.save();ctx.translate(2,-35);ctx.rotate(p.tilt);headAll(c,tr,ex,dv,o,glow);ctx.restore();
  arm(c,3,-24,p.fh,dv,true,tr);
  ctx.restore();
  ctx.restore();
}
