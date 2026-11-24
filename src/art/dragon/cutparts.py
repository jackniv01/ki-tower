import sys,json,numpy as np,scipy.ndimage as ndi
from PIL import Image
src,name,maxh=sys.argv[1],sys.argv[2],int(sys.argv[3])
IM=np.array(Image.open(src).convert('RGB')).astype(np.float32)
H,W=IM.shape[:2]
c=np.concatenate([IM[:20,:20].reshape(-1,3),IM[:20,-20:].reshape(-1,3),IM[-20:,:20].reshape(-1,3),IM[-20:,-20:].reshape(-1,3)])
BG=np.median(c,axis=0);print('bg',BG)
d=np.sqrt(((IM-BG)**2).sum(2));a=np.clip((d-50)/60,0,1)
# remove magenta spill on edges
r,g,b=IM[...,0],IM[...,1],IM[...,2]
spill=np.clip(np.minimum(r,b)-g,0,None)*(1-a)
I2=IM.copy();I2[...,0]=r-spill*0.85;I2[...,2]=b-spill*0.85
m=a>0.35
lab,n=ndi.label(ndi.binary_closing(m,iterations=3))
sz=ndi.sum(m,lab,range(1,n+1))
big=[i+1 for i in range(n) if sz[i]>4000]
cents={i:ndi.center_of_mass(m,lab,i) for i in big}
# attach small comps (sparkles, whisker bits) to nearest big
keep={i:(lab==i) for i in big}
for i in range(n):
    if i+1 in big or sz[i]<30:continue
    cy,cx=ndi.center_of_mass(m,lab,i+1)
    j=min(big,key=lambda k:(cents[k][0]-cy)**2+(cents[k][1]-cx)**2)
    if abs(cents[j][0]-cy)<260 and abs(cents[j][1]-cx)<200: keep[j]=keep[j]|(lab==i+1)
order=sorted(big,key=lambda k:(round(cents[k][0]/300),cents[k][1]))
print('parts',len(order))
parts=[];x=0;atlas=[]
for k in order:
    mk=ndi.binary_dilation(keep[k],iterations=2);ys,xs=np.where(mk&(a>0.1))
    y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    al=(a*mk)[y0:y1,x0:x1];rgb=np.clip(I2[y0:y1,x0:x1],0,255)
    im=Image.fromarray(np.dstack([rgb,al*255]).astype(np.uint8))
    atlas.append(im)
G=min(1,maxh/max(i.height for i in atlas))
atlas=[im.resize((max(1,round(im.width*G)),max(1,round(im.height*G))),Image.LANCZOS) for im in atlas]
if 0:
    im=im.resize((max(1,round(im.width*s)),max(1,round(im.height*s))),Image.LANCZOS)
AW=sum(i.width+4 for i in atlas);AH=max(i.height for i in atlas)
A=Image.new('RGBA',(AW,AH));fr=[]
for im in atlas:
    A.paste(im,(x,0));fr.append([x,0,im.width,im.height]);x+=im.width+4
A.save(name+'.png');A.save(name+'.webp','WEBP',quality=88,method=6)
json.dump(fr,open(name+'.json','w'));print(fr)
