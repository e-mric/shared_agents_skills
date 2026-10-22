# Optional design and writing skills

Reviewed 2026-10-18. Use these when the task needs visual direction, interface refinement
or clearer prose. The shared workflow works without them and does not install anything.

| Need | Optional skill | When to use it |
| --- | --- | --- |
| Establish a visual direction specific to the product | [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Before building a new interface or agreeing a redesign |
| Critique and refine an existing interface | [Impeccable](https://github.com/pbakaus/impeccable) | Review hierarchy, layout, accessibility and recovery, then apply scoped improvements |
| Edit formulaic or inflated prose | [Humanizer](https://github.com/blader/humanizer) | Refine documentation, narration or interface copy while preserving facts and the author's voice |

## Apply one method at a time

These methods support the shared **design first → implement → review** loop. Generate
the visual reference before building a new app screen or landing/showcase page; use
the review findings to decide what the next design iteration needs. Small fixes can
reuse an accepted reference.

1. Inspect the current host's skill catalog. If a relevant skill is available, read its
   instructions. Otherwise consult its upstream documentation and supported setup;
   installation paths and command syntax belong to the host, not this workflow.
2. Agree the target and intended outcome. Preserve the accepted design, factual claims
   and behavior during refinement; a redesign needs a clear brief.
3. Choose the method for the phase. These resources can overlap: use frontend-design
   for direction or Impeccable for shaping, rather than stacking competing workflows.
   Use Humanizer only where editorial cleanup helps.
4. Review the output against real product content and constraints. Inspect rendered
   interfaces and complete the user journey; compare edited prose with its source.
5. Record the upstream revision/version when practical, the changes, verification and
   remaining limits. Treat detector findings as prompts to investigate, not quality scores.

## Image-generation fallback

Check what the current host can actually generate. When image generation is available,
use the selected skill and the agreed brief. Availability is a tool capability, not a
property guaranteed by a model name or subscription.

When unavailable or declined:

1. Ask: “Would you like a ready-to-copy design prompt for an image tool you use, such
   as Higgsfield or another tool?” Let the user choose the destination.
2. If yes, provide a self-contained prompt: app purpose, approved scope, desktop/mobile
   layout, real sample content, essential states, visual direction and exclusions.
   Use public or fictional sample data suitable for that destination.
3. Ask the user to attach the generated image here. Keep the Imagine step awaiting
   that reference; continue independent requirements work if useful.
4. Inspect the attached image, discuss material gaps and ask the user to accept the
   direction or revise it. Record the chosen image and brief in project context before
   implementation. Features pictured outside scope remain proposals.

The prompt is portable; do not claim a particular external tool or model was invoked.
If the user prefers a wireframe or code-first route instead, record that explicit
exception and the intended review rather than silently skipping the reference.

## Portable boundaries

Skills provide guidance; they do not grant permission to publish, install globally,
start subagents, send project data to a service or replace the user's chosen style.
Adapt invocation to the host and disclose unsupported tooling or skipped checks.
Link to upstream resources rather than copying their instructions into this MIT repo;
their own licenses continue to apply.

Judge choices by whether they serve the product. Typography, colors and familiar
patterns can be appropriate; a list of forbidden visual traits is not a design brief.
Editorial cleanup should improve clarity and specificity without inventing details or
promising to defeat AI detectors. These skills supplement acceptance criteria and review.
