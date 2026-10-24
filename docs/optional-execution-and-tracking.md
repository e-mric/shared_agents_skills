# Optional execution and tracking

Accepted structure, 2026-10-22:

| Layer | Authority and purpose |
| --- | --- |
| Portable core | First-run explanations, skill preferences, role definitions, shared documents and completion criteria |
| Optional execution: AI DevKit | Host-specific session control and phase skills, enabled for a concrete need |
| Optional tracking: aGiTrack | Interaction/change history and supported usage metadata, separately opted into |

The core works without either tool. Choosing execution does not enable tracking.
Cloning this repository installs neither. No third-party skills are vendored here.

A separate [Paperclip reading-list trial and usage guide](evaluations/paperclip-reading-list-trial.md)
checks manual Codex → Claude review through a local task board. It is an optional
alternative under evaluation, not a requirement or a change to the portable core.

## AI DevKit evaluation decision

**Reuse the phase contracts and fresh verification discipline; keep the runtime optional.**
The [source review](evaluations/ai-devkit-source-review.md) and
[isolated note-app pilot](evaluations/ai-devkit-pilot.md) cover version 0.70.1 at a
pinned revision. Scaffold and document lint worked. A manually executed four-phase
fixture passed a real export regression and all 33 tests. Agent dispatch, memory and
an autonomous lifecycle were not tested; this is not an end-to-end orchestration pass.

Our proposed mapping is Imagine → requirements/design/planning, Implement →
implementation, Test → testing/verification, Review → final review. AI DevKit's
`dev-design` reviews architecture/documents; visual generation still needs a separate
skill. Our four keywords are not built-in aliases.

Keep existing project documents authoritative. The tested initializer added five base
documents, and feature lint required five feature documents plus a named branch.
Use adapter documents as short pointers/phase records where compatible, not parallel
product truth. A custom docs directory changes a directory, not this phase structure.

## Before enabling an execution adapter

- Select a concrete provider/version and inspect supported session discovery, startup
  and delivery. CLI support does not establish desktop-chat control.
- Trial project initialization in a disposable copy; review every config/skill/MCP/doc
  change. Machine-wide `setup` is a separate decision. Preserve existing instructions.
- Resolve skill overlap explicitly. Upstream lifecycle startup can install all built-ins
  and fall back to Claude-specific initialization; implementation requires TDD and
  phase skills can require approval. Adopt those requirements knowingly, or use a
  separate portable router rather than describing a modified flow as stock lifecycle.
- Assign exact session identities to roles. Upstream provides `agent list`, `detail`
  and `send`; verify project and recipient, then send the authorized task packet.
  Handle unsupported delivery with a manual handoff.
- Keep local searchable memory optional. Verify facts against source and shared docs;
  a local SQLite database is not cross-machine synchronization or shared chat context.

The initial evaluation installed no live routing. A subsequent
[reading-list live trial](evaluations/reading-list-live-pilot.md) on 2026-10-23 verified
AI DevKit delivery to a Codex implementation session, a Claude Code review session
and a focused Codex fix pass. It required a permission preflight, local discovery
fallback and independent coordinator verification. This supports optional bounded CLI
use; it does not establish desktop-chat control, autonomous lifecycle completion or a
global keyword router. Keep these setup and permission limits explicit.

## aGiTrack

[aGiTrack](https://github.com/core-aix/agitrack) is a separate tracking option. Its
documentation describes recording agent turns, interaction traces and model/token
metadata with Git commits. Decide recording, retention and publication scope before
enabling it; preserve any existing commit/release policy. Recorded usage is not a
guaranteed subscription-quota forecast. No tracking or compatibility trial with AI
DevKit was performed, so concurrent operation and commit ownership remain unverified.
