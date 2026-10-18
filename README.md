# Shared agents skills

Reusable development guidance for working with coding agents across projects.

## Available guidance

- [Project development workflow](PROJECT_DEVELOPMENT_WORKFLOW.md): a setup request
  for project instructions, shared documentation, skill selection, verification and
  focused chat starters. Adapt it to the target project's size and conventions.
- [Optional agent teams and cost planning](docs/optional-agent-teams.md): choose
  single-agent or delegated work, assign roles and compare supported cost estimates.

The guidance is tool- and model-agnostic. The optional interactive example uses
SvelteKit to demonstrate it. Cloning this repository changes no agent configuration.

## Interactive presentation

[Marginal](examples/note-app/README.md) explains the workflow through 12 interactive
chapters. A pinned note app gains writing, saving and recovery as the story progresses.
It includes an illustrative naive-prompt comparison, optional team/cost examples and
presenter cues. The [presentation script](examples/note-app/docs/demo.md) guides a live demo.

With Node 22.12 or newer:

```sh
cd examples/note-app
npm ci
npm run dev
```

Open [the local presentation](http://127.0.0.1:4173/). See the example's README for
production preview commands, verification and browser-storage limitations.

## Use the workflow

Open a chat in the project you want to improve, attach the workflow document or give
the agent its actual path, and ask:

> Read and apply `PROJECT_DEVELOPMENT_WORKFLOW.md` to this project. Inspect the
> existing setup first, preserve unrelated work, and implement only the missing
> guidance, shared context and verification needed for a practical workflow.

The target project's instructions and your request determine the scope. Referenced
third-party skills are optional dependencies; review availability before installation.

## Maintaining this repository

Keep guidance portable: use relative links, exclude credentials and personal project
data, and date checks of tool-specific commands and external references. Review
Markdown structure, links and factual claims when changing documentation.

See [the initial audit](docs/audits/2026-10-17.md) for publication checks and limitations.

## License

Released under the [MIT License](LICENSE).
