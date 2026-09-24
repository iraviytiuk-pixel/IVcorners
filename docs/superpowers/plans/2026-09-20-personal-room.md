# Personal room implementation plan

Goal: deliver the approved floor-plan tracing, doors/windows, personal artwork, and eye-level view workflow without accounts.

Architecture: keep a single physical room state in feet. Add a geometry module for simple polygon rooms, calibration, and wall attachments; an isolated dialog controller for tracing and attachments; extend the Three.js renderer for segmented walls and eye-level navigation. Preserve version-2 projects with optional new fields.

- [x] Test and implement calibration, polygon validation/containment, wall attachments, and saved-state validation.
- [x] Add upload/calibrate/trace dialog with visible steps, undo corner, redraw and numeric alternative room dimensions. Image guides remain local; traced geometry is saved.
- [x] Add editable door/window positions and dimensions by wall, plus uploaded artwork with physical dimensions and hanging height. Reject overlapping wall attachments and placements outside walls. Compress art locally and save with project.
- [x] Render actual walls/openings/art, custom polygon floor, and eye-level look/movement on mouse/touch/keyboard. Keep camera within room; movement is a preview, not a clearance certification.
- [x] Verify exports, reload, undo, old layouts, desktop/mobile controls, malformed traces, and all existing tests. Deploy to existing Netlify site.

Constraints: no new accounts, no Blender; manual calibration from a known measurement; one simple room polygon (no holes); 4–60 ft bounds, 3–24 corners; no automatic image measurement claims; art stays on-device; architectural alterations remain conceptual.
