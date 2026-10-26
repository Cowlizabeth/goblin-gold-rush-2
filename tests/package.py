from pathlib import Path
import subprocess,shutil,zipfile
root=Path(__file__).resolve().parents[1]
subprocess.run(['python3','tests/ref2game-pack.py','--name','Goblin-Gold-Rush-2'],cwd=root,check=True)
out=root/'dist/Goblin-Gold-Rush-2'
shutil.copy(root/'live/style.css',out/'game/style.css')
for folder in ['live','starter','tests','study','frames','third_party']:
 shutil.copytree(root/folder,out/'source'/folder,dirs_exist_ok=True)
for f in ['README.md','TEST_RESULTS.md','package.json','package-lock.json','index.html','.gitignore']:
 shutil.copy(root/f,out/'source'/f)
shutil.copy(root/'README.md',out/'README.md');shutil.copy(root/'TEST_RESULTS.md',out/'TEST_RESULTS.md');shutil.copytree(root/'third_party',out/'third_party',dirs_exist_ok=True)
archive=root/'dist/Goblin-Gold-Rush-2-source.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(out.rglob('*')):
  if p.is_file():z.write(p,p.relative_to(out.parent))
print(archive,archive.stat().st_size)
