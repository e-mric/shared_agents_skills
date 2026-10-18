# Marginal product

<!-- impeccable:product-schema 1 -->

Initialized with Impeccable 4.6.0 on 2026-10-18 from the user's established brief,
accepted design decisions and repository evidence. This app-specific record remains
at its existing path; the shared repository's workflow stays agent-agnostic.

## Platform

web

## Users

Primary user: a presenter explaining a practical development workflow to others.
The audience follows the decisions and tries the progressively revealed note app.
The note-taking journey serves people capturing short thoughts in one browser.

## Product Purpose

Explain the [shared development workflow](../../../PROJECT_DEVELOPMENT_WORKFLOW.md)
through an interactive presentation that becomes a functioning note app. Success is
an understandable sequence of decisions and a complete write, save, reopen and
recover journey. The user chose this live experience in place of a PowerPoint.

## Positioning

This is a teaching example: the same editor gains capabilities as the workflow
progresses. A generated naive-prompt baseline makes the design discussion tangible;
functional save and recovery interactions demonstrate the resulting behavior.
It is not a validated commercial note-taking proposition.

## Operating Context

The presenter runs the SvelteKit app locally in a browser. Desktop users scroll
through twelve chapters beside a pinned canvas; chapter buttons and arrow keys
provide another route. At 960px and below, explicit chapter navigation and a stacked
layout make the app usable at narrower widths. Speaker cues and a handoff support
rehearsal and presentation. The live demo uses ordinary text and controlled failures.
The owning [demo script](demo.md) and [project state](project-state.md) hold rehearsal
instructions and dated observations.

## Capabilities and Constraints

- Create, edit, search, explicitly save and reopen plain-text notes in one browser.
- Preserve the same mounted editor and unsaved draft across chapter changes.
- Retain the draft on save failure; offer retry or download and guard dirty navigation.
- Keep the existing `marginal.notes.v1` storage key. Local persistence is not a backup
  or device sync; simultaneous cross-tab writes are not transactional.
- Select decorative covers locally from five pre-generated themes using saved note
  text. No runtime image generation, external note transmission or model calls.
- Explore illustrative team assignments and dated cost assumptions without starting
  agents, switching models or predicting included subscription quota.
- Accounts, collaboration, rich text and device sync remain outside this milestone.
- Hosting/deployment beyond the local preview is undecided. GitHub publication ships
  source, not a deployed app. Broader product-market usefulness remains untested.

## Brand Commitments

The existing name is Marginal. The user chose minimalism, a blueprint-inspired palette,
illustrations revealed through iterations, and later readability/responsive refinement
that preserves the current design. Keep instructions and save feedback clear and
consistent. The [design record](design/README.md) and implementation hold the visual
choices and asset provenance; this init does not establish a replacement visual system.

## Evidence on Hand

- Functional demo, plain-text sample notes and five generated illustrations. Asset
  prompts and reference links live in [the design notes](design/illustrated-covers.md).
- Dated builder checks and screenshots in [project state](project-state.md), including
  save/reload, retained drafts, retry and local cover selection.
- [Impeccable review](design/impeccable-review.md): 27 passing tests, successful Svelte
  checks/build, and browser checks at phone, intermediate and desktop widths.
- No independent user study, physical-device matrix, screen-reader study, measured
  naive-prompt comparison or actual model-usage bill. Generated concepts and worked
  cost estimates must remain labelled as illustrations or assumptions.

## Product Principles

1. Teach through one bounded, working outcome and make each iteration understandable.
2. Earn trust through truthful save feedback and recoverable failures.
3. Preserve the user's thoughts and keep note processing local.
4. Keep shared guidance portable; expose optional tools and delegation explicitly.
5. Separate accepted decisions, proposals, observations and remaining uncertainty.

## Accessibility & Inclusion

Preserve labelled fields, visible keyboard focus, announced save/error feedback,
keyboard chapter navigation and reduced-motion behavior. Maintain readable controls
and wrapping text across supported layouts. These are product acceptance expectations,
not a claim of accessibility certification; physical devices and screen readers remain
unverified.

## Observable acceptance criteria

1. An empty library explains the next action. A new note accepts a title and body.
2. A title or body with non-whitespace content can save. Empty notes cannot save.
3. “Saved in this browser” appears only after a successful storage write. Reloading
   the same origin reopens the saved content exactly, including line breaks.
4. Editing sets “Unsaved changes”. A failed save retains the full draft and previous
   saved version, explains the issue, and allows retry or a draft download.
5. Switching notes or starting a new note asks before discarding unsaved content.
   Cancel keeps the draft. A browser unload guard supplements this within browser limits.
6. List and editor use consistent titles and selection. Notes open by mouse or keyboard.
   Buttons have visible focus, fields have labels, save feedback is announced.
7. Demo mode can fail exactly the next save. It never clears or edits saved notes itself.
8. Malformed stored data is preserved and reported. Conflicting edits from another
   tab cannot silently overwrite the same note.

Builder owns experience review in this chat. No independent reviewer or participant study
is implied. Done requires scoped automated checks, an actual browser journey and a handoff.

## Presentation iteration requested by the user

2026-10-18: replace the PowerPoint as the main presenter experience with an interactive
SvelteKit app. Keep the app minimal and show it growing through iterations. The user
also requested Mobbin inspiration, generated design proposals, a generic naive-prompt
comparison, an optional model/team example and scrollytelling.

Additional acceptance criteria:

9. The desktop explanation scrolls through 12 chapters while the live canvas stays
   pinned. Chapter buttons and keyboard navigation provide an alternative. Narrow
   screens use the explicit chapter layout; reduced-motion preferences are respected.
10. Writing, saving, recovery and review expose successive capabilities of the same
    editor. A chapter change does not discard its draft. Reload restores story position
    in the same tab and reads saved notes from the same localStorage key.
11. The baseline toggle labels both generated designs as illustrative. It makes no
    claim about actual model output, guaranteed quality or measured improvement.
12. Team choices update worked API-dollar and credit estimates without changing models,
    starting agents or modifying account settings. State token assumptions and sources.
13. Document tabs, role starters, scope exploration and acceptance criteria are interactive.
    Review checkboxes are presenter observations, not automatic tests.
14. A downloadable handoff records observed browser interactions and limitations.
15. Illustrations appear progressively: library covers in Save, a matching editor cover
    in Recover, and final editorial typography in Review. Search filters saved notes.
16. Select from the pre-generated cover library locally using saved note text, with
    a default for unmatched themes. No runtime generation or note transmission.
    Covers stay stable during editing and failed saves, updating after successful save.
17. Show the design first → implement → review loop explicitly: a generated reference
    before the first live chapter, a phase navigator and a path from Review back to
    Design. Preserve the mounted editor and draft while revisiting the reference.

Earlier builder choices of a dependency-free server and a normal app-first screen
are superseded by the explicit SvelteKit and interactive presentation requests.
