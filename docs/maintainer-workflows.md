# Maintainer Workflows

This project is designed for AI-assisted open-source maintenance while keeping legal and privacy risks explicit.

## Codex Use Cases

- Review pull requests for schema compatibility.
- Check examples against the validation script.
- Draft release notes from merged pull requests.
- Triage issues into docs, schema, automation, security or legal-content categories.
- Identify missing disclaimers where generated content could be mistaken for legal advice.
- Propose tests for new procedure examples.

## API Credit Use Cases

API credits would be used for maintainer automation, not for private legal case processing:

- Procedure example validation and consistency checks.
- Pull request review summaries.
- Documentation linting for legal-safety disclaimers.
- Generation of draft test cases for schemas.
- Batch conversion of public educational legal outlines into structured examples.

## Guardrails

- Do not process confidential client data in public workflows.
- Keep examples synthetic or public-domain/official-source based.
- Require human review for legal content changes.
- Mark generated outputs as educational or automation examples.
- Keep CI deterministic where possible.

## Release Checklist

1. `npm test` passes.
2. New examples include a source/disclaimer.
3. Schema changes are documented.
4. README links remain valid.
5. Security/privacy implications are reviewed.
6. Changelog is updated.
