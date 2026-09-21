import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const file of ['index.html', 'styles.css', 'app.js', 'studio.html', 'studio.css', 'studio.js', 'knowledge/airena-knowledge.mjs', 'src/editor-model.js', 'src/model-catalog.js', 'src/design-guide.js', 'src/room-scene.js', 'src/space-model.js', 'src/space-tools.js', 'src/room-architecture.js', 'favicon.svg', '_headers', 'assets', 'src/geometry.js']) {
  await cp(file, `dist/${file}`, { recursive: true });
}
console.log('Built static website in dist/');

await mkdir('dist/vendor', {recursive:true});
for(const name of ['three.module.js','three.core.js'])await cp(`node_modules/three/build/${name}`,`dist/vendor/${name}`);
await cp('node_modules/three/examples/jsm/controls/OrbitControls.js','dist/vendor/OrbitControls.js');

await mkdir('dist/vendor/loaders',{recursive:true});await mkdir('dist/vendor/utils',{recursive:true});
await cp('node_modules/three/examples/jsm/loaders/GLTFLoader.js','dist/vendor/loaders/GLTFLoader.js');
await cp('node_modules/three/examples/jsm/utils/BufferGeometryUtils.js','dist/vendor/utils/BufferGeometryUtils.js');
