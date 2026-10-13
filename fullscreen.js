/* Fullscreen is requested only by a user click; enlarged mode is a fallback. */
class LumiFullscreen {
 constructor(doc,root,{onChange=()=>{},onError=()=>{}}={}){Object.assign(this,{doc,root,onChange,onError});this.enlarged=false;this.busy=false;this.wasNative=false}
 native(){return !!(this.doc.fullscreenElement||this.doc.webkitFullscreenElement)}
 sync(){const native=this.native();if(this.wasNative&&!native)this.enlarged=false;this.wasNative=native;this.onChange({active:native||this.enlarged,native,enlarged:this.enlarged})}
 async toggle(){if(this.busy)return;this.busy=true;try{if(this.native()){const exit=this.doc.exitFullscreen||this.doc.webkitExitFullscreen;await exit.call(this.doc)}else if(this.enlarged){this.enlarged=false}else{const enter=this.root.requestFullscreen||this.root.webkitRequestFullscreen;if(!enter||this.doc.fullscreenEnabled===false){this.enlarged=true;this.onError()}else{try{await enter.call(this.root)}catch{this.enlarged=true;this.onError()}}}}finally{this.busy=false;this.sync()}}
}
if(typeof module!=='undefined')module.exports=LumiFullscreen;
else (()=>{
 const buttons=[...document.querySelectorAll('[data-fullscreen]')];let scheduled=false;
 const mode=new LumiFullscreen(document,document.documentElement,{onChange:({active,native})=>{document.body.classList.toggle('immersive',active);buttons.forEach(b=>{b.textContent=active?'⛶ SORTIR':'⛶';b.setAttribute('aria-label',active?'Quitter '+(native?'le plein écran':'le mode agrandi'):'Passer en plein écran');b.setAttribute('aria-pressed',String(active))});fit()},onError:()=>toast('Mode agrandi activé · le navigateur ne permet pas le plein écran ici.')});
 function height(el){return el&&el.getClientRects().length?el.getBoundingClientRect().height:0}
 function fit(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;const mobile=document.body.dataset.view==='game'&&matchMedia('(max-width: 800px), (pointer: coarse), (max-height: 600px) and (orientation: landscape)').matches;document.body.classList.toggle('mobile-game',mobile);document.documentElement.classList.toggle('game-locked',mobile);document.body.style.setProperty('--play-height',(window.visualViewport?.height||window.innerHeight)+'px');if(!(document.body.classList.contains('immersive')||mobile)||document.body.dataset.view!=='game'){document.body.style.removeProperty('--fit-board');return}
  const machine=document.querySelector('.machine'),main=document.querySelector('main'),style=getComputedStyle(machine),landscape=matchMedia('(max-height: 600px) and (orientation: landscape)').matches;
  const viewport=window.visualViewport?.height||window.innerHeight,header=height(document.querySelector('header')),heading=height(document.querySelector('.game-heading'));
  const controls=height(document.querySelector('.machine-bottom'))+(landscape?0:height(document.querySelector('#dash'))+height(document.querySelector('.touchpad'))+24);
  const padding=parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)+4;
  const bodyStyle=getComputedStyle(document.body),safePadding=parseFloat(bodyStyle.paddingTop)+parseFloat(bodyStyle.paddingBottom);const availableHeight=viewport-safePadding-header-heading-height(document.querySelector('.scoreboard'))-controls-padding-28;
  const availableWidth=main.clientWidth-32-(landscape?130:0)-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-4;
  const board=Math.max(100,Math.min(630,availableWidth,availableHeight*630/690));document.body.style.setProperty('--fit-board',Math.floor(board)+'px');
 })}
 buttons.forEach(b=>b.onclick=()=>mode.toggle());for(const e of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(e,()=>mode.sync());window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);new MutationObserver(fit).observe(document.body,{attributes:true,attributeFilter:['data-view']});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(mode.native()||mode.enlarged)){e.stopImmediatePropagation();if(mode.enlarged){mode.enlarged=false;mode.sync()}}},true);mode.sync();
})();
