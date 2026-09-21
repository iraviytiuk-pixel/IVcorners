import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const file of ['index.html', 'styles.css', 'app.js', 'studio.html', 'studio.css', 'studio.js', 'knowledge/airena-knowledge.mjs', 'src/editor-model.js', 'src/design-guide.js', 'src/room-scene.js', 'favicon.svg', '_headers', 'assets', 'src/geometry.js']) {
  await cp(file, `dist/${file}`, { recursive: true });
}
console.log('Built static website in dist/');

await mkdir('dist/vendor', {recursive:true});
for(const name of ['three.module.js','three.core.js'])await cp(`node_modules/three/build/${name}`,`dist/vendor/${name}`);
await cp('node_modules/three/examples/jsm/controls/OrbitControls.js','dist/vendor/OrbitControls.js');
