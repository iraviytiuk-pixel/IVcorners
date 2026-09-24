# Design refinement plan

Approved scope: placement guides, wall/floor finishes, saved layout comparisons, and room-image exports. Continue in the existing workspace; no accounts or additional providers.

- Test pure placement assistance and measurement calculations. Snap nearby edges/centers and walls only when the resulting position passes existing geometry validation. Keep free placement toggle and keyboard controls.
- Add curated wall colors, floor textures, and lighting presets, retaining original room palettes. Save finishes in project state and apply them consistently to the scene.
- Add browser-local named layouts via IndexedDB, with room-state snapshots, preview images, camera state, restore and remove controls. Restore participates in undo. Do not silently discard an unsaved room.
- Add clean PNG capture, excluding editing guides, after assets finish loading. Capture current camera and finishes; downloadable locally.
- Verify fresh and existing saves, geometry failures, mobile UI, layout persistence/restoration, exported image content; deploy and smoke-test production.
