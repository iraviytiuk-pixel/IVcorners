# IV Corners — interactive studio and AIrena

## Prototype delivered

- Browser-first studio at `/studio.html`; AIrena is a side panel, with mobile drawers.
- Real Three.js scene and an overhead plan driven by one room state in feet.
- Catalog drag/drop or tap-to-add; move existing furniture; 90-degree rotation; removal; keyboard movement.
- Placement checks enforce room boundaries, the L-shaped cutout, and solid furniture overlaps. Rugs can overlap furniture. These are basic footprint checks, not circulation, door-swing, or accessibility validation.
- Undo/redo, three palettes, browser-local project/brief saving, and SVG export of the current arrangement.
- AIrena portrait opens a typing-effect conversation. Eight designer intake topics, reference photos, and explicit apply buttons for palette, dimension, and furniture suggestions.
- The portrait is not an animated/live avatar. Offline conversation is explicitly labeled guided demo. Photo attachments are local visual references; no image interpretation is claimed.
- A Netlify Function is prepared for live OpenAI conversation with a structured response schema, reviewed room actions, starter knowledge, request limits, same-origin checks, and provider-error handling. The live provider path cannot be verified until credentials are supplied.

## Recommended production stack

| Layer | Recommendation | Purpose |
| --- | --- | --- |
| Interactive room | Three.js, already integrated | Render the same physical room state used by fit checks. Later replace procedural concept furniture with verified GLB models. |
| Design conversation | OpenAI Responses API | Ground replies in the designer knowledge and current project. Return structured proposals for geometry tools to validate. |
| Live avatar | HeyGen LiveAvatar LITE/custom stack | Keep IV Corners in control of AIrena's knowledge, decisions, and room tools; provider supplies streamed video. A persistent streaming service is needed for audio/WebSocket orchestration. |
| Alternative avatar | Tavus CVI | Evaluate with the same brief for latency, interruptions, realism, device coverage, and tool-call behavior. |
| Fastest voice milestone | Voice conversation without video | Validate interview quality and latency before adding avatar streaming cost and complexity. |
| Project records | Postgres, e.g. Supabase | Users, projects, room versions, brief answers, catalog metadata, and scoped access. |
| Uploads | Private object storage | Room photos, floor plans, art, and authorized furniture models; signed URLs and explicit retention/deletion. |
| Knowledge | Reviewed documents first; retrieval as it grows | Designer voice, approach, palettes, materials, question trees, rules, examples, and approved catalog. |

## Connect live text

In **this project's Netlify environment variables**, set `OPENAI_API_KEY`, `AI_CHAT_ENABLED=true`, and optionally `OPENAI_MODEL` (default `gpt-6-astra`). Redeploy so the function receives the variables. Never paste keys in chat, commit `.env`, or expose credentials in browser JavaScript. The status endpoint switches the UI to live mode only when enabled and configured. Run real conversation evaluations before public use. Configure provider spending limits before enabling broad access.

The current text integration does not yet send reference photos to the model. That needs an explicit upload/consent flow, validation, private storage, and vision evaluation.

## Connect the avatar

1. Create a LiveAvatar project and choose a stock avatar for technical evaluation. A custom AIrena identity needs provider-supported enrollment and appropriate likeness/voice permission.
2. Add avatar API credentials to server-side secrets; select avatar and voice IDs.
3. Deploy a persistent session service for the custom audio/video pipeline. Netlify Functions remain useful for authorization/session issuance; they should not hold a long-lived avatar socket.
4. Update the current camera/microphone Permissions-Policy in `netlify.toml` and `_headers` for the chosen provider and intended permissions. Browser receives a short-lived session token and subscribes to WebRTC video/audio. Request microphone only after the user starts a call; camera is optional.
5. Connect transcripts and assistant actions to the same IV Corners brief/room tools used by text. Implement interrupt, mute, reconnect, explicit stop, session expiry, and cleanup.
6. Test response time, interruptibility, mobile audio restrictions, and a per-session cost cap. Confirm current provider pricing/credits and API permissions in the account rather than assuming a HeyGen video subscription includes LiveAvatar.

## Build the designer knowledge base

`knowledge/airena-knowledge.mjs` is a starter structure, not Irena's proprietary design expertise. Review and expand it with:

- Intake: purpose, household, dimensions, doors/windows, daylight, existing pieces, taste/dislikes, palette, budget, rental restrictions, durability and accessibility needs.
- Approved design examples with the reasoning behind each decision.
- Style families, material compatibility, care requirements, and color/light relationships.
- Verified measurement and clearance rules with sources and uncertainty.
- Product inventory: dimensions, variants, current prices/availability, model assets, and permitted retailer links.
- Escalation and boundaries: structural changes, mounting, electrical work, unknown dimensions, and cases that need a professional.

Use test conversations to measure: useful questions, remembered constraints, no invented products, valid geometry, coherent suggestions, and clear handling of unknowns.

## Still needed for a production product

Live provider credentials and end-to-end tests; authentic avatar session plumbing; accounts and durable private storage; real floor-plan/door/window editing; photo interpretation; verified GLB/product catalog; circulation and doorway checks; saving uploaded references/art; multi-room projects; complete observability and abuse controls. This prototype is a working interaction foundation, not a finished autonomous designer.

## Primary references checked

- https://docs.liveavatar.com/llms.txt — current FULL/LITE modes, contexts, sessions, secrets, custom LLM integration.
- https://docs.tavus.io/llms.txt — CVI, PALs, tool calling, pipeline modes.
- https://developers.openai.com/api/docs/guides/function-calling
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://docs.netlify.com/build/functions/api/
- https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/
