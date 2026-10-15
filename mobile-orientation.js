/* Orientation is a separate simulation lock, never a manual pause or a new run. */
class LumiOrientationGate {
 constructor(){this.blocked=false}
 update(active,mobile,width,height){const next=active&&mobile&&height>width,changed=next!==this.blocked;this.blocked=next;return changed}
}
if(typeof module!=='undefined')module.exports=LumiOrientationGate;
else (()=>{
 const gate=new LumiOrientationGate(),screen=document.querySelector('#rotation-screen'),app=document.querySelector('#app');
 const mobile=()=>matchMedia('(max-width:800px), (pointer:coarse), (max-height:600px) and (orientation:landscape)').matches;
 function sync(){const width=window.visualViewport?.width||innerWidth,height=window.visualViewport?.height||innerHeight;
  const changed=gate.update(document.body.dataset.view==='game',mobile(),width,height);
  screen.hidden=!gate.blocked;app.inert=gate.blocked;document.body.classList.toggle('rotation-required',gate.blocked);
  if(changed){globalThis.LumiTouchControls?.reset();window.dispatchEvent(new Event('lumi-orientation-gate'))}
 }
 window.LumiMobileSession={isMobile:mobile,isBlocked(){sync();return gate.blocked}};
 for(const event of ['resize','orientationchange','pageshow'])window.addEventListener(event,sync);window.visualViewport?.addEventListener('resize',sync);
 for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,sync);
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-view']});
 for(let i=0;i<18;i++){const fly=document.createElement('i');fly.className='rotation-firefly';fly.style.cssText=`left:${5+(i*37)%90}%;top:${8+(i*23)%81}%;animation-delay:${-i*.37}s;opacity:${.3+(i%4)*.18}`;screen.append(fly)}
 sync();
})();
