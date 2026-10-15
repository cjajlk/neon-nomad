// Test-only player: chooses move/dash actions, never alters enemies, pickups or game state.
module.exports=function(){
 let actions=0,dashes=0;const trace=[];
 function distances(from){const out=new Map([[from.x+','+from.y,0]]),q=[from];for(let i=0;i<q.length;i++){const p=q[i],d=out.get(p.x+','+p.y);for(const [dx,dy] of Object.values(dirs)){const x=p.x+dx,y=p.y+dy,k=x+','+y;if(open(x,y)&&!out.has(k)){out.set(k,d+1);q.push({x,y})}}}return out}
 while(level===1&&state==='playing'&&actions<6000){
  if(freeze){step();actions++;continue}
  const enemyDistances=enemies.map(distances),threat=(x,y)=>Math.min(...enemyDistances.map(d=>d.get(x+','+y)??999));
  const q=[{x:player.x,y:player.y,cost:0,first:null}],bestCost=new Map([[player.x+','+player.y,0]]);let target=null,targetCost=Infinity;
  while(q.length){q.sort((a,b)=>b.cost-a.cost);const p=q.pop();if(p.cost>(bestCost.get(p.x+','+p.y)??Infinity))continue;const v=pellets.get(p.x+','+p.y),bias=v===3&&power<30?10:0;
   if(v&&p.first&&p.cost-bias<targetCost){target=p;targetCost=p.cost-bias}
   if(p.cost>targetCost+10)continue;
   for(const [dir,[dx,dy]] of Object.entries(dirs)){const x=p.x+dx,y=p.y+dy,k=x+','+y;if(!open(x,y))continue;const danger=threat(x,y),protectedFor=power-p.cost;const penalty=protectedFor>4?0:danger===0?200:danger===1?60:danger===2?12:danger===3?3:0;const cost=p.cost+1+penalty;if(cost<(bestCost.get(k)??Infinity)){bestCost.set(k,cost);q.push({x,y,cost,first:p.first||dir})}}
  }
  const dir=target?.first||player.dir;move(dir);trace.push(dir);
  // Bond only when the current line is threatened; use the real collision checks.
  if(!dashCooldown&&power<5&&threat(player.x,player.y)<=3){dash();dashes++}
  step();actions++;
 }
 return {completed:level===2,actions,lives,score,coins:runCoins,remaining:pellets.size,dashes,trace};
};
