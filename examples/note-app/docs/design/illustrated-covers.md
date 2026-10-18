# Illustrated notes

2026-10-18. Implemented from the approved generated proposal in
`static/design/visual-notes-concept-v2.png`.

References inspected: [mymind](https://mobbin.com/screens/6358c67c-395f-43b8-9b91-cb5c7c41c9b8)
for visual recognition and [Craft](https://mobbin.com/screens/58c71118-15cc-4e28-945c-e446472a9e44)
for readable document previews. No reference screenshots are shipped.

## Progressive reveal

- Write: plain title and text, draft in memory.
- Save: illustrated cards, text search, explicit saving and reopening.
- Recover: the selected card's illustration appears above the editor; existing recovery controls remain.
- Review: editorial body typography, cover proportions and final spacing.

The editor remains mounted across chapters. Reduced-motion styling disables transitions.
The library scrolls internally on smaller desktop canvases.

## Local selection

`src/lib/covers.mjs` selects from five themes using local whole-word matches:

- Travel and walking: wandering path.
- Reading and learning: reading corner.
- Ideas and creativity: folded paper stars.
- Recipes and cooking: kitchen table.
- Unmatched notes: paper boat.

Title matches take priority over body matches. Within a field, the theme with the most
distinct matching words wins; ties follow the order above. Repeated words cannot
inflate a score. Matching ignores case, accents and punctuation and includes a small
English/French vocabulary. This is a heuristic, not language understanding.
Existing notes can acquire a new cover when the app reloads under the expanded rules;
no stored content is migrated. This is a deliberately
small rule-based library, not semantic AI or local image generation. No note text is
sent to a service, no runtime model calls occur and no per-note generation fee applies.
Artwork was generated once during development.

The editor derives its cover from the last saved note. Typing and failed saves leave
it stable; a successful save can update both the card and editor. New drafts use the boat.
Covers are decorative, use empty alt text, and do not alter stored note content or schema.
Search filters saved titles and bodies; its no-results state leaves the current draft alone.

## Assets and prompts

Mode: built-in Imagegen, no API fallback. Original PNGs copied into the project:

- `static/illustrations/paper-boat.png`
- `static/illustrations/wandering-path.png`

Boat prompt:

Create a wide panoramic editorial illustration for a minimal note app cover, no text, no UI, no border. A small white folded paper boat floating on rippling blue water in the foreground, rolling layered blue hills behind, delicate botanical reeds and ink branches framing the edges, a small pale sun. Sophisticated cut-paper collage mixed with finely drawn botanical ink, subtle tactile paper grain, quiet and contemplative, beautifully composed with generous open water in center. Strict blueprint palette: deep navy #13293D, Baltic #006494, cerulean #247BA0, brighter blue #1B98E0 in small accents, pale Alice blue #E8F1F2 and white. Landscape 3:1 composition. This is illustration artwork only, no letters or words.

Landscape prompt:

A wide panoramic editorial illustration only, no text or interface. A winding white walking path through layered blue hills, delicate tall grasses, wildflowers and navy botanical branches at edges, pale sky, distant tiny cypress trees. Refined tactile cut-paper collage and botanical ink with paper grain, calm, spacious, independent design journal illustration. Strict palette #13293D navy, #006494 Baltic blue, #247BA0 cerulean, #E8F1F2 pale blue and white. Landscape 3:1 composition, coherent with a poetic paper-boat note app illustration series. No letters, words, border or watermark.

Additional asset prompts: [reading, ideas and cooking](additional-theme-prompts.md).
