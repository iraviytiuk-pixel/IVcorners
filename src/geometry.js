export const palettes = [
 { name:'Warm & grounded', short:'Warm', edit:'The warm edit', description:'Walnut. Travertine. Linen. A little warmth goes a long way.', color:'#a59179', accent:'#79553d', materials:[['walnut','Walnut'],['travertine','Travertine'],['linen','Linen'],['boucle','Bouclé'],['brass','Aged brass']] },
 { name:'Quiet & natural', short:'Quiet', edit:'The quiet edit', description:'Plaster. Linen. Soft stone. A quieter kind of beautiful.', color:'#b3b3a0', accent:'#797e65', materials:[['plaster','Plaster'],['linen','Linen'],['travertine','Travertine'],['boucle','Bouclé'],['terrazzo','Terrazzo']] },
 { name:'Bold & collected', short:'Bold', edit:'The bold edit', description:'Rosso marble. Walnut. Leather. A room with something to say.', color:'#a57270', accent:'#702c32', materials:[['marble_red','Rosso marble'],['walnut','Walnut'],['leather','Leather'],['marble_dk','Dark marble'],['brass','Aged brass']] }
];
export function validateRoom(room){
 if(!Number.isFinite(room.width)||!Number.isFinite(room.depth)||room.width<10||room.width>30||room.depth<10||room.depth>30)throw new Error('Please enter room dimensions between 10 and 30 feet.');
 if(!['rectangle','l-shape'].includes(room.shape))throw new Error('Choose a supported room shape.');
 return room;
}
export function roomPolygon(room){validateRoom(room);const {width:w,depth:d}=room;return room.shape==='l-shape'?[[0,0],[w*.68,0],[w*.68,d*.3],[w,d*.3],[w,d],[0,d]]:[[0,0],[w,0],[w,d],[0,d]];}
export function roomArea(room){const p=roomPolygon(room);return Math.abs(p.reduce((n,[x,y],i)=>{const q=p[(i+1)%p.length];return n+x*q[1]-q[0]*y},0)/2);}
export function pointInside([x,y],poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))inside=!inside;}return inside;}
export function layoutItems(room,alternate=false){
 validateRoom(room);const {width:w,depth:d}=room;const cy=room.shape==='l-shape'?d*.66:d*.56;
 const sofaW=Math.min(7,w*.52),sofaD=2.6,tableW=Math.min(3.5,w*.24),tableD=1.8;
 const items=[{kind:'sofa',x:w*.5-sofaW/2,y:d-3.05,w:sofaW,d:sofaD},{kind:'table',x:w*.5-tableW/2,y:Math.min(cy-.4,d-5.1),w:tableW,d:tableD},{kind:'chair',x:alternate?w-2.7:.55,y:Math.max(d*.34,cy-1.8),w:2.1,d:2.2},{kind:'console',x:w*.34-2.5,y:.4,w:5,d:1.05}];
 return items.filter(o=>[[o.x,o.y],[o.x+o.w,o.y],[o.x,o.y+o.d],[o.x+o.w,o.y+o.d]].every(p=>pointInside(p,roomPolygon(room))));
}
function feetLabel(value){const feet=Math.floor(value);return `${feet}′–${Math.round((value-feet)*12)}″`;}
function escapeXml(text){return String(text).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));}
export function renderPlan(room={width:16,depth:13,shape:'rectangle'},options={}){
 validateRoom(room);const{alternate=false,palette=0,compact=false}=options;const p=palettes[palette]||palettes[0];const w=room.width,d=room.depth;const scale=Math.min(400/w,300/d),ox=(520-w*scale)/2,oy=(400-d*scale)/2;
 const points=roomPolygon(room).map(([x,y])=>`${x*scale+ox},${y*scale+oy}`).join(' ');
 const items=layoutItems(room,alternate);const n=(v)=>Number(v.toFixed(2));let furn='';
 for(const item of items){const x=n(ox+item.x*scale),y=n(oy+item.y*scale),fw=n(item.w*scale),fd=n(item.d*scale);let content='';
 if(item.kind==='sofa'){content=`<rect width="${fw}" height="${fd}" rx="3" fill="${p.color}" stroke="${p.accent}"/><path d="M6 0v${fd-6}h${fw-12}V0M${fw/3} 0v${fd-6}m${fw/3} 0V0" fill="none" stroke="${p.accent}" stroke-width=".8"/>`;}
 else if(item.kind==='table'){content=`<rect width="${fw}" height="${fd}" rx="${fd/2}" fill="#e4d6c4" stroke="${p.accent}"/><circle cx="${fw*.6}" cy="${fd*.5}" r="${scale*.22}" fill="${p.accent}" opacity=".5"/>`;}
 else if(item.kind==='chair'){content=`<rect width="${fw}" height="${fd}" rx="5" fill="${p.color}" stroke="${p.accent}"/><rect x="5" y="5" width="${fw-10}" height="${fd-10}" rx="3" fill="#ede5d8" stroke="${p.accent}" stroke-width=".7"/>`;}
 else{content=`<rect width="${fw}" height="${fd}" fill="${p.accent}" fill-opacity=".65" stroke="${p.accent}"/><path d="M${fw/3} 0v${fd}m${fw/3} 0V0" stroke="#f5f1e9" stroke-width=".6"/>`;}
 furn+=`<g transform="translate(${x},${y})">${content}</g>`;
 }
 const rugW=Math.min(w*.66,10)*scale,rugD=Math.min(d*.53,7)*scale;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 400" role="img" aria-label="${escapeXml(room.name||'Living room')} concept floor plan, ${w} by ${d} feet"><title>${escapeXml(room.name||'Living room')} — conceptual layout</title><rect width="520" height="400" fill="#f3eee5"/><polygon points="${points}" fill="#f8f4ed" stroke="#51463c" stroke-width="6" stroke-linejoin="miter"/><rect x="${n(ox+(w*scale-rugW)/2)}" y="${n(oy+d*scale-rugD-scale*.7)}" width="${n(rugW)}" height="${n(rugD)}" fill="${p.color}" fill-opacity=".14" stroke="${p.color}" stroke-width=".8"/>${furn}<g stroke="#74675a" fill="none" stroke-width=".7"><path d="M${ox} ${oy-19}H${ox+w*scale}M${ox} ${oy-25}v12M${ox+w*scale} ${oy-25}v12"/><path d="M${ox-21} ${oy}v${d*scale}M${ox-27} ${oy}h12M${ox-27} ${oy+d*scale}h12"/></g><g fill="#74675a" font-family="Arial,sans-serif" font-size="10" text-anchor="middle"><text x="260" y="${oy-27}">${feetLabel(w)}</text><text transform="translate(${ox-29} 200) rotate(-90)">${feetLabel(d)}</text>${compact?'':`<text x="260" y="${oy+d*scale+24}" letter-spacing="2" font-size="8">${escapeXml(room.name||'LIVING ROOM').toUpperCase()} / ${Math.round(roomArea(room))} SQ FT</text>`}</g><g stroke="#702c32" stroke-width="1" fill="none"><path d="M${ox+w*scale-2.7*scale} ${oy+d*scale}h${2.3*scale}" stroke="#f3eee5" stroke-width="8"/><path d="M${ox+w*scale-.4*scale} ${oy+d*scale}v${-2.3*scale}a${2.3*scale} ${2.3*scale} 0 0 0 ${-2.3*scale} ${2.3*scale}"/></g><text x="500" y="385" text-anchor="end" fill="#948778" font-family="Arial,sans-serif" font-size="7">IV CORNERS · CONCEPT STUDY</text></svg>`;
}
export function artSvg(index=0){
 const art=[`<rect width="240" height="320" fill="#e7dac6"/><path d="M38 258V118a82 82 0 0 1 164 0v140Z" fill="#8d4b3d"/><path d="M76 258V127a44 44 0 0 1 88 0v131Z" fill="#d9c5a4"/><circle cx="120" cy="130" r="31" fill="#69452f"/><path d="M35 279h171" stroke="#735740"/>`,`<rect width="240" height="320" fill="#ebe6d8"/><path d="M32 54h95v141H32z" fill="#73765c"/><path d="M103 127h104v150H103z" fill="#b2a387"/><circle cx="147" cy="98" r="48" fill="#373a2f"/><path d="M25 240Q80 170 211 218" fill="none" stroke="#f7f3e9" stroke-width="9"/>`,`<rect width="240" height="320" fill="#eadcc5"/><path d="M0 210 135 37l105 100v183H0Z" fill="#843b3d"/><circle cx="150" cy="105" r="43" fill="#cea15c"/><path d="m0 276 114-152 126 196H0" fill="#342b25"/><path d="M25 298 151 65" stroke="#e7cdb1" stroke-width="3"/>`];
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 320" role="img" aria-label="Abstract art composition ${index+1}">${art[index%art.length]}</svg>`;
}
