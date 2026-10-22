# AI DevKit note-app pilot

Date: 2026-10-22. **Partial fit: reuse the method; keep execution optional.**

Version 0.70.1, upstream revision
[`be14ea1e74e6aec24cb156a8d05f50870aa9a426`](https://github.com/codeaholicguy/ai-devkit/tree/be14ea1e74e6aec24cb156a8d05f50870aa9a426).
The npm version matched upstream metadata; package integrity is in the
[result record](ai-devkit-pilot.json). Installed into a temporary prefix with install
scripts disabled. No global install, setup, daemon, MCP configuration, model call or
session message. No browser-local note data was copied.

## Executed trial

Copied the note app at `6df41d4` with its pre-existing uncommitted closing-step cleanup
to a disposable repository. All 70 snapshot files in the original app were verified
unchanged after evaluation. The temporary fixture alone received experimental code.

1. Ran the pinned CLI's help and
   `init -e codex -p requirements,design,planning,implementation,testing --yes`.
   It added `.ai-devkit.json` and five phase README templates under `docs/ai`, preserved
   `AGENTS.md`, and skipped built-in skills in this non-interactive invocation.
2. Base lint passed. Feature lint for `markdown-export-heading` failed with six missing
   requirements: five dated feature documents and the named branch.
3. Added five concise feature phase records and selected `feature-markdown-export-heading`.
   Feature lint then passed all twelve checks. This confirms structural readiness,
   not semantic completeness, working software or populated skills.

## Imagine → implement → test → review

The evaluator executed these phases manually, using upstream phase concepts and CLI
document validation. No claim is made that `dev-lifecycle` dispatched agents.

| Phase | Fixture exercise | Observed result |
| --- | --- | --- |
| Imagine | Define one-line export headings for multiline titles; keep exact body and storage. Reuse the accepted UI; no new visual surface. | Brief, exclusions and acceptance recorded in phase files |
| Implement | Extract existing export construction into a helper and connect the editor caller | Bounded helper/caller diff; no storage changes |
| Test | Add multiline/blank-title and exact-body regression; observe red, normalize only export heading whitespace, rerun checks | Regression exit 1 before fix; 33 tests pass afterward; Svelte check and build exit 0 |
| Review | Inspect diff, storage invariant and criteria; check all original app files against the starting snapshot | Diff check passes; existing app unchanged; experimental patch remains fixture-only |

The [experimental patch](ai-devkit-pilot.patch) is evidence, not a shipped note-app
feature. It can be inspected separately; applying it is outside this evaluation.

## What to reuse

- Bounded phase inputs, outputs and backward transitions.
- Verify before claiming completion; keep test evidence distinct from document lint.
- Discover and validate a recipient before sending a task packet.
- Retrieve narrow context while retaining authoritative repository documents.

Retain our task-proportionate skill selection, generated visual references, existing
document owners and explicit host capabilities. Stock lifecycle imposes more setup,
TDD and approval conventions than our portable core. See the
[source review](ai-devkit-source-review.md) for primary permalinks and differences.

## Limits and next experiment

No live model/provider routing, task creation in a desktop app, automatic four-keyword
trigger, memory-service operation, aGiTrack coexistence, independent review, UI/browser
download test for the fixture change, or cost/latency benchmark. No credentials or paid
agent sessions were needed. Current result supports an optional adapter proposal, not
production adoption. A later live-provider pilot should verify exact recipient/project,
context transfer, bounded execution and a returned result before claiming automation.
