class LumiSwipe {
 constructor(threshold=8){this.threshold=threshold;this.pointer=null}
 start(id,x,y){if(this.pointer)return false;this.pointer={id,x,y};return true}
 move(id,x,y){const p=this.pointer;if(!p||p.id!==id)return null;const dx=x-p.x,dy=y-p.y;if(Math.max(Math.abs(dx),Math.abs(dy))<this.threshold)return null;p.x=x;p.y=y;return Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up'}
 end(id){if(this.pointer?.id===id)this.pointer=null}
}
if(typeof module!=='undefined')module.exports=LumiSwipe;
else (()=>{
 const swipe=new LumiSwipe(),pad=document.querySelector('.touchpad'),held=new Map();let previous=0;
 const playing=()=>currentView==='game'&&state==='playing'&&!document.querySelector('#controller-dialog').open;
 canvas.addEventListener('pointerdown',e=>{if(!playing()||!swipe.start(e.pointerId,e.clientX,e.clientY))return;e.preventDefault();canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!playing())return;const d=swipe.move(e.pointerId,e.clientX,e.clientY);if(d){e.preventDefault();move(d)}});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>swipe.end(e.pointerId));
 pad.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-dir]');if(!b||!playing())return;e.preventDefault();held.set(e.pointerId,b.dataset.dir);pad.setPointerCapture(e.pointerId);move(b.dataset.dir);b.classList.add('touch-active')});
 pad.addEventListener('pointermove',e=>{if(!held.has(e.pointerId))return;e.preventDefault();const b=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-dir]');held.set(e.pointerId,b&&pad.contains(b)?b.dataset.dir:null);paint();if(b&&pad.contains(b)&&playing())move(b.dataset.dir)});
 function paint(){pad.querySelectorAll('[data-dir]').forEach(b=>b.classList.toggle('touch-active',[...held.values()].includes(b.dataset.dir)))}
 for(const event of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(event,e=>{held.delete(e.pointerId);paint()});
 function reset(){held.clear();swipe.pointer=null;paint()}
 window.LumiTouchControls={tick(now){if(!playing()){reset();return}if(now-previous>=90){previous=now;const d=[...held.values()].filter(Boolean).at(-1);if(d)move(d)}}};
 const bond=document.querySelector('#dash');bond.addEventListener('pointerdown',e=>{if(!playing())return;e.preventDefault();dash()});bond.onclick=e=>{if(e.detail===0)dash()};
 window.addEventListener('blur',reset);document.addEventListener('visibilitychange',reset);
 // Stop document panning only inside the active game. Dialogs and menus can still scroll.
 document.addEventListener('touchmove',e=>{if(document.body.classList.contains('mobile-game')&&currentView==='game'&&!document.querySelector('dialog[open]')&&document.querySelector('#overlay').hidden&&e.cancelable)e.preventDefault()},{passive:false});
})();
