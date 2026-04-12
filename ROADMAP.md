# Roadmap

Phased execution plan for the Oregon CCB Pre-License Course site.

## Phase 0 — Foundation

Goal: a deployable empty site with content schemas in place.

- [ ] Finalize stack (Vite + vanilla TypeScript — decided)
- [ ] Scaffold repo with directory structure, configs, CI workflows
- [ ] Deploy blank GitHub Pages site from `main`
- [ ] Define content schemas: topic frontmatter, quiz JSON, source registry
- [ ] Implement `validate-content` script and CI check

## Phase 1 — Site Plumbing

Goal: a navigable site shell with working progress tracking.

- [ ] Build page skeletons: home, curriculum index, topic detail, quiz, progress, sources, methodology
- [ ] Implement client-side router or multi-page Vite setup
- [ ] Implement localStorage progress store (`src/lib/progress.ts`)
- [ ] Build minimal UI components: header/nav, topic card, lesson section, quiz block, progress badge
- [ ] Source registry rendering on the sources page
- [ ] Mobile-first responsive CSS

## Phase 2 — Thin Curriculum Slice

Goal: 3 complete, source-backed, published topics.

- [ ] Lock curriculum map from PSI outline (14 topics, weights estimated)
- [ ] Research pass: Laws and Regulations
- [ ] Research pass: Contracts
- [ ] Research pass: Hiring and Managing Employees
- [ ] Generate lesson packages for all 3 (summary, body, audio script, glossary, quiz)
- [ ] Validate and review each package against sources
- [ ] Publish first 3 topics to the live site
- [ ] Write methodology page explaining how content is produced and checked
- [ ] Add disclaimer on every page

## Phase 3 — Learning Quality

Goal: make the published content easier to study.

- [ ] Polish audio-first mode: script formatting, estimated listening time, Speech Synthesis integration
- [ ] Improve quizzes: better distractors, more questions per topic
- [ ] Add glossary page and per-topic key-terms sidebar
- [ ] Add open-book lookup drills
- [ ] Refine progress UX: completion %, topic-level indicators

## Phase 4 — Scale Content

Goal: expand from 3 topics to all 14, responsibly.

- [ ] Research and generate remaining 11 topic packages
- [ ] Validate each through the editorial review process
- [ ] Open external contributions (CONTRIBUTING.md, PR template, editorial guardrails)
- [ ] Add committed audio assets (generated MP3s)
- [ ] Add search and topic filtering
- [ ] Add CI checks: reading level lint, citation coverage, per-topic completeness score

## Definition of Done — First Public Launch

The site is ready for first public launch when:

1. Site deploys reliably on GitHub Pages
2. Curriculum index renders from content files
3. At least 3 modules are source-backed and reviewed
4. Each published module includes: lesson text, audio script, quiz, and citations
5. Learner progress works and survives page reloads
6. Methodology and source pages explain how material is produced and checked
7. CI blocks malformed content from landing in `main`

## Iteration Loops

These loops repeat throughout the project lifecycle:

- **Loop A: Research -> Generate -> Validate -> Publish** — for every new topic
- **Loop B: Publish -> Observe weak spots -> Revise** — after real learners use the site
- **Loop C: Source changes -> Diff -> Revalidate** — when official materials update
- **Loop D: Topic exists -> Derive formats** — turn one topic into recap, audio script, quiz, lookup drill, glossary cards
