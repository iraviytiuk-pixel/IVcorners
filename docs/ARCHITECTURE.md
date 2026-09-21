# Architecture

Two constraints decide whether this product works. Both cut against the obvious approach.

## 1. Floor plans are assembled, not generated

Asking a model to draw an accurate to-scale floor plan produces walls that don't meet, doors
that open into walls, and dimensions that don't add up. A model that is 97% accurate at drawing
walls puts a door in a wall one time in thirty, and that one time destroys trust in everything
else on the screen.

So the AI never draws geometry. The app carries parameterised room archetypes — rectangle,
L-shape, rectangle with alcove, open plan — and the customer picks the closest and gives two or
three real dimensions. Openings are placed on named walls. The geometry is then exact by
construction.

`src/planner.py` is the renderer. It takes a polygon in inches plus a furniture list and emits
SVG: poché walls with mitred corners, door swings, window breaks, furniture as plan symbols,
dimension strings. It is deterministic and has no model in it.

The version that removes the objection permanently is scanning — iOS RoomPlan returns real room
geometry from a LiDAR scan in about thirty seconds. That's a v2 path, not a v1 requirement.

## 2. The look is composed from the catalog, not matched to it afterwards

Product data comes from affiliate feeds only. No scraping.

If AIrena designs a beautiful room and then goes looking for the pieces, most won't exist in the
feeds and the shopping list arrives full of holes — the exact failure that makes an app like this
feel fake. So the order inverts: ingest feeds first, cluster what is actually purchasable into
style families, and compose rooms out of pieces known to be in stock. Palette and renders are
built to match real products, not the other way round.

Consequence worth naming: the quality ceiling of the whole product is set by which affiliate
programs are signed. That is a business task and it gates launch as much as any code does.

## Furniture placement is a solver

Placement is not a generative problem. Every catalog item carries a footprint (W×D×H), required
clearances, and a placement class (wall-anchored, floating, corner, paired-with-seating).

Rules run in priority order:

1. **Circulation** — 30–36" main paths, door swings clear
2. **Function** — seating faces the focal point; coffee table 14–18" from the sofa; 36" behind
   dining chairs to pull out; TV at 1.5–2.5× screen diagonal
3. **Fit** — footprint plus clearances inside the polygon, nothing overlapping
4. **Proportion** — sofa no more than ~⅔ of its wall; rug under the front legs of all seating

The solver places the anchor piece first (sofa in a living room, bed in a bedroom, positioned
relative to the focal wall), then dependent pieces in order, scoring candidate positions and
rejecting rule violations.

Selection is then a filtered query, not a creative act: *"sofa, ≤84in wide, against an 11ft wall,
in this style family, in this budget band"* returns candidate rows, scored for style fit. The AI
picks from rows. It never invents a product.

## Where the AI actually belongs

Three places, all of them language and taste rather than geometry:

- Parsing the customer's answers about how they live into design parameters
- Choosing which style family and which specific pieces
- Writing the rationale in Irena's voice

## Not the answer

**Autodesk / CAD.** Design Automation runs AutoCAD and Revit operations on existing files in the
cloud. It does not generate good plans from a description, needs Autodesk licensing, is slow and
expensive per job, and outputs CAD files when the app needs web-native SVG.

**A better model.** The failure mode isn't model capability. It's asking a model to do a job that
belongs to code.
