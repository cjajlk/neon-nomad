/* Hardware-independent reader: browser-standard layout, per-device remapping and edge-triggered actions. */
class LumiGamepadInput {
 constructor({onAction=()=>{},onConnection=()=>{},onDisconnect=()=>{},getMapping=()=>null}={}){Object.assign(this,{onAction,onConnection,onDisconnect,getMapping});this.device=null;this.previous={};this.armed=false;this.lastDirection=null;this.repeatAt=0}
 static defaults(){return {up:{button:12,axis:1,sign:-1},down:{button:13,axis:1,sign:1},left:{button:14,axis:0,sign:-1},right:{button:15,axis:0,sign:1},primary:{button:0},back:{button:1},pause:{button:9}}}
 static valid(map){return map&&['up','down','left','right','primary','back','pause'].every(k=>{const b=map[k];return b&&(Number.isInteger(b.button)&&b.button>=0&&b.button<64||Number.isInteger(b.axis)&&b.axis>=0&&b.axis<32&&[-1,1].includes(b.sign))})}
 static pressed(pad,binding){if(!binding)return false;const b=pad.buttons?.[binding.button],value=typeof b==='number'?b:b?.value;const axis=pad.axes?.[binding.axis];return !!(b?.pressed||value>.5||Number.isFinite(axis)&&axis*binding.sign>.3)}
 values(pad){const custom=this.getMapping(pad.id),map=LumiGamepadInput.valid(custom)?custom:LumiGamepadInput.defaults();return Object.fromEntries(Object.entries(map).map(([key,b])=>[key,LumiGamepadInput.pressed(pad,b)]))}
 reset(){this.armed=false;this.previous={};this.lastDirection=null;this.repeatAt=0}
 poll(pads,now,enabled=true){const available=Array.from(pads||[]).filter(p=>p?.connected!==false&&p);let pad=this.device&&available.find(p=>p.index===this.device.index&&p.id===this.device.id);
  if(this.device&&!pad){const old=this.device;this.device=null;this.reset();this.onDisconnect(old);return}
  if(!pad){pad=available[0];if(!pad)return;this.device={id:pad.id,index:pad.index,mapping:pad.mapping};this.reset();this.onConnection(this.device)}
  const values=this.values(pad);if(!enabled){this.reset();return}if(!this.armed){if(!Object.values(values).some(Boolean))this.armed=true;this.previous=values;return}
  const horizontal=values.left!==values.right?(values.left?'left':'right'):null,vertical=values.up!==values.down?(values.up?'up':'down'):null;
  let direction=horizontal||vertical;if(horizontal&&vertical){const x=Math.abs(pad.axes?.[0]||0),y=Math.abs(pad.axes?.[1]||0);direction=y>x?vertical:horizontal}
  if(direction){const repeat=direction===this.lastDirection;if(!repeat||now>=this.repeatAt){this.onAction(direction);this.repeatAt=now+(repeat?140:360)}}this.lastDirection=direction;
  // One command per frame prevents a held validate button from also dashing after a screen change.
  for(const action of ['pause','back','primary'])if(values[action]&&!this.previous[action]){this.onAction(action);break}this.previous=values;
 }
}
if(typeof module!=='undefined')module.exports=LumiGamepadInput;
