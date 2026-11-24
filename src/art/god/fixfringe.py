# Turn the pink fringe (magenta background bleeding into the glow) into soft gold, only near the edges.
import sys
from PIL import Image
import numpy as np, scipy.ndimage as ndi
n=sys.argv[1];A=np.array(Image.open(n+'.png').convert('RGBA')).astype(np.float32)
r,g,b,a=[A[...,i] for i in range(4)]
solid=a>250
edge=(a>0)&~ndi.binary_erosion(solid,iterations=5)
pink=edge&(r>150)&(b>g+40)&(r>g+60)
A[...,1]=np.where(pink,np.maximum(g,r*0.78),g)
A[...,2]=np.where(pink,np.minimum(b,g*0.6+40),b)
im=Image.fromarray(A.clip(0,255).astype(np.uint8))
im.save(n+'.png');im.save(n+'.webp','WEBP',quality=84,method=6)
print('fixed',int(pink.sum()))
