/* Run-scoped powers and separate local records. No changes to progression storage. */
class LumiModeRecords {
 constructor(storage){this.storage=storage;this.choice='classic';this.records={classic:0,adventure:0};try{for(const mode of Object.keys(this.records)){const value=Number(storage.getItem(this.key(mode)));this.records[mode]=Number.isSafeInteger(value)&&value>=0?value:0}if(storage.getItem('lumi-mode-v1')==='adventure')this.choice='adventure'}catch{}}
 key(mode){return mode==='adventure'?'lumi-best-adventure-v1':'lumi-best'}
 choose(mode){if(!['classic','adventure'].includes(mode))return false;this.choice=mode;try{this.storage.setItem('lumi-mode-v1',mode)}catch{}return true}
 best(mode=this.choice){return this.records[mode]||0}
 record(mode,score){if(!['classic','adventure'].includes(mode)||!Number.isSafeInteger(score)||score<0)return false;if(score<=this.records[mode])return false;this.records[mode]=score;try{this.storage.setItem(this.key(mode),String(score))}catch{}return true}
}
class LumiCompanionBonus {
 static descriptions={
  lumi:{name:'Second souffle',description:'Après une vie perdue, ton premier bond se recharge immédiatement.',short:'Second souffle'},
  aurora:{name:'Fleur enchantée',description:'Les fleurs prolongent la protection de 20 %.',short:'Fleur +20 %'},
  mist:{name:'Pas léger',description:'Le bond se recharge environ 15 % plus vite.',short:'Bond accéléré'},
  sylve:{name:'Sentier lumineux',description:'Quand il reste 10 lucioles ou moins, un chemin apparaît brièvement vers la plus proche.',short:'Sentier lumineux'},
  nyx:{name:'Voile lunaire',description:'Après une fleur, les papillons avancent deux fois moins souvent pendant un court instant.',short:'Voile lunaire'},
  astre:{name:'Étoile gardienne',description:'Absorbe une collision mortelle par partie, avec une brève protection.',short:'Étoile prête'}
 };
 constructor(mode,id){this.id=mode==='adventure'&&LumiCompanionBonus.descriptions[id]?id:null;this.shieldUsed=false;this.clearTransient()}
 clearTransient(){this.freeDash=false;this.slow=0;this.invulnerable=0;this.effect=0;this.path=[];this.pathTicks=0;this.hintCooldown=0}
 tick(){for(const key of ['slow','invulnerable','effect','pathTicks','hintCooldown'])if(this[key]>0)this[key]--;if(!this.pathTicks)this.path=[]}
 flowerDuration(){if(this.id==='nyx')this.slow=20;return this.id==='aurora'?72:60}
 lifeLost(){if(this.id==='lumi')this.freeDash=true}
 dashRecharge(moved){if(this.id==='lumi'&&this.freeDash&&moved){this.freeDash=false;this.effect=10;return 0}return this.id==='mist'?24:28}
 enemyInterval(base){return this.id==='nyx'&&this.slow>0?base*2:base}
 absorb(){if(this.id!=='astre'||this.shieldUsed)return false;this.shieldUsed=true;this.invulnerable=8;this.effect=14;return true}
 updatePath(map,player,pellets){
  if(this.id!=='sylve')return;const targets=new Set([...pellets].filter(([,v])=>v===1).map(([k])=>k));
  if(!targets.size||targets.size>10){this.path=[];this.pathTicks=0;return}
  if(!this.pathTicks){if(this.hintCooldown)return;this.pathTicks=14;this.hintCooldown=42}
  const start=player.x+','+player.y,queue=[start],parents=new Map([[start,null]]);let target=null;
  for(let i=0;i<queue.length;i++){const key=queue[i];if(targets.has(key)){target=key;break}const [x,y]=key.split(',').map(Number);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(map[ny]?.[nx]!==undefined&&map[ny][nx]!=='#'&&!parents.has(k)){parents.set(k,key);queue.push(k)}}}
  this.path=[];for(let key=target;key!==null&&key!==undefined;key=parents.get(key))this.path.unshift(key.split(',').map(Number));
 }
 status(){if(!this.id)return 'Sans pouvoir';if(this.id==='astre')return this.shieldUsed?'Étoile utilisée':'Étoile prête';if(this.id==='lumi'&&this.freeDash)return 'Bond sans attente';if(this.id==='nyx'&&this.slow)return 'Voile actif';if(this.id==='sylve'&&this.pathTicks)return 'Sentier révélé';return LumiCompanionBonus.descriptions[this.id].short}
}
if(typeof module!=='undefined')module.exports={LumiModeRecords,LumiCompanionBonus};
else {let storage;try{storage=localStorage}catch{}window.LumiModes=new LumiModeRecords(storage)}
