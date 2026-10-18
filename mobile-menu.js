/* Responsive menu presentation only; gameplay and saved progression stay independent. */
(()=>{
 const $=s=>document.querySelector(s),query=matchMedia('(max-width:800px), (max-height:600px) and (orientation:landscape)'),dialog=$('#mobile-menu-settings');
 function render(){
  const p=Progression.view(),c=Progression.companion(),wish=globalThis.LumiCollection?.view(p);
  $('#mobile-companion-label').textContent='Avec '+c.name;
  const goal=$('#mobile-collection-goal');goal.dataset.complete=String(!wish);
  $('#mobile-goal-art').src=wish?.target.art||c.art;$('#mobile-goal-name').textContent=wish?.target.name||'Refuge au complet';
  $('#mobile-goal-fill').style.width=(wish?.percent??100)+'%';
  $('#mobile-goal-amount').textContent=wish?(wish.missing?'Encore '+wish.missing.toLocaleString('fr-FR')+' Éclats':'Prêt à débloquer'):'Tous tes compagnons sont réunis';
  goal.setAttribute('aria-label',wish?'Objectif '+wish.target.name+' : '+$('#mobile-goal-amount').textContent:'Voir mes compagnons');
  const count=p.missions.filter(m=>m.count>=m.goal&&!m.claimed).length,badge=$('#mobile-daily-count');badge.hidden=!count;badge.textContent=count;
  $('#mobile-menu-sound').textContent=$('#sound').textContent;$('#mobile-menu-sound').setAttribute('aria-label',$('#sound').getAttribute('aria-label'));
 }
 function sync(){const active=query.matches&&!['splash','game'].includes(currentView);document.body.classList.toggle('mobile-shell',active);document.querySelectorAll('[data-mobile-view]').forEach(b=>{if(b.dataset.mobileView===currentView)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});if(!active&&dialog.open)dialog.close()}
 const closeThen=fn=>()=>{dialog.close();fn()};
 $('#mobile-menu-settings-open').onclick=()=>{render();dialog.showModal()};$('#mobile-menu-settings-close').onclick=()=>dialog.close();
 $('#mobile-menu-sound').onclick=()=>{$('#sound').click();render()};
 $('#mobile-menu-controller').onclick=closeThen(()=>$('#controller-status').click());
 $('#mobile-menu-touch').onclick=closeThen(()=>openTouchSettings());
 $('#mobile-menu-help').onclick=closeThen(()=>showView('help'));
 $('#mobile-collection-goal').onclick=()=>showView('characters');
 document.querySelectorAll('[data-mobile-view]').forEach(b=>b.onclick=()=>showView(b.dataset.mobileView));
 query.addEventListener('change',sync);new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-view']});
 Progression.subscribe(()=>{if(currentView==='menu')render()});window.LumiMobileMenu={render};render();sync();
})();
