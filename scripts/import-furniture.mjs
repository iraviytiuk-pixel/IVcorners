// Public CC0 sources, downloaded only during asset preparation; no runtime API dependency.
import {mkdir,writeFile,readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {NodeIO} from '@gltf-transform/core';
import {getBounds} from '@gltf-transform/functions';
const sources=[['modern_arm_chair_01','chair','Seating'],['mid_century_lounge_chair','chair','Seating'],['sofa_02','sofa','Seating'],['sofa_03','sofa','Seating'],['modern_coffee_table_01','table','Tables'],['modern_coffee_table_02','table','Tables'],['coffee_table_round_01','table','Tables'],['side_table_01','table','Tables'],['dining_chair_02','chair','Seating'],['chinese_console_table','sideboard','Storage']];
async function get(url){const r=await fetch(url);if(!r.ok)throw Error(`${r.status} ${url}`);return r;}
const all=await (await get('https://api.polyhaven.com/assets?t=models')).json(),manifest=[];
for(const [id,kind,category] of sources){
 const dir=`.asset-cache/${id}`;await mkdir(dir,{recursive:true});
 const files=await(await get(`https://api.polyhaven.com/files/${id}`)).json(),source=files.gltf['1k'].gltf;
 for(const [name,file] of Object.entries({'source.gltf':source,...source.include})){const dest=`${dir}/${name}`;await mkdir(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});try{await stat(dest)}catch{await writeFile(dest,Buffer.from(await(await get(file.url)).arrayBuffer()))}}
 const io=new NodeIO(),doc=await io.read(`${dir}/source.gltf`),bounds=getBounds(doc.getRoot().listScenes()[0]),size=bounds.max.map((v,i)=>v-bounds.min[i]);
 execFileSync('node_modules/.bin/gltf-transform',['optimize',`${dir}/source.gltf`,`assets/models/${id}.glb`,'--compress','false','--texture-compress','webp','--texture-size','1024','--simplify','false'],{stdio:'pipe'});
 const thumb=`assets/models/${id}.png`;await writeFile(thumb,Buffer.from(await(await get(`https://cdn.polyhaven.com/asset_img/primary/${id}.png?width=256`)).arrayBuffer()));
 const [w,h,d]=size.map(v=>Math.round(v*3.28084*100)/100);
 manifest.push({kind:id,baseKind:kind,name:all[id].name,category,w,d,h,color:'#a68d70',note:`${Math.round(w*12)} × ${Math.round(d*12)} in · model scale`,model:`/assets/models/${id}.glb`,thumbnail:`/${thumb}`,source:`https://polyhaven.com/a/${id}`,license:'CC0-1.0',authors:Object.keys(all[id].authors||{}),bytes:(await stat(`assets/models/${id}.glb`)).size});
 console.log(id,w,d,h,manifest.at(-1).bytes);
}
await writeFile('src/model-catalog.js',`// Dimensions derived from source geometry, not verified retail measurements.\nexport const modelCatalog = ${JSON.stringify(manifest,null,2)};\n`);
await writeFile('assets/models/credits.json',JSON.stringify(manifest,null,2));
