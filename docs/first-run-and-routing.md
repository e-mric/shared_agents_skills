# First run and task routing

This is portable workflow guidance. Keywords are conventions, not installed commands.
Use it when setting up a project or introducing the workflow to a new user.

## First run

1. Inspect project instructions, current work and available skills/tools. Explain the
   recommended skills in one sentence each: purpose, trigger and expected output.
   Separate available skills from suggestions that need installation.
2. Ask once: **explain and confirm choices**, or **automatically select relevant
   available skills and announce them**? Record the preference and its scope in project
   state. Reuse prior answers. Required skills still apply; selecting all skills is not
   the automatic mode.
3. Agree on single-agent work or a delegated team, responsibilities and cost limits.
   Use [team and cost planning](optional-agent-teams.md) when delegation is wanted.
4. Prepare the [four focused chat categories](../PROJECT_DEVELOPMENT_WORKFLOW.md#7-use-four-focused-chat-categories).
   Create conversations when explicitly requested and supported by the host. Record
   their exact identities, project/revision and role; otherwise provide chat starters.
5. Explain the keyword map below and demonstrate one context handoff. Setup is done
   when the user understands the choices and the next bounded outcome is ready.

## Keyword map

| Keyword | Responsibility | Required context | Completion |
| --- | --- | --- | --- |
| Imagine | Product/design | User problem, constraints, references and current app | Accepted brief, design direction and observable criteria |
| Implement | Implementation | Accepted brief/design, selected technologies, execution preference, source, status and criteria | Working diff with verification evidence |
| Test | Testing | Exact revision/build, criteria, journey and demo data | Pass/fail/inconclusive results with reproduction and limits |
| Review | Reviewer | Brief/design, diff, test results and remaining uncertainty | Prioritized findings or scoped acceptance; route fixes back |
| Doc | The role owning the topic | Current authoritative document and verified change | Updated owning document, with uncertainty preserved |

Research can support any phase. Visual Imagine work retains **generate design →
implement → review**. Check image-generation capability first. If unavailable, ask
whether the user wants a prompt for an external image tool, then accept the returned
image as a proposed reference. Use the [visual fallback](optional-design-writing-skills.md#image-generation-fallback)
for the prompt and approval handoff. Skill names are selected from the host's actual catalog:
for example imagegen for a visual reference, diagnosing-bugs for a failure, or
Impeccable for readability. A keyword neither installs a skill nor grants permission
to message another conversation.

## Before implementation

1. Inspect the existing stack and constraints. Suggest technologies in plain language:
   what each does, why it fits, and the main trade-off. Reuse a suitable existing stack;
   mention alternatives only where they change a meaningful decision. Verify current
   compatibility and costs when those facts affect the recommendation.
2. Present the recommended stack for confirmation or adjustment before scaffolding a
   new project or materially changing its architecture. Reuse an already accepted choice.
   Record the decision and rationale with the brief.
3. Ask whether the user wants one agent or a subagent workflow, unless their recorded
   preference already covers this project. Explain proposed roles, context handoffs and
   overhead. Show subscription usage and API cost estimates where supported; label
   unknown costs rather than inventing them. Use [team planning](optional-agent-teams.md)
   for details. If delegation is unavailable, explain this and offer sequential roles.
4. Record the selected mode and stack in project state. Begin implementation once both
   are settled. A preference question does not itself launch agents or create chats;
   use the host's authorization rules and tools for those actions.

## Context handoff

Keep rules in `AGENTS.md`, navigation in `docs/index.md`, accepted requirements/design
in their owning pages, and current progress/evidence in `docs/project-state.md`.
The destination reads only relevant material and inspects current source/status.

Send a bounded task packet: **goal, role, project/revision, context paths, criteria,
allowed edits, expected output and verification limits**. Include the accepted skill
and delegation preferences. Verify the destination identity and project before sending;
record actual receipt/result rather than assuming delivery.

Repository files carry durable knowledge; chat transcripts and local databases are
separate. Same-checkout chats can see current files but must coordinate edits. Separate
worktrees need the relevant commits or an explicit handoff; they do not share unsaved
files automatically. Prefer one writer per file. Without messaging support, present the
packet for manual transfer and continue useful work in the current chat.

For optional host execution and tracking, see [adapters](optional-execution-and-tracking.md).
