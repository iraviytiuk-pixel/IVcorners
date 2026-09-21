import { palettes, renderPlan, roomArea, validateRoom, artSvg } from './src/geometry.js';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const defaultRoom={name:'My living room',width:16,depth:13,shape:'rectangle'};
let room={...defaultRoom}, palette=0, alternate=false, artIndex=0, artWidth=24, activeView='look', timer=null, uploadedArt=null, artAspect=3/4;
const views=['look','plan','palette','art'];
const titles=['A softer kind of living.','Room for your everyday.','The things you’re drawn to.','A little more character.'];
const notes=['“A room for slow mornings.<br>And a little more you.”','“Start with how you move.<br>Then make room to stay.”','“Warm wood. Soft linen.<br>A conversation in texture.”','“That piece you love?<br>There’s a place for it here.”'];
const img=(material,extra='')=>`<img src="/assets/${material[0]}.jpg" alt="${material[1]} material sample" ${extra}>`;
function updatePalette(index){
 palette=index;const p=palettes[index];$('#inspector-title').textContent=p.name;
 $('#inspector-materials').innerHTML=p.materials.slice(0,4).map(m=>`<div>${img(m)}<span>${m[1]}</span></div>`).join('');
 $('#screen-materials').innerHTML=p.materials.slice(0,4).map(m=>img(m)).join('');
 $$('.palette-switch').forEach(b=>{const active=+b.dataset.palette===index;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
 $$('.studio-palette').forEach(b=>{const active=+b.dataset.palette===index;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
 $('#studio-look-materials').innerHTML=p.materials.slice(0,4).map(m=>`<figure>${img(m)}<figcaption>${m[1]}</figcaption></figure>`).join('');
 updatePlans();
}
function updatePlans(){
 $('#hero-plan').innerHTML=renderPlan(defaultRoom,{palette,alternate});
 $('#mini-plan').innerHTML=renderPlan(defaultRoom,{palette,alternate,compact:true});
 $('#story-plan').innerHTML=renderPlan(defaultRoom,{palette,alternate,compact:true});
 $('#studio-plan').innerHTML=renderPlan(room,{palette,alternate});
 $('#room-area').textContent=`${Math.round(roomArea(room))} SQ FT / CONCEPT LAYOUT`;
 $('#studio-room-title').textContent=room.name;
 $('#studio-rationale').textContent=alternate?'A new angle on the everyday.':'Room to gather. Space to breathe.';
}
function stopStory(){clearInterval(timer);timer=null;$('#demo-play').innerHTML='<span class="play-icon">▷</span> Play the story';$('#demo-play').setAttribute('aria-label','Play the design walkthrough')}
function switchView(view,manual=false){
 if(manual)stopStory();activeView=view;const index=views.indexOf(view);
 $$('.rail-button').forEach(b=>{const active=b.dataset.view===view;b.classList.toggle('active',active);b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1});
 $$('.demo-panel').forEach(p=>p.hidden=p.id!==`panel-${view}`);
 $('#screen-title').textContent=titles[index];$('.screen-count').textContent=`0${index+1} / 04`;$('#demo-note').innerHTML=notes[index];
}
function updateMood(index){
 $('#physical-swatches').innerHTML=palettes[index].materials.map(m=>img(m,'class="physical-swatch" loading="lazy"')).join('');
 $('#board-description').textContent=palettes[index].description;$('#board-number').textContent=`Nº 00${index+1}`;$('#mood-board').setAttribute('aria-labelledby',`mood-${index}`);
 $$('.mood-tabs button').forEach(b=>{const active=+b.dataset.mood===index;b.classList.toggle('active',active);b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1});
 $('#use-palette').dataset.palette=index;
}
function updateArt(){
 $('#hero-art').innerHTML=artSvg(artIndex);const frame=$('#studio-art-frame');
 frame.style.width=`${artWidth/144*100}%`;frame.style.aspectRatio=String(artAspect);
 frame.replaceChildren();if(uploadedArt){const image=document.createElement('img');image.src=uploadedArt;image.alt='Your uploaded artwork';frame.append(image)}else frame.innerHTML=artSvg(artIndex);
 $('#art-size-value').textContent=`${artWidth} in`;$('#studio-art-dimension').textContent=`${artWidth} × ${Math.round(artWidth/artAspect)} in`;
}
function feedback(message){$('#studio-feedback').textContent=message}
function openStudio(){stopStory();window.location.assign('/studio.html')}
function closeStudio(){$('#studio-dialog').close()}
function switchStudioView(view){
 $$('[data-studio-view]').forEach(b=>{const active=b.dataset.studioView===view;b.classList.toggle('active',active);b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1});
 $$('.studio-view').forEach(p=>p.hidden=p.id!==`studio-${view}-view`);
}
$('#studio-palettes').innerHTML=palettes.map((p,i)=>`<button type="button" class="studio-palette ${i===0?'active':''}" data-palette="${i}" aria-pressed="${i===0}">${img(p.materials[0])}${p.short}</button>`).join('');
try{const saved=JSON.parse(localStorage.getItem('iv-corners-room'));if(saved?.version===1){validateRoom(saved.room);room={...saved.room,name:String(saved.room.name||'My living room').slice(0,40)};palette=Number.isInteger(saved.palette)&&saved.palette>=0&&saved.palette<palettes.length?saved.palette:0;alternate=Boolean(saved.alternate);artWidth=Number.isFinite(saved.artWidth)&&saved.artWidth>=12&&saved.artWidth<=48?saved.artWidth:24;artIndex=Number.isInteger(saved.artIndex)&&saved.artIndex>=0&&saved.artIndex<3?saved.artIndex:0;$('#room-name').value=room.name;$('#room-width').value=room.width;$('#room-depth').value=room.depth;$('#room-shape').value=room.shape;$('#art-size').value=artWidth;feedback('Your last saved room is ready.')}}catch{}
updatePalette(palette);updateMood(palette);updateArt();$('#year').textContent=new Date().getFullYear();
$$('[data-open-studio]').forEach(b=>b.addEventListener('click',openStudio));$('#close-studio').addEventListener('click',closeStudio);$('#studio-home').addEventListener('click',e=>{e.preventDefault();closeStudio()});
$$('.rail-button').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view,true)));
$$('[data-palette]').forEach(b=>b.addEventListener('click',()=>{stopStory();updatePalette(+b.dataset.palette);if(b.classList.contains('palette-switch'))switchView('palette')}));
$$('[data-mood]').forEach(b=>b.addEventListener('click',()=>updateMood(+b.dataset.mood)));
$('#use-palette').addEventListener('click',()=>{updatePalette(+$('#use-palette').dataset.palette);openStudio();switchStudioView('look')});
$$('[data-studio-view]').forEach(b=>b.addEventListener('click',()=>switchStudioView(b.dataset.studioView)));
$('#hero-alternate').addEventListener('click',()=>{stopStory();alternate=!alternate;updatePlans()});$('#alternate-layout').addEventListener('click',()=>{alternate=!alternate;updatePlans();feedback('Another sample arrangement. Confirm furniture dimensions and clearances before purchasing.')});
$('#hero-art-next').addEventListener('click',()=>{stopStory();artIndex=(artIndex+1)%3;updateArt()});
$('#change-art').addEventListener('click',()=>{artIndex=(artIndex+1)%3;if(uploadedArt)URL.revokeObjectURL(uploadedArt);uploadedArt=null;artAspect=3/4;$('#art-upload').value='';updateArt()});
$('#art-size').addEventListener('input',e=>{artWidth=Number(e.target.value);updateArt()});
$('#art-upload').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){feedback('Choose a JPG, PNG, or WebP under 10 MB.');e.target.value='';return}
 const url=URL.createObjectURL(file),picture=new Image();picture.src=url;
 try{await picture.decode();if(uploadedArt)URL.revokeObjectURL(uploadedArt);uploadedArt=url;artAspect=picture.naturalWidth/picture.naturalHeight;updateArt();feedback('Your artwork is here. It stays in this browser session.')}catch{URL.revokeObjectURL(url);feedback('That image could not be opened. Please try a different file.')}
});
$('#room-form').addEventListener('submit',e=>{e.preventDefault();try{room=validateRoom({name:$('#room-name').value.trim()||'My living room',width:Number($('#room-width').value),depth:Number($('#room-depth').value),shape:$('#room-shape').value});updatePlans();switchStudioView('plan');feedback('Your room dimensions are updated. This is a conceptual arrangement.');if(innerWidth<=760)$('.studio-result').scrollIntoView({behavior:motionQuery.matches?'instant':'smooth',block:'start'})}catch(err){feedback(err.message)}});
$('#save-room').addEventListener('click',()=>{try{localStorage.setItem('iv-corners-room',JSON.stringify({version:1,room,palette,alternate,artWidth,artIndex}));feedback('Room saved on this device. Uploaded artwork is not stored.')}catch{feedback('Your browser could not save this room. You can still download your floor plan.')}});
$('#download-plan').addEventListener('click',()=>{const svg=renderPlan(room,{palette,alternate}),blob=new Blob([svg],{type:'image/svg+xml'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='iv-corners-room-plan.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);feedback('Floor plan downloaded. Dimensions are in feet; furniture is illustrative.')});
$$('[data-select-item]').forEach(b=>b.addEventListener('click',()=>{stopStory();const note=$('#item-note');note.hidden=false;note.innerHTML=b.dataset.selectItem==='sofa'?'<strong>A softer place to land.</strong>Linen upholstery, a low profile, and room to put your feet up. Concept inspiration.':'<strong>A little natural character.</strong>Soft edges and a stone finish. A material direction, not a product listing.'}));
$('#demo-play').addEventListener('click',()=>{if(timer){stopStory();return}switchView(views[(views.indexOf(activeView)+1)%4]);$('#demo-play').innerHTML='<span class="play-icon">Ⅱ</span> Pause the story';$('#demo-play').setAttribute('aria-label','Pause the design walkthrough');timer=setInterval(()=>switchView(views[(views.indexOf(activeView)+1)%4]),4500)});
$$('[data-step]').forEach(b=>b.addEventListener('click',()=>{$$('[data-step]').forEach(el=>el.classList.toggle('active',el===b));openStudio();switchStudioView(['plan','look','art'][+b.dataset.step])}));
$('#about-preview').addEventListener('click',()=>$('#about-dialog').showModal());$('#close-about').addEventListener('click',()=>$('#about-dialog').close());$('#about-to-studio').addEventListener('click',()=>{$('#about-dialog').close();openStudio()});
// Native dialogs provide Escape dismissal and focus restoration.
// Keep Tab cycling within visible controls, including at the browser chrome boundary.
for(const dialog of $$("dialog")) dialog.addEventListener("keydown", e => {
 if(e.key !== "Tab") return;
 const controls = $$("a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex=\"0\"]",dialog).filter(el => el.getClientRects().length && el.tabIndex >= 0);
 const first=controls[0], last=controls.at(-1);
 if(e.shiftKey && document.activeElement===first){e.preventDefault();last?.focus()}
 else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus()}
});
for(const dialog of $$('dialog'))dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
// Arrow key behavior for all tab lists, including the vertical monitor rail.
$$('[role=tablist]').forEach(list=>list.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;const tabs=$$('[role=tab]',list),index=tabs.indexOf(document.activeElement);if(index<0)return;e.preventDefault();let next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+tabs.length)%tabs.length;tabs[next].click();tabs[next].focus()}));
// Progressive reveal is enabled only after all the working controls are wired.
if(!motionQuery.matches){document.documentElement.classList.add('js-motion');const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.08});$$('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${i%3*65}ms`;revealObserver.observe(el)})}
let ticking=false;function moveScreen(){if(ticking||motionQuery.matches||innerWidth<761)return;ticking=true;requestAnimationFrame(()=>{const progress=Math.min(1,scrollY/650);$('#monitor-wrap').style.transform=`rotateY(${-7+progress*7}deg) rotateX(${2-progress*2}deg) translateY(${-progress*16}px)`;ticking=false})}addEventListener('scroll',moveScreen,{passive:true});
motionQuery.addEventListener('change',()=>{if(motionQuery.matches){stopStory();document.documentElement.classList.remove('js-motion');$('#monitor-wrap').style.transform='none'}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopStory()});
new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stopStory()},{threshold:.1}).observe($('#screen-app'));
