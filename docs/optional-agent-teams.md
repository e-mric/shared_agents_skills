# Optional agent teams and cost planning

Use this when a user wants delegation or a task could benefit from independent work.
The core workflow is tool- and model-agnostic. The product/design, research,
implementation and testing chat categories remain useful with a single agent.

## 1. Ask once, then respect the preference

At setup, offer single-agent work, a small delegated team, or a custom assignment.
Explain the concrete benefit and overhead for the current task. Record the user's
choice in project state, including whether the preference lasts for this task or
project. Reuse that authorization; ask again only for a material change in scope or cost.
Default to one agent while awaiting a choice. Do not silently enable delegation.

A useful question is:

> Would you prefer one agent, a team with a planner/reviewer and an executor, or a
> custom setup? Should I prioritize cost, speed or depth? What concurrency and usage
> or spending limit should apply? I will show supported cost information first.

## 2. Offer feasible roles

Inspect the current environment for available models, delegation, permissions and
billing mode. Offer only supported assignments. Roles may share a model, run
sequentially, or be handled by a person when the tool lacks subagents.

| Role | Responsibility |
| --- | --- |
| Coordinator | Own scope, assign bounded tasks, integrate results and report evidence |
| Planner | Resolve material uncertainty and define a reviewable plan |
| Designer / asset creator | Produce the visual direction, reusable assets and implementation handoff |
| Executor | Implement one accepted outcome and run the relevant checks |
| Reviewer | Evaluate the final work against the spec and experience criteria |
| Maintainer | Handle bounded documentation, triage and mechanical changes with verification |

For short or dependent tasks, combine coordination and execution. Independent research
or review may justify separate context. A planner reviewing its own plan is not a fully
independent challenge of that plan; use the final spec and diff as review evidence.

Before delegation, record the role-to-model mapping, task boundaries, maximum concurrent
agents (state whether this includes the coordinator), budget and escalation conditions.
Assign one owner per edited file; use isolation when overlapping edits require it.
Give each task its source context, expected output and completion criteria.

Switching the coordinator's own model may require the user to change it in the host UI.
Never claim a model switch happened unless confirmed. Treat child-model overrides and
context inheritance as host-specific capabilities. Do not alter global configuration
or create user-owned chats merely to implement a team preference.

### Optional Claude + Codex preset

User-selected mapping, 2026-10-25. Use when both providers are available and the user
chooses this team. These are replaceable assignments to portable roles, not required
models or claims that this combination has been benchmarked end to end.

| Portable role | Provider / model | Effort | Expected output |
| --- | --- | --- | --- |
| CTO / planner | Claude Code · Opus 5.5 | High | Scope, architecture decisions, technology recommendation and bounded tickets |
| Designer / asset creator | Codex · GPT-6 Astra | High | Design proposal, approved reference, reusable assets and interaction states |
| Engineer — most tickets | Codex · GPT-6.1 Sol | Medium | Working change and verification evidence |
| Senior engineer — hard tickets | Codex · GPT-6.1 Sol | High | Resolution of difficult implementation, debugging or integration work |
| Reviewer / QA | Claude Code · Opus 5.5 | High | Prioritized findings against acceptance criteria, code and rendered experience |
| Maintainer — chores | Claude Code · Haiku 5.5 **or** Codex · GPT-6 Luna | Medium for Haiku; High for Luna | Focused docs, triage or rename changes with relevant checks |

The planner can coordinate the handoffs. Engineer and senior engineer are execution
tiers: start ordinary tickets at Medium and route hard tickets to High. Choose one
available chores option per task. Separate planner and reviewer contexts even when
they use the same model; the reviewer must assess the final evidence independently.

Use Mobbin MCP for design references and Higgsfield MCP for assets when needed and
available. Inspect the selected tool/skill instructions first. Verify image generation
in the actual worker: desktop tools are not automatically available to a headless
execution adapter. If unsupported, generate in a capable session or provide an
external-tool prompt and ask the user to supply the result. Save accepted assets and
their intended use in the project; implementation reads those files.

Run **plan → design/assets → accepted direction → implement/test → review → fix →
recheck**. For small tickets, reuse the existing plan/design. Give the reviewer the
brief, exact revision/diff, approved visuals and checks; return actionable findings
to the executor. After two unsuccessful fix rounds, bring the unresolved decision
to the user. One writer per file remains the default.

Verify model access, supported effort, tools and permissions before dispatch. Record
the actual assignment and any agreed fallback; this preset does not silently change
the current session, install MCP servers or create running agents. Estimate usage
using the two cost views below, including asset generation and review/fix rounds.

## 3. Show two distinct cost views

**Subscription:** show the account's available usage windows, remaining quota/credits
and reset times when the host exposes them. Label them account-wide when shared.
If usage telemetry is unavailable, say so. A role assignment does not predict a reliable
percentage of quota or a dollar charge. Separate included usage, purchased credits and
API billing. Offer a small pilot and compare observed consumption when useful.

**API:** use dated official rates for the exact models, processing tier and context
size. Estimate each role separately, then sum coordinator, delegated work and retries.
State input, cached input, cache writes and billable output assumptions (including
reasoning where applicable), plus tool/compute fees. Mark unknown fees and missing
usage fields. Model-only figures are not an all-in quote or this task's actual bill.

For a simple uncached scenario, model cost in USD is:

`sum((input_tokens * input_rate + output_tokens * output_rate) / 1_000_000)`

Add cache categories, tier/context premiums and other fees when applicable. An older
model is not automatically cheaper. Compare verified prices and total work required,
including review and rework, rather than promising equal quality from a cheaper model.

## 4. Codex example, not a portable requirement

Illustrative assignments requested by the user, reviewed 2026-10-18. Availability
must be checked in the actual Codex session. API availability alone does not establish
that the desktop host can assign a given model to each role.

| Option | Planner/reviewer | Coordinator | Executor |
| --- | --- | --- | --- |
| Single agent | Same agent | GPT-6.1 Sol | Same agent |
| Depth for decisions | GPT-6 Astra | GPT-6.1 Sol | GPT-6.1 Sol |
| Lower-cost execution | GPT-6 Astra | GPT-6.1 Sol | GPT-6 Luna for bounded work, with review |
| Custom | User's available choice | User's available choice | User's available choice |

Official Standard short-context API rates, USD per million tokens:

| Model | Uncached input | Cached input | Cache write | Output |
| --- | ---: | ---: | ---: | ---: |
| [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) | 10.00 | 1.00 | 12.50 | 50.00 |
| [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) | 2.00 | 0.10 | 2.50 | 10.00 |
| [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) | 0.10 | 0.01 | 0.125 | 0.50 |

**Worked arithmetic only, not a forecast:** assume total usage of 60,000 uncached input
and 10,000 billable output tokens, no caching, each request below the long-context
threshold, and no other fees. Allocate tokens as shown, across all calls in each role.

| Scenario | Assumed input / output tokens by model | Model-only USD |
| --- | --- | ---: |
| Single Sol | Sol 60k / 10k | 0.22 |
| Astra decisions, Sol execution | Astra 20k / 4k; Sol 40k / 6k | 0.54 |
| Astra decisions, Sol coordination, Luna execution | Astra 20k / 4k; Sol 10k / 2k; Luna 30k / 4k | 0.445 |

The fixed workload makes the arithmetic comparable, not the outcomes. Actual teams
may use more tokens through duplicated context, coordination and rework. These API
amounts cannot be converted into subscription quota percentages. Do not present them
as prices for building the note app.

For credit-based Codex billing, the same source date gives these Standard rates per
million input / cached input / output tokens: Astra 250 / 25 / 1,250 credits,
Sol 50 / 2.5 / 250, and Luna 2.5 / 0.25 / 12.5. The worked scenarios would therefore
use 5.5, 13.5 and 11.125 model credits respectively under those same assumptions.
Credit billing has no separate cache-write charge. Included subscription allowances
follow their own rules; these figures do not predict quota consumption. Credit purchase
prices depend on the plan or agreement, so no universal credits-to-USD conversion applies.

See [Codex subscription pricing](https://learn.chatgpt.com/docs/pricing),
[model and delegated usage accounting](https://developers.openai.com/api/docs/guides/agents-api/observability)
and [the Agents API's delegation capabilities](https://developers.openai.com/api/docs/guides/agents-api/multi-agent).
Those API capabilities do not imply identical desktop controls. Recheck all rates and
host capabilities before use. Report observed usage separately from estimates.
