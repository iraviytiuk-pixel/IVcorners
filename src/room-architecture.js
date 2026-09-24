import {wallFinishes,finishesFor} from './finishes.js';
import * as THREE from 'three';
import {walls} from './space-model.js';
// Textures are cached for this session; images never leave the user's browser.
const artMaterials=new Map();
function artworkMaterial(data,render){if(!artMaterials.has(data)){const texture=new THREE.TextureLoader().load(data,render);texture.colorSpace=THREE.SRGBColorSpace;artMaterials.set(data,new THREE.MeshStandardMaterial({map:texture,roughness:.9,side:THREE.DoubleSide}));}return artMaterials.get(data);}
export function buildWalls(state,structure,cuboid,mat,render){
 const height=state.room.height||8,wallColor=wallFinishes.find(p=>p.id===finishesFor(state).wall)?.color||['#e2d9c9','#d7d9cc','#d5c4b6'][state.palette];
 for(const wall of walls(state.room)){
  const group=new THREE.Group();group.position.set(wall.a.x,0,wall.a.z);group.rotation.y=-Math.atan2(wall.dz,wall.dx);group.userData.wall=wall;structure.add(group);
  const openings=(state.openings||[]).filter(p=>p.wall===wall.index),cuts=[0,wall.length,...openings.flatMap(p=>[p.offset,p.offset+p.width])].sort((a,b)=>a-b);
  for(let i=1;i<cuts.length;i++){const lo=cuts[i-1],hi=cuts[i];if(hi-lo<.001)continue;const opening=openings.find(p=>(lo+hi)/2>p.offset&&(lo+hi)/2<p.offset+p.width);if(!opening)cuboid(hi-lo,height,.16,wallColor,(lo+hi)/2,height/2,-.08,group);else{if(opening.bottom>0)cuboid(hi-lo,opening.bottom,.16,wallColor,(lo+hi)/2,opening.bottom/2,-.08,group);const top=opening.bottom+opening.height;if(top<height)cuboid(hi-lo,height-top,.16,wallColor,(lo+hi)/2,(height+top)/2,-.08,group);}}
  for(const p of openings){const center=p.offset+p.width/2,b=p.bottom,t=b+p.height,frame='#b29c7c';for(const x of [p.offset,p.offset+p.width])cuboid(.09,p.height,.2,frame,x,(b+t)/2,.005,group);cuboid(p.width,.09,.2,frame,center,t,.005,group);if(p.kind==='window'){cuboid(p.width,.09,.2,frame,center,b,.005,group);const glass=new THREE.Mesh(new THREE.PlaneGeometry(p.width-.08,p.height-.08),new THREE.MeshStandardMaterial({color:'#b9d0d2',transparent:true,opacity:.22,roughness:.15,side:THREE.DoubleSide}));glass.position.set(center,(b+t)/2,-.08);glass.userData.disposeMaterial=true;group.add(glass);cuboid(.05,p.height,.09,frame,center,(b+t)/2,.02,group);}}
  for(const p of (state.artworks||[]).filter(p=>p.wall===wall.index)){const center=p.offset+p.width/2,y=p.bottom+p.height/2;cuboid(p.width+.12,p.height+.12,.1,'#634735',center,y,.09,group);cuboid(p.width,p.height,.025,'#f4efe4',center,y,.15,group);const material=artworkMaterial(p.image,render),mesh=new THREE.Mesh(new THREE.PlaneGeometry(Math.min(p.width,p.height*(p.imageAspect||p.width/p.height)),Math.min(p.height,p.width/(p.imageAspect||p.width/p.height))),material);mesh.position.set(center,y,.17);group.add(mesh);}
  // Floor-plan marks stay visible even with the cutaway walls hidden.
  const marks=new THREE.Group();marks.position.copy(group.position);marks.rotation.copy(group.rotation);marks.userData.planMarks=true;structure.add(marks);
  cuboid(wall.length,.018,.07,'#8e7b63',wall.length/2,.03,0,marks);
  for(const p of openings){cuboid(p.width,.025,.16,p.kind==='door'?'#f4eee1':'#83a8ac',p.offset+p.width/2,.06,0,marks);if(p.kind==='door'){cuboid(.035,.025,p.width,'#9b7755',p.offset,.065,p.width/2,marks);}}
  for(const p of (state.artworks||[]).filter(p=>p.wall===wall.index))cuboid(p.width,.025,.12,'#782c38',p.offset+p.width/2,.065,.13,marks);
 }
}
export function updateWallVisibility(structure,mode,camera){for(const g of structure.children){if(g.userData.wall){const w=g.userData.wall;g.visible=mode==='eye'||(mode==='3d'&&(-w.dz*(camera.position.x-(w.a.x+w.b.x)/2)+w.dx*(camera.position.z-(w.a.z+w.b.z)/2))>0);}if(g.userData.planMarks)g.visible=mode==='2d';}}
