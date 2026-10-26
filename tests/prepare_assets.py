from pathlib import Path
from PIL import Image
import json,shutil
root=Path(__file__).resolve().parents[1]; src=root/'starter/assets'; dst=root/'live/assets';dst.mkdir(exist_ok=True)
m={}
def add(name,p,trim=False):
 im=Image.open(p).convert('RGBA'); box=im.getbbox();
 if trim: im=im.crop(box)
 im.save(dst/(name+'.png'));m[name]={'file':'assets/'+name+'.png','size':list(im.size),'source':str(p.relative_to(root)),'sourceBounds':box}
for p in sorted((src/'hero_approved/frames').glob('*.png')):add('hero_'+p.stem,p)
for p in sorted((src/'knight_approved').glob('*.png')):
 if p.stem.startswith(('run_','attack_')):add('knight_'+p.stem,p)
for name in ['ceiling_ledge_a','rocks_pillar','cave_arch','rocks_spikes','rocks_crystal_blue','rocks_crystal_gold','rocks_lantern','stalagmite_tall_a','stalagmite_wide_a','rocks_decor_a','ceiling_wide_a','ceiling_sharp_b','coin_front','fury_button','skill_blades','skill_bleed','skill_heal','healing_potion','treasure_chest','upgrade_card_a','upgrade_card_b','upgrade_card_c','button_gold']:
 add(name,src/'recovered/production/cave_v2'/f'{name}.png',True)
add('cave_wall',src/'recovered/production/cave_wall.webp')
(dst/'manifest.json').write_text(json.dumps(m,indent=2))
(root/'live/assets.js').write_text('window.ASSETS = '+json.dumps(m)+';')
print('Prepared',len(m),'original textures; hero frames unchanged')
