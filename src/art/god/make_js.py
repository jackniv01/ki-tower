# Builds src/game/d4_god_art.js: Sonofgod sprite atlas + teleport atlas (base64).
import base64,os
H=os.path.dirname(os.path.abspath(__file__))
def b64(n):return base64.b64encode(open(os.path.join(H,n),'rb').read()).decode()
js="/* ---------- Sonofgod art (Grok) ---------- */\n"
js+="loadSprite(6,'data:image/webp;base64,%s',%s,null,null);\n"%(b64('sonofgod.webp'),open(os.path.join(H,'sonofgod.json')).read())
js+="var TELE={img:new Image(),fr:%s,ok:false};TELE.img.onload=function(){TELE.ok=true;};TELE.img.src='data:image/webp;base64,%s';\n"%(open(os.path.join(H,'teleport.json')).read(),b64('teleport.webp'))
js+="var GATES={fr:%s,src:'data:image/webp;base64,%s'};\n"%(open(os.path.join(H,'gates.json')).read(),b64('gates.webp'))
out=os.path.join(H,'..','..','game','d4_god_art.js');open(out,'w').write(js);print('wrote',len(js))
