# Spanish Legal Procedure Automation

Open-source toolkit for Spanish and EU legal-tech automation. The project turns procedural legal knowledge into reusable schemas, examples, prompts, workflow patterns and validation scripts for developers building AI-assisted legal operations.

> Status: early-stage, public MIT-licensed project. The repository is being prepared as a reusable foundation for Spanish legal procedure automation, not as legal advice.

## Why This Exists

Spanish legal-tech teams repeatedly rebuild the same base components: legal intake forms, document classification, procedural checklists, evidence timelines, compliance questionnaires and data extraction schemas. This repository provides a shared starting point so developers, lawyers and compliance teams can build safer and faster.

The first module focuses on the Spanish ordinary civil trial (`juicio ordinario civil`) and demonstrates how a legal procedure can be represented as Markdown, structured JSON and educational media.

## What Is Included

- Structured civil procedure outline: [`juicio-ordinario-civil.md`](juicio-ordinario-civil.md)
- JSON example: [`examples/juicio-ordinario-civil.json`](examples/juicio-ordinario-civil.json)
- JSON schema: [`schemas/civil-procedure.schema.json`](schemas/civil-procedure.schema.json)
- Validation script: [`scripts/validate_examples.js`](scripts/validate_examples.js)
- Video generation script: [`make_video.js`](make_video.js)
- Project architecture: [`docs/architecture.md`](docs/architecture.md)
- Roadmap: [`docs/roadmap.md`](docs/roadmap.md)
- Codex for OSS application notes: [`docs/codex-for-oss-application.md`](docs/codex-for-oss-application.md)

## Main Use Cases

- Spanish civil procedure workflow structuring
- Legal document intake automation
- Compliance checklist generation
- Legal data extraction into structured formats
- n8n or API workflow templates for legal operations
- AI-assisted document processing with traceable outputs
- Educational legal content generation

## Quick Start

```bash
npm install
npm test
```

Validate the bundled structured procedure example:

```bash
npm run validate
```

Generate the civil procedure video locally:

```bash
npx playwright install chromium
npm run video
```

If Chromium is already installed, you can point the script to it:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome npm run video
```

## Repository Structure

```text
.
├── docs/                         # Architecture, roadmap, maintainer docs
├── examples/                     # Valid structured legal examples
├── schemas/                      # JSON schemas for legal procedures
├── scripts/                      # Validation and automation scripts
├── juicio-ordinario-civil.md     # Human-readable civil procedure outline
├── juicio-ordinario-civil.mp4    # Generated educational video
├── make_video.js                 # Playwright video generator
└── package.json
```

## Current Module: Ordinary Civil Trial

The first module models a Spanish ordinary civil trial from pleadings through enforcement:

1. Pleadings
2. Preliminary hearing
3. Trial hearing
4. Judgment
5. Appeals
6. Enforcement

The same knowledge is represented in Markdown and JSON so it can be used by humans, workflow engines, validation scripts and AI agents.

## Legal and Safety Notice

This repository is for developer tooling, education and workflow automation. It is not legal advice and does not replace case-specific analysis by a qualified lawyer. See [`docs/data-privacy.md`](docs/data-privacy.md) and [`SECURITY.md`](SECURITY.md).

## Contributing

Contributions are welcome. Good first contributions include:

- Adding another Spanish procedure as Markdown + JSON
- Improving the schema or validation script
- Adding n8n workflow examples
- Adding tests for legal timeline validation
- Improving documentation for non-lawyer developers

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a pull request.

## Maintainer Workflows

The repository is designed to benefit from Codex and API credits for:

- Pull request review and triage
- Schema validation and regression tests
- Release checklist automation
- Documentation consistency checks
- Security review of legal-data handling examples

See [`docs/maintainer-workflows.md`](docs/maintainer-workflows.md).

## License

MIT. See [`LICENSE`](LICENSE).
