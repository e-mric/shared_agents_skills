# Storage decision

Reviewed 2026-10-18. Question: how can this small local demo reopen notes without a backend?

Decision by builder: use `localStorage` behind a small persistence module and run on a
stable localhost origin. No dependency installation or credentials are necessary.

Source facts from [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage):
storage belongs to an origin and persists across browser sessions. Browser policy can
prevent access, and private browsing has different retention. `file:` behavior is undefined.
Therefore serve over HTTP, catch access/write errors and keep the same hostname and port.
Browser storage is not a backup or cross-device sync.

[MDN beforeunload](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)
describes limitations of unload warnings. Use an in-app confirmation for navigation and
register the browser warning only while dirty. A crash or forced close can still lose
an unsaved draft. The recovery demo checks text retention in the open editor.

The test suite uses the [Node test runner](https://nodejs.org/docs/latest-v24.x/api/test.html).
Tests of injected storage failures prove application recovery logic, not every browser
quota, policy, OS or private-browsing behavior. Real browser observations live in project state.

## Scrollytelling implementation

2026-10-18. User requested SvelteKit and scrollytelling after the initial plain-JavaScript
prototype. The earlier stack choice is superseded. The storage boundary remains unchanged.

The [SvelteKit setup documentation](https://svelte.dev/docs/kit/creating-a-project)
and official CLI scaffold establish the current project structure. This project uses
SvelteKit 3, with adapter configuration in `vite.config.ts`.
[Lifecycle guidance](https://svelte.dev/docs/svelte/lifecycle-hooks) supports initializing
browser-only storage in `onMount`.

[Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
activates chapters when the explanation enters a viewport band. CSS sticky positioning
keeps the canvas in place. No additional scrollytelling library is needed for this scope.
Manual chapter navigation remains available, including on small screens.

The optional role assignments and cost assumptions use official model and Codex sources
linked inside the Team chapter. They are examples only. No agents were spawned and no
model settings were changed. Pricing and arithmetic checks do not predict a real task bill.

## User-provided Scrolly reference

The user then selected the [Svelte Scrollytelling Starter example](https://svelte.dev/playground/e59b909384c04393af26be2eb7fa859e?version=5.57.2).
Its App and Scrolly component source were inspected. It uses a local component that
binds a chapter index to the story section with the highest intersection ratio,
with a separate sticky visualization. The example credits Russell Goldenberg,
Connor Rothschild and Sebastian Lammers.

`src/lib/components/Scrolly.svelte` implements that pattern using Svelte 5 snippets,
`$bindable` state and effect cleanup. It replaces the earlier inline viewport-band
observer. No unrelated npm package was added. It retains the active chapter when
none is visible and when equally visible chapters tie, avoiding jumps and flicker.
Narrow-screen chapter navigation disables scroll activation.
