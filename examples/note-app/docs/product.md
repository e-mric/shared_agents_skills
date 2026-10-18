# Product intent

2026-10-18. User request: build the simple note app as a live demonstration of the
[shared workflow](https://github.com/e-mric/shared_agents_skills/blob/4ff6194/PROJECT_DEVELOPMENT_WORKFLOW.md).

Audience: a presenter explaining work with coding agents, and people capturing short notes.
Milestone: create, edit, explicitly save and reopen plain-text notes in one browser.
No accounts, collaboration, rich text or device sync in this milestone.

Implementation choices by the builder: dependency-free web app, browser storage,
app name “Marginal”, paper tones, a quiet green accent and a large serif writing area.
The notebook reference gives writing visual priority. Clear save feedback supports trust.
These choices implement the authorized demo scope; usefulness to a broader market is untested.

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

Earlier builder choices of a dependency-free server and a normal app-first screen
are superseded by the explicit SvelteKit and interactive presentation requests.
