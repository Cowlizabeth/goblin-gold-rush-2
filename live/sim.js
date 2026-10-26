(function(root){
'use strict';
const DT=1/120,FLOOR=450,SPEED=165;
const LEVEL={length:27000,bosses:[8100,17550,26500],platforms:[],spikes:[],coins:[],enemies:[]};
for(let base=900;base<LEVEL.length-900;base+=1800){
 if(LEVEL.bosses.some(x=>Math.abs(x-(base+350))<1000))continue;
 LEVEL.platforms.push({x:base,w:170,y:370,kind:'pillar'},{x:base+220,w:240,y:305,kind:'arch'},{x:base+510,w:180,y:365,kind:'pillar'});
 LEVEL.spikes.push({x:base+170,w:520});
 for(let i=0;i<3;i++){let p=LEVEL.platforms.at(-3+i);for(let j=0;j<3;j++)LEVEL.coins.push({x:p.x+30+j*50,y:p.y-42});}
}
for(let x=430;x<LEVEL.length-400;x+=1800){for(let j=0;j<(x>15000?4:x>8000?3:2);j++)LEVEL.enemies.push({x:x+j*110,hp:48,boss:0});}
LEVEL.bosses.forEach((x,i)=>LEVEL.enemies.push({x,hp:240+i*120,boss:i+1}));
for(let x=240;x<LEVEL.length;x+=180){if(!LEVEL.platforms.some(p=>x>p.x-80&&x<p.x+p.w+80))LEVEL.coins.push({x,y:FLOOR-38});}
function create(passive=0){return {t:0,x:120,y:FLOOR,vy:0,ground:true,coyote:.1,buffer:0,held:0,hp:100+passive*10,maxHp:100+passive*10,gold:0,xp:0,lv:0,path:null,ranks:0,damage:26+passive*2,fury:0,rage:0,attack:-1,cool:0,inv:0,clash:0,mode:'play',cam:0,ev:[],enemies:LEVEL.enemies.map((e,i)=>({...e,id:i,maxHp:e.hp,y:FLOOR,cd:0,pressure:0,knock:0,poison:0,charges:0,dead:0})),coins:LEVEL.coins.map(c=>({...c,taken:false})),kills:0,jumps:0,landings:0,bossKills:0,hitCount:0,stuck:0,notice:'',noticeTime:0};}
function event(s,type,x,y){s.ev.push({type,x,y,t:s.t});}
function hurt(s,n){if(s.inv>0)return;s.hp-=n;s.inv=.9;event(s,'hurt',s.x,s.y-40);if(s.hp<=0){s.hp=0;s.mode='dead';}}
function kill(s,e){if(e.dead)return;e.dead=s.t||.001;e.hp=0;s.kills++;s.xp+=e.boss?8:2;s.gold+=e.boss?40:8;s.fury=Math.min(100,s.fury+18);event(s,'kill',e.x,e.y-40);if(e.boss){s.bossKills++;s.hp=Math.min(s.maxHp,s.hp+45);s.notice='Страж повержен · +40 золота · лечение';s.noticeTime=4;}if(s.path==='plague'){for(const n of s.enemies)if(!n.dead&&Math.abs(n.x-e.x)<200){n.poison=4;n.hp-=12+s.ranks*5;}}}
function upgrade(s,path){if(s.mode!=='upgrade')return;if(!s.path)s.path=path;s.ranks++;s.lv++;s.damage+=5;s.hp=Math.min(s.maxHp,s.hp+20);s.mode='play';s.notice=s.ranks>=3?'Эволюция оружия открыта':'Оружие усилено';s.noticeTime=3;}
function rage(s){if(s.mode==='play'&&s.fury>=100&&!s.rage){s.rage=7;s.fury=0;event(s,'rage',s.x,s.y-50);return true;}return false;}
function step(s,input={}){
 if(s.mode!=='play')return;
 const d=DT;s.t+=d;s.ev=s.ev.filter(e=>s.t-e.t<.8);s.noticeTime=Math.max(0,s.noticeTime-d);s.inv=Math.max(0,s.inv-d);s.cool=Math.max(0,s.cool-d);
 if(input.fury)rage(s);
 if(input.press)s.buffer=.14;else s.buffer=Math.max(0,s.buffer-d);
 s.coyote=s.ground?.11:Math.max(0,s.coyote-d);
 if(s.buffer>0&&s.coyote>0){s.vy=-495;s.ground=false;s.coyote=0;s.buffer=0;s.held=0;s.jumps++;s.clash=0;event(s,'jump',s.x,s.y);}
 const oldX=s.x,oldY=s.y; s.held+=d;
 if(!input.hold&&s.vy< -240)s.vy=-240;
 s.vy+=(input.hold&&s.held<.24&&s.vy<0?470:1150)*d;
 s.x+=SPEED*d;s.y+=s.vy*d;s.ground=false;
 let surface=FLOOR;
 for(const p of LEVEL.platforms){if(s.x+16>p.x&&s.x-16<p.x+p.w){if(oldY<=p.y+3&&s.y>=p.y&&s.vy>=0)surface=Math.min(surface,p.y);else if(oldY>p.y+3&&s.y>p.y+5&&oldX+16<=p.x+2){s.x=p.x-16;}}}
 if(s.y>=surface&&s.vy>=0){if(oldY<surface-3){s.landings++;event(s,'land',s.x,surface);}s.y=surface;s.vy=0;s.ground=true;}
 if(s.y>FLOOR+1){s.y=FLOOR;s.vy=0;s.ground=true;}
 for(const h of LEVEL.spikes)if(s.x>h.x&&s.x<h.x+h.w&&s.y>FLOOR-18)hurt(s,18);
 const near=s.enemies.some(e=>!e.dead&&Math.abs(e.x-s.x)<330);
 if(s.rage>0&&near)s.rage=Math.max(0,s.rage-d);
 let contact=null;
 for(const e of s.enemies){
  if(e.dead)continue;e.cd=Math.max(0,e.cd-d);
  if(e.hp<=0){kill(s,e);continue;}
  if(e.boss&&Math.abs(e.x-s.x)<360){e.slam=(e.slam||0)+d;if(e.slam>3.4){e.slam=0;event(s,'slam',e.x,e.y);if(Math.abs(e.x-s.x)<230&&s.y>FLOOR-65)hurt(s,16);}}
  if(e.poison>0){e.poison-=d;e.hp-= (3+s.ranks*2)*d;if(e.hp<=0){kill(s,e);continue;}}
  if(e.knock>0){e.x+=e.knock*d;e.knock=Math.max(0,e.knock-680*d);}else if(Math.abs(e.x-s.x)<550&&e.x>s.x+65)e.x-=(e.poison>0?38:65)*d;
  // Living gate guardians cannot be skipped; jumping still disengages their contact.
  if(e.boss&&s.x>e.x-65)s.x=e.x-65;
  if(Math.abs(e.x-s.x)<=65.01&&s.y>FLOOR-85){
   if(oldX<=e.x)s.x=Math.min(s.x,e.x-65);else s.x=Math.max(s.x,e.x+65);
   contact=e;e.pressure+=d;
   if(e.pressure>=.56){e.pressure=0;e.knock=260;e.cd=1.1;hurt(s,s.rage?1:e.boss?12:5);event(s,'clash',e.x-32,FLOOR-55);}
  }else e.pressure=0;
 }
 s.clash=contact?contact.id+1:0;
 if(s.clash&&s.attack<0&&s.cool===0){s.attack=0;s.hitDone=false;event(s,'clash',s.x+33,s.y-55);}
 if(s.attack>=0){s.attack+=d;if(!s.hitDone&&s.attack>=4/9){s.hitDone=true;const targets=s.enemies.filter(e=>!e.dead&&Math.abs(e.x-s.x)<(s.path==='butcher'?(s.ranks>=3?310:220):155)&&Math.abs(e.y-s.y)<100).sort((a,b)=>Math.abs(a.x-s.x)-Math.abs(b.x-s.x));
 const count=s.path==='butcher'?99:1;
 for(const e of targets.slice(0,count)){let dmg=s.damage*(s.rage?2.8:1)*(s.path==='hunter'?1.75:1);if(s.path==='hunter'&&e.hp<e.maxHp*(s.ranks>=3?.35:.23))dmg+=e.maxHp*(s.ranks>=3?.35:.23);
 e.hp-=dmg;s.hitCount++;s.fury=Math.min(100,s.fury+12);event(s,'hit',e.x-25,e.y-55);
 if(s.path==='plague'){e.poison=5;e.charges++;if(e.charges>=3){e.charges=0;for(const n of s.enemies)if(!n.dead&&Math.abs(n.x-e.x)<230)n.hp-=s.damage;event(s,'poison',e.x,e.y-50);}}
 if(e.hp<=0)kill(s,e);
 }
 }if(s.attack>=10/9){s.attack=-1;s.cool=.35;}}
 for(const c of s.coins)if(!c.taken&&Math.abs(c.x-s.x)<35&&Math.abs(c.y-(s.y-40))<65){c.taken=true;s.gold++;s.xp+=.18;event(s,'coin',c.x,c.y);}
 if(s.xp>=(s.lv+1)*5&&s.mode==='play'&&s.ground&&!s.clash){s.mode='upgrade';}
 s.stuck=Math.abs(s.x-oldX)<.01&&!s.clash?s.stuck+d:0;
 if(s.stuck>1){s.notice='Удерживайте прыжок, чтобы подняться на колонну';s.noticeTime=1;}
 s.cam=Math.max(0,Math.min(LEVEL.length-960,s.x-235));
 if(s.x>=LEVEL.length-160&&s.enemies.filter(e=>e.boss).every(e=>e.dead)){s.mode='win';}
}
function bot(s){let jump=false;if(s.ground){for(const p of LEVEL.platforms){if(p.y<s.y-5&&p.x-s.x>0&&p.x-s.x<105)jump=true;if(Math.abs(s.y-p.y)<2&&p.x+p.w-s.x<50&&p.x+p.w-s.x>0)jump=true;}for(const h of LEVEL.spikes)if(s.y===FLOOR&&h.x-s.x>0&&h.x-s.x<110)jump=true;}if(s.ground&&s.enemies.some(e=>!e.dead&&e.boss&&e.slam>2.95&&Math.abs(e.x-s.x)<300))jump=true;return {press:jump,hold:true,fury:s.fury===100};}
const API={DT,FLOOR,SPEED,LEVEL,HINT:'Tap/Space jump; hold for height. Fury button/F activates Fury. Escape pauses.',VIEW:{W:960,H:540},create,step,upgrade,rage,bot};if(typeof module!=='undefined')module.exports=API;root.SIM=API;
})(typeof window!=='undefined'?window:globalThis);
