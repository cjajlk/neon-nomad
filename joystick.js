/* Fixed four-direction steering, with deadzone and one captured steering finger. */
class LumiFixedJoystick {
 constructor({radius=28,deadzone=9}={}){this.radius=radius;this.deadzone=deadzone;this.reset()}
 reset(){this.pointer=null;this.x=0;this.y=0;this.direction=null}
 start(id,x,y){if(this.pointer!==null)return false;this.pointer=id;this.update(id,x,y);return true}
 update(id,x,y){if(this.pointer!==id)return null;const length=Math.hypot(x,y),scale=length>this.radius?this.radius/length:1;this.x=x*scale;this.y=y*scale;
  if(length<this.deadzone){this.direction=null;return null}
  let horizontal=Math.abs(x)>Math.abs(y);
  if(this.direction){const wasHorizontal=['left','right'].includes(this.direction);if(Math.abs(Math.abs(x)-Math.abs(y))<length*.1)horizontal=wasHorizontal}
  this.direction=horizontal?x>0?'right':'left':y>0?'down':'up';return this.direction;
 }
 end(id){if(this.pointer===id)this.reset()}
}
if(typeof module!=='undefined')module.exports=LumiFixedJoystick;
else (()=>{
 const stick=document.querySelector('#fixed-joystick'),knob=stick.querySelector('.joystick-knob'),bond=document.querySelector('#mobile-bond'),label=bond.querySelector('small'),model=new LumiFixedJoystick();let lastRepeat=0;
 const playing=()=>currentView==='game'&&state==='playing'&&!orientationBlocked()&&!document.querySelector('dialog[open]')?.open;
 function paint(){knob.style.setProperty('--stick-x',model.x+'px');knob.style.setProperty('--stick-y',model.y+'px');stick.classList.toggle('is-held',model.pointer!==null)}
 function point(e){const r=stick.getBoundingClientRect();model.radius=r.width*.318;model.deadzone=r.width*.102;return [e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2]}
 stick.addEventListener('pointerdown',e=>{if(!playing()||!model.start(e.pointerId,...point(e)))return;e.preventDefault();stick.setPointerCapture(e.pointerId);paint();if(model.direction)move(model.direction)});
 stick.addEventListener('pointermove',e=>{if(model.pointer!==e.pointerId)return;if(!playing()){reset();return}e.preventDefault();const d=model.update(e.pointerId,...point(e));paint();if(d)move(d)});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,e=>{model.end(e.pointerId);paint()});
 function reset(){model.reset();paint()}
 bond.addEventListener('pointerdown',e=>{if(!playing()||dashCooldown)return;e.preventDefault();dash()});bond.addEventListener('click',e=>{if(e.detail===0&&playing())dash()});
 window.LumiJoystickControls={reset,tick(now){const active=playing();if(!active)reset();if(active&&model.direction&&now-lastRepeat>=90){lastRepeat=now;move(model.direction)}bond.disabled=!active||dashCooldown>0;label.textContent=dashCooldown?Math.ceil(dashCooldown*.14)+'s':'BOND'}};
 window.addEventListener('lumi-touch-settings',reset);window.addEventListener('blur',reset);document.addEventListener('visibilitychange',reset);paint();
})();
