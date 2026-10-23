# Live presentation script

Allow about 12–18 minutes, plus discussion. Start at http://127.0.0.1:4173/ and choose
“Restart story”. This resets chapter position only. It preserves notes, observations
and the illustrative team selection. Use a dedicated demo browser profile for a fresh
library. Never clear a browser profile containing notes you want to keep.

Scroll over the explanation to progress on desktop. The right canvas stays pinned.
Use chapter buttons or Previous/Next when presenting deliberately. Arrow keys work
outside text fields, selects and dialogs. On small screens, use chapter navigation.
Fullscreen depends on the host.

| Chapter | Interaction | Point to explain |
| --- | --- | --- |
| Baseline | Toggle Naive prompt / With intent | Both are generated illustrations, not a controlled model experiment. |
| Understand | Explore collaboration | A proposed feature changes scope and the test burden. |
| Guidance | Choose a chat role | Roles focus tasks; they do not require four agents. |
| Context | Switch document tabs | Guidance, product decisions and current state have distinct owners. |
| Methods | Choose a question | Match a method to the task and inspect available skills. |
| Team | Choose one agent or subagents; explore roles and costs | Ask about delegation and reuse the preference. Distinguish estimates, credits and quota. |
| Design | Choose Figma or generation; explore MCP/export and external-image fallbacks | Accept an existing reference or generate one, then review it before implementation. |
| Write | Open Before building; compare browser-only vs sync needs, choose agent mode, then close and write | Explain and confirm technologies and team before building. |
| Save | Save, switch notes, reopen, then use the reload check | Persistence and truthful status form a complete outcome. |
| Recover | Interrupt next save, edit, save, then retry | The failed write keeps the draft and prior saved version. |
| Review | Inspect the journey, tick observed criteria, then choose Refine the design | Compare the result with the reference and return to design where changes are needed. |
| Handoff | Recap the observed interactions | Name the next step; open the shared workflow for more detail. |

In Review, compare the generated reference on the left with the functioning note app
on the right. The iteration summary names what Write, Save, Recover and Review added.
Use the full-size reference link for a closer look. Try editing and recovery in the
live panel; it is the same editor used earlier. At narrow widths the panels stack.
The comparison explains a design-to-build process, not a measured before/after study.

Suggested note title: “A thought worth keeping”. Body: “Good tools make room for thought.
Great ones help you keep it.” For recovery, add “This line survives a failed save.”

From Design onward, the three-part navigator highlights **Design first → Implement →
Review**. Use “Implement this direction” to enter the live editor. In Review, choose
“Refine the design” and return to Implement to demonstrate another pass; the same
editor and draft remain mounted. These controls revisit a pre-generated reference
and prebuilt capabilities. They do not generate images, execute code or start agents.

## Useful edge cases

- Try switching notes while dirty. Keep editing must retain the text.
- A blank new note cannot save. Body-only and title-only notes can save.
- The failure control interrupts exactly one save and can be cancelled before use.
- Download draft provides a Markdown copy after an error.
- The note list shows titles consistently. Keyboard focus should remain visible.

## Limits to say aloud

A single agent built and reviewed this demonstration. Exploring a model plan does not
delegate work. Prices are dated illustrative calculations with stated token assumptions,
not this session’s bill or a conversion to subscription allowance. The baseline designs
are generated proposals. Browser checks cover the local test environment, not every
browser, assistive technology, mobile device or real-user study.
# Illustrated reveal

Write starts plain. Save adds illustrated cards and search. Recover adds the matching
editor cover. Review applies the editorial body type and final spacing.
For the cover selection demo, save a note titled “Weekend wanderings” with a walking
plan: the local rule selects the landscape. Ordinary reflections use the boat.
Edit without saving to show that the cover stays stable. No runtime image generation
or external model calls occur; this is selection from five pre-generated illustrations.

Theme examples: save “Books to read”, “Creative ideas” or “Dinner recipes”.
The title takes priority if the body mentions another theme.

## Present with less text

Each chapter has one message: say it, then demonstrate the action.
Review fits the comparison and controls on a 1280×720 display; narrower
screens stack the panels. Returning to Review starts its scroll surfaces at the top
and keeps your draft. Explicit chapter choices remain selected until you scroll again.

Regression rehearsal: type a long unsaved body, scroll it down, choose Refine, then
Review. Its first line should be visible and its full text unchanged. Interrupt a save
and retry. Rehearse on the actual presentation display before presenting.

## Markdown and future voice input

Write a heading, a short list and `**bold text**`. Use the formatting buttons or
Cmd/Ctrl+B and Cmd/Ctrl+I. Switch to Preview to read the formatted note; switch back
to Write to edit the source. Save, reopen and export `.md` to show that the source
stays portable. Task checks in Preview reflect the source; edit `[ ]` / `[x]` in Write.
Images appear as links to avoid automatic remote requests. Embedded HTML is literal.
The voice-to-text button is a labelled, disabled concept only: no recording or service.

## Preparation choices

Design opens with a source choice. Try Figma with/without MCP access, then generation
in the host or an external tool. The external path offers a portable prompt and asks
for the generated image to be attached and reviewed. The Generated design tab still
shows this demo’s real reference; no Figma file is imported by these example controls.

In Write, expand “Before building: technologies & team”. Browser-only needs recommend
SvelteKit + TypeScript, plain CSS/local artwork and browser storage. Sync needs explain
the added backend/authentication/database decision. Confirm or adjust recommendations
with the user. Choose one agent or a small team; Explore roles and costs carries that
selection to Team. Close the panel to return space to the same editor. Choices survive
chapter changes and reload in this tab; they do not change the app stack or start agents.
