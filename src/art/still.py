import sys,json,base64
from PIL import Image
import numpy as np, scipy.ndimage as ndi
src,name,out=sys.argv[1],sys.argv[2],sys.argv[3]
IM=np.array(Image.open(src).convert('RGB')).astype(np.float32)
FH,FW=IM.shape[:2];CW,CH=FW/4,FH/2
corners=np.concatenate([IM[:10,:10].reshape(-1,3),IM[:10,-10:].reshape(-1,3),IM[-10:,:10].reshape(-1,3),IM[-10:,-10:].reshape(-1,3)])
BG=np.median(corners,axis=0);print('bg',BG)
def cut(cell):
    cx,cy=int((cell%4)*CW),int((cell//4)*CH)
    X0,Y0,X1,Y1=max(0,cx-60),max(0,cy-30),min(FW,int(cx+CW+60)),min(FH,int(cy+CH+30))
    c=IM[Y0:Y1,X0:X1]
    d=np.sqrt(((c-BG)**2).sum(2));a=np.clip((d-45)/55,0,1)
    r,g,b=c[...,0],c[...,1],c[...,2]
    spill=np.clip(np.minimum(r,b)-g,0,None)*(1-a)
    c2=c.copy();c2[...,0]=r-spill*0.8;c2[...,2]=b-spill*0.8
    m=a>0.35
    lab,n=ndi.label(ndi.binary_closing(m,iterations=2))
    sizes=ndi.sum(m,lab,range(1,n+1))
    ccx,ccy=cx-X0+CW/2,cy-Y0+CH/2;best=None;bd=1e9
    for i in range(n):
        if sizes[i]<2000:continue
        ys,xs=np.where(lab==i+1);dd=abs(xs.mean()-ccx)+abs(ys.mean()-ccy)*0.5
        if dd<bd:bd=dd;best=i+1
    keep=lab==best;near=ndi.binary_dilation(keep,iterations=12)
    for i in range(n):
        if i+1!=best and sizes[i]<sizes[best-1]*0.2 and (near&(lab==i+1)).any():keep|=lab==i+1
    a=a*ndi.binary_dilation(keep,iterations=2)
    ys,xs=np.where(a>0.5);x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
    rgba=np.dstack([np.clip(c2,0,255),a*255]).astype(np.uint8)
    return Image.fromarray(rgba).crop((x0-2,y0-2,x1+3,y1+3)),(x0+x1)/2-(x0-2),y1-(y0-2),y1-y0
cells=[cut(i) for i in range(8)]
SCALE=192/cells[0][3]
names=['idle','run','run','jump','fall','flip','kiai','win']
frames={k:[] for k in ['idle','run','jump','fall','flip','kiai','win','land']}
x=0;imgs=[]
for i,(img,ax,ay,h) in enumerate(cells):
    w2,h2=round(img.width*SCALE),round(img.height*SCALE)
    imgs.append((names[i],img.resize((w2,h2),Image.LANCZOS),ax*SCALE,ay*SCALE))
W=sum(i[1].width+2 for i in imgs);H=max(i[1].height for i in imgs)
atlas=Image.new('RGBA',(W,H),(0,0,0,0))
for nm,img,ax,ay in imgs:
    atlas.paste(img,(x,0));frames[nm].append([x,0,img.width,img.height,round(ax,1),round(ay,1)]);x+=img.width+2
frames['land']=[frames['kiai'][0]]
atlas.save(out+'.webp','WEBP',quality=84,method=6);atlas.save(out+'.png')
json.dump(frames,open(out+'.json','w'))
import os;print({k:len(v) for k,v in frames.items()},atlas.size,os.path.getsize(out+'.webp'))
