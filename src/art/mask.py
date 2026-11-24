import json,sys,colorsys
from PIL import Image
import numpy as np, scipy.ndimage as ndi
def hsv(rgb):
    r,g,b=[rgb[...,i]/255. for i in range(3)]
    mx=np.maximum(np.maximum(r,g),b);mn=np.minimum(np.minimum(r,g),b);d=mx-mn+1e-6
    h=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60
    s=np.where(mx>0,d/(mx+1e-6),0);return h,s,mx
SPEC={
 'ryo':{'test':lambda h,s,v,rgb:(v<0.42)&~((h<25)|(h>335))&(s<0.75),'lim':{'idle':.33,'run':.36,'jump':.4,'fall':.62,'kiai':.36,'win':.42,'land':.36,'flip':.0}},
 'anna':{'test':lambda h,s,v,rgb:(s<0.16)&(v>0.62),'lim':{'idle':.5,'run':.45,'jump':.45,'fall':.5,'kiai':.45,'win':.5,'land':.45,'flip':.5}},
 'bolt':{'test':lambda h,s,v,rgb:(h>170)&(h<205)&(s>0.35)&(v>0.45),'lim':{'idle':1,'run':1,'jump':1,'fall':1,'kiai':1,'win':1,'land':1,'flip':1}},
 'zorn':{'test':lambda h,s,v,rgb:(h>250)&(h<300)&(s>0.3),'lim':{'idle':.2,'run':.24,'jump':.22,'fall':.33,'kiai':.24,'win':.3,'land':.24,'flip':.3}},
 'dani':{'test':lambda h,s,v,rgb:(v<0.3),'lim':{'idle':.36,'run':.33,'jump':.3,'fall':.42,'kiai':.36,'win':.36,'land':.36,'flip':.5}},
 'mika':{'test':lambda h,s,v,rgb:(h>235)&(h<300)&(s>0.25),'lim':{'idle':.42,'run':.40,'jump':.40,'fall':.40,'kiai':.40,'win':.44,'land':.40,'flip':.45}},
}
def build(n):
    A=np.array(Image.open(n+'.png').convert('RGBA')).astype(np.float32)
    fr=json.load(open(n+'.json'));sp=SPEC[n]
    M=np.zeros(A.shape[:2],np.float32);L=[]
    done=set()
    for pose,lst in fr.items():
        for f in lst:
            x,y,w,h=int(f[0]),int(f[1]),int(f[2]),int(f[3])
            if (x,y) in done: continue
            done.add((x,y))
            lim=sp['lim'].get(pose,.36)
            sub=A[y:y+h,x:x+w];hh,ss,vv=hsv(sub[...,:3])
            m=sp['test'](hh,ss,vv,sub[...,:3])&(sub[...,3]>200)
            m[int(h*lim):]=False
            m=ndi.binary_opening(m,iterations=1)
            lab,k=ndi.label(m)
            if k:
                sz=ndi.sum(m,lab,range(1,k+1));keep=np.isin(lab,[i+1 for i in range(k) if sz[i]>60]);m=keep
            m=ndi.binary_closing(m,iterations=2)
            soft=ndi.gaussian_filter(m.astype(np.float32),0.7)
            M[y:y+h,x:x+w]=np.maximum(M[y:y+h,x:x+w],soft)
            if m.any():L.extend(list(vv[m]))
    L=np.array(L);lo,hi=np.percentile(L,3),np.percentile(L,97)
    Image.fromarray((np.clip(M,0,1)*255).astype(np.uint8)).save(n+'_mask.webp','WEBP',lossless=True)
    Image.fromarray((np.clip(M,0,1)*255).astype(np.uint8)).save(n+'_mask.png')
    json.dump({'lo':float(lo),'hi':float(hi)},open(n+'_hair.json','w'))
    # preview recolor
    out=A.copy();v=np.clip((hsv(A[...,:3])[2]-lo)/(hi-lo+1e-6),0,1)
    gold=np.array([255,213,61.]);dark=np.array([160,90,0.]);light=np.array([255,250,200.])
    col=np.where(v[...,None]<0.5,dark+(gold-dark)*(v[...,None]*2),gold+(light-gold)*((v[...,None]-0.5)*2))
    out[...,:3]=A[...,:3]*(1-M[...,None])+col*M[...,None]
    bg=Image.new('RGBA',(A.shape[1],A.shape[0]),(120,170,230,255));bg.alpha_composite(Image.fromarray(out.astype(np.uint8)));bg.convert('RGB').save(n+'_tint.png')
    print(n,lo,hi)
for n in sys.argv[1:]:build(n)
