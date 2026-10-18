/* A collection wish is independent of purchases, rewards and the saved run. */
class LumiCollectionGoals {
 constructor(catalog,storage){this.catalog=catalog;this.storage=storage;this.id=null;try{const id=storage.getItem('lumi-collection-goal-v1');if(catalog.some(c=>c.id===id))this.id=id}catch{}}
 view(progress){const available=this.catalog.filter(c=>!progress.owned.includes(c.id)),target=available.find(c=>c.id===this.id)||available.find(c=>c.collection)||available[0];if(!target)return null;return {target,missing:Math.max(0,target.price-progress.coins),percent:Math.min(100,Math.floor(progress.coins/target.price*100))}}
 choose(id,progress){if(!this.catalog.some(c=>c.id===id)||progress.owned.includes(id))return false;this.id=id;try{this.storage.setItem('lumi-collection-goal-v1',id)}catch{}return true}
}
if(typeof module!=='undefined')module.exports=LumiCollectionGoals;
else{let storage;try{storage=localStorage}catch{}window.LumiCollection=new LumiCollectionGoals(Progression.catalog,storage)}
