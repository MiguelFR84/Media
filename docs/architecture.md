# Architecture

The project separates legal knowledge from automation code.

## Layers

1. Human-readable content
   - Markdown outlines for lawyers, students and reviewers.
2. Structured examples
   - JSON files that represent a legal procedure as phases, steps, deadlines and outputs.
3. Schemas
   - Machine-readable contracts for workflow engines, agents and validation scripts.
4. Automation scripts
   - Small scripts that validate examples or transform structured content into assets.
5. Maintainer workflows
   - CI, issue templates, review checklists and Codex/API workflows.

## Design Principles

- Keep legal claims traceable to a visible source or explicit disclaimer.
- Prefer structured JSON over free-text when data is used by automation.
- Never treat generated output as legal advice.
- Make examples runnable with local tools and CI.
- Keep workflows reusable for n8n, API services and AI agents.

## Current Data Flow

```text
Markdown outline
      |
      v
Structured JSON example
      |
      v
Validation script / CI
      |
      v
Workflow, documentation or generated media
```

## Future Modules

- Civil procedure timelines
- Evidence checklist generation
- Compliance intake schemas
- Administrative appeal workflows
- Legal document extraction examples
- n8n workflow templates
- Evaluation datasets for Spanish legal automation
