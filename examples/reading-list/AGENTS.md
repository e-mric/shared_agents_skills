# Next Chapter

Read [the project guide](docs/index.md), [product brief](docs/product.md) and current
[state](docs/project-state.md). This is a separate reading-list example; preserve
the note app and unrelated repository work.

- Follow the accepted generated design in `static/design/approved-concept.png`.
- User preference: automatically select relevant available skills and explain briefly.
  Use image generation for new visual directions and Impeccable for experience review.
- Keep book content local under `next-chapter.books.v1`. Never overwrite unreadable
  stored data. Announce success only after storage succeeds; retain form text on failure.
- `src/lib/books.mjs` owns validation and storage. The Svelte route owns presentation.
- Run `npm run check`, `npm test`, `npm run build`, then check the affected browser
  journey on desktop and mobile. Record expected/observed results and limits.
- Each phase reads the owning documents and exact source/revision. Update the owning
  page rather than copying chat transcripts. Keep one writer per file.
- Default to sequential roles. Use subagents or a cross-provider execution adapter only
  when the user chooses that mode; keep role contracts and shared documents portable.
  The four workflow keywords imply no global integration, deployment or publication.
