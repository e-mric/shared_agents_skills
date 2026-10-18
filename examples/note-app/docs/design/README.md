# Design direction and references

The latest [illustrated implementation and asset prompts](illustrated-covers.md) add
locally selected covers and progressive visual refinement to the live app.
The [Impeccable review](impeccable-review.md) records the subsequent readability and
responsive pass, upstream revision and verification limits.

2026-10-18. User requested a minimal, interactive SvelteKit presentation with a storyboard,
visible iterations, a naive-prompt comparison and then scrollytelling.

Mobbin references inspected:

- [Gamma presentation canvas and filmstrip](https://mobbin.com/screens/6adb01c3-e314-48fb-b403-0bfd3bfbca02): a large canvas and small previews keep the story navigable.
- [Copilot writing surface](https://mobbin.com/screens/136cfa0a-2377-4520-90b2-961497dafb42): quiet document space and unobtrusive controls.

We borrow the interaction principles, not logos or source artwork. Mobbin screenshots
are not embedded in the product.

Two concepts use the built-in Imagegen tool and appear in the baseline comparison:

- `static/design/workflow-concept.png`: editorial layout with restrained sage accents,
  a live app canvas, a recovery state and an iteration timeline.
- `static/design/generic-baseline.png`: a plausible conventional blue note interface.

These are illustrative generated designs, not screenshots of an actual model experiment.
The concept image is a proposal; the later chapters contain the functioning Svelte app.

Prompt briefs: “Minimal desktop interactive presentation called marginal, one note app
evolving through iterations, explanatory text beside a live canvas, quiet typography,
compact storyboard, recovery state.” Baseline: “Plausible competent generic note app from
‘Build me a note app’, white and pale gray surfaces, blue accent, sidebar and editor,
not deliberately ugly or broken.” Generation mode: built-in Imagegen, no API fallback. The [full prompts](prompts.md)
are retained for reproducibility.

The user’s later scrollytelling direction adds sticky positioning and a local Svelte 5
Scrolly component following the supplied playground’s most-visible-section pattern. Reduced-motion preferences suppress transitions, and narrow
screens use explicit chapter navigation. Generated image text is not used as the source
of any app logic or price claims.

## Blueprint palette

User-selected on 2026-10-18. The live app uses Deep Space Blue (`#13293D`) for
text, Baltic Blue (`#006494`) for primary actions, Cerulean (`#247BA0`) for focus
and line details, Blue Bell (`#1B98E0`) for selected borders, Alice Blue (`#E8F1F2`)
for the page and white for the canvas. Supporting muted text uses `#50677B`.
Warning and error colors retain their semantic purpose. The earlier generated concept
images remain dated design explorations, preceding this palette selection.
