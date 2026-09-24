import {mkdir,cp} from 'node:fs/promises';
await mkdir('vendor',{recursive:true});
for(const name of ['three.module.js','three.core.js'])await cp(`node_modules/three/build/${name}`,`vendor/${name}`);
await cp('node_modules/three/examples/jsm/controls/OrbitControls.js','vendor/OrbitControls.js');

await mkdir('vendor/loaders',{recursive:true});await mkdir('vendor/utils',{recursive:true});
await cp('node_modules/three/examples/jsm/loaders/GLTFLoader.js','vendor/loaders/GLTFLoader.js');
await cp('node_modules/three/examples/jsm/utils/BufferGeometryUtils.js','vendor/utils/BufferGeometryUtils.js');
