# Marginal: an app, built step by step

An interactive SvelteKit presentation of the shared development workflow. Scroll through
the story while a pinned canvas evolves into a working note app. A chapter strip, arrow
keys, speaker cues and a small-screen chapter layout provide presentation alternatives.

## Run locally

Node 22.12 or newer is required. From this directory:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:4173/**. The earlier `?demo=1` link also works.
Keep that hostname and port stable: browser storage belongs to the origin.

For a presentation, prefer a built preview that cannot change mid-demo:

```sh
npm run check
npm test
npm run build
npm run preview
```

Stop the development server before starting preview because both use port 4173.
Nothing is deployed or sent to a remote service by the note editor.

## Presentation route

Start with [the live presentation script](docs/demo.md). The 12 chapters cover an
illustrative generic baseline, understanding, guidance, shared context, methods, optional
teams, design, writing, saving, recovery, review and handoff. The note editor remains
mounted across chapters so changing steps retains its draft. Chapters reveal prebuilt
capabilities; the story makes no model calls or live code-generation claims.

The Design chapter pairs the generated reference with acceptance criteria. A visible
**Design first → Implement → Review** navigator connects the reference to the live
app; Review can return to Design for another iteration without losing the draft.

The team selector explores hypothetical assignments and dated model-only estimates.
It does not start agents or change models. API costs, Codex credits and included
subscription quota are different measures.

## Checks and scope

- `npm run check`: Svelte and TypeScript diagnostics.
- `npm test`: persistence, failure/conflict handling, story progression and cost arithmetic.
- `npm run build`: production bundle and Node adapter output.
- Browser walkthrough: see [dated evidence and limitations](docs/project-state.md).

Browser storage is not a backup. Saved notes stay in this browser, device and origin.
A crash or forced close may lose unsaved edits. A controlled failure proves the demo’s
recovery path, not all operating-system, quota or private-browsing behavior.

## Project context

[AGENTS.md](AGENTS.md) gives working rules. [The index](docs/index.md) links product
criteria, evidence and chat starters. [Design references](docs/design/README.md) record
Mobbin inspiration and generated concepts. The presentation replaces the need for the
PowerPoint file; that earlier artifact remains outside this example.

This example lives under `examples/note-app` in the shared_agents_skills repository.
The [repository workflow](../../PROJECT_DEVELOPMENT_WORKFLOW.md) and
[optional agent-team guide](../../docs/optional-agent-teams.md) remain tool-agnostic.
The application is an optional SvelteKit demonstration of those methods.

### Markdown notes

Write Markdown or use the compact formatting toolbar; Preview renders headings,
checklists, quotes, links, code and tables. Export `.md` from the editor. Source stays
in the existing browser-local notes, including after failed saves. Preview escapes
HTML and sanitizes output; images are explicit links rather than automatic loads.
“Transcribe voice to text · coming soon” is a disabled placeholder, with no audio or
transcription implementation.
