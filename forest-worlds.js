/* Independent world journal, touch preferences and presentation data. */
class LumiForestWorlds {
 static zones=[
  {id:'emerald',art:'assets/forest-emerald.jpg',name:'Clairière émeraude',subtitle:'Sous les fougères, la lumière s’éveille.',symbol:'✧',accent:'#c9f59b',floor:['#23483e','#173a33','#10292d'],hedge:['#729b60','#477449','#2d513a'],stone:['#607c78','#435c61','#30464c'],leaf:'#9aca75',motif:'fern',notes:[196,246.94,293.66,369.99],wave:'sine',interval:1600},
  {id:'moon',art:'assets/forest-moon.jpg',name:'Jardin lunaire',subtitle:'Des fleurs d’argent sous un ciel de velours.',symbol:'☽',accent:'#c4e8ff',floor:['#253b54','#1b2c46','#112137'],hedge:['#8ca9be','#607e99','#3c526d'],stone:['#89a4b5','#5c788c','#394f66'],leaf:'#b8dcec',motif:'moonflower',notes:[261.63,392,523.25,587.33],wave:'sine',interval:2100},
  {id:'violet',art:'assets/forest-violet.jpg',name:'Bois violet',subtitle:'Un sentier secret parmi les champignons lumineux.',symbol:'✺',accent:'#e3c2ff',floor:['#3d2a4d','#2e2240','#1b2135'],hedge:['#a47bb6','#76538d','#4b375f'],stone:['#8b83a7','#665d81','#484263'],leaf:'#dbb5ed',motif:'mushroom',notes:[164.81,220,329.63,261.63],wave:'triangle',interval:1800},
  {id:'gold',art:'assets/forest-gold.jpg',name:'Forêt dorée',subtitle:'Les dernières feuilles gardent la chaleur des étoiles.',symbol:'✦',accent:'#ffe2a0',floor:['#493d2b','#352f28','#202d2d'],hedge:['#c7b276','#978247','#625b36'],stone:['#a49c7c','#7b755c','#555648'],leaf:'#f0d89a',motif:'leaf',notes:[293.66,369.99,440,587.33],wave:'sine',interval:1500}
 ];
 static forLevel(level=1){const n=Number.isSafeInteger(level)&&level>0?level:1,index=Math.floor((n-1)/5)%4,start=Math.floor((n-1)/5)*5+1;return {...this.zones[index],index,start,end:start+4,cycle:Math.floor((n-1)/20)+1}}
}
class LumiForestJourney {
 constructor(storage){this.storage=storage;this.data={classic:{reached:1,cleared:0},adventure:{reached:1,cleared:0}};try{const raw=JSON.parse(storage.getItem('lumi-journey-v1'));if(raw?.version===1)for(const mode of ['classic','adventure']){const v=raw.modes?.[mode];if(v){const cleared=this.number(v.cleared,0);this.data[mode]={cleared,reached:Math.max(cleared+1,this.number(v.reached,1))}}}}catch{}}
 number(n,fallback){return Number.isSafeInteger(n)&&n>=fallback?Math.min(n,1000000):fallback}
 save(){try{this.storage.setItem('lumi-journey-v1',JSON.stringify({version:1,modes:this.data}))}catch{}}
 reach(mode,level){if(!this.data[mode]||!Number.isSafeInteger(level)||level<1)return;this.data[mode].reached=Math.max(this.data[mode].reached,Math.min(level,1000000));this.save()}
 complete(mode,level){if(!this.data[mode]||!Number.isSafeInteger(level)||level<1)return;this.data[mode].cleared=Math.max(this.data[mode].cleared,Math.min(level,999999));this.data[mode].reached=Math.max(this.data[mode].reached,Math.min(level+1,1000000));this.save()}
 view(mode='classic'){return {...(this.data[mode]||this.data.classic)}}
}
class LumiTouchPreferences {
 constructor(storage){this.storage=storage;this.value={size:88,side:'left'};try{const raw=JSON.parse(storage.getItem('lumi-touch-v1'));if([76,88,104].includes(raw?.size))this.value.size=raw.size;if(['left','right'].includes(raw?.side))this.value.side=raw.side}catch{}}
 view(){return {...this.value}}
 update(next){if(next.size!==undefined&&![76,88,104].includes(next.size)||next.side!==undefined&&!['left','right'].includes(next.side))return false;this.value={...this.value,...next};try{this.storage.setItem('lumi-touch-v1',JSON.stringify(this.value))}catch{}return true}
}
class LumiSoundscape {
 constructor(play){this.play=play;this.elapsed=0;this.index=0;this.world=null}
 tick(dt,active,muted,world){if(this.world!==world.id){this.world=world.id;this.elapsed=0;this.index=0}if(!active||muted){this.elapsed=0;return}this.elapsed+=Math.max(0,Math.min(dt,250));if(this.elapsed>=world.interval){this.elapsed-=world.interval;this.play(world.notes[this.index%world.notes.length],.65,world.wave,.007);this.index++}}
}
if(typeof module!=='undefined')module.exports={LumiForestWorlds,LumiForestJourney,LumiTouchPreferences,LumiSoundscape};
else {let storage;try{storage=localStorage}catch{}window.LumiJourney=new LumiForestJourney(storage);window.LumiTouchPrefs=new LumiTouchPreferences(storage)}
