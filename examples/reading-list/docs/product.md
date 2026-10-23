# Next Chapter — accepted brief

2026-10-22. A simple reading list: save books and mark them as read. The user approved
the generated desktop/mobile design, then requested implementation and a step-by-step
explanation of the context needed by each phase.

## Scope and direction

Add a title and optional author; mark a book read/unread; filter All/Unread/Read;
retain the list across reloads in this browser. Search titles or authors within the
selected read-status filter. No accounts, synchronization or book-cover API.

Follow the [approved reference](../static/design/approved-concept.png): warm white,
navy type, Baltic-blue actions, literary serif titles and simple geometric covers.
The image is a design reference. Build real controls and represent book content as
text. Covers are decorative local SVG shapes, not fetched commercial cover artwork.

## Technology recommendation

For this small browser-local example:

| Technology | Purpose and reason | Trade-off |
| --- | --- | --- |
| SvelteKit + Svelte | Interactive UI; reuse this repository’s working example conventions | A framework/build step for a small app |
| TypeScript checking + JavaScript storage module | Check UI integration; keep storage directly testable | The storage boundary needs maintained type declarations |
| Plain CSS + local SVG | Match the approved design with a small dependency surface | Responsive styles are maintained by the project |
| Browser localStorage | Save the small list without a backend or account | Browser/origin only; no sync or backup |
| Node test runner + Svelte checks + browser review | Verify storage behavior, integration and the actual journey | Browser checks here are manual, not a browser regression suite |

These document the stack already implemented; they were not presented as a separate
approval step beforehand. Future new projects should receive the recommendation first.
A backend/database becomes a separate decision if accounts or device sync enter scope.

## Acceptance criteria

1. Add book reveals a short inline form with labelled Title and Author (optional).
   Reject blank titles; cancel returns focus to Add book without adding anything.
2. Successful save displays the book, updates the count and closes the form. Books
   with no author remain legible without a fabricated author.
3. Each book can be marked read and unread with a labelled keyboard-operable control.
   Counters and All/Unread/Read filters reflect the current state.
4. A reload retains saved titles, authors and read statuses exactly.
5. An empty library and an empty filter explain the next action briefly.
6. Failed writes retain form text or the previous read state, with an actionable error.
   Invalid stored data is preserved and writes remain blocked until it can be loaded.
7. Desktop and mobile follow the reference with wrapping titles, clear focus, readable
   text and touch-sized controls. No page-wide horizontal overflow at 390px.
8. Demo mode (`?demo=1`) supplies sample books only when no list has been saved. It
   does not clear or replace an existing list. Storage is not a backup or device sync.
9. Search title or optional author case-insensitively, trimming query whitespace.
   Empty queries retain the selected All/Unread/Read filter. For a nonempty library,
   no matches offer Clear search, which retains the filter and focuses the input.
   An empty library keeps its onboarding and Add your first book affordance even
   while searching. Library counts remain unfiltered; active search shows a separate
   visible result count within the selected filter, associated with the search input.
   The list label identifies search results within that filter. Searching never
   writes storage or changes books. After successful additions, clearing the query
   complements the existing All-filter reset so the new book is visible.

Implementation receives this brief, the approved reference, storage constraints and
the test commands. Test receives the exact implementation plus these criteria. Review
receives the same design/brief, diff and fresh test/browser evidence.
