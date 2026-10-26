# Paperclip: guided reading-list trial

2026-10-24 · Paperclip `2026.1023.0` · source revision `89cfb14`.

Paperclip is an optional execution board. The repository still owns requirements,
design decisions, role contracts and completion criteria. This trial checks the
existing search with Codex, then Claude; it adds no feature.

## Use the board

Open [Shared Skills Trial](http://127.0.0.1:3100/SHA/dashboard).

| Screen | What to do |
| --- | --- |
| Projects | Keep the reading-list brief and the exact Git checkout together. |
| Tasks | Write one bounded request; name its owner and acceptance criteria. |
| Agents | Check the CLI, workspace, instructions and run settings. |
| Task conversation | Follow progress, inspect the result, or stop a live run. |
| Inbox | Resolve a concrete blocker before retrying. |

Start with [SHA-1: Codex search check](http://127.0.0.1:3100/SHA/issues/SHA-1),
then [SHA-2: Claude review](http://127.0.0.1:3100/SHA/issues/SHA-2).
Read each result and its evidence; a successful process exit alone is not approval.

For the next session: open **Agents → the selected agent → Resume**, then open the
specific task and send its bounded request. The agent overview also exposes **Run
now**, but a task message makes the intended work explicit. **Runs / Latest Run**
shows execution evidence; **Pause** prevents further work between sessions. Keep
the two agents sequential until you have a concrete reason to run in parallel.

## Write a useful task

```text
Task: Check the existing title/author search. No new feature or source edits.
Context: examples/reading-list/AGENTS.md, docs/product.md,
docs/project-state.md, route, store and tests at revision 89cfb14.
Verify: title OR author; case-insensitive; trimmed/empty query;
All/Read/Unread combinations; counts; clear; empty states; no saved-data mutation.
Deliver: reproducible findings with file/line, checks run, and limits.
Stop: report once. Do not create agents, commit, push or deploy.
```

For implementation later, keep one writer per checkout. Give the reviewer the exact
revision/diff, acceptance criteria and test evidence. Send actionable findings back
to that writer, then request another review of the fixes.

## How context moves

Both agents read the same repository revision and their assigned task. Their chat
histories are separate. Pass the first result into the second task explicitly;
record accepted decisions in the owning repository document. Paperclip's task
history helps trace work but is not automatic shared model memory.

Imagine → Implement → Test → Review remain portable phase names. They do not become
global commands merely by installing Paperclip. Here, task briefs route the phases.

## Settings for this trial

These settings describe the completed two-agent trial, not the larger preset below.

- Localhost only, embedded PostgreSQL, no startup service or global installation.
- Separate Git worktree; the main checkout's pending presentation edits are excluded.
- Local Claude/Codex CLI adapters use `engine: cli`; API keys are unset in the server.
- Explicit permission bypass flags are false. Codex uses `workspace-write`; its brief
  forbids source edits. Claude reviews with normal permissions.
- Timer heartbeats are disabled. Each agent has one concurrent run, a 240-second
  timeout and a three-run daily limit. Agents cannot create agents or skills.
- Backlog is used to hold assigned work. Moving assigned work into an actionable
  state or sending a task message can wake an agent; keep assignment and messaging
  deliberate. Recovery logic can also act on interrupted tasks. Manual invocation
  starts the scoped trial run; pause both agents when the trial finishes.

The company shows a $5 monthly accounting target and $2.50 per agent. **Hard budget
stops are disabled for this trial:** a failed pre-provider bootstrap left a receipt
pending, and the accounting retry did not resolve it. These amounts are advisory,
not a spending guarantee or a measure of remaining subscription quota. The bounded
manual runs and timeouts control this trial; check provider usage separately.

## Optional Claude + Codex setup for future projects

Use the [role/model preset](../optional-agent-teams.md#optional-claude--codex-preset)
when both providers are available. That table owns the exact models and efforts;
Paperclip supplies the task board and dispatch. The shared role contracts remain
usable with another provider or without Paperclip.

1. **Planner / CTO:** write the brief, technology recommendation and ticket criteria.
   Define how each criterion will be verified and the important failure cases before
   implementation. Coordinate the handoffs; reuse existing decisions for small changes.
2. **Designer / asset creator:** produce the design and necessary assets. Use Mobbin
   MCP or Higgsfield MCP when needed and available. Verify tool access in the actual
   worker; otherwise generate in a capable session and attach the saved files. Record
   the user's accepted direction, including empty/loading/error/recovery/mobile states,
   before implementation.
3. **Engineer:** for bugs and important rules, demonstrate the relevant failure with
   a focused test where feasible; implement one ticket and run its checks. Route hard
   tickets to the senior execution tier; keep one writer per file. Use the selected chores worker
   for bounded docs, triage and renames.
4. **Reviewer / QA:** use a separate context with the brief, accepted visuals, exact
   revision/diff, screenshots and test evidence. Report reproducible findings and
   distinguish checks actually run from supplied evidence. Inspect the assertions and
   missing cases: do these tests establish the promised behavior? Check the complete
   journey; passing tests alone do not establish completion.
5. **Fix and recheck:** return findings to the implementer, then review the fixes.
   After two unsuccessful rounds, bring the unresolved decision to the user. Record
   the final disposition, check the task status after comments, and pause workers.

Before enabling these assignments, verify each adapter's exact model/effort selection,
authentication, workspace, tools and permissions. Keep timer heartbeats off for a
manual workflow and record concurrency/run limits. Role definitions do not require
all workers to run or exist simultaneously. Planner and reviewer can use the same
model with separate task contexts. Neither role automatically inherits the other's
conversation.

This is a documented setup preference, not a live reconfiguration or a completed
multi-role trial. The historical two-agent results and accounting limits still apply.

For example, a search ticket can specify **searching never changes saved books**.
Verify both filtering behavior and storage writes, then exercise the browser journey.
Scale testing to the change; this does not require TDD for every visual or docs edit.

## Setup lessons

1. Attach the project workspace before starting a task. An agent's default directory
   alone did not provide the task's checkout.
2. Point the workspace at the Git root, not the nested SvelteKit app directory.
   This version's workspace check required `.git` metadata at the selected root.
3. Put new agent instructions in `instructionsBundle/AGENTS.md`; this version rejects
   a new agent configured through `adapterConfig.promptTemplate`.
4. A failed bootstrap can leave pending accounting even when no model work started.
   Do not interpret the board's $0 display as proof of complete cost accounting.

## Outcome

- **SHA-1 / Codex:** completed. Check passed with zero errors/warnings; all 10 tests
  and production build passed. Additional in-memory probe covered 15 combinations
  without mutations or storage writes. No reproducible functional search defect.
- **SHA-2 / Claude:** completed independent source/test inspection and reviewed the
  attached Codex report. No functional defect against the accepted criteria. Shell
  checks required approval and were denied; Claude did not independently rerun them.
- **Coordinator:** freshly verified title and padded uppercase author matching,
  visible result counts, Read-filter no-match state, and Clear preserving the Read
  filter and returning input focus. This was a desktop browser check at an isolated
  origin; mobile, assistive technology and physical devices were not checked.
- **Decision:** retain route/browser regression coverage as the concrete follow-up.
  Claude rated this gap medium; Codex rated it low. Accent/Unicode and interior-space
  matching are optional product choices beyond current criteria. Live-region
  verbosity remains an unmeasured concern requiring a real screen-reader check.
- **State:** both tasks done; both agents paused; isolated checkout clean. No source
  edits, commits, pushes, extra features or tracking integration.

Completed runs: Codex `adb9b2f6-9757-4359-881f-b6ddd2d19467`;
Claude `e3e861ea-65bd-408e-9519-d2005ee34d15`. Paperclip attached final responses to
the tasks even though agent-side API writes were unavailable. The coordinator
explicitly copied Codex's report into Claude's task description and posted the
final decision. This tested a human-coordinated handoff, not an autonomous loop.
Paperclip also scheduled a disposition-recovery run after Claude returned without
updating the task through its API. That run was cancelled while pausing the agent.
Posting the coordinator comment reopened the task to Todo; the coordinator then
marked it Done again. Check the final task state after commenting rather than
assuming a report or a paused agent makes the task complete.

## Local lifetime

The trial runtime, database and checkout live under `/tmp/shared-skills-paperclip-*`.
This is temporary evaluation data, not a durable installation. No login-start service
was installed. Before adopting Paperclip, choose a permanent data directory and
back up the instance using its documented process. Never commit the instance's
authentication files, secrets or database into this repository.

## Official references

- [Quickstart](https://docs.paperclip.ing/guides/getting-started/five-minute-path/)
- [Codex adapter](https://docs.paperclip.ing/reference/adapters/codex/)
- [Claude Code adapter](https://docs.paperclip.ing/reference/adapters/claude-code/)

Local setup details are observations from the installed version, not promises about
future releases. This trial does not enable aGiTrack or replace AI DevKit.
