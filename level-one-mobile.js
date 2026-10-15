/* Only mobile level 1 uses this board. No storage or economy dependencies. */
class LumiLevelOneMobile {
 static create(){
  const width=33,height=17,g=Array.from({length:height},()=>Array(width).fill('#'));let seed=7962;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296},vectors=[[1,0],[-1,0],[0,1],[0,-1]],stack=[[1,1]];g[1][1]='.';
  while(stack.length){const [x,y]=stack.at(-1),options=vectors.map(([x,y])=>[x*2,y*2]).filter(([dx,dy])=>x+dx>0&&x+dx<width-1&&y+dy>0&&y+dy<height-1&&g[y+dy][x+dx]==='#');if(!options.length){stack.pop();continue}const [dx,dy]=options[Math.floor(random()*options.length)];g[y+dy/2][x+dx/2]='.';g[y+dy][x+dx]='.';stack.push([x+dx,y+dy])}
  for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++)if(g[y][x]==='#'&&random()<.2&&((g[y][x-1]==='.'&&g[y][x+1]==='.')||(g[y-1][x]==='.'&&g[y+1][x]==='.')))g[y][x]='.';
  for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++)if(g[y][x]==='.'&&vectors.filter(([dx,dy])=>g[y+dy]?.[x+dx]==='.').length===1){const options=vectors.map(([x,y])=>[x*2,y*2]).filter(([dx,dy])=>x+dx>0&&x+dx<width-1&&y+dy>0&&y+dy<height-1&&g[y+dy][x+dx]==='.');if(options.length){const [dx,dy]=options[Math.floor(random()*options.length)];g[y+dy/2][x+dx/2]='.'}}
  const cells=[];g.forEach((row,y)=>row.forEach((c,x)=>{if(c==='.')cells.push({x,y})}));
  const nearest=(x,y,options)=>[...options].sort((a,b)=>(Math.abs(a.x-x)+Math.abs(a.y-y))-(Math.abs(b.x-x)+Math.abs(b.y-y))||a.y-b.y||a.x-b.x)[0];
  const player=nearest(16,13,cells),distances=new Map([[player.x+','+player.y,0]]),queue=[player];
  for(let i=0;i<queue.length;i++){const p=queue[i],d=distances.get(p.x+','+p.y);for(const [dx,dy] of vectors){const x=p.x+dx,y=p.y+dy,k=x+','+y;if(g[y]?.[x]==='.'&&!distances.has(k)){distances.set(k,d+1);queue.push({x,y})}}}
  const enemyCandidates=cells.filter(p=>distances.get(p.x+','+p.y)>=10),enemies=[];
  for(let i=0;i<4;i++){const p=nearest(16+i%2,7+Math.floor(i/2),enemyCandidates.filter(p=>!enemies.includes(p)));enemies.push(p)}
  const flowers=[[1,1],[31,1],[1,15],[31,15]];for(const [x,y] of flowers)g[y][x]='o';
  // Same 244 normal fireflies + 4 flowers as original level 1 (248 pickups).
  const normal=cells.filter(p=>g[p.y][p.x]!== 'o'&&(p.x!==player.x||p.y!==player.y)),collectibles=flowers.map(([x,y])=>({x,y,value:3}));
  for(let i=0;i<244;i++){const p=normal[Math.floor(i*normal.length/244)];collectibles.push({...p,value:1})}
  return {map:g.map(r=>r.join('')),player,enemies,home:enemies[0],collectibles,width,height};
 }
}
if(typeof module!=='undefined')module.exports=LumiLevelOneMobile;
