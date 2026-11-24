import numpy as np,scipy.ndimage as ndi
from PIL import Image
IM=np.array(Image.open('o1.jpg').convert('RGB')).astype(np.float32)
BG=np.median(IM[:30,:30].reshape(-1,3),axis=0)
d=np.sqrt(((IM-BG)**2).sum(2));a=np.clip((d-55)/55,0,1)
lab,n=ndi.label(ndi.binary_closing(a>0.4,iterations=3));sz=ndi.sum(a>0.4,lab,range(1,n+1))
objs=ndi.find_objects(lab)
boxes=sorted([objs[i] for i in range(n) if sz[i]>8000],key=lambda s:(s[0].start//200,s[1].start))
r,g,b=IM[...,0],IM[...,1],IM[...,2];spill=np.clip(np.minimum(r,b)-g,0,None)*(1-a)
I2=IM.copy();I2[...,0]-=spill*0.9;I2[...,2]-=spill*0.9
orbs=[]
for s in boxes:
    y0,y1,x0,x1=s[0].start-4,s[0].stop+4,s[1].start-4,s[1].stop+4
    orbs.append(Image.fromarray(np.dstack([np.clip(I2[y0:y1,x0:x1],0,255),a[y0:y1,x0:x1]*255]).astype(np.uint8)))
o4=orbs[3].copy();o1=orbs[0]
w,h=o1.size;cs=int(w*0.36)
star=o1.crop((w//2-cs//2,h//2-cs//2-4,w//2+cs//2,h//2+cs//2-4))
rgb=np.array(star).astype(np.float32)[...,:3]
m=((rgb[...,0]>200)&(rgb[...,1]>150)&(rgb[...,2]<140))|((rgb[...,0]<90)&(rgb[...,1]<60))
m=ndi.binary_fill_holes(ndi.binary_closing(m,iterations=2));m=ndi.binary_dilation(m,iterations=1)
lab2,n2=ndi.label(m);c=lab2[cs//2,cs//2]
if c:m=lab2==c
ma=ndi.gaussian_filter(m.astype(float),0.8)
k=0.5
st=Image.fromarray(np.dstack([rgb,ma*255]).astype(np.uint8)).resize((int(cs*k),int(cs*k)),Image.LANCZOS)
W4,H4=o4.size;o4.alpha_composite(st,(W4//2-st.width//2,H4//2-st.height//2+2))
orbs[4]=o4
S=96;out=[o.resize((S,S),Image.LANCZOS) for o in orbs]
A=Image.new('RGBA',(7*(S+4),S))
for i,o in enumerate(out):A.paste(o,(i*(S+4),0))
A.save('orbs.png');A.save('orbs.webp','WEBP',quality=90,method=6)
v=Image.new('RGBA',A.size,(30,30,70,255));v.alpha_composite(A);v.resize((A.width*2,A.height*2)).save('view.png')
