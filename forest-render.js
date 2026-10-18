/* Deterministic canvas decoration and bounded effects: never consume game RNG. */
class LumiForestFX {
 constructor(){this.items=[];this.seed=91;this.reduced=false}
 random(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296}
 clear(){this.items=[]}
 burst(x,y,color,count=8){if(this.reduced)return;for(let i=0;i<count;i++){const a=this.random()*Math.PI*2,s=12+this.random()*45;this.items.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-12,color,age:0,life:280+this.random()*300,size:1+this.random()*1.8})}if(this.items.length>72)this.items.splice(0,this.items.length-72)}
 dash(points,color){if(this.reduced)return;for(const p of points)this.burst(p.x*30+15,p.y*30+15,color,3)}
 tick(dt){if(this.reduced){this.clear();return}const delta=Math.max(0,Math.min(dt,100));for(const p of this.items){p.age+=delta;p.x+=p.vx*delta/1000;p.y+=p.vy*delta/1000;p.vy+=12*delta/1000}this.items=this.items.filter(p=>p.age<p.life)}
 draw(c){if(!this.items.length)return;c.save();for(const p of this.items){c.globalAlpha=1-p.age/p.life;c.fillStyle=p.color;c.beginPath();c.arc(p.x,p.y,p.size,0,Math.PI*2);c.fill()}c.restore()}
}
class LumiForestArt {
 static detail(c,x,y,world,seed){
  c.save();c.translate(x,y);c.strokeStyle=world.leaf+'99';c.fillStyle=world.leaf+'99';c.lineWidth=.8;
  if(world.motif==='fern'){c.beginPath();c.moveTo(0,4);c.lineTo(0,-5);for(let i=0;i<3;i++){const y=2-i*2;c.moveTo(0,y);c.lineTo(-3+i*.3,y-2);c.moveTo(0,y);c.lineTo(3-i*.3,y-2)}c.stroke()}
  else if(world.motif==='moonflower'){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;c.beginPath();c.ellipse(Math.cos(a)*2.8,Math.sin(a)*2.8,2,1.1,a,0,Math.PI*2);c.fill()}c.fillStyle='#fff3cd';c.beginPath();c.arc(0,0,1.2,0,Math.PI*2);c.fill()}
  else if(world.motif==='mushroom'){c.fillStyle='#d5bbdb';c.fillRect(-.6,0,1.2,4);c.fillStyle=seed%2?'#b38ddd':'#e6a2ce';c.beginPath();c.ellipse(0,-1,4,2.5,0,Math.PI,Math.PI*2);c.fill();c.fillStyle='#f4e9ff';c.fillRect(-1.5,-2,.9,.9);c.fillRect(1,-2.4,.8,.8)}
  else {c.rotate(seed*.3);c.beginPath();c.ellipse(0,0,2.2,4.2,.6,0,Math.PI*2);c.fill();c.strokeStyle='#80682d99';c.beginPath();c.moveTo(-1,2);c.lineTo(1,-2);c.stroke()}
  c.restore();
 }
 static lighting(c,w,h,world){
  c.save();const glow=c.createRadialGradient(w*.65,h*.2,5,w*.5,h*.3,w*.8);glow.addColorStop(0,world.accent+'0c');glow.addColorStop(1,'#00000000');c.fillStyle=glow;c.fillRect(0,0,w,h);
  if(world.id==='moon'){c.fillStyle='#b4d8ff06';c.beginPath();c.moveTo(w*.7,0);c.lineTo(w*.86,0);c.lineTo(w*.35,h);c.lineTo(w*.1,h);c.closePath();c.fill()}
  c.restore();
 }
 static preview(c,world,w=640,h=200){
  const gradient=c.createLinearGradient(0,0,w,h);gradient.addColorStop(0,world.floor[0]);gradient.addColorStop(1,world.floor[2]);c.fillStyle=gradient;c.fillRect(0,0,w,h);
  c.strokeStyle=world.accent+'40';c.lineWidth=18;c.lineCap='round';c.beginPath();c.moveTo(w*.15,h);c.bezierCurveTo(w*.15,h*.4,w*.8,h*.8,w*.78,0);c.stroke();
  for(let i=0;i<18;i++){const x=((i*137+41)%w),y=30+(i*43)%(h-20),r=14+i%4*6;c.fillStyle=world.hedge[i%3]+'aa';c.beginPath();c.ellipse(x,y,r*1.3,r,0,0,Math.PI*2);c.fill();this.detail(c,x,y,world,i)}
  for(let i=0;i<18;i++){c.fillStyle=world.accent+(i%2?'bb':'66');c.beginPath();c.arc((i*83+29)%w,(i*61+11)%h,i%3===0?2:1,0,Math.PI*2);c.fill()}
  this.lighting(c,w,h,world);
 }
}
if(typeof module!=='undefined')module.exports={LumiForestFX,LumiForestArt};
