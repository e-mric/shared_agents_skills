# Next Chapter

A small SvelteKit reading-list app demonstrating **imagine → implement → test → review**.
The approved generated design and [phase handoffs](docs/project-state.md) explain the
context shared between steps. No execution adapter is required.

With Node 22.12+:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4174/. Use `/?demo=1` for sample books when no list is saved.
The note-app presentation continues to use port 4173. Books are stored only in this
browser/origin; clearing browser storage clears them.

Verification: `npm run check`, `npm test`, `npm run build`. To preview the build:
`npm run preview`. Browser/device checks and their limits belong in project state.
