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

## Open furniture library

The collection includes 10 textured Poly Haven CC0 models alongside seven original concept pieces. New models use dimensions derived from source geometry, not verified manufacturer measurements. Source links, authors, licenses, and output sizes are preserved in `assets/models/credits.json`.

Models are self-hosted and loaded on demand. No external account, API key, runtime library API, or Blender installation is needed. `@gltf-transform/cli` from donmccurdy/glTF-Transform is installed as a development dependency. Run `npm run assets:import` to download the curated public source files and optimize them to GLB with 1K WebP textures. Original downloads are cached in ignored `.asset-cache/`. The generated catalog and optimized assets are committed, so normal builds do not fetch external models.

The 10 models total about 5 MB before thumbnails. Runtime models retain their source materials; palette changes affect the room and concept furniture.

## Trace your home, add openings, and hang art

- **Trace a floor plan:** import a JPG/PNG/WebP image, mark two ends of a known distance in feet, then click room corners around the inside perimeter. Build one simple room with 3–24 corners and a 4–60 ft bounding box. Numeric pixel entry is available for keyboard use. Crossed outlines are rejected. The image guide stays in the current tab; calibrated geometry saves with the project.
- **Doors, windows & art:** select a numbered wall; set width/height in inches, offset and bottom height in feet. Door/window geometry cuts the wall. Upload artwork and set its physical dimensions. Reopen entries to edit or delete. Wall details cannot overlap one another or extend beyond a wall. Ceiling height is currently 8 ft for new rooms.
- **Eye level:** drag to look; use on-screen arrows or keyboard arrows/WASD to move. Camera movement remains within the room outline; it is a visual preview and does not model body clearance, obstacles, or door swings.
- Uploaded artwork is resized to JPEG locally (up to 768 px) and included with explicit device-local saves. A room image budget limits storage; browser quota failures are reported. The SVG export shows the traced outline and wall-detail locations, not artwork elevations or the source image.
- Older saved layouts remain supported. Changes participate in undo/redo. Tracing a new room removes existing wall details and furniture that no longer fits; undo restores the previous state.

Implementation: `src/space-model.js` owns polygon/calibration/attachment validation; `src/space-tools.js` owns the dialogs and local image processing; `src/room-architecture.js` owns segmented walls, openings, and artwork in the Three.js scene.
