/* Geometry and DOM layout only: no game state, level, score or storage changes. */
class LumiViewportLayout {
 static calculate(width,height,{mobile=true,ratio=630/690,joystick=false}={}){
  const landscape=width>=height,header=mobile?0:48,sceneHeight=Math.max(1,height-header),rail=mobile?96:128,gap=8;
  const rightRail=mobile&&joystick&&landscape?64:0;
  const availableWidth=landscape?Math.max(1,width-rail-gap-rightRail-(rightRail?gap:0)):width;
  const availableHeight=landscape?sceneHeight:Math.max(1,sceneHeight-106);
  const boardWidth=Math.min(availableWidth,availableHeight*ratio),boardHeight=boardWidth/ratio;
  return {landscape,header,sceneHeight,rail,rightRail,gap,boardWidth,boardHeight,availableWidth,availableHeight};
 }
}
if(typeof module!=='undefined')module.exports=LumiViewportLayout;
else (()=>{
 const body=document.body,view=document.querySelector('#game-view'),pauseButton=document.querySelector('#pause'),pauseHome=pauseButton.parentElement,pauseNext=pauseButton.nextSibling,hint=document.querySelector('.mobile-touch-hint');let queued=false;
 if(hint)view.append(hint);
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;const active=body.dataset.view==='game';body.classList.toggle('lumi-fit',active);document.documentElement.classList.toggle('lumi-fit-root',active);if(!active){if(pauseButton.parentElement!==pauseHome)pauseHome.insertBefore(pauseButton,pauseNext);return}
  const mobile=matchMedia('(max-width:800px), (pointer:coarse), (max-height:600px) and (orientation:landscape)').matches;
  const style=getComputedStyle(body),top=parseFloat(style.paddingTop)||0,bottom=parseFloat(style.paddingBottom)||0,left=parseFloat(style.paddingLeft)||0,right=parseFloat(style.paddingRight)||0;
  const width=(window.visualViewport?.width||document.documentElement.clientWidth)-left-right,height=(window.visualViewport?.height||window.innerHeight)-top-bottom;
  const layout=LumiViewportLayout.calculate(width,height,{mobile,ratio:canvas.width/canvas.height,joystick:true});
  view.dataset.layout=layout.landscape?'landscape':'portrait';view.dataset.device=mobile?'mobile':'desktop';body.style.setProperty('--layout-height',(height+top+bottom)+'px');
  for(const [key,value] of Object.entries({width:layout.boardWidth,height:layout.boardHeight,rail:layout.rail,scene:layout.sceneHeight,header:layout.header}))view.style.setProperty('--layout-'+key,value+'px');
  if(pauseButton.parentElement!==document.querySelector('.game-heading'))document.querySelector('.game-heading').append(pauseButton);
 })}
 window.addEventListener('lumi-board-resize',schedule);window.addEventListener('resize',schedule);window.addEventListener('orientationchange',schedule);window.visualViewport?.addEventListener('resize',schedule);for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,schedule);new MutationObserver(schedule).observe(body,{attributes:true,attributeFilter:['data-view']});schedule();
})();
