# Next Chapter design

The accepted reference is [the generated desktop/mobile concept](static/design/approved-concept.png),
approved in the workflow conversation on 2026-10-22. This is a quiet personal reading
list: restrained chrome, literary headings and abstract book covers.

## Visual system

- Warm paper `#fffdfa`, outside canvas `#eeede9`, navy text `#14243f`.
- Baltic blue `#006494` for actions and read controls; muted text `#596477`.
- Georgia serif for identity and book titles; Arial/Helvetica system sans for controls.
- Desktop uses a centered sheet, small cover, title/author and read control per row.
  Below 700px, the control sits beneath the title, with a 44px minimum target.
- Covers are decorative local SVG geometry. They are not downloaded book artwork.
- The add form opens on request; title is required, author optional. Errors stay
  beside the form, status changes are announced, and keyboard focus remains visible.

## Review decisions

The implementation keeps the approved hierarchy and palette. The initial form is
closed to keep the list quiet; newly added books appear first. Empty lists and
filters have short, actionable messages. Motion is unnecessary for this app.

Impeccable's manual detector flagged the system font as an overused-font warning.
Accepted deliberately: serif headings provide character, system controls stay
readable and require no font request. Review evidence and limits are recorded in
[project state](docs/project-state.md).
