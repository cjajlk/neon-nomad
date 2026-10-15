const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),crypto=require('node:crypto');
const Board=require('../level-one-mobile.js'),Gate=require('../mobile-orientation.js'),Layout=require('../viewport-layout.js');
function setup(mobile=true,seed=1){
 const nodes=new Map(),context2d=new Proxy({},{get:(_,key)=>key.startsWith('create')?()=>({addColorStop(){}}):()=>{}}),events=new Map();let randomSeed=seed;
 const node=k=>{if(!nodes.has(k))nodes.set(k,{width:630,height:690,dataset:{},textContent:'',hidden:true,style:{},innerHTML:'',disabled:false,open:false,listeners:new Map(),addEventListener(type,fn){this.listeners.set(type,fn)},querySelectorAll:()=>[],setPointerCapture(){},setAttribute(){},getContext:()=>context2d});return nodes.get(k)};
 const math=Object.create(Math);math.random=()=>{randomSeed=(randomSeed*1664525+1013904223)>>>0;return randomSeed/4294967296};
 const sandbox={console,Math:math,Date,Event:class{constructor(type){this.type=type}},setTimeout(){},document:{body:{classList:{add(){}}},querySelector:node,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame(){},renderWallet(){},toast(){},currentView:'game',blocked:false,LumiMobileSession:{isMobile:()=>mobile,isBlocked:()=>sandbox.blocked},window:{addEventListener:(name,fn)=>events.set(name,fn),dispatchEvent:e=>events.get(e.type)?.()}};
 vm.createContext(sandbox);for(const file of ['level-one-mobile.js','progression.js','game.js'])vm.runInContext(fs.readFileSync(file,'utf8'),sandbox);
 const run=code=>vm.runInContext(code,sandbox);run('start()');return {run,sandbox,emit:(selector,type,event)=>node(selector).listeners.get(type)?.({pointerId:1,preventDefault(){},...event})};
}
test('mobile level 1 repeats deterministically; all 295 paths and 248 pickups reachable',()=>{
 const first=Board.create();for(let n=0;n<20;n++)assert.deepEqual(Board.create(),first);
 const seen=new Set(),queue=[first.player];for(let i=0;i<queue.length;i++){const {x,y}=queue[i],k=x+','+y;if(seen.has(k))continue;seen.add(k);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(first.map[y+dy]?.[x+dx]&&first.map[y+dy][x+dx]!=='#')queue.push({x:x+dx,y:y+dy})}
 assert.equal(seen.size,295);assert.equal(first.width,33);assert.equal(first.height,17);assert.equal(first.collectibles.length,248);assert.equal(first.collectibles.filter(p=>p.value===3).length,4);assert.equal(new Set(first.collectibles.map(p=>p.x+','+p.y)).size,248);
 for(const p of [...first.collectibles,...first.enemies,first.home])assert.ok(seen.has(p.x+','+p.y));
});
test('only mobile level 1 changes; desktop and levels 2–30 remain classic',()=>{
 for(const mobile of [false,true]){const {run}=setup(mobile);assert.equal(run('canvas.width'),mobile?990:630);assert.equal(run('canvas.height'),mobile?510:690);const maps=[];for(let n=2;n<=30;n++){run(`level=${n};board()`);assert.equal(run('JSON.stringify(map)===JSON.stringify(forest(level))'),true);assert.equal(run('canvas.width'),630);assert.equal(run('canvas.height'),690);maps.push(run('map.join("\\n")'))}assert.equal(crypto.createHash('sha256').update(maps.join('\n---\n')).digest('hex'),'e83251f32e9da8f6f7a603b094f9b5b25c180a2d3a05addb03961a26b449b130')}
});
test('orientation freezes simulation and every gameplay input, preserving manual pause',()=>{
 const {run,sandbox}=setup();run('last=500;acc=100');const before=run('JSON.stringify({player,enemies,score,lives,pellets:[...pellets],dashCooldown,power,tick})');sandbox.blocked=true;
 run('step();move("up");dash();pause();start();loop(10000)');assert.equal(run('JSON.stringify({player,enemies,score,lives,pellets:[...pellets],dashCooldown,power,tick})'),before);assert.equal(run('acc'),0);
 sandbox.blocked=false;run('pause()');assert.equal(run('state'),'paused');sandbox.blocked=true;run('loop(20000);pause();start()');sandbox.blocked=false;run('loop(30000)');assert.equal(run('state'),'paused');assert.equal(run('score'),0);
});
test('starting in portrait prepares the V3 run without advancing it',()=>{const {run,sandbox}=setup();run('state="menu"');sandbox.blocked=true;run('start();loop(40000)');assert.equal(run('state'),'playing');assert.equal(run('canvas.width'),990);assert.equal(run('tick'),0);assert.equal(run('score'),0)});
test('orientation gate distinguishes portrait, landscape, menus and desktop',()=>{const g=new Gate();g.update(true,true,390,844);assert.equal(g.blocked,true);g.update(true,true,844,390);assert.equal(g.blocked,false);g.update(false,true,390,844);assert.equal(g.blocked,false);g.update(true,false,390,844);assert.equal(g.blocked,false)});
test('V3 landscape fit uses all available space with square cells',()=>{for(const [w,h] of [[844,390],[915,412]]){const l=Layout.calculate(w,h,{mobile:true,ratio:33/17});assert.ok(l.boardWidth<=w-104+1e-8);assert.ok(l.boardHeight<=h+1e-8);assert.ok(Math.abs(l.boardWidth/33-l.boardHeight/17)<1e-8);assert.ok(l.boardWidth*l.boardHeight/w/h>.85)}});
test('mobile collisions, powered enemy return, walls and dash use valid adapted cells',()=>{const {run}=setup();run('player.x=enemies[0].x;player.y=enemies[0].y;collision()');assert.equal(run('lives'),2);assert.equal(run('open(player.x,player.y)'),true);run('player.x=enemies[0].x;player.y=enemies[0].y;power=60;collision()');assert.equal(run('score'),75);assert.equal(run('enemies[0].x===levelLayout.home.x&&enemies[0].y===levelLayout.home.y'),true);run('player={x:1,y:1,dir:"left",next:"left"};dash()');assert.equal(run('player.x'),1);assert.equal(run('player.y'),1);assert.equal(run('dashTrail.length'),0)});
test('real level 1 completes with active enemies, unchanged rewards and classic level 2',()=>{
 const {run}=setup(true,1),bot=require('./fixtures/level-one-bot.cjs'),result=run('('+bot.toString()+')()');
 assert.equal(result.completed,true);assert.equal(result.lives,3);assert.equal(result.coins,49);assert.equal(run('level'),2);assert.equal(run('canvas.width'),630);assert.equal(run('canvas.height'),690);assert.equal(run('JSON.stringify(map)===JSON.stringify(forest(2))'),true);
});
test('real touch adapter steers, blocks portrait and clears partial gestures across rotation',()=>{
 const {run,sandbox,emit}=setup();run(fs.readFileSync('touch-controls.js','utf8'));
 emit('#game','pointerdown',{clientX:100,clientY:100});emit('#game','pointermove',{clientX:125,clientY:100});assert.equal(run('player.next'),'right');
 sandbox.blocked=true;run('window.LumiTouchControls.reset()');emit('#game','pointerdown',{clientX:100,clientY:100});emit('#game','pointermove',{clientX:80,clientY:100});assert.equal(run('player.next'),'right');
 sandbox.blocked=false;run('window.LumiTouchControls.reset()');emit('#game','pointerdown',{clientX:100,clientY:100});emit('#game','pointermove',{clientX:80,clientY:100});assert.equal(run('player.next'),'left');emit('#game','pointerup',{clientX:80,clientY:100,timeStamp:1});
 const tap=time=>{emit('#game','pointerdown',{clientX:100,clientY:100});emit('#game','pointerup',{clientX:100,clientY:100,timeStamp:time})};
 tap(100);sandbox.blocked=true;run('window.LumiTouchControls.reset()');sandbox.blocked=false;tap(200);assert.equal(run('dashCooldown'),0);tap(300);assert.equal(run('dashCooldown'),28);assert.equal(run('open(player.x,player.y)'),true);
});
module.exports={setup};
