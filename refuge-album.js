/* Read-only album filters; purchases still go through the existing wallet rules. */
class LumiRefugeAlbum {
 constructor(progression,collection){this.progression=progression;this.collection=collection;this.filter='all'}
 setFilter(value){if(!['all','owned','locked'].includes(value))return false;this.filter=value;return true}
 entries(){const p=this.progression.view();return this.progression.catalog.filter(c=>this.filter==='all'||p.owned.includes(c.id)===(this.filter==='owned')).slice().sort((a,b)=>a.price-b.price)}
 detail(id){const c=this.progression.catalog.find(c=>c.id===id);if(!c)return null;const p=this.progression.view();return {c,owned:p.owned.includes(id),selected:p.selected===id,missing:Math.max(0,c.price-p.coins),goal:this.collection?.view(p)?.target.id===id}}
 acquire(id){return this.progression.select(id)}
 wish(id){return this.collection?.choose(id,this.progression.view())||false}
}
if(typeof module!=='undefined')module.exports=LumiRefugeAlbum;
else (()=>{
 const $=s=>document.querySelector(s),album=new LumiRefugeAlbum(Progression,globalThis.LumiCollection),dialog=$('#refuge-detail'),query=matchMedia('(max-width:800px), (max-height:600px) and (orientation:landscape)');let active=null;
 const number=n=>n.toLocaleString('fr-FR');
 function render(){
  const p=Progression.view(),entries=album.entries();
  document.querySelectorAll('[data-refuge-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.refugeFilter===album.filter)));
  $('#album-count').textContent=p.owned.length+' / '+Progression.catalog.length+' réunis · '+entries.length+' affiché'+(entries.length>1?'s':'');
  $('#album-empty').hidden=entries.length>0;
  $('#album-grid').innerHTML=entries.map(c=>{const d=album.detail(c.id);return '<button class="album-card rarity-'+(c.rarity||'classic')+(d.selected?' selected':'')+'" data-album-companion="'+c.id+'" aria-label="Voir '+c.name+' · '+(d.selected?'Sélectionné':d.owned?'Débloqué':number(c.price)+' Éclats')+'" aria-haspopup="dialog"><span class="rarity-badge">'+(c.rarityLabel||'Compagnon')+'</span><span class="album-portrait"><img src="'+c.art+'" alt="" width="160" height="160" loading="lazy" decoding="async"></span><strong>'+c.name+'</strong><small class="album-cost">'+(d.owned?'✦ DÉBLOQUÉ':'✦ '+number(c.price)+' ÉCLATS')+'</small><small class="album-state">'+(d.selected?'SÉLECTIONNÉ':d.goal?'MON OBJECTIF':'VOIR LA FICHE')+'</small></button>'}).join('');
  document.querySelectorAll('[data-album-companion]').forEach(b=>b.onclick=()=>open(b.dataset.albumCompanion));
  $('#album-goal-detail')?.remove();const wish=globalThis.LumiCollection?.view(p);if(wish){const b=document.createElement('button');b.id='album-goal-detail';b.className='quiet';b.textContent='VOIR';b.setAttribute('aria-label','Voir mon objectif '+wish.target.name);b.onclick=()=>open(wish.target.id);$('#collection-goal').append(b)}
 }
 function detail(){
  const d=album.detail(active);if(!d)return;const {c}=d,power=LumiCompanionBonus.descriptions[c.id];dialog.dataset.rarity=c.rarity||'classic';
  $('#refuge-detail-content').innerHTML='<span class="rarity-badge">'+(c.rarityLabel||'Compagnon')+'</span><img class="refuge-detail-art" src="'+c.art+'" alt="'+c.name+'" width="260" height="260"><h2 id="refuge-detail-title">'+c.name+'</h2>'+(c.home?'<span class="refuge-detail-home">'+c.home+'</span>':'')+'<p>'+c.description+'</p><div class="companion-power"><small>POUVOIR AVENTURE</small><strong>'+power.name+'</strong><span>'+power.description+'</span></div><p class="refuge-classic-note">En Classique, ce compagnon joue sans pouvoir.</p><span class="cost">'+(d.owned?'DÉBLOQUÉ':'✦ '+number(c.price)+' ÉCLATS')+'</span><button id="refuge-detail-buy" class="primary" '+(d.selected||!d.owned&&d.missing?'disabled':'')+'>'+(d.selected?'SÉLECTIONNÉ':d.owned?'CHOISIR':d.missing?'ENCORE '+number(d.missing)+' ÉCLATS':'DÉBLOQUER · '+number(c.price)+' ✦')+'</button>'+(!d.owned?'<button id="refuge-detail-goal" class="quiet" '+(d.goal?'disabled':'')+'>'+(d.goal?'✧ MON OBJECTIF':'EN FAIRE MON OBJECTIF')+'</button>':'');
  $('#refuge-detail-buy').onclick=()=>{const result=album.acquire(active);if(result.ok){renderCharacters();renderWallet();detail();$('#refuge-detail-close').focus();toast(c.name+' rejoint ton aventure !')}else detail()};
  if($('#refuge-detail-goal'))$('#refuge-detail-goal').onclick=()=>{if(album.wish(active)){renderCharacters();detail();$('#refuge-detail-close').focus();toast('Objectif : '+c.name)}};
 }
 function open(id){if(!album.detail(id))return;active=id;detail();dialog.showModal()}
 $('#refuge-detail-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{const button=$('[data-album-companion="'+active+'"]')||$('[data-refuge-filter][aria-pressed="true"]');if(currentView==='characters'&&button?.getClientRects().length)button.focus({preventScroll:true})});
 document.querySelectorAll('[data-refuge-filter]').forEach(b=>b.onclick=()=>{album.setFilter(b.dataset.refugeFilter);render()});
 query.addEventListener('change',()=>{if(!query.matches&&dialog.open)dialog.close()});
 window.LumiRefuge={render};
})();
