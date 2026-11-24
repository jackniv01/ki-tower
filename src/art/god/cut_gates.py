# Cut the 3 teleport gate rings (Grok, stacked vertically) into one strip atlas + meta.
# Meta per gate: [x, y, w, h, disc_cx, disc_cy, disc_d] (atlas pixels); the cosmic disc is the anchor.
import json
from PIL import Image
import numpy as np, scipy.ndimage as ndi
IM=np.array(Image.open('gates_grok.jpg').convert('RGB')).astype(np.float32)
H,W=IM.shape[:2];bg=np.median(IM[:30,:30].reshape(-1,3),0)
d=np.sqrt(((IM-bg)**2).sum(2));A=np.clip((d-50)/70,0,1)
r,g,b=IM[...,0],IM[...,1],IM[...,2]
pink=np.clip((np.minimum(r,b)-g)/255,0,1)*(1-A*0.7)
IM[...,1]=g+pink*140;IM[...,2]=b-pink*80
lab,n=ndi.label(ndi.binary_dilation(A>0.3,iterations=14))
sizes=ndi.sum(A>0.3,lab,range(1,n+1));big=sorted(range(n),key=lambda i:-sizes[i])[:3]
big=sorted(big,key=lambda i:ndi.center_of_mass(lab==i+1)[0])
dark=(IM.max(2)<120)&(A>0.9)
pieces=[];DISC=110;FIX=[1,1,0.8]  # ring 3's disc reads small (inner rings), so shrink it to match  # disc diameter in atlas px
for gi,i in enumerate(big):
    m=lab==i+1;ys,xs=np.where(m);y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    dl,dn=ndi.label(ndi.binary_closing(dark&m,iterations=6));ds=ndi.sum(dl>0,dl,range(1,dn+1));j=int(np.argmax(ds))+1
    dy,dx=np.where(dl==j);dd=((dx.max()-dx.min())+(dy.max()-dy.min()))/2
    S=DISC/dd*FIX[gi]
    rgba=np.dstack([IM[y0:y1,x0:x1],A[y0:y1,x0:x1]*255*m[y0:y1,x0:x1]]).clip(0,255).astype(np.uint8)
    im=Image.fromarray(rgba);im=im.resize((round(im.width*S),round(im.height*S)),Image.LANCZOS)
    pieces.append((im,((dx.min()+dx.max())/2-x0)*S,((dy.min()+dy.max())/2-y0)*S))
Wt=sum(p[0].width+4 for p in pieces);Ht=max(p[0].height for p in pieces)
atlas=Image.new('RGBA',(Wt,Ht),(0,0,0,0));meta=[];x=0
for im,cx,cy in pieces:
    atlas.paste(im,(x,0));meta.append([x,0,im.width,im.height,round(cx,1),round(cy,1),round(DISC*FIX[len(meta)])]);x+=im.width+4
atlas.save('gates.webp','WEBP',quality=85,method=6);atlas.save('gates.png')
json.dump(meta,open('gates.json','w'));print(atlas.size,meta)
