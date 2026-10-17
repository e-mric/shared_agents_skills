# Shared agents skills

Reusable development guidance for working with coding agents across projects.

## Available guidance

- [Project development workflow](PROJECT_DEVELOPMENT_WORKFLOW.md): a setup request
  for project instructions, shared documentation, skill selection, verification and
  focused chat starters. Adapt it to the target project's size and conventions.

This repository currently contains a standalone workflow document. It is not an
installable skill package or plugin, and cloning it changes no agent configuration.

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
