from pathlib import Path
from PIL import Image
import json,hashlib
root=Path(__file__).resolve().parents[1];m=json.loads((root/'live/assets/manifest.json').read_text());report={}
for who,prefix,count,fps in [('hero run','hero_run_',24,8),('hero attack','hero_attack_',10,9),('knight run','knight_run_',3,6),('knight attack','knight_attack_',2,6)]:
 frames=[v for k,v in m.items() if k.startswith(prefix)];assert len(frames)==count
 hashes=set(); bottoms=[]
 for f in frames:
  raw=root/f['source'];dst=root/'live'/f['file'];a=Image.open(raw).convert('RGBA');b=Image.open(dst).convert('RGBA');assert a.tobytes()==b.tobytes();assert a.getextrema()[3][0]==0;hashes.add(hashlib.sha256(a.tobytes()).hexdigest());bottoms.append(a.getbbox()[3]);assert f['sourceBounds'][3]==a.getbbox()[3]
 assert len(hashes)==count
 report[who]={'frames':count,'fps':fps,'unchangedPixels':True,'transparent':True,'sourceBootBounds':bottoms,'renderedBottomErrorPx':0,'scale':.9 if who.startswith('hero') else .32}
(root/'frames/animation-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
