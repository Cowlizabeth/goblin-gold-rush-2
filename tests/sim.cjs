const assert=require('node:assert/strict'),M=require('../live/sim.js'),fs=require('fs');let checks=[];
function test(name,fn){fn();checks.push(name);}
function run(path){let s=M.create();for(let i=0;i<120*450&&s.mode!=='win'&&s.mode!=='dead';i++){if(s.mode==='upgrade')M.upgrade(s,path);M.step(s,M.bot(s));}return s;}
for(const path of ['butcher','hunter','plague'])test('Reachable full route: '+path,()=>{const s=run(path);assert.equal(s.mode,'win',JSON.stringify({x:s.x,hp:s.hp,t:s.t}));assert.equal(s.bossKills,M.LEVEL.bosses.length);assert(s.jumps>=12);assert(s.landings>=12);assert(s.hitCount>0);checks.push({path,seconds:s.t,gold:s.gold,hp:s.hp,kills:s.kills,jumps:s.jumps});});
test('No-input route cannot bypass mandatory platforming',()=>{const s=M.create();for(let i=0;i<120*45;i++){if(s.mode==='upgrade')M.upgrade(s,'butcher');M.step(s,{})}assert(s.x<910);assert.notEqual(s.mode,'win');});
test('Short vs held jump',()=>{function height(hold){let s=M.create();s.enemies=[];let min=s.y;for(let i=0;i<100;i++){M.step(s,{press:i===0,hold:i<hold});min=Math.min(min,s.y)}return M.FLOOR-min}assert(height(35)>height(4)+50)});
test('Fury retained indefinitely away from enemies',()=>{let s=M.create();s.enemies=[];s.fury=100;assert(M.rage(s));let r=s.rage;for(let i=0;i<300;i++)M.step(s,{});assert.equal(s.rage,r);});
test('Fury requires charge and cannot refresh',()=>{let s=M.create();assert(!M.rage(s));s.fury=100;assert(M.rage(s));assert(!M.rage(s));});
test('Overlay freezes time and physics',()=>{let s=M.create();s.mode='upgrade';const t=JSON.stringify(s);M.step(s,{press:true,hold:true});assert.equal(JSON.stringify(s),t);});
test('Exclusive weapon choice',()=>{let s=M.create();s.mode='upgrade';M.upgrade(s,'hunter');s.mode='upgrade';M.upgrade(s,'plague');assert.equal(s.path,'hunter');});
test('Clash solid contact and jump escape',()=>{let s=M.create();s.enemies=[{...s.enemies[0],x:s.x+66}];for(let i=0;i<30;i++)M.step(s,{});assert(s.clash);assert(s.enemies[0].x-s.x>=64);for(let i=0;i<30;i++)M.step(s,{press:i===0,hold:true});assert.equal(s.clash,0);});
test('Attack ends and returns to run',()=>{let s=M.create();s.enemies=[];s.attack=0;for(let i=0;i<150;i++)M.step(s,{});assert.equal(s.attack,-1)});
test('Buffered landing triggers next jump',()=>{let s=M.create();s.y=M.FLOOR-5;s.vy=100;s.ground=false;s.coyote=0;M.step(s,{press:true,hold:true});for(let i=0;i<12;i++)M.step(s,{hold:true});assert(s.vy<0);});
test('Coyote time permits jump after edge',()=>{let s=M.create();s.ground=false;s.y-=2;s.coyote=.08;M.step(s,{press:true,hold:true});assert(s.vy<0)});
test('Spikes damage grounded player',()=>{let s=M.create();s.x=M.LEVEL.spikes[0].x+70;M.step(s,{});assert(s.hp<s.maxHp)});
test('Jumping across a living boss cannot softlock the arena',()=>{let s=M.create();let e={...s.enemies.find(e=>e.boss)};s.x=e.x+130;s.enemies=[e];s.y=M.FLOOR-150;s.vy=100;s.ground=false;for(let i=0;i<120*20;i++){if(s.mode==='upgrade')M.upgrade(s,'hunter');M.step(s,M.bot(s));}assert(s.hitCount>0);assert(s.enemies[0].dead);});
test('Boss shockwave can be avoided with a jump',()=>{const make=()=>{let s=M.create();let e={...s.enemies.find(e=>e.boss)};s.x=e.x-180;e.slam=3.4;s.enemies=[e];return s};let a=make(),b=make();b.y-=100;b.ground=false;M.step(a,{});M.step(b,{});assert(a.hp<b.hp);});
fs.writeFileSync('frames/simulation-report.json',JSON.stringify({passed:checks.filter(x=>typeof x==='string').length,checks},null,2));console.log(JSON.stringify({passed:checks.filter(x=>typeof x==='string').length,checks}));
