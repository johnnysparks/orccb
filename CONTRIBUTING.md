# Contributing

Thank you for helping improve the Oregon CCB Pre-License Course.

## What you can contribute

- **Lesson content**: New topics or improvements to existing lessons
- **Quiz questions**: Additional questions with explanations and source citations
- **Source references**: New official sources or updated URLs for existing ones
- **Bug fixes**: Site rendering issues, broken links, validation script improvements
- **Accessibility improvements**: Better screen reader support, keyboard navigation, color contrast

## Before you start

1. Read the [Editorial Guidelines](docs/editorial-guidelines.md) — all factual claims must be source-backed.
2. Read the [Content Model](docs/content-model.md) — content must follow the defined schemas.
3. Check existing issues to avoid duplicate work.

## Content contribution workflow

1. **Fork and branch** from `main`
2. **Research first** — gather sources before writing. Use the Importer prompt in [Agent Prompts](docs/agent-prompts.md) to dump research into `src/content/raw/`.
3. **Organize into wiki pages** — use the Organizer prompt to convert raw research into wiki term pages at `src/content/wiki/terms/{letter}/{slug}.md`.
4. **Follow the schemas** — topic Markdown must have valid frontmatter; quiz JSON must match the schema.
5. **Set `reviewStatus: draft`** — never submit content as `published`.
6. **Run validation** — both `npm run validate` and `npm run lint:wiki` must pass before opening a PR.
7. **Open a PR** — use the pull request template and fill in all sections.

## Code contribution workflow

1. **Fork and branch** from `main`
2. **Run checks** — `npm run check && npm run validate` must pass.
3. **Keep it minimal** — fix the issue or add the feature; don't refactor unrelated code.
4. **Open a PR** with a clear description of what changed and why.

## What we will not accept

- Content without source citations for factual claims
- Content marked as `published` or `reviewed` in a PR (maintainers set these states)
- Legal advice or certification claims
- Content copied from copyrighted training materials
- Large PRs that mix content and code changes (split them)

## Running locally

```bash
npm install
npm run dev          # Dev server
npm run check        # TypeScript check
npm run validate     # Content validation
npm run lint:wiki    # Wiki cross-link validation
```

## Questions?

Open an issue. We'd rather answer a question before you write 2,000 words than ask you to rewrite after.
