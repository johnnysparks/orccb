# Architecture

Resolved technical decisions for the Oregon CCB course site.

## Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Build tool | Vite 5 | Fast dev server, zero-config for static sites, handles TypeScript |
| Language | TypeScript (vanilla, no framework) | Type safety for schemas and progress logic without React overhead |
| Content format | Markdown + YAML frontmatter (lessons), JSON (quizzes, metadata) | Easy for humans and agents to author; parseable in build scripts |
| Styling | Single CSS file with custom properties | No build-time CSS tooling needed; mobile-first with design tokens |
| Hosting | GitHub Pages via GitHub Actions | Free, deploys from `main`, supports custom domains later |
| Progress | localStorage | No backend needed; browser-local only |
| CI | GitHub Actions | Content validation on every PR; deploy on merge to `main` |

## Why no framework?

The site is primarily rendered content (lessons, quizzes) with lightweight interactivity (quiz answers, progress toggles). A framework like React or Vue would add bundle weight and complexity without proportional benefit. If interactivity requirements grow beyond what vanilla TypeScript handles cleanly, Preact is the recommended migration target (compatible API, ~3KB).

## Repository layout

```
/orccb
  index.html                           # Site shell
  package.json                         # Vite + TypeScript dev dependencies
  tsconfig.json                        # Strict TS config
  vite.config.ts                       # Build config
  /public
    /audio                             # Committed MP3 files (Phase 3+)
    /images                            # Static images
  /src
    main.ts                            # Entry point
    /components                        # Reusable UI (header, quiz block, etc.)
    /layouts                           # Page layout wrappers
    /pages                             # Page-level modules
    /lib
      types.ts                         # Shared TypeScript types
      progress.ts                      # localStorage read/write (Phase 1)
    /styles
      main.css                         # All styles, mobile-first
    /content
      /raw                             # Unprocessed research dumps (importer output)
      /wiki
        INDEX.md                       # Master index grouped by curriculum topic
        /terms/{letter}/{slug}.md      # One wiki page per concept, alphabetically filed
      /artifacts                       # Publishable intermediates (podcast scripts, etc.)
      /quizzes                         # One .json file per topic
      /metadata
        curriculum.json                # Topic list, order, weights
        sources.json                   # Global source registry
        glossary.json                  # Shared glossary terms
  /scripts
    validate-content.mjs               # Schema + integrity checks
    validate-wiki-links.mjs            # Wiki cross-link validation
  /docs                                # Project documentation
  /.github
    /workflows
      deploy.yml                       # Build + deploy to GitHub Pages
      validate.yml                     # Content validation + wiki link checks on PRs
    PULL_REQUEST_TEMPLATE.md           # PR checklist
```

## Deployment

1. Push to `main` triggers `.github/workflows/deploy.yml`
2. GitHub Actions runs `npm ci && npm run build`
3. Vite outputs static files to `dist/`
4. `actions/deploy-pages` publishes `dist/` to GitHub Pages

The site is fully static after build — no server-side rendering, no API calls at runtime.

## Content pipeline

```
  src/content/raw/          Importer agents dump research here
        |
        v
  src/content/wiki/terms/   Organizer agents convert to cited wiki pages
        |
        v
  Curator agents            Clean, dedup, cross-link, validate
        |
        v
  Build script              Reads wiki term .md + quiz .json → HTML
        |
        v
  Topic detail page         Renders lesson body, audio script, citations
        |
        v
  Quiz JSON                 Loaded client-side for interactive quiz
        |
        v
  src/content/artifacts/    Publishable intermediates (podcast scripts, etc.)
        |
        v
  Progress                  Written to localStorage on completion
```

Wiki term pages serve as the canonical source of truth. The three agent roles
(importer, organizer, curator) can run concurrently with multiple instances
each, operating on different slices of the knowledge base. See
[Agent Prompts](agent-prompts.md) for copy-paste prompts.

In Phase 0–1, content rendering may use a simple build-time MD-to-HTML transform. If the content pipeline grows complex, a Vite plugin or dedicated build step in `scripts/` will handle it.

## Future migration path

If the project later needs a backend (accounts, server-side progress, admin dashboard):

1. Content stays in Git as the source of truth
2. Add an API layer that reads from the same content files (or a synced database)
3. Replace localStorage progress with API-backed storage
4. Keep the static site as a read-only fallback

This is explicitly not planned for v1.
