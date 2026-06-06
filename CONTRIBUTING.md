# Contributing

Thanks for helping improve Spanish legal automation infrastructure.

## Good First Contributions

- Add a new procedure outline in Markdown.
- Add a matching structured JSON example.
- Improve `schemas/civil-procedure.schema.json`.
- Add tests to `scripts/validate_examples.js`.
- Improve documentation for developers who are not lawyers.
- Add n8n or API workflow examples that use synthetic data.

## Contribution Rules

- Do not submit confidential client data.
- Use synthetic examples or public legal sources.
- Add a disclaimer when an example could be mistaken for legal advice.
- Keep JSON examples valid with `npm test`.
- Keep changes small and reviewable.

## Pull Request Checklist

- [ ] I ran `npm test`.
- [ ] I did not include confidential or personal data.
- [ ] I added or updated documentation when behavior changed.
- [ ] I marked generated or educational material as non-advice.
- [ ] I explained the legal source or procedural assumption behind the change.

## Local Setup

```bash
npm install
npm test
```

Video generation requires Playwright Chromium:

```bash
npx playwright install chromium
npm run video
```
