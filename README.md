# IV Corners

A mobile-friendly, web-first interior design concept inspired by IV Atelier. Phase 1 turns the original HTML mockup into a polished website with an interactive monitor and a working browser studio.

## Run

Node 20+ and Python 3. Three.js is bundled locally.

```sh
npm ci
npm run dev
# http://127.0.0.1:4173
npm test
npm run build
```

Deploy `dist/` to Netlify. `netlify.toml` supplies the build settings; `_headers` also supports direct ZIP deployments.

## Working in this version

- Responsive editorial landing page with an interactive monitor and studio entry points.
- Dedicated `/studio.html` workspace: Three.js 3D room and floor-plan view, furniture catalog drag/drop, tap-to-add, moving, rotation, removal, undo/redo.
- Rectangle/L-shaped rooms, editable dimensions, basic boundary and footprint overlap checks, three palettes.
- AIrena sidebar/mobile drawer with typing, an eight-topic guided interview, local reference images, and explicit apply buttons for design proposals.
- Device-local room/brief saving and SVG export of the current furniture arrangement.
- Prepared server-side OpenAI integration in `netlify/functions/airena.mjs`; disabled until credentials and enable flag are configured.

## Scope

This is an interactive prototype. The sample furniture has concept dimensions; there is no verified retailer catalog, door-swing or circulation solver, or fit guarantee. AIrena currently runs an explicitly labeled guided demo. Her portrait is not a live avatar. Live provider behavior remains untested without credentials. Uploaded references stay in memory and are not analyzed or saved. Room and brief are saved on this device only when requested.

See [the AIrena prototype and integration plan](docs/AIRENA-PROTOTYPE-PLAN.md) for live text, avatar sessions, reviewed knowledge, storage, and remaining production work.

## Files

- `index.html`, `styles.css`, `app.js`: landing page and monitor demo.
- `studio.html`, `studio.css`, `studio.js`: interactive workspace.
- `src/editor-model.js`, `src/room-scene.js`: validated room state and Three.js scene.
- `knowledge/airena-knowledge.mjs`, `src/design-guide.js`: starter design knowledge and guided interview.
- `netlify/functions/airena.mjs`: optional live conversation endpoint.
- `src/geometry.js`: pure, tested room geometry and SVG rendering.
- `src/planner.py`: preserved original standalone Python renderer.
- `assets/`: original repository photography/materials, retained locally.
- `docs/WEB-MVP-PLAN.md`: phased implementation plan.
- `docs/reference/original-mockup.html`: preserved original (its asset paths assume the original root).
- `docs/ARCHITECTURE.md`, `docs/FLOW.md`: original product thinking; the current phase is documented above and in the MVP plan.

## Next

Measured wall/opening editing and shared 3D geometry → approved furniture catalog → tool-driven AIrena suggestions → saved accounts and production rendering. See the phase plan for details.
