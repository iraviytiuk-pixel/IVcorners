# IV Corners — web-first visual MVP

## Design direction
Preserve the repository's warm natural materials, burgundy, AIrena, and IV Atelier identity. Turn the fixed-aspect mockup into an editorial, responsive website. Use paper backgrounds, large serif typography, architectural rules, square controls, original photography, and deliberate motion. No gradients or pill controls.

## Phase 1 — visual MVP (this build)
- Responsive landing page with an interactive desktop monitor: room inspiration, computed floor plan, material studies, and artwork elevation.
- Scroll-linked monitor movement, staggered reveal, and optional autoplay demo. Respect reduced motion and stop autoplay when someone interacts.
- Browser studio: room dimensions, rectangular/L-shaped room, two sample arrangements, three palettes, artwork size, and local image upload.
- Save a version on this device; download a scaled SVG plan. Label sample imagery and conceptual furniture honestly.
- Reuse original assets. Keep original mockup under docs/reference and preserve Python planner.
- Static build, accessible dialog, touch/keyboard controls, desktop/mobile browser verification, deploy to a new site in the connected Netlify account.

## Phase 2 — reliable spatial editor
Define one room schema in physical units with wall polygons, openings, ceiling heights, measurement provenance, furniture footprints, and clearance zones. Add measured floor-plan import and editable door/window locations. Build a real-time Three.js view from the same geometry. Add geometric validation, undo/redo, and project persistence. Replace illustrative placements with a tested constraint solver.

## Phase 3 — catalog and intelligence
Ingest authorized furniture feeds with dimensions, availability, assets, and product URLs. AIrena proposes catalog selections and explanations through tools; geometry verifies every placement. Add accounts, private uploads/deletion, saved projects, budgets, and a shopping list. Validate product performance/cost before enabling paid AI requests.

## Phase 4 — visual fidelity
Prepare verified GLB furniture assets in Blender. Add material/light controls, accurate artwork mounting, optional browser AR where supported, and rendering jobs. Keep native scanning outside the first web release.

## Acceptance
No horizontal overflow at phone widths. Every CTA reaches a working flow. Dimensions change plan geometry, palette selection changes materials, art uploads remain local, save reloads, SVG downloads. Keyboard modal navigation and reduced motion work. Production contains no credentials, internal docs, tests, or source mockup. No claims of live AI, product availability, guaranteed fit, or reconstructed room photography.

## Delivery and verification
- Hosted preview: https://iv-corners-studio.netlify.app
- Working branch: `codex/visual-web-mvp` in the local clone.
- Six geometry tests pass: area, unsupported input, furniture containment across supported dimensions, SVG text escaping, alternate layouts/materials, fractional dimension labels.
- Browser checked at 320, 390, 768, 1024, and 1440 px without page overflow.
- Verified room name/dimension/shape updates, local save and reload, uploaded image aspect ratio, SVG download, keyboard tabs, dialog Tab cycling, Escape dismissal, and reduced motion.
- This is a direct Netlify deployment. Automatic GitHub deployments have not been configured.


## Interactive studio follow-up

The standalone 3D studio and guided AIrena interview are now implemented. See [AIRENA-PROTOTYPE-PLAN.md](AIRENA-PROTOTYPE-PLAN.md) for current capabilities, connection requirements, and remaining production scope.
