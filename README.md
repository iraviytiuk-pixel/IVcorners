# IV Corners

A mobile-friendly, web-first interior design concept inspired by IV Atelier. Phase 1 turns the original HTML mockup into a polished website with an interactive monitor and a working browser studio.

## Run

Node 20+ and Python 3. No npm dependencies required.

```sh
npm run dev
# http://127.0.0.1:4173
npm test
npm run build
```

Deploy `dist/` to Netlify. `netlify.toml` supplies the build settings; `_headers` also supports direct ZIP deployments.

## Working in this version

- Responsive editorial landing page with scroll reveals and an optional animated walkthrough.
- Interactive monitor: inspiration, dimensioned floor plan, material palettes, and art elevation.
- Studio: rectangle/L-shaped room, 10–30 ft dimensions, two conceptual arrangements, three palettes.
- Local JPG/PNG/WebP art upload, aspect-ratio-aware display and artwork sizing.
- Device-local saving and SVG floor-plan download.
- Keyboard-accessible tabs, native modal focus management, reduced-motion support.

## Scope

This is a visual MVP. Photography is inspiration rather than a generated view of the user's room. Furniture and openings are illustrative; no fit guarantee or clearance solver is provided. AIrena notes are curated copy. No API keys, live AI, accounts, backend uploads, purchasing links, or native app are included. Uploaded art remains in memory and is not saved. Room preferences are saved only when the user chooses to save them.

## Files

- `index.html`, `styles.css`, `app.js`: website and studio.
- `src/geometry.js`: pure, tested room geometry and SVG rendering.
- `src/planner.py`: preserved original standalone Python renderer.
- `assets/`: original repository photography/materials, retained locally.
- `docs/WEB-MVP-PLAN.md`: phased implementation plan.
- `docs/reference/original-mockup.html`: preserved original (its asset paths assume the original root).
- `docs/ARCHITECTURE.md`, `docs/FLOW.md`: original product thinking; the current phase is documented above and in the MVP plan.

## Next

Measured wall/opening editing and shared 3D geometry → approved furniture catalog → tool-driven AIrena suggestions → saved accounts and production rendering. See the phase plan for details.
