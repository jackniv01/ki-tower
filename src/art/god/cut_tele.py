# Cut the 8-frame teleport sheet (Grok) into a strip atlas. Every frame keeps the same box,
# so the character stays in place; the anchor is his feet in frame 1.
import json
from PIL import Image
import numpy as np, scipy.ndimage as ndi
IM=np.array(Image.open('teleport_grok.jpg').convert('RGB')).astype(np.float32)
XS=[(12,242),(261,494),(513,746),(766,999)];YS=[(14,884),(903,1780)]
cells=[(x,y) for y in YS for x in XS]
frames=[]
for (x0,x1),(y0,y1) in cells:
    c=IM[y0:y1,x0:x1]
    bg=np.median(np.concatenate([c[:20,:20].reshape(-1,3),c[:20,-20:].reshape(-1,3),c[-20:,:20].reshape(-1,3),c[-20:,-20:].reshape(-1,3)]),0)
    d=np.sqrt(((c-bg)**2).sum(2));a=np.clip((d-40)/70,0,1)
    a=ndi.gaussian_filter(a,0.6)
    r,g,b=c[...,0],c[...,1],c[...,2]
    # remove pink spill: push pink tints toward gold/white
    pink=np.clip((np.minimum(r,b)-g)/255,0,1)*(1-a*0.6)
    g2=g+pink*120;b2=b-pink*90
    rgba=np.dstack([r,np.clip(g2,0,255),np.clip(b2,0,255),a*255]).clip(0,255).astype(np.uint8)
    frames.append(Image.fromarray(rgba))
# same-size frames; scale so the standing body (frame 1) matches the main sprite height (~192px)
a0=np.array(frames[0])[...,3]>128;ys=np.where(a0.any(1))[0];xs=np.where(a0.any(0))[0]
body_h=ys.max()-ys.min();S=200/body_h
feet_y=ys.max()-12;cx=(xs.min()+xs.max())/2
fw=max(f.width for f in frames);fh=max(f.height for f in frames)
W2,H2=round(fw*S),round(fh*S)
atlas=Image.new('RGBA',((W2+2)*8,H2),(0,0,0,0));meta=[]
for i,f in enumerate(frames):
    atlas.paste(f.resize((W2,H2),Image.LANCZOS),(i*(W2+2),0))
    meta.append([i*(W2+2),0,W2,H2,round(cx*S,1),round(feet_y*S,1)])
atlas.save('teleport.webp','WEBP',quality=82,method=6);atlas.save('teleport.png')
json.dump(meta,open('teleport.json','w'));print(atlas.size,meta[0])
