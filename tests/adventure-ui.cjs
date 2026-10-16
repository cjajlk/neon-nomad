const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('default gamepad confirm still starts the game after adding mode buttons',()=>{
 const nodes=new Map(),clicked=[],node=id=>{if(!nodes.has(id))nodes.set(id,{id:id.replace('#',''),open:false,hidden:true,textContent:'',addEventListener(){},click(){clicked.push(this.id)},getClientRects:()=>[{}],querySelector:node,focus(){}});return nodes.get(id)};
 const root=node('#menu'),classic=node('#classic'),adventure=node('#adventure'),play=node('#play');root.querySelectorAll=()=>[classic,adventure,play];
 const context={currentView:'menu',localStorage:{getItem:()=>null},document:{activeElement:{},querySelector:node,addEventListener(){},hasFocus:()=>true},window:{addEventListener(){}},navigator:{getGamepads:()=>[]},requestAnimationFrame(){},LumiGamepadInput:class{constructor(options){context.actions=options.onAction}reset(){}}};
 vm.createContext(context);vm.runInContext(fs.readFileSync('controller.js','utf8'),context);context.actions('primary');assert.deepEqual(clicked,['play']);context.document.activeElement=adventure;context.actions('primary');assert.deepEqual(clicked,['play','adventure']);
});
