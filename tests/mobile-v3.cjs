const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),crypto=require('node:crypto');
const Board=require('../level-one-mobile.js'),Gate=require('../mobile-orientation.js'),Layout=require('../viewport-layout.js');
const {setup}=require('./fixtures/game-environment.cjs');

test('mobile level 1 repeats deterministically; all 295 paths and 248 pickups reachable',()=>{
 const first=Board.create();for(let n=0;n<20;n++)assert.deepEqual(Board.create(),first);
 const seen=new Set(),queue=[first.player];for(let i=0;i<queue.length;i++){const {x,y}=queue[i],k=x+','+y;if(seen.has(k))continue;seen.add(k);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(first.map[y+dy]?.[x+dx]&&first.map[y+dy][x+dx]!=='#')queue.push({x:x+dx,y:y+dy})}
 assert.equal(seen.size,295);assert.equal(first.width,33);assert.equal(first.height,17);assert.equal(first.collectibles.length,248);assert.equal(first.collectibles.filter(p=>p.value===3).length,4);assert.equal(new Set(first.collectibles.map(p=>p.x+','+p.y)).size,248);
 for(const p of [...first.collectibles,...first.enemies,first.home])assert.ok(seen.has(p.x+','+p.y));
});
test('desktop levels 2–30 remain identical to the pre-V3 maps',()=>{
 const {run}=setup(false),maps=[];for(let n=2;n<=30;n++){run(`level=${n};board()`);assert.equal(run('JSON.stringify(map)===JSON.stringify(forest(level))'),true);assert.equal(run('canvas.width'),630);assert.equal(run('canvas.height'),690);maps.push(run('map.join("\\n")'))}assert.equal(crypto.createHash('sha256').update(maps.join('\n---\n')).digest('hex'),'e83251f32e9da8f6f7a603b094f9b5b25c180a2d3a05addb03961a26b449b130')
});
test('200 mobile levels are connected, deterministic, distinct and preserve each classic pickup count',()=>{
 const {run}=setup(true),hashes=new Set();for(let n=1;n<=200;n++){
  run(`level=${n};board()`);assert.equal(run('canvas.width'),990);assert.equal(run('canvas.height'),510);
  assert.equal(run(`pellets.size===forest(level).join('').split('').filter(c=>c!=='#').length-1`),true);assert.equal(run(`[...pellets.values()].filter(v=>v===3).length`),4);
  assert.equal(run(`JSON.stringify(map)===JSON.stringify(LumiLevelOneMobile.create({level,normalCount:forest(level).join('').split('').filter(c=>c==='.').length-1}).map)`),true);
  run(`{const seen=new Set(),q=[player];for(let i=0;i<q.length;i++){const {x,y}=q[i],key=x+','+y;if(seen.has(key))continue;seen.add(key);for(const [dx,dy] of Object.values(dirs))if(open(x+dx,y+dy))q.push({x:x+dx,y:y+dy})}if(seen.size!==map.join('').split('').filter(c=>c!=='#').length)throw Error('disconnected '+level);for(const key of pellets.keys())if(!seen.has(key))throw Error('unreachable pickup');for(const p of [...enemies,levelLayout.home])if(!seen.has(p.x+','+p.y))throw Error('invalid spawn')}`);
  hashes.add(run('map.join("")'));
 }assert.equal(hashes.size,200);
});
test('orientation freezes simulation and every gameplay input, preserving manual pause',()=>{
 const {run,sandbox}=setup();run('last=500;acc=100');const before=run('JSON.stringify({player,enemies,score,lives,pellets:[...pellets],dashCooldown,power,tick})');sandbox.blocked=true;
 run('step();move("up");dash();pause();start();loop(10000)');assert.equal(run('JSON.stringify({player,enemies,score,lives,pellets:[...pellets],dashCooldown,power,tick})'),before);assert.equal(run('acc'),0);
 sandbox.blocked=false;run('pause()');assert.equal(run('state'),'paused');sandbox.blocked=true;run('loop(20000);pause();start()');sandbox.blocked=false;run('loop(30000)');assert.equal(run('state'),'paused');assert.equal(run('score'),0);
});
test('starting in portrait prepares the V3 run without advancing it',()=>{const {run,sandbox}=setup();run('state="menu"');sandbox.blocked=true;run('start();loop(40000)');assert.equal(run('state'),'playing');assert.equal(run('canvas.width'),990);assert.equal(run('tick'),0);assert.equal(run('score'),0)});
test('orientation gate distinguishes portrait, landscape, menus and desktop',()=>{const g=new Gate();g.update(true,true,390,844);assert.equal(g.blocked,true);g.update(true,true,844,390);assert.equal(g.blocked,false);g.update(false,true,390,844);assert.equal(g.blocked,false);g.update(true,false,390,844);assert.equal(g.blocked,false)});
test('V3 landscape fit reserves both thumb zones and keeps square cells',()=>{for(const [w,h] of [[844,390],[915,412]]){const l=Layout.calculate(w,h,{mobile:true,ratio:33/17,joystick:true});assert.equal(l.rightRail,64);assert.ok(l.boardWidth<=w-176+1e-8);assert.ok(l.boardHeight<=h+1e-8);assert.ok(Math.abs(l.boardWidth/33-l.boardHeight/17)<1e-8);assert.ok(Math.abs(l.boardWidth-l.availableWidth)<1e-8||Math.abs(l.boardHeight-l.availableHeight)<1e-8)}});
test('mobile collisions, powered enemy return, walls and dash use valid adapted cells',()=>{const {run}=setup();run('player.x=enemies[0].x;player.y=enemies[0].y;collision()');assert.equal(run('lives'),2);assert.equal(run('open(player.x,player.y)'),true);run('player.x=enemies[0].x;player.y=enemies[0].y;power=60;collision()');assert.equal(run('score'),75);assert.equal(run('enemies[0].x===levelLayout.home.x&&enemies[0].y===levelLayout.home.y'),true);run('player={x:1,y:1,dir:"left",next:"left"};dash()');assert.equal(run('player.x'),1);assert.equal(run('player.y'),1);assert.equal(run('dashTrail.length'),0)});
test('real level 1 completes with active enemies, unchanged rewards and landscape level 2',()=>{
 const {run}=setup(true,1),bot=require('./fixtures/level-one-bot.cjs'),result=run('('+bot.toString()+')()');
 assert.equal(result.completed,true);assert.equal(result.lives,3);assert.equal(result.coins,49);assert.equal(run('level'),2);assert.equal(run('canvas.width'),990);assert.equal(run('canvas.height'),510);assert.equal(run('JSON.stringify(map)===JSON.stringify(LumiLevelOneMobile.create({level:2,normalCount:forest(2).join(\'\').split(\'\').filter(c=>c===\'.\').length-1}).map)'),true);
});
test('mobile levels 2, 3, 4, 5, 6 and 10 can be completed with active enemies',()=>{
 const bot=require('./fixtures/level-one-bot.cjs');for(const n of [2,3,4,5,6,10]){const {run}=setup(true,1);run(`level=${n};board()`);const expected=run('Math.floor([...pellets.values()].filter(v=>v===1).length/10)+25'),result=run('('+bot.toString()+')()');assert.equal(result.completed,true,'level '+n);assert.equal(run('level'),n+1);assert.equal(run('canvas.width'),990);assert.equal(result.coins,expected);assert.ok(result.lives>0)}
});
test('real touch adapter steers, blocks portrait and clears partial gestures across rotation',()=>{
 const {run,sandbox,emit}=setup();run(fs.readFileSync('touch-controls.js','utf8'));
 emit('#game','pointerdown',{clientX:100,clientY:100});emit('#game','pointermove',{clientX:125,clientY:100});assert.equal(run('player.next'),'right');
 sandbox.blocked=true;run('window.LumiTouchControls.reset()');emit('#game','pointerdown',{clientX:100,clientY:100});emit('#game','pointermove',{clientX:80,clientY:100});assert.equal(run('player.next'),'right');
 sandbox.blocked=false;run('window.LumiTouchControls.reset()');emit('#game','pointerdown',{clientX:100,clientY:100});emit('#game','pointermove',{clientX:80,clientY:100});assert.equal(run('player.next'),'left');emit('#game','pointerup',{clientX:80,clientY:100,timeStamp:1});
 const tap=time=>{emit('#game','pointerdown',{clientX:100,clientY:100});emit('#game','pointerup',{clientX:100,clientY:100,timeStamp:time})};
 tap(100);sandbox.blocked=true;run('window.LumiTouchControls.reset()');sandbox.blocked=false;tap(200);assert.equal(run('dashCooldown'),0);tap(300);assert.equal(run('dashCooldown'),28);assert.equal(run('open(player.x,player.y)'),true);
});
test('fixed joystick supports another finger for Bond, ignores competing steering and resets on rotation',()=>{
 const {run,sandbox,emit}=setup();run(fs.readFileSync('touch-controls.js','utf8'));run(fs.readFileSync('joystick.js','utf8'));sandbox.LumiJoystickControls=sandbox.window.LumiJoystickControls;
 emit('#fixed-joystick','pointerdown',{clientX:70,clientY:44});assert.equal(run('player.next'),'right');
 emit('#fixed-joystick','pointerdown',{pointerId:2,clientX:5,clientY:44});emit('#fixed-joystick','pointermove',{pointerId:2,clientX:5,clientY:44});assert.equal(run('player.next'),'right');
 emit('#mobile-bond','pointerdown',{pointerId:2});assert.equal(run('dashCooldown'),28);assert.equal(run('open(player.x,player.y)'),true);
 sandbox.blocked=true;run('window.LumiTouchControls.reset()');emit('#fixed-joystick','pointermove',{clientX:5,clientY:44});assert.equal(run('player.next'),'right');
 sandbox.blocked=false;emit('#fixed-joystick','pointerdown',{pointerId:3,clientX:5,clientY:44});assert.equal(run('player.next'),'left');emit('#fixed-joystick','pointercancel',{pointerId:3});emit('#fixed-joystick','pointermove',{pointerId:3,clientX:70,clientY:44});assert.equal(run('player.next'),'left');
});
module.exports={setup};
