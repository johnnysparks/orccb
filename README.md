# Oregon CCB Pre-License Course

A free, open-source study site for the Oregon Construction Contractors Board pre-license exam.

## What is this?

Oregon requires aspiring construction contractors to complete a 16-hour pre-license training and pass a PSI-administered exam: 80 multiple-choice questions, open-book, 3 hours, 70% to pass.

This project is a static website that provides structured, source-backed study materials for that exam — hosted on GitHub Pages, stored entirely in Git, with no backend or accounts required.

## Status

**Pre-launch.** The project is being scaffolded. No lessons are published yet. See the [Roadmap](ROADMAP.md) for the execution plan.

## Quick start (development)

```bash
npm install
npm run dev          # Start Vite dev server
npm run build        # Production build to dist/
npm run validate     # Run content validation checks
npm run lint:wiki    # Validate wiki cross-links
npm run check        # TypeScript type checking
```

## Project structure

```
/orccb
  index.html                          # Site entry point
  /public                             # Static assets (audio, images)
  /src
    main.ts                           # App entry point
    /components                       # UI components
    /layouts                          # Page layouts
    /pages                            # Page modules
    /lib                              # Shared utilities and types
    /styles                           # CSS
    /content
      /raw                            # Unprocessed research dumps
      /wiki
        INDEX.md                      # Master index by curriculum topic
        /terms/{letter}/{slug}.md     # Wiki term pages, alphabetically filed
      /artifacts                      # Publishable intermediates (podcast scripts, etc.)
      /quizzes                        # Quiz JSON files
      /metadata                       # curriculum.json, sources/*.json, glossary/*.json
  /scripts                            # Build and validation scripts
  /docs                               # Project documentation
  /.github/workflows                  # CI: deploy + content validation
```

## Documentation

| Document | Purpose |
|----------|---------|
| [Roadmap](ROADMAP.md) | Phased execution plan and milestones |
| [Architecture](docs/architecture.md) | Stack decisions, deployment, repo layout |
| [Content Model](docs/content-model.md) | Topic, quiz, and source schemas |
| [Curriculum Map](docs/curriculum-map.md) | Topic list, weights, ordering, first-3 rationale |
| [Editorial Guidelines](docs/editorial-guidelines.md) | Source tiers, review process, validation |
| [Progress Model](docs/progress-model.md) | localStorage schema for learner state |
| [Agent Prompts](docs/agent-prompts.md) | Copy-paste prompts for agent-driven workflows |
| [Contributing](CONTRIBUTING.md) | How to contribute content and code |

## Principles

1. **Useful before comprehensive.** Ship 3 credible topics before attempting 14.
2. **Source-backed.** Every factual claim traces to an official Oregon source or the PSI bulletin.
3. **Static-first.** No backend, no database, no accounts. GitHub Pages + localStorage.
4. **Agent-friendly.** Content schemas and validation make it safe for agents to research, generate, and submit content through the standard review process.

## Disclaimer

This is a community study aid, not an official Oregon CCB product. Always verify information against current official sources before relying on it for exam preparation.

## License

TBD — an open license will be chosen before first public launch.
