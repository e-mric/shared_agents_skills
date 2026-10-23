# Claude/Codex reading-list coordination pilot

Date: 2026-10-23. Result: bounded cross-provider handoff and review/fix cycle completed.

## Scope and portable boundary

The user authorized AI DevKit to coordinate one implementation agent and another
reviewing the reading-list app. Bounded task: title/author search, combined with the
existing read-status filters, without changing persisted book data or the accepted
visual direction. No commit, push, deployment or tracking integration is included.

Use the existing stack. The portable brief, design, acceptance criteria and repository
files remain authoritative. AI DevKit is only the optional execution/communication
adapter. Its upstream instructions are not copied into this repository or installed
globally. The isolated trial uses AI DevKit 0.70.1 from the earlier evaluation runtime.

## Execution boundary

A separate local Git worktree starts at `6bd41bf`. Named durable AI DevKit sessions target
its reading-list directory: Codex implements; Claude reviews afterward, without editing.
Each receives a self-contained packet naming context paths, baseline, allowed edits,
criteria, checks and expected output. These are CLI sessions, not newly created desktop
chats. The coordinator relays results; shared files do not merge chat histories.

The earlier runtime had disabled installation scripts, leaving better-sqlite3 without
its native binding. A scoped dependency rebuild repaired discovery. AI DevKit then
warned that daemon discovery was empty while local fallback found active processes.
Only the named trial sessions are eligible for messaging; unrelated sessions are excluded.
Claude Code initially reported no authentication; the user completed the launched
browser login before the review phase. No credentials are stored in this report.

## Permission preflight

The first Codex session received its packet and returned a verified read-only block:
no diff, six existing tests passed, build/check not run. It was not counted as a
successful implementation. A fresh session uses a temporary launcher selecting the
standard `workspace-write` sandbox only when cwd is the isolated reading-list app.
The upstream adapter still invokes Codex exec; no sandbox bypass, global Codex setting
or upstream source change is used. The launcher is trial infrastructure outside the
repository, not a portable workflow requirement.

## Observed execution

| Phase | Session | Observed output |
| --- | --- | --- |
| Permission preflight | `reading-list-implement-20261023` · Codex | Delivered packet, returned read-only block; no edits |
| Implement | `reading-list-build-20261023` · Codex | Search helper, UI, tests and scoped documents; nine tests, check/build passed |
| Review | `reading-list-review-20261023` · Claude Code | Actual diff reviewed; actionable onboarding/count/list-label findings; command execution refused |
| Fix | Same Codex build session, resumed through AI DevKit | Findings repaired, author-only regression added; ten tests, check/build passed |
| Verify | Coordinator | Fresh ten-test run, zero Svelte errors/warnings, production build, diff check and browser regressions passed |

Claude Code 2.1.263 and Codex CLI 0.163.0-alpha.11.2 were installed. Claude authentication
was completed by the user. No provider/model substitution was configured. The adapter
used durable CLI execution (`codex exec` and `claude -p`), not the removed Codex MCP
server or desktop chat automation. Session discovery and messaging went through the
pinned AI DevKit CLI. The coordinator relayed the review rather than assuming that
both sessions shared a transcript. Local adapter session/registry state persists for
resumption; no machine-wide workflow initialization was run.

The [peer-review record](reading-list-peer-review.md) separates actionable findings
from unverified suggestions. Findings were relayed in a focused follow-up packet;
no new dependencies, accent matching, database, tracking or unrelated features were added.

## Independent verification

Integrated the bounded app diff into the normal checkout after confirming its reading-list
files had no intervening edits. The trial worktree remains available; integration initially remained uncommitted.
The user subsequently authorized committing and pushing search and these records on
2026-10-23. Fresh coordinator commands in the normal app exited zero: `npm test`
(ten passed), `npm run check` (zero errors/warnings), `npm run build` and `git diff --check`.

Browser preview at port 4184 used a separate origin and fictional demo books; the
existing port-4174 library was not modified. Observed title/author matching with padded
mixed-case input, combined read filter, no-match recovery, keyboard Clear search/focus,
full-library versus visible counts, successful add with query reset and persistence.
The empty-library issue was reproduced before the fix on a fresh localhost origin;
after the fix, a typed query under All and Read retained Add your first book.
At 390×844 there was no horizontal overflow and search measured 44px high. Desktop
1280×960 remained readable. No physical-device, Safari or screen-reader test is claimed.
Failed writes remain covered by the existing storage tests, not a new browser failure
injection. Evidence: [desktop](evidence/reading-list-search-desktop.png),
[phone](evidence/reading-list-search-mobile.png).

## Adoption decision

Useful optional adapter for a bounded CLI trial, with explicit preflight and a human
coordinator. This does not establish an autonomous lifecycle, unattended completion,
reliable daemon discovery, arbitrary desktop session messaging or broad production
readiness. The Claude review session's command permissions limited verification;
passing tests from Codex did not replace coordinator checks. No second Claude review
of the fixed diff was run; the coordinator checked the specific fixes and regressions.
Keep all portable requirements and role contracts independent of provider names.
The first read-only attempt plus implementation, review and fix made four provider
turns; durable session creation alone did not run a model.

The adapter provides no verified subscription-quota forecast in this trial. API dollars
must not be inferred from subscription access or hypothetical token estimates.
