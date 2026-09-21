# IV Corners

AI interior design by [IV Atelier](https://ivatelier.com). A person describes a room they
already live in; IV Corners returns a scaled floor plan, a material palette, and a furniture
list where every piece links to buy it. No designer in the loop at any point.

The taste is Irena Viitiuk's — a decade of hospitality and residential work behind Park
Central Hotel, Fisher Island and Bentley South Beach — encoded into something that runs
without her.

## What's here

| Path | What it is |
| --- | --- |
| `index.html` | The live site. Screens 1–3, self-contained apart from `assets/`. Open it directly in a browser. |
| `src/planner.py` | Floor plan renderer. Room polygon + furniture list in, SVG out. |
| `examples/` | Two plans produced by `planner.py`, unedited. |
| `assets/` | Photography, material swatches, reference images. |
| `docs/ARCHITECTURE.md` | The two constraints that decide whether this product works. Read this first. |
| `docs/FLOW.md` | The five screens, end to end. |

## Running it

`index.html` needs no build step and no server — open it in a browser. Screen 1 is the
landing page, "Meet AIrena" goes to the intake, and entering dimensions draws a plan live.

The Python renderer is standalone:

```bash
python3 - <<'PY'
import sys; sys.path.insert(0, 'src')
from planner import Room, Opening, Item, render
room = Room('LIVING', [(0,0),(192,0),(192,156),(0,156)],
            [Opening(0, 42, 84, 'window'), Opening(2, 22, 34, 'door')],
            [Item('sofa', 96, 34, 88, 37, 0, 'SOFA')])
open('plan.svg','w').write(render(room))
PY
```

## Current state

Screens 1–3 are built. Screen 3 places furniture by rule in JavaScript — a simplified version
of the solver described in `docs/ARCHITECTURE.md`. Screens 4 and 5 are specified but not built,
and both depend on the product catalog, which depends on affiliate approvals.

## The one thing to get right

No language model draws geometry here, and none should. Walls, clearances and dimensions are
computed. The AI's job is reading what the customer says, choosing which pieces, and writing
the rationale. Everything spatial is code. `docs/ARCHITECTURE.md` explains why.
