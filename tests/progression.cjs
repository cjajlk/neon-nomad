const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(storage=new Map(),date='2026-10-12T12:00:00'){let now=date;class Clock extends Date{constructor(...args){super(...(args.length?args:[now]))}}const context=vm.createContext({Date:Clock,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}});vm.runInContext(fs.readFileSync('progression.js','utf8')+';globalThis.p=Progression;',context);return {p:context.p,storage,nextDay:()=>now='2026-10-13T12:00:00'}}
test('Éclats carry partial collections across reloads',()=>{const {p,storage}=setup();assert.equal(p.event('fireflies',9),0);const other=setup(storage).p;assert.equal(other.event('fireflies'),1);assert.equal(other.view().coins,1);assert.equal(other.view().remainder,0)});
test('daily rewards require completion and cannot be claimed twice after reload',()=>{const {p,storage}=setup();const task=p.view().missions[0];assert.equal(p.claim(task.id),0);p.event(task.id,task.goal);assert.equal(p.claim(task.id),task.reward);const earned=p.view().coins;assert.equal(setup(storage).p.claim(task.id),0);assert.equal(setup(storage).p.view().coins,earned)});
test('midnight resets daily progress but preserves wallet and companions',()=>{const {p,nextDay}=setup();p.bonus(150);assert.equal(p.select('aurora').ok,true);p.event('dashes',20);p.claim('dashes');const coins=p.view().coins;nextDay();assert.equal(p.view().date,'2026-10-13');assert.equal(p.view().missions[1].count,0);assert.equal(p.view().missions[1].claimed,false);assert.equal(p.view().coins,coins);assert.equal(p.view().selected,'aurora')});
test('companion unlocking charges only once and persists selection',()=>{const {p,storage}=setup();assert.equal(p.select('mist').ok,false);p.bonus(300);assert.equal(p.select('mist').ok,true);assert.equal(p.view().coins,0);assert.equal(p.select('lumi').ok,true);assert.equal(p.select('mist').ok,true);assert.equal(p.view().coins,0);assert.equal(setup(storage).p.companion().id,'mist')});
test('invalid events cannot remove currency',()=>{const {p}=setup();p.bonus(5);p.event('fireflies',-100);p.bonus(-20);assert.equal(p.select('unknown').ok,false);assert.equal(p.view().coins,5)});
test('rare companions have increasing prices and each purchase persists without charging twice',()=>{
 for(const [id,price,rarity] of [['sylve',650,'rare'],['nyx',1200,'epic'],['astre',2400,'legendary']]){
  const {p,storage}=setup(),c=p.catalog.find(c=>c.id===id);assert.equal(c.price,price);assert.equal(c.rarity,rarity);assert.equal(p.select(id).ok,false);assert.equal(p.view().coins,0);
  p.bonus(price-1);assert.equal(p.select(id).missing,1);assert.equal(p.view().coins,price-1);p.bonus(1);assert.equal(p.select(id).ok,true);assert.equal(p.view().coins,0);
  const restored=setup(storage).p;assert.equal(restored.companion().id,id);assert.equal(restored.select('lumi').ok,true);assert.equal(restored.select(id).ok,true);assert.equal(restored.view().coins,0);assert.equal(restored.view().owned.filter(x=>x===id).length,1);
 }
});
test('legacy saves preserve old companions, currency, remainder and daily rewards',()=>{
 const legacy={version:1,coins:917,remainder:7,selected:'mist',owned:['lumi','aurora','mist'],daily:{date:'2026-10-12',counts:{fireflies:200,dashes:20,flowers:10},claimed:['dashes']}};
 const storage=new Map([['lumi-progress-v1',JSON.stringify(legacy)]]),{p}=setup(storage),v=p.view();assert.equal(v.coins,917);assert.equal(v.remainder,7);assert.equal(v.selected,'mist');assert.deepEqual([...v.owned],legacy.owned);assert.equal(v.missions.find(m=>m.id==='dashes').claimed,true);assert.equal(p.claim('dashes'),0);
 assert.deepEqual(JSON.parse(JSON.stringify(p.catalog.slice(0,3).map(c=>[c.id,c.price]))),[['lumi',0],['aurora',150],['mist',300]]);assert.equal(v.owned.includes('astre'),false);
});
test('all catalog art exists as PNG with alpha; new companions are available to the game renderer',()=>{
 const {p}=setup();assert.equal(new Set(p.catalog.map(c=>c.id)).size,p.catalog.length);
 for(const c of p.catalog){assert.ok(fs.existsSync(c.art),c.art);const png=fs.readFileSync(c.art);assert.equal(png.toString('ascii',1,4),'PNG');assert.equal(png[25],6,'RGBA image '+c.id);assert.ok(c.body&&c.head&&c.scarf)}
});
