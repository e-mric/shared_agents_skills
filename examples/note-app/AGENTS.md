# Marginal workflow presentation

An interactive SvelteKit presentation that evolves into a real note app. At task start
read [the index](docs/index.md), [project state](docs/project-state.md), and relevant links.

- For new visual surfaces or substantial redesigns, follow the user's preference:
  generate a design first, implement it, then review the rendered result. This applies
  to app screens and landing/showcase pages, overriding Impeccable's code-first default
  for app screens. Bounded fixes can use the already accepted design as their reference.
- Preserve existing notes, the storage key and unrelated presentation files. Use demo data.
- Follow Svelte 5 / SvelteKit 3 conventions. Keep browser storage inside client lifecycle.
- `src/lib/notes.mjs` owns persistence and conflicts. `NoteEditor.svelte` owns note UI.
  `src/lib/story.mjs` owns chapter content and dated cost arithmetic. The route coordinates
  scrollytelling; preserve the mounted editor and draft across chapter changes.
- Store note content as text. Only successful storage writes justify “Saved”. Keep the
  full draft on failure. Treat generated baseline imagery as illustrative, not empirical evidence.
- Follow `docs/product.md`. Run `npm run check`, `npm test` and `npm run build`, then
  check affected journeys in a browser. Tests of mocked storage do not replace browser checks.
- Date pricing sources and keep API dollars, Codex credit billing and included quota distinct.
  The model selector explores examples; it must never silently start agents or change settings.
- Update owning documentation when behavior or evidence changes. Report verification limits.
- Keep skills and delegation proportionate. User requested no actual subagent team for this build.
- Work remains local unless the user authorizes publication. Preserve unrelated work.
