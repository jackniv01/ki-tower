
/* ---------- drawing primitives ---------- */
function outlineText(txt,x,y,size,fill,align){
  ctx.font=size+'px Bangers, Impact, "Arial Black", sans-serif';
  ctx.textAlign=align||'left';ctx.textBaseline='alphabetic';ctx.lineJoin='round';
  ctx.lineWidth=Math.max(3,size*0.18);ctx.strokeStyle=INK;ctx.strokeText(txt,x,y);
  ctx.fillStyle=fill;ctx.fillText(txt,x,y);
}
/* two-tone fill: shade on the lower right, base elsewhere, thin ink outline */
function cel(path,base,shade,dv,k,lw){
  k=k||2.4;
  path();ctx.fillStyle=shade;ctx.fill();
  ctx.save();path();ctx.clip();ctx.translate(-k*dv,-k*1.15);path();ctx.fillStyle=base;ctx.fill();ctx.restore();
  path();ctx.lineWidth=lw||LW;ctx.strokeStyle=INK;ctx.lineJoin='round';ctx.stroke();
}
/* rim light on the upper left edge, drawn after cel */
function rim(path,col,dv,k,a){
  ctx.save();path();ctx.clip();ctx.translate(k*dv,k);path();
  ctx.globalAlpha*=(a==null?0.8:a);ctx.lineWidth=k*2;ctx.strokeStyle=col;ctx.lineJoin='round';ctx.stroke();ctx.restore();
}
function celH(path,base,shade,dv,k,hi,lw){cel(path,base,shade,dv,k,lw);rim(path,hi||'#ffffff',dv,Math.max(0.8,k*0.45),0.7);}
function circ(x,y,r){return function(){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);};}
function glowDot(x,y,r,col,a){
  var g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
}
function flow(ax,ay,segs,len,w0,col,colS,o,phase,lift){
  var mvx=o.vx*o.dir,mvy=clamp(o.vy,-8,8),dx=-(0.7+mvx*0.3),dy=0.3-mvy*0.16+(lift||0);
  var m=Math.sqrt(dx*dx+dy*dy)||1;dx/=m;dy/=m;
  var seg=len/segs,sp=Math.min(1,Math.abs(o.vx)/5+(o.on?0:0.5)),px=ax,py=ay,top=[],bot=[],i;
  for(i=0;i<=segs;i++){
    var hw=w0*(1-i/(segs+1))*0.5;
    top.push([px,py-hw]);bot.push([px,py+hw]);
    var wv=Math.sin(t*0.3+phase-i*0.9)*(i+1)*0.5*(0.5+sp);
    px+=dx*seg;py+=dy*seg+wv*0.35;
  }
  function pth(){ctx.beginPath();ctx.moveTo(top[0][0],top[0][1]);
    for(i=1;i<=segs;i++)ctx.lineTo(top[i][0],top[i][1]);
    for(i=segs;i>=0;i--)ctx.lineTo(bot[i][0],bot[i][1]);ctx.closePath();}
  pth();ctx.fillStyle=col;ctx.fill();
  ctx.strokeStyle=colS;ctx.lineWidth=Math.max(1.5,w0*0.3);ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(bot[0][0],bot[0][1]-0.5);
  for(i=1;i<=segs;i++)ctx.lineTo(bot[i][0],bot[i][1]-0.5);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(top[0][0],top[0][1]+1.2);
  for(i=1;i<segs;i++)ctx.lineTo(top[i][0],top[i][1]+1.2);ctx.stroke();
  pth();ctx.lineWidth=LW;ctx.strokeStyle=INK;ctx.stroke();
  return [top[segs][0],(top[segs][1]+bot[segs][1])/2];
}

/* ---------- worlds ---------- */
var WORLDS=[
 {name:'Emerald Peaks',sky:['#3d8ff0','#86c6ff','#e4f6ff'],wall:['#5d7aa8','#86a3d0','#34476b'],lamp:'#ffd27a',plat:0},
 {name:'Frost Spires',sky:['#5f8fd6','#aed3f2','#f3fbff'],wall:['#6a8fb8','#9fc4e6','#3a5577'],lamp:'#9ff3ff',plat:1},
 {name:'Crystal Hollow',sky:['#160c38','#33186a','#5e2a8a'],wall:['#3a2a6e','#5d48a8','#1d1440'],lamp:'#ff7bf0',plat:2},
 {name:'Ember Core',sky:['#240505','#651208','#cf4417'],wall:['#3e2226','#62383c','#1c0c0e'],lamp:'#ff8a2a',plat:3},
 {name:'Sea of Clouds',sky:['#35357f','#d9608f','#ffc47a'],wall:['#7a4f86','#a477b0','#3d2445'],lamp:'#ffb36b',plat:4},
 {name:'Sky Temple',sky:['#2a56cf','#6c9ff4','#d2e6ff'],wall:['#b89f78','#e6d3ab','#6d5a3c'],lamp:'#ffe27a',plat:5},
 {name:'Starfield',sky:['#04051a','#0f0b35','#2a0f52'],wall:['#2a2266','#463ca0','#130f36'],lamp:'#7cf3ff',plat:6},
 {name:'Neon City',sky:['#07031a','#220a46','#5a1262'],wall:['#241f44','#463e80','#100c26'],lamp:'#ff3df0',plat:7},
 {name:'Thunder Storm',sky:['#0a0e1c','#1c2540','#36425e'],wall:['#3a4258','#5a6480','#1a2030'],lamp:'#ffe63d',plat:8},
 {name:'Black Hole',sky:['#000000','#06030f','#170828'],wall:['#1a1430','#302860','#08061a'],lamp:'#b57bff',plat:9},
 {name:'Pure Energy',sky:['#fff4d0','#c4f2ff','#ffd2f0'],wall:['#d8ccff','#ffffff','#9a8ad0'],lamp:'#ffffff',plat:10}
];
var NW=WORLDS.length;
function worldAt(f){return Math.min(NW-1,Math.max(0,Math.floor(f/100)));}
function blend(){var w=fs/100,a=Math.min(NW-1,Math.floor(w)),k=a<NW-1?ss(0.9,1,w-a):0;return {a:a,b:Math.min(NW-1,a+1),k:k};}
function wc(key,j,B){return mix(WORLDS[B.a][key][j],WORLDS[B.b][key][j],B.k);}

function pine(x,y,s,col,colS){
  for(var i=0;i<3;i++){
    var yy=y-i*9*s,ww=(13-i*3)*s;
    ctx.beginPath();ctx.moveTo(x,yy-14*s);ctx.lineTo(x+ww,yy);ctx.lineTo(x-ww,yy);ctx.closePath();
    ctx.fillStyle=colS;ctx.fill();
    ctx.beginPath();ctx.moveTo(x,yy-14*s);ctx.lineTo(x-ww,yy);ctx.lineTo(x-ww*0.2,yy);ctx.closePath();ctx.fillStyle=col;ctx.fill();
  }
  ctx.fillStyle=colS;ctx.fillRect(x-1.5*s,y,3*s,5*s);
}
function cloud(cx,cy,s,base,shade){
  var P4=[[0,0,46,16],[-26,4,28,12],[28,5,30,11],[4,-10,26,13]],i;
  ctx.fillStyle=shade;ctx.beginPath();
  for(i=0;i<4;i++){ctx.moveTo(cx+(P4[i][0]+P4[i][2])*s,cy+5*s+P4[i][1]*s);ctx.ellipse(cx+P4[i][0]*s,cy+5*s+P4[i][1]*s,P4[i][2]*s,P4[i][3]*s,0,0,Math.PI*2);}
  ctx.fill();
  ctx.fillStyle=base;ctx.beginPath();
  for(i=0;i<4;i++){ctx.moveTo(cx+(P4[i][0]+P4[i][2])*s,cy+P4[i][1]*s);ctx.ellipse(cx+P4[i][0]*s,cy+P4[i][1]*s,P4[i][2]*s,P4[i][3]*s,0,0,Math.PI*2);}
  ctx.fill();
}
function ridge(baseY,amp,col,seed){
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,H+10);
  for(var x=0;x<=W+30;x+=24){var i=x/24,h=amp*(0.55+0.3*Math.sin(i*0.8+seed)+0.25*Math.sin(i*0.33+seed*2)+0.12*Math.sin(i*2.1+seed));ctx.lineTo(x,baseY-h);}
  ctx.lineTo(W+30,H+10);ctx.closePath();ctx.fill();
}
function rockPillar(x,y,w,h,col,colS,top){
  ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x+w*0.08,y+12);ctx.quadraticCurveTo(x+w*0.1,y,x+w*0.3,y-2);ctx.lineTo(x+w*0.75,y+1);ctx.quadraticCurveTo(x+w*0.95,y+2,x+w*0.92,y+14);ctx.lineTo(x+w,y+h);ctx.closePath();
  ctx.fillStyle=colS;ctx.fill();
  ctx.beginPath();ctx.moveTo(x+w*0.08,y+12);ctx.quadraticCurveTo(x+w*0.1,y,x+w*0.3,y-2);ctx.lineTo(x+w*0.55,y);ctx.lineTo(x+w*0.42,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fillStyle=col;ctx.fill();
  if(top){ctx.fillStyle=top;rr(x+w*0.05,y-4,w*0.9,9,4);ctx.fill();}
}
function crystal(x,y,len,w,ang,col,colS,al){
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);
  glowDot(0,-len*0.6,len*0.8,col,0.22*al);
  ctx.beginPath();ctx.moveTo(-w/2,0);ctx.lineTo(-w/2,-len*0.78);ctx.lineTo(0,-len);ctx.lineTo(w/2,-len*0.78);ctx.lineTo(w/2,0);ctx.closePath();
  ctx.fillStyle=colS;ctx.fill();
  ctx.beginPath();ctx.moveTo(-w/2,0);ctx.lineTo(-w/2,-len*0.78);ctx.lineTo(0,-len);ctx.lineTo(0,0);ctx.closePath();ctx.fillStyle=col;ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.7)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-w/2+2,-len*0.1);ctx.lineTo(-w/2+2,-len*0.74);ctx.lineTo(-1,-len*0.93);ctx.stroke();
  ctx.restore();
}
function temple(x,y,s,al){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle='#6b4a2e';ctx.beginPath();ctx.moveTo(-70,0);ctx.quadraticCurveTo(-40,60,0,90);ctx.quadraticCurveTo(40,60,70,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#8a6440';ctx.beginPath();ctx.moveTo(-70,0);ctx.quadraticCurveTo(-40,60,0,90);ctx.lineTo(-10,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#5fbf4a';rr(-74,-6,148,12,6);ctx.fill();
  ctx.fillStyle='#efe2c4';ctx.fillRect(-40,-36,80,30);
  ctx.fillStyle='#c9b48c';for(var i=-32;i<=32;i+=16)ctx.fillRect(i-3,-36,6,30);
  ctx.fillStyle='#d8433a';ctx.beginPath();ctx.moveTo(-56,-34);ctx.quadraticCurveTo(0,-46,56,-34);ctx.lineTo(36,-54);ctx.lineTo(-36,-54);ctx.closePath();ctx.fill();
  ctx.fillStyle='#efe2c4';ctx.fillRect(-22,-72,44,18);
  ctx.fillStyle='#d8433a';ctx.beginPath();ctx.moveTo(-36,-70);ctx.quadraticCurveTo(0,-80,36,-70);ctx.lineTo(18,-90);ctx.lineTo(-18,-90);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ffd53d';ctx.beginPath();ctx.arc(0,-95,5,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function planet(cx,cy,r,base,shade,ringCol,alpha){
  ctx.save();ctx.globalAlpha*=alpha;
  if(ringCol){ctx.strokeStyle=ringCol;ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(cx,cy,r*1.7,r*0.4,-0.35,Math.PI,Math.PI*2);ctx.stroke();}
  var pf=circ(cx,cy,r);
  pf();ctx.fillStyle=shade;ctx.fill();
  ctx.save();pf();ctx.clip();ctx.beginPath();ctx.arc(cx-r*0.18,cy-r*0.18,r,0,Math.PI*2);ctx.fillStyle=base;ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=r*0.12;
  ctx.beginPath();ctx.moveTo(cx-r,cy-r*0.25);ctx.quadraticCurveTo(cx,cy-r*0.45,cx+r,cy-r*0.2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-r,cy+r*0.3);ctx.quadraticCurveTo(cx,cy+r*0.1,cx+r,cy+r*0.35);ctx.stroke();ctx.restore();
  if(ringCol){ctx.strokeStyle=ringCol;ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(cx,cy,r*1.7,r*0.4,-0.35,0,Math.PI);ctx.stroke();}
  ctx.restore();
}
function starField(al,dens){
  for(var i=0;i<stars.length*dens;i++){
    var s=stars[i],y=wrap(s.y-cam*0.12,H),tw=0.45+0.55*Math.abs(Math.sin(t*0.04+i));
    ctx.globalAlpha=al*tw;ctx.fillStyle=s.c;ctx.fillRect(s.x,y,s.s,s.s);
    if(s.s===3){ctx.fillRect(s.x-2,y+1,7,1);ctx.fillRect(s.x+1,y-2,1,7);}
  }
  ctx.globalAlpha=al;
}

/* each world draws its own scenery at opacity al */
function decor(wi,al){
  if(al<0.01)return;
  ctx.save();ctx.globalAlpha=al;
  var i,x,y,climb=Math.max(0,-(cam+610));
  if(wi===0){
    glowDot(372,150,150,'#fff1b8',0.55);
    ctx.fillStyle='#fff6d0';ctx.beginPath();ctx.arc(372,150,38,0,Math.PI*2);ctx.fill();
    var hz=1-ss(0,900,climb);
    if(hz>0.01){
      ctx.globalAlpha=al*hz;
      ridge(H-210+climb*0.12,150,'#9cc3ee',1.3);ridge(H-150+climb*0.18,120,'#6fa0d8',4.1);
      for(i=0;i<16;i++)pine(WALL+10+i*28+((i*13)%9),H-60+climb*0.26+((i*7)%11),1.1,'#3f9a5a','#246e45');
      ctx.globalAlpha=al;
    }
    for(i=0;i<4;i++){
      var side=i%2;y=wrap(i*290-cam*0.2,1160)-240;x=side?W-WALL-62:WALL-28;
      ctx.globalAlpha=al*0.9;rockPillar(x,y,90,320,'#7f95bf','#62789f','#58b06a');
      pine(x+(side?22:58),y-2,0.9,'#3f9a5a','#246e45');pine(x+(side?44:36),y-4,1.1,'#3f9a5a','#246e45');
    }
    ctx.globalAlpha=al;
    for(i=0;i<6;i++){
      var l=i%2,cx=wrap(i*173+40+t*(l?0.12:0.06),W+200)-100,cy=wrap(i*170-cam*(l?0.32:0.2),H+240)-120;
      ctx.globalAlpha=al*(l?0.95:0.7);cloud(cx,cy,l?1:0.72,'#ffffff','#cfe2f7');
    }
  }else if(wi===1){
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    var ac=['#5dffb0','#5de0ff','#a07bff'];
    for(i=0;i<3;i++){
      ctx.strokeStyle=rgba(ac[i],0.16*al);ctx.lineWidth=34;ctx.beginPath();
      for(x=0;x<=W;x+=20){y=90+i*46+Math.sin(x*0.013+t*0.015+i*2)*30+Math.sin(x*0.035-t*0.02)*8;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
      ctx.stroke();
    }
    ctx.restore();
    for(i=0;i<5;i++){
      var sd=i%2;y=wrap(i*240-cam*0.18,1200)-260;x=sd?W-WALL-80:WALL-30;
      ctx.fillStyle='#8fb3d9';ctx.beginPath();ctx.moveTo(x,y+380);ctx.lineTo(x+20,y+80);ctx.lineTo(x+55,y);ctx.lineTo(x+95,y+90);ctx.lineTo(x+110,y+380);ctx.closePath();ctx.fill();
      ctx.fillStyle='#f4fbff';ctx.beginPath();ctx.moveTo(x+31,y+45);ctx.lineTo(x+55,y);ctx.lineTo(x+80,y+50);ctx.lineTo(x+68,y+44);ctx.lineTo(x+58,y+58);ctx.lineTo(x+46,y+42);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.beginPath();ctx.moveTo(x+55,y);ctx.lineTo(x+20,y+80);ctx.lineTo(x+30,y+200);ctx.lineTo(x+52,y+20);ctx.closePath();ctx.fill();
    }
    ctx.fillStyle='#ffffff';
    for(i=0;i<55;i++){
      x=wrap(i*53+Math.sin(t*0.012+i)*24,W);y=wrap(i*97+t*(0.6+(i%3)*0.3)-cam*0.25,H);
      ctx.globalAlpha=al*(0.5+(i%3)*0.2);ctx.beginPath();ctx.arc(x,y,1.2+(i%3)*0.7,0,Math.PI*2);ctx.fill();
    }
  }else if(wi===2){
    for(i=0;i<6;i++){
      var s2=i%2;y=wrap(i*210-cam*0.16,1260)-200;
      ctx.fillStyle='#1d1046';ctx.beginPath();
      if(s2){ctx.moveTo(W,y-40);ctx.quadraticCurveTo(W-110,y+60,W-70,y+180);ctx.quadraticCurveTo(W-140,y+260,W,y+340);}
      else{ctx.moveTo(0,y-40);ctx.quadraticCurveTo(110,y+60,70,y+180);ctx.quadraticCurveTo(140,y+260,0,y+340);}
      ctx.closePath();ctx.fill();
      var cols=[['#ff8af0','#b03aa8'],['#7cf3ff','#2a9ab8'],['#c4a0ff','#6a3ad0']],cc=cols[i%3];
      var bx=s2?W-80:80,by=y+170;
      crystal(bx,by,70,22,s2?-0.7:0.7,cc[0],cc[1],al);crystal(bx+(s2?18:-18),by+16,48,16,s2?-1.1:1.1,cc[0],cc[1],al);crystal(bx+(s2?-6:6),by-6,40,14,s2?-0.3:0.3,cc[0],cc[1],al);
    }
    for(i=0;i<30;i++){
      x=wrap(i*71,W);y=wrap(i*113-cam*0.3+Math.sin(t*0.02+i)*10,H);var tw=0.3+0.7*Math.abs(Math.sin(t*0.05+i*1.7));
      ctx.globalAlpha=al*tw;ctx.fillStyle=i%2?'#ffd6ff':'#bff8ff';ctx.fillRect(x-1,y-4,2,8);ctx.fillRect(x-4,y-1,8,2);
    }
  }else if(wi===3){
    var hg=ctx.createLinearGradient(0,H*0.55,0,H);hg.addColorStop(0,'rgba(255,90,20,0)');hg.addColorStop(1,'rgba(255,120,30,'+(0.35)+')');
    ctx.fillStyle=hg;ctx.fillRect(0,H*0.55,W,H*0.45);
    for(i=0;i<5;i++){
      var s3=i%2;y=wrap(i*250-cam*0.17,1250)-240;x=s3?W-WALL-90:WALL-30;
      ctx.fillStyle='#2a1012';ctx.beginPath();ctx.moveTo(x,y+400);ctx.lineTo(x+30,y+40);ctx.lineTo(x+50,y);ctx.lineTo(x+78,y+10);ctx.lineTo(x+100,y+60);ctx.lineTo(x+120,y+400);ctx.closePath();ctx.fill();
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=rgba('#ff7a1a',0.8*al);ctx.lineWidth=4;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(x+60,y+8);ctx.quadraticCurveTo(x+52,y+90,x+66,y+160);ctx.quadraticCurveTo(x+74,y+230,x+60,y+320);ctx.stroke();
      ctx.lineWidth=1.6;ctx.strokeStyle=rgba('#ffe08a',0.9*al);ctx.stroke();
      glowDot(x+64,y+10,40,'#ff7a1a',0.5*al);ctx.restore();
    }
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(i=0;i<45;i++){
      x=wrap(i*67+Math.sin(t*0.03+i)*14,W);y=wrap(i*131-t*(0.8+(i%4)*0.4)-cam*0.3,H+40)-20;
      ctx.globalAlpha=al*(0.4+0.6*Math.abs(Math.sin(t*0.08+i)));ctx.fillStyle=i%3?'#ff9a3a':'#ffe08a';ctx.beginPath();ctx.arc(x,y,1.3+(i%3)*0.6,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }else if(wi===4){
    glowDot(W/2,470,260,'#ffb36b',0.55);
    ctx.fillStyle='#ffe3b0';ctx.beginPath();ctx.arc(W/2,470,70,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,170,120,0.6)';for(i=0;i<4;i++)ctx.fillRect(W/2-80,480+i*14,160,4);
    starField(al*0.6,0.4);ctx.globalAlpha=al;
    var cb=[['#ffd9e8','#e08fb0'],['#ffe7c9','#f09a7a'],['#f3c6ff','#b77fd0']];
    for(i=0;i<9;i++){
      var ly=i%3,cx2=wrap(i*157+t*(0.04+ly*0.04),W+260)-130,cy2=wrap(i*130-cam*(0.15+ly*0.1),H+260)-130;
      ctx.globalAlpha=al*(0.65+ly*0.15);cloud(cx2,cy2,0.9+ly*0.35,cb[ly][0],cb[ly][1]);
    }
  }else if(wi===5){
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(i=0;i<4;i++){var bx2=60+i*120,gr=ctx.createLinearGradient(bx2,0,bx2+60,H);gr.addColorStop(0,'rgba(255,255,220,'+(0.12*al)+')');gr.addColorStop(1,'rgba(255,255,220,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(bx2,0);ctx.lineTo(bx2+40,0);ctx.lineTo(bx2+140,H);ctx.lineTo(bx2+60,H);ctx.closePath();ctx.fill();}
    ctx.restore();
    for(i=0;i<5;i++){
      var l5=i%2;var tx=l5?W-110-((i*37)%40):110+((i*29)%40),ty=wrap(i*260-cam*(l5?0.22:0.14),1300)-200;
      ctx.globalAlpha=al*(l5?0.95:0.7);temple(tx,ty,l5?0.85:0.6,al);
    }
    ctx.globalAlpha=al;
    for(i=0;i<5;i++){var cx3=wrap(i*190+t*0.08,W+200)-100,cy3=wrap(i*200-cam*0.35,H+240)-120;ctx.globalAlpha=al*0.85;cloud(cx3,cy3,0.8,'#ffffff','#c6dbf7');}
  }else if(wi===7){
    var sg,j;
    glowDot(W/2,250,230,'#ff3df0',0.4);
    ctx.save();ctx.beginPath();ctx.arc(W/2,250,86,0,Math.PI*2);ctx.clip();
    sg=ctx.createLinearGradient(0,164,0,336);sg.addColorStop(0,'#ffe066');sg.addColorStop(0.55,'#ff7a5a');sg.addColorStop(1,'#ff2d9a');ctx.fillStyle=sg;ctx.fillRect(W/2-90,160,180,180);
    ctx.fillStyle='#2a0a4a';for(i=0;i<7;i++){ctx.fillRect(W/2-90,262+i*11+((t*0.3)%11),180,1.5+i*0.9);}
    ctx.restore();
    for(i=0;i<9;i++){
      var bx=36+i*50+((i*13)%10),bw=26+((i*17)%16);
      ctx.fillStyle='rgba(26,12,58,0.92)';ctx.fillRect(bx,0,bw,H);
      for(j=0;j<40;j++){var wy=wrap(j*19-cam*0.08+i*7,H+20)-10;if(((i*31+j*7)%5)<2){ctx.fillStyle=(j+i)%3?'rgba(255,61,240,0.55)':'rgba(63,224,255,0.55)';ctx.fillRect(bx+4,wy,3,5);ctx.fillRect(bx+bw-8,wy,3,5);}}
    }
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(i=0;i<7;i++){var cx4=wrap(t*(2.2+(i%3))*(i%2?1:-1)+i*151,W+120)-60,cy4=wrap(i*143-cam*0.15,H);
      ctx.strokeStyle=i%2?'rgba(63,224,255,0.9)':'rgba(255,61,240,0.9)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx4,cy4);ctx.lineTo(cx4+(i%2?-26:26),cy4);ctx.stroke();
      glowDot(cx4,cy4,8,i%2?'#3fe0ff':'#ff3df0',0.8);}
    ctx.restore();
    for(var sd2=0;sd2<2;sd2++){
      var tx2=sd2?W-WALL-56:WALL-14;
      ctx.fillStyle='#120a2c';ctx.fillRect(tx2,0,70,H);
      for(j=0;j<30;j++){var wy2=wrap(j*26-cam*0.25,H+26)-13;for(var c2=0;c2<4;c2++){if(((j*3+c2*5+sd2)%7)<4){ctx.fillStyle=((j+c2)%4)?'rgba(255,214,120,0.7)':'rgba(63,224,255,0.75)';ctx.fillRect(tx2+8+c2*15,wy2,8,10);}}}
      for(j=0;j<3;j++){
        var sy3=wrap(j*330+sd2*160-cam*0.25,H+330)-160,on=Math.sin(t*0.08+j*2+sd2)>-0.7,nc=(j+sd2)%2?'#3fe0ff':'#ff3df0';
        ctx.save();if(on){ctx.globalCompositeOperation='lighter';glowDot(tx2+35,sy3+24,50,nc,0.45);}
        ctx.strokeStyle=on?nc:rgba(nc,0.25);ctx.lineWidth=3;rr(tx2+10,sy3,50,48,8);ctx.stroke();
        ctx.lineWidth=2;ctx.beginPath();if(j%3===0){ctx.moveTo(tx2+20,sy3+38);ctx.lineTo(tx2+35,sy3+10);ctx.lineTo(tx2+50,sy3+38);}else if(j%3===1){ctx.arc(tx2+35,sy3+24,12,0,Math.PI*2);}else{ctx.moveTo(tx2+22,sy3+14);ctx.lineTo(tx2+48,sy3+14);ctx.moveTo(tx2+22,sy3+24);ctx.lineTo(tx2+48,sy3+24);ctx.moveTo(tx2+22,sy3+34);ctx.lineTo(tx2+40,sy3+34);}ctx.stroke();
        if(on){ctx.strokeStyle='rgba(255,255,255,0.85)';ctx.lineWidth=0.8;ctx.stroke();}
        ctx.restore();
      }
    }
  }else if(wi===8){
    var lk=t%170,seedL=Math.floor(t/170),pr=function(n){var q=Math.sin(n*12.9898+seedL*78.233)*43758.5453;return q-Math.floor(q);};
    for(i=0;i<10;i++){
      var ly2=i%3,cx5=wrap(i*163+t*(0.15+ly2*0.12),W+300)-150,cy5=wrap(i*121-cam*(0.1+ly2*0.08),H+300)-150;
      ctx.globalAlpha=al*(0.75+ly2*0.1);cloud(cx5,cy5,1.2+ly2*0.4,['#3a4660','#2a3248','#1c2234'][ly2],['#232b40','#161c2c','#0e121e'][ly2]);
      if(lk<25&&i%3===((seedL)%3)){ctx.save();ctx.globalCompositeOperation='lighter';glowDot(cx5,cy5,90,'#bcd4ff',0.35*(1-lk/25)*al);ctx.restore();}
    }
    ctx.globalAlpha=al;
    if(lk<14){
      var bx2=60+pr(1)*(W-120),by2=0,k3=1-lk/14,pts=[[bx2,by2]];
      for(j=0;j<9;j++){bx2+=(pr(j+2)-0.5)*60;by2+=30+pr(j+20)*25;pts.push([bx2,by2]);}
      ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineJoin='round';ctx.lineCap='round';
      [[10,'rgba(160,190,255,'+(0.35*k3)+')'],[4,'rgba(220,235,255,'+(0.9*k3)+')'],[1.6,'rgba(255,255,255,'+k3+')']].forEach(function(st){ctx.strokeStyle=st[1];ctx.lineWidth=st[0];ctx.beginPath();pts.forEach(function(p,q){if(q)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);});ctx.stroke();});
      ctx.lineWidth=1.4;ctx.strokeStyle='rgba(220,235,255,'+(0.8*k3)+')';ctx.beginPath();ctx.moveTo(pts[4][0],pts[4][1]);ctx.lineTo(pts[4][0]+(pr(40)-0.5)*80,pts[4][1]+50);ctx.lineTo(pts[4][0]+(pr(41)-0.5)*100,pts[4][1]+95);ctx.stroke();
      ctx.restore();
      ctx.fillStyle='rgba(230,240,255,'+(0.45*k3*(SET.lite?0.3:1))+')';ctx.fillRect(0,0,W,H);
    }
    ctx.strokeStyle='rgba(170,195,235,0.45)';ctx.lineWidth=1.2;ctx.beginPath();
    for(i=0;i<90;i++){var rx=wrap(i*37+t*3,W+40)-20,ry=wrap(i*71+t*14-cam*0.3,H+40)-20;ctx.moveTo(rx,ry);ctx.lineTo(rx-4,ry+14);}
    ctx.stroke();
  }else if(wi===9){
    starField(al,1);
    var bhx=W/2,bhy=300+Math.sin(t*0.005)*10;
    ctx.save();ctx.globalCompositeOperation='lighter';
    glowDot(bhx,bhy,260,'#7a2fd0',0.35);glowDot(bhx,bhy,160,'#ff6a3d',0.25);
    for(i=0;i<60;i++){
      var ph=((t*0.5+i*41)%300)/300,rr3=320*(1-ph)+60,an=i*2.4+ph*9+t*0.004;
      ctx.fillStyle=i%3?'rgba(255,190,120,'+(0.9*ph)+')':'rgba(190,150,255,'+(0.9*ph)+')';
      ctx.beginPath();ctx.arc(bhx+Math.cos(an)*rr3,bhy+Math.sin(an)*rr3*0.38,1.2+ph*1.4,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
    var disk=function(back){
      for(j=0;j<9;j++){
        var r4=70+j*11,cl=['#fff1c0','#ffd27a','#ffa04a','#ff6a3d','#ff3d71','#d03aa8','#9a3ad0','#6a2fb0','#3a1a80'][j];
        ctx.save();ctx.translate(bhx,bhy);ctx.rotate(-0.22);
        ctx.strokeStyle=rgba(cl,0.85-j*0.06);ctx.lineWidth=7-j*0.4;ctx.setLineDash([24+j*6,8+j*2]);ctx.lineDashOffset=-t*(2.6-j*0.2);
        ctx.beginPath();ctx.ellipse(0,0,r4,r4*0.26,0,back?Math.PI:0,back?Math.PI*2:Math.PI);ctx.stroke();ctx.restore();
      }
      ctx.setLineDash([]);
    };
    ctx.save();ctx.globalCompositeOperation='lighter';disk(true);
    ctx.strokeStyle='rgba(255,210,140,0.55)';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(bhx,bhy-6,70,64,0,Math.PI*1.08,Math.PI*1.92);ctx.stroke();
    ctx.restore();
    ctx.fillStyle='#000000';ctx.beginPath();ctx.arc(bhx,bhy,56,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.globalCompositeOperation='lighter';
    ctx.strokeStyle='rgba(255,236,190,'+(0.8+0.2*Math.sin(t*0.1))+')';ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(bhx,bhy,57.5,0,Math.PI*2);ctx.stroke();
    disk(false);ctx.restore();
  }else if(wi===10){
    var ex=W/2,ey=260;
    ctx.save();ctx.translate(ex,ey);ctx.rotate(t*0.004);
    for(i=0;i<18;i++){ctx.rotate(Math.PI*2/18);ctx.fillStyle=i%2?'rgba(255,214,90,0.22)':'rgba(120,220,255,0.2)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-26,-700);ctx.lineTo(26,-700);ctx.closePath();ctx.fill();}
    ctx.restore();
    for(i=0;i<4;i++){var rp=((t*1.4+i*90)%360);ctx.strokeStyle='rgba(255,255,255,'+(0.7*(1-rp/360))+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(ex,ey,rp,0,Math.PI*2);ctx.stroke();}
    var hg=0.18+0.12*Math.sin(t*0.05);ctx.strokeStyle='rgba(140,120,255,'+hg+')';ctx.lineWidth=1;ctx.beginPath();
    for(var hy=-1;hy<20;hy++){var yy2=wrap(hy*42-cam*0.1,H+42)-21;for(var hx=-1;hx<14;hx++){var xx2=hx*42+(hy%2?21:0);for(var q=0;q<6;q++){var a1=q*Math.PI/3+Math.PI/6,a2=a1+Math.PI/3;ctx.moveTo(xx2+Math.cos(a1)*14,yy2+Math.sin(a1)*14);ctx.lineTo(xx2+Math.cos(a2)*14,yy2+Math.sin(a2)*14);}}}
    ctx.stroke();
    var oc=['#ffd53d','#3fe0ff','#ff6ad5','#9a7bff','#7dff9a'];
    for(i=0;i<26;i++){var ox=wrap(i*67+Math.sin(t*0.02+i)*20,W),oy=wrap(i*131-t*(0.6+(i%4)*0.3)-cam*0.25,H+40)-20,orr=5+(i%4)*3;
      glowDot(ox,oy,orr*3,oc[i%5],0.6);ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(ox,oy,orr*0.5,0,Math.PI*2);ctx.fill();}
    glowDot(ex,ey,120,'#ffffff',0.9);
  }else{
    starField(al,1);
    var nb=[[110,230,190,'#7a3fe0'],[380,420,220,'#1fb8c8'],[200,600,200,'#e03f9a']];
    for(i=0;i<3;i++){
      var ny=wrap(nb[i][1]-cam*0.06+i*140,H+400)-200,gr2=ctx.createRadialGradient(nb[i][0],ny,0,nb[i][0],ny,nb[i][2]);
      gr2.addColorStop(0,rgba(nb[i][3],0.32*al));gr2.addColorStop(1,rgba(nb[i][3],0));
      ctx.fillStyle=gr2;ctx.fillRect(0,ny-nb[i][2],W,nb[i][2]*2);
    }
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    var cs=['#3fe0ff','#ff4fb8','#ffd53d'];
    for(i=0;i<3;i++){
      ctx.strokeStyle=rgba(cs[i],0.16*al);ctx.lineWidth=26;ctx.beginPath();
      for(x=0;x<=W;x+=20){var y2=130+i*190+Math.sin(x*0.015+t*0.02+i*2)*34+Math.sin(x*0.04-t*0.03)*10;if(x===0)ctx.moveTo(x,y2);else ctx.lineTo(x,y2);}
      ctx.stroke();
    }
    ctx.restore();
    planet(372,wrap(-cam*0.05+120,H+500)-250,56,'#8a6ff0','#4a3aa8','#ffd8f0',0.95);
    planet(96,wrap(-cam*0.09+420,H+300)-150,26,'#ff9f6e','#b04a4a',null,0.95);
    if(t%260<16){
      var sdn=Math.floor(t/260),sx=(sdn*97)%W+60,sy=(sdn*53)%260+40,kk=(t%260)/16;
      ctx.strokeStyle='rgba(255,255,255,'+(1-kk)+')';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx-kk*90,sy+kk*45);ctx.lineTo(sx-kk*90+34,sy+kk*45-17);ctx.stroke();
    }
  }
  ctx.restore();
}
function drawBG(){
  var B=blend();
  var g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,wc('sky',0,B));g.addColorStop(0.55,wc('sky',1,B));g.addColorStop(1,wc('sky',2,B));
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  decor(B.a,1-B.k);
  if(B.k>0.01)decor(B.b,B.k);
}
function lamp(x,y,col){
  glowDot(x,y,40,col,0.55);
  rr(x-5,y-8,10,16,4);ctx.fillStyle=col;ctx.fill();ctx.lineWidth=LW;ctx.strokeStyle=INK;ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.8)';ctx.fillRect(x-2.5,y-5,2,7);
}
function drawWalls(){
  var B=blend(),wcol=wc('wall',0,B),wh=wc('wall',1,B),lc=wc('wall',2,B),k0=Math.floor(cam/48),y,k;
  var gL=ctx.createLinearGradient(0,0,WALL,0);gL.addColorStop(0,lc);gL.addColorStop(1,wcol);
  var gR=ctx.createLinearGradient(W-WALL,0,W,0);gR.addColorStop(0,wcol);gR.addColorStop(1,lc);
  ctx.fillStyle=gL;ctx.fillRect(0,0,WALL,H);ctx.fillStyle=gR;ctx.fillRect(W-WALL,0,WALL,H);
  ctx.lineWidth=2;
  for(y=k0*48-cam,k=k0;y<H+48;y+=48,k++){
    var jx=(k%2===0)?WALL*0.4:WALL*0.75;
    ctx.strokeStyle=lc;ctx.beginPath();
    ctx.moveTo(0,y+48);ctx.lineTo(WALL,y+48);ctx.moveTo(W-WALL,y+48);ctx.lineTo(W,y+48);
    ctx.moveTo(jx,y);ctx.lineTo(jx,y+48);ctx.moveTo(W-WALL+jx,y);ctx.lineTo(W-WALL+jx,y+48);ctx.stroke();
    ctx.strokeStyle=wh;ctx.lineWidth=1.4;ctx.beginPath();
    ctx.moveTo(2,y+3);ctx.lineTo(jx-3,y+3);ctx.moveTo(jx+2,y+3);ctx.lineTo(WALL-2,y+3);
    ctx.moveTo(W-WALL+2,y+3);ctx.lineTo(W-WALL+jx-3,y+3);ctx.moveTo(W-WALL+jx+2,y+3);ctx.lineTo(W-2,y+3);ctx.stroke();ctx.lineWidth=2;
  }
  ctx.strokeStyle=INK;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(WALL,0);ctx.lineTo(WALL,H);ctx.moveTo(W-WALL,0);ctx.lineTo(W-WALL,H);ctx.stroke();
  ctx.strokeStyle=rgba('#ffffff',0.35);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(WALL-2.5,0);ctx.lineTo(WALL-2.5,H);ctx.moveTo(W-WALL+2.5,0);ctx.lineTo(W-WALL+2.5,H);ctx.stroke();
  var lampC=mix(WORLDS[B.a].lamp,WORLDS[B.b].lamp,B.k),fmin=Math.max(1,Math.floor((-cam-H-60)/SP)),fmax=Math.ceil((-cam+60)/SP);
  for(var f=fmin;f<=fmax;f++){
    if(f%5===0){var ly=-f*SP-cam-52;lamp(WALL-4,ly,lampC);lamp(W-WALL+4,ly,lampC);}
  }
}

/* ---------- platforms, one look per world ---------- */
function platBody(st,x,sy,pw,th,seed){
  var i,n;
  ctx.fillStyle='rgba(10,8,30,0.22)';ctx.beginPath();ctx.ellipse(x+pw/2,sy+th+8,pw*0.42,4,0,0,Math.PI*2);ctx.fill();
  if(st===0){
    var stone=function(){ctx.beginPath();ctx.moveTo(x+2,sy+3);ctx.lineTo(x+pw-2,sy+3);ctx.quadraticCurveTo(x+pw+1,sy+th*0.6,x+pw-8,sy+th+3);ctx.lineTo(x+8,sy+th+3);ctx.quadraticCurveTo(x-1,sy+th*0.6,x+2,sy+3);ctx.closePath();};
    celH(stone,'#a39a90','#6f655f',1,2.6,'#e0d8cf');
    ctx.strokeStyle='rgba(20,16,43,0.35)';ctx.lineWidth=1;ctx.beginPath();
    for(i=x+24;i<x+pw-14;i+=30+((seed+i)%12)){ctx.moveTo(i,sy+8);ctx.lineTo(i-3,sy+th+1);}ctx.stroke();
    var grass=function(){rr(x-2,sy-2,pw+4,8,4);};
    celH(grass,'#6fd35a','#3f9a3a',1,1.6,'#c6ff9a');
    ctx.fillStyle='#3f9a3a';
    for(i=x+6;i<x+pw-4;i+=11){n=(seed*7+i)%5;ctx.beginPath();ctx.moveTo(i,sy+6);ctx.lineTo(i+2,sy+10+n);ctx.lineTo(i+4,sy+6);ctx.fill();}
    ctx.fillStyle='#8ae070';
    for(i=x+9;i<x+pw-6;i+=17){ctx.beginPath();ctx.moveTo(i,sy-1);ctx.lineTo(i+2,sy-6-((seed+i)%4));ctx.lineTo(i+4,sy-1);ctx.fill();}
    if(pw>110){ctx.fillStyle='#ff7ab8';ctx.beginPath();ctx.arc(x+pw*0.7,sy-2,2.2,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff3a0';ctx.beginPath();ctx.arc(x+pw*0.7,sy-2,0.9,0,Math.PI*2);ctx.fill();}
  }else if(st===1){
    var ice=function(){rr(x,sy+2,pw,th,5);};
    celH(ice,'#bfe9ff','#78b8e0',1,2.6,'#ffffff');
    ctx.fillStyle='#bfe9ff';ctx.strokeStyle=INK;ctx.lineWidth=1.2;
    for(i=x+8;i<x+pw-8;i+=14){n=6+((seed+i*3)%9);ctx.beginPath();ctx.moveTo(i-3,sy+th+1);ctx.lineTo(i,sy+th+1+n);ctx.lineTo(i+3,sy+th+1);ctx.fill();ctx.stroke();}
    var snow=function(){ctx.beginPath();ctx.moveTo(x-2,sy+6);ctx.quadraticCurveTo(x-3,sy-4,x+10,sy-3);ctx.lineTo(x+pw-10,sy-3);ctx.quadraticCurveTo(x+pw+3,sy-4,x+pw+2,sy+6);ctx.quadraticCurveTo(x+pw*0.7,sy+10,x+pw*0.5,sy+6);ctx.quadraticCurveTo(x+pw*0.3,sy+11,x-2,sy+6);ctx.closePath();};
    celH(snow,'#ffffff','#cfe3f5',1,1.6,'#ffffff');
    ctx.strokeStyle='rgba(255,255,255,0.9)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+12,sy+th-2);ctx.lineTo(x+22,sy+8);ctx.stroke();
  }else if(st===2){
    var gem=function(){ctx.beginPath();ctx.moveTo(x+8,sy);ctx.lineTo(x+pw-8,sy);ctx.lineTo(x+pw,sy+th/2+1);ctx.lineTo(x+pw-8,sy+th+2);ctx.lineTo(x+8,sy+th+2);ctx.lineTo(x,sy+th/2+1);ctx.closePath();};
    ctx.save();ctx.globalCompositeOperation='lighter';glowDot(x+pw/2,sy+th/2,pw*0.55,'#c47bff',0.28);ctx.restore();
    celH(gem,'#c99cff','#7a4fd0',1,2.8,'#ffffff');
    ctx.strokeStyle='rgba(255,255,255,0.55)';ctx.lineWidth=1;ctx.beginPath();
    for(i=x+20;i<x+pw-12;i+=22){ctx.moveTo(i,sy+1);ctx.lineTo(i+8,sy+th+1);}ctx.stroke();
    ctx.save();ctx.fillStyle='#ffffff';ctx.globalAlpha*=Math.abs(Math.sin(t*0.06+seed));ctx.fillRect(x+pw*0.3-1,sy+3,2,6);ctx.fillRect(x+pw*0.3-3,sy+5,6,2);ctx.restore();
  }else if(st===3){
    var rock=function(){ctx.beginPath();ctx.moveTo(x+3,sy+1);ctx.lineTo(x+pw-3,sy+1);ctx.lineTo(x+pw,sy+th*0.5);ctx.lineTo(x+pw-10,sy+th+3);ctx.lineTo(x+10,sy+th+3);ctx.lineTo(x,sy+th*0.5);ctx.closePath();};
    ctx.save();ctx.globalCompositeOperation='lighter';glowDot(x+pw/2,sy+th+4,pw*0.45,'#ff6a1a',0.35);ctx.restore();
    celH(rock,'#4f3d42','#2a1c20',1,2.6,'#8a6a6e');
    ctx.save();ctx.globalCompositeOperation='lighter';
    var pulse=0.6+0.4*Math.sin(t*0.08+seed);
    ctx.strokeStyle=rgba('#ff7a1a',0.9*pulse);ctx.lineWidth=2.4;ctx.lineCap='round';ctx.beginPath();
    for(i=x+14;i<x+pw-14;i+=26){ctx.moveTo(i,sy+3);ctx.lineTo(i+5,sy+th*0.5);ctx.lineTo(i+1,sy+th);}
    ctx.stroke();ctx.strokeStyle=rgba('#ffe08a',pulse);ctx.lineWidth=1;ctx.stroke();ctx.restore();
    ctx.fillStyle='#ff9a3a';rr(x+3,sy-1,pw-6,3,1.5);ctx.fill();
  }else if(st===4){
    ctx.save();ctx.globalCompositeOperation='lighter';glowDot(x+pw/2,sy+th,pw*0.4,'#ffd27a',0.25);ctx.restore();
    var puffs=Math.max(3,Math.round(pw/22));
    var cl=function(){ctx.beginPath();for(var j=0;j<puffs;j++){var cx=x+8+j*(pw-16)/(puffs-1),r=9+((seed+j*5)%4);ctx.moveTo(cx+r,sy+th*0.5);ctx.arc(cx,sy+th*0.5,r,0,Math.PI*2);}ctx.rect(x+6,sy+th*0.5,pw-12,th*0.55);};
    cl();ctx.fillStyle='#e7a8c4';ctx.fill();
    ctx.save();cl();ctx.clip();ctx.translate(-2,-3);cl();ctx.fillStyle='#fff4f8';ctx.fill();ctx.restore();
    ctx.fillStyle='#ffd53d';rr(x+6,sy+th+1,pw-12,3,1.5);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1;ctx.stroke();
  }else if(st===5){
    var blk=function(){rr(x,sy+3,pw,th,3);};
    celH(blk,'#efe2c4','#bda77e',1,2.4,'#ffffff');
    ctx.strokeStyle='rgba(20,16,43,0.25)';ctx.lineWidth=1;ctx.beginPath();for(i=x+20;i<x+pw-8;i+=20){ctx.moveTo(i,sy+9);ctx.lineTo(i,sy+th+2);}ctx.stroke();
    var roof=function(){ctx.beginPath();ctx.moveTo(x-4,sy+5);ctx.lineTo(x+4,sy-3);ctx.lineTo(x+pw-4,sy-3);ctx.lineTo(x+pw+4,sy+5);ctx.closePath();};
    celH(roof,'#3f6fd8','#24479e',1,1.6,'#a8c8ff');
    ctx.fillStyle='#ffd53d';ctx.fillRect(x+2,sy+5,pw-4,2.5);
    ctx.fillStyle='#d8433a';ctx.beginPath();ctx.arc(x+pw/2,sy+th*0.65+3,2.6,0,Math.PI*2);ctx.fill();
  }else if(st===7){
    var nc2=(Math.floor(seed)%2)?'#3fe0ff':'#ff3df0';
    celH(function(){rr(x,sy+2,pw,th,4);},'#2e2850','#15122a',1,2,'#6a60b0');
    ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=1;ctx.beginPath();for(i=x+14;i<x+pw-8;i+=14){ctx.moveTo(i,sy+7);ctx.lineTo(i,sy+th);}ctx.stroke();
    ctx.save();ctx.globalCompositeOperation='lighter';glowDot(x+pw/2,sy+3,pw*0.55,nc2,0.35);
    ctx.strokeStyle=rgba(nc2,0.95);ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+5,sy+3);ctx.lineTo(x+pw-5,sy+3);ctx.stroke();ctx.restore();
    ctx.strokeStyle='#ffffff';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+5,sy+3);ctx.lineTo(x+pw-5,sy+3);ctx.stroke();
    for(i=x+10;i<x+pw-8;i+=18){ctx.fillStyle=rgba(nc2,(Math.sin(t*0.2+i)>0)?0.95:0.35);ctx.fillRect(i,sy+th-1,7,2.5);}
  }else if(st===8){
    celH(function(){rr(x,sy+2,pw,th,3);},'#5a6480','#2a3044',1,2.4,'#a8b4d8');
    ctx.strokeStyle='rgba(10,12,24,0.55)';ctx.lineWidth=1.2;ctx.beginPath();for(i=x+7;i<x+pw-4;i+=6){ctx.moveTo(i,sy+8);ctx.lineTo(i,sy+th);}ctx.stroke();
    ctx.save();rr(x+2,sy+2,pw-4,4,2);ctx.clip();ctx.fillStyle='#ffe63d';ctx.fillRect(x,sy+2,pw,4);ctx.fillStyle='#1a1a1a';for(i=x-6;i<x+pw;i+=10){ctx.beginPath();ctx.moveTo(i,sy+6);ctx.lineTo(i+4,sy+2);ctx.lineTo(i+8,sy+2);ctx.lineTo(i+4,sy+6);ctx.fill();}ctx.restore();
    if(Math.sin(t*0.27+seed)>0.86){ctx.save();ctx.globalCompositeOperation='lighter';var zx=x+8+((seed*7+t*3)%Math.max(1,pw-16));glowDot(zx,sy-6,16,'#fff7a0',0.7);ctx.strokeStyle='#fffbd0';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(zx,sy+1);ctx.lineTo(zx+4,sy-5);ctx.lineTo(zx-2,sy-8);ctx.lineTo(zx+3,sy-15);ctx.stroke();ctx.restore();}
  }else if(st===9){
    ctx.save();ctx.globalCompositeOperation='lighter';glowDot(x+pw/2,sy+th,pw*0.45,'#9a5aff',0.3);ctx.restore();
    var bumps=Math.max(4,Math.round(pw/18));
    var ast=function(){ctx.beginPath();ctx.moveTo(x+2,sy+5);for(var b=1;b<=bumps;b++){var bx3=x+pw*b/bumps,by3=sy+((Math.floor(seed)*7+b*13)%5);ctx.lineTo(bx3,by3);}ctx.lineTo(x+pw,sy+th*0.7);ctx.quadraticCurveTo(x+pw*0.6,sy+th+6,x+pw*0.3,sy+th+3);ctx.quadraticCurveTo(x,sy+th,x+2,sy+5);ctx.closePath();};
    celH(ast,'#4f4070','#221a3a',1,2.6,'#9a88c8');
    for(i=0;i<Math.max(2,Math.round(pw/40));i++){var ccx=x+14+((Math.floor(seed)*11+i*37)%Math.max(1,pw-28)),ccr=2.5+((i*5)%3);ctx.fillStyle='#2a2044';ctx.beginPath();ctx.ellipse(ccx,sy+th*0.55,ccr*1.4,ccr,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(200,180,255,0.5)';ctx.lineWidth=0.8;ctx.beginPath();ctx.ellipse(ccx,sy+th*0.55+0.6,ccr*1.4,ccr,0,0.2,Math.PI-0.2);ctx.stroke();}
  }else if(st===10){
    glowDot(x+pw/2,sy+th/2,pw*0.6,'#ffd53d',0.45);
    var ebar=function(){rr(x,sy+2,pw,th-2,(th-2)/2);};
    var gE=ctx.createLinearGradient(0,sy,0,sy+th);gE.addColorStop(0,'#ffffff');gE.addColorStop(0.5,'#ffe680');gE.addColorStop(1,'#ff9ad5');
    ebar();ctx.fillStyle=gE;ctx.fill();ctx.lineWidth=1.8;ctx.strokeStyle='#6a3ad0';ctx.stroke();
    var shx=x+((t*3+seed)%(pw+40))-20;ctx.save();ebar();ctx.clip();ctx.fillStyle='rgba(255,255,255,0.85)';ctx.beginPath();ctx.moveTo(shx,sy);ctx.lineTo(shx+10,sy);ctx.lineTo(shx-2,sy+th);ctx.lineTo(shx-12,sy+th);ctx.closePath();ctx.fill();ctx.restore();
  }else{
    var pl2=0.6+0.4*Math.sin(t*0.1+seed);
    var en=function(){rr(x,sy+2,pw,th-1,th/2);};
    ctx.save();ctx.globalCompositeOperation='lighter';glowDot(x+pw/2,sy+th/2,pw*0.6,'#3fe0ff',0.3*pl2);ctx.restore();
    en();ctx.fillStyle='#17134a';ctx.fill();
    ctx.save();ctx.globalCompositeOperation='lighter';en();ctx.lineWidth=3;ctx.strokeStyle=rgba('#3fe0ff',0.8*pl2);ctx.stroke();ctx.restore();
    en();ctx.lineWidth=1;ctx.strokeStyle='#d8fbff';ctx.stroke();
    ctx.strokeStyle=rgba('#7cf3ff',0.6);ctx.lineWidth=1.2;ctx.beginPath();
    var off=(t*1.5+seed)%24;for(i=x+8+off;i<x+pw-8;i+=24){ctx.moveTo(i,sy+th*0.55);ctx.lineTo(i+10,sy+th*0.55);}ctx.stroke();
  }
}
function drawPlats(){
  var fmin=Math.max(0,Math.floor((-cam-H-60)/SP)),fmax=Math.min(plats.length-1,Math.ceil((-cam+60)/SP));
  ctx.lineJoin='round';
  for(var f=fmin;f<=fmax;f++){
    var p=plats[f],sy=p.y-cam,i;
    if(f===0){
      var gg=ctx.createLinearGradient(0,sy,0,sy+200);gg.addColorStop(0,'#8a7f76');gg.addColorStop(1,'#4a403c');
      ctx.fillStyle=gg;ctx.fillRect(WALL,sy,W-2*WALL,H+40);
      ctx.strokeStyle='rgba(20,16,43,0.3)';ctx.lineWidth=1;ctx.beginPath();
      for(i=sy+30;i<H+40;i+=30){ctx.moveTo(WALL,i);ctx.lineTo(W-WALL,i);}
      for(i=WALL+20;i<W-WALL;i+=48){ctx.moveTo(i,sy+12);ctx.lineTo(i,H+40);}ctx.stroke();
      rr(WALL,sy-3,W-2*WALL,12,4);ctx.fillStyle='#6fd35a';ctx.fill();ctx.lineWidth=LW;ctx.strokeStyle=INK;ctx.stroke();
      ctx.fillStyle='#c6ff9a';ctx.fillRect(WALL+4,sy-1,W-2*WALL-8,2);
      ctx.fillStyle='#8ae070';for(i=WALL+6;i<W-WALL;i+=12){ctx.beginPath();ctx.moveTo(i,sy-2);ctx.lineTo(i+3,sy-8-((i*7)%5));ctx.lineTo(i+6,sy-2);ctx.fill();}
    }else{
      var ms=(f%10===0),th=ms?20:16,pw=p.w;
      platBody(WORLDS[worldAt(f)].plat,p.x,sy,pw,th,p.seed||f*37);
      if(f%50===0){
        ctx.save();ctx.globalCompositeOperation='lighter';
        var gl=ctx.createLinearGradient(0,sy-40,0,sy);gl.addColorStop(0,'rgba(255,213,61,0)');gl.addColorStop(1,'rgba(255,213,61,'+(0.28+0.12*Math.sin(t*0.08))+')');
        ctx.fillStyle=gl;ctx.fillRect(p.x,sy-40,pw,40);ctx.restore();
        outlineText('SAFE ZONE',WALL+12,sy-10,16,'#ffe680','left');outlineText('SAFE ZONE',W-WALL-12,sy-10,16,'#ffe680','right');
      }
      if(ms){
        ctx.fillStyle='#ffd53d';rr(p.x+4,sy+th-3,pw-8,4,2);ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1;ctx.stroke();
        var bw=34,bx=p.x+pw/2-bw/2,by=sy+th-4;
        rr(bx,by,bw,17,6);ctx.fillStyle='#ffb020';ctx.fill();ctx.lineWidth=LW;ctx.strokeStyle=INK;ctx.stroke();
        outlineText(String(f),p.x+pw/2,by+14.5,15,'#ffffff','center');
      }
    }
  }
}
