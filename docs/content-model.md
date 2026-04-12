# Content Model

Defines the shape of every content artifact in the course and the rules that
govern authoring, validation, and future expansion.

---

## Content Directory Layout

```
src/content/
  raw/                          # Unprocessed research dumps (importer output)
  wiki/
    INDEX.md                    # Master index grouped by curriculum topic
    terms/{letter}/{slug}.md    # One wiki page per concept, alphabetically filed
  artifacts/                    # Publishable intermediates (podcast scripts, etc.)
  quizzes/{slug}.json           # Quiz JSON files
  metadata/
    curriculum.json             # Topic list, order, weights
    sources.json                # Global source registry
    glossary.json               # Shared glossary terms
```

### Content lifecycle

1. **raw/** — Importer agents dump research material here. Files are
   self-contained research passes with source inventories and fact lists.
2. **wiki/terms/** — Organizer agents convert raw dumps into cited, cross-linked
   wiki pages. Once a raw file is fully processed, it is deleted.
3. **wiki/INDEX.md** — Groups all terms by curriculum topic for navigation.
4. **artifacts/** — Publishable intermediate materials derived from wiki content
   (podcast scripts, study guides, flashcard sets).

## Canonical vs. Derived Artifacts

**Canonical** — authored in Git; the source of truth.

| Artifact | Location | Format |
|---|---|---|
| Wiki term pages (lessons) | `src/content/wiki/terms/{letter}/{slug}.md` | Markdown + YAML frontmatter |
| Wiki index | `src/content/wiki/INDEX.md` | Markdown with `[[slug]]` links |
| Quiz questions | `src/content/quizzes/{slug}.json` | JSON |
| Source registry | `src/content/metadata/sources.json` | JSON array |
| Curriculum order | `src/content/metadata/curriculum.json` | JSON array |
| Glossary terms | `src/content/metadata/glossary.json` | JSON array |

**Working** — temporary; deleted after processing.

| Artifact | Location | Lifecycle |
|---|---|---|
| Research dumps | `src/content/raw/*.md` | Created by importer, deleted by organizer |

**Derived** — generated from canonical sources; never hand-edited.

| Artifact | How it is produced |
|---|---|
| Publishable artifacts | Generated from wiki content → `src/content/artifacts/` |
| Rendered HTML pages | Build step (Vite) transforms Markdown → HTML |
| Aggregated glossary page | Build reads `glossary.json` → renders term list |
| Sources page | Build reads `sources.json` → renders citations |
| Learner progress | Written to `localStorage` at runtime |

The rule: if you want to change something a learner sees, change the canonical
source file, not a generated output.

---

## Topic Package

Each exam topic maps to one **topic package** — a wiki term page plus a companion
quiz file that together form the complete learner experience for that topic.

```
src/content/wiki/terms/{letter}/{slug}.md   ← lesson text + audio script + key terms
src/content/quizzes/{slug}.json             ← quiz questions
```

The term page lives in an alphabetical subdirectory based on the first letter
of its slug (e.g. `terms/c/contracts.md`). Both files share the same `slug`,
which is also the key in `curriculum.json`.

### Wiki cross-links

Term pages link to each other using `[[slug]]` syntax. For example, the
contracts page can reference `[[offer]]` or `[[breach-of-contract]]`. The
`npm run lint:wiki` script validates that all wiki links resolve to existing
term files.

### Topic Markdown frontmatter

Full field reference:

```yaml
slug: contracts                       # kebab-case; matches filename and curriculum.json
title: Contracts                      # display title (3–120 chars)
examWeightPct: 12                     # approximate % from PSI CIB; must match curriculum.json
difficulty: standard                  # foundation | standard | advanced
reviewStatus: draft                   # draft | source-backed | reviewed | published | needs-revision
version: "1.0.0"                      # semver: PATCH=copy edit, MINOR=addition, MAJOR=rewrite
lastValidatedAt: null                 # ISO date (YYYY-MM-DD) of last SME review, or null
audioScriptEstMinutes: 9              # estimated listening time for the Audio Script section
sourceRefs:                           # IDs from sources.json; at least one required
  - ors-chapter-701
  - ors-701-305
  - psi-cib-oregon-construction-contractors
learningObjectives:                   # minimum 2; start each with an action verb
  - Identify the four essential elements of an enforceable contract.
  - Recall the dollar threshold at which Oregon law requires a written residential contract.
glossaryTermSlugs:                    # slugs that must exist in glossary.json
  - offer
  - acceptance
  - consideration
prerequisites:                        # optional; topic slugs to complete first
  - laws-and-regulations
```

### Topic Markdown body

Sections must appear **in this order**, with these exact headings:

```markdown
## Summary
Brief 2–3 paragraph overview. No headings inside Summary.

## Lesson
Full lesson content with subheadings (###), lists, and bold key terms.
Inline citations are prose-style ("Under ORS 701.305…"), not footnotes.

## Audio Script
<!-- Estimated listening time: N minutes -->
Conversational narration of the lesson. Short paragraphs. Active voice.
No tables or lists — this is meant to be listened to. Mention key terms
verbally rather than pointing to visual elements.

## Key Terms
**term** — definition sentence(s). One bold term per paragraph.
Copy the definitions from glossary.json; do not create parallel definitions.

## Common Mistakes
Misconceptions, exam traps, and misapplied rules.
Each item: what the mistake is and why it is wrong.

## Open-Book Lookup Tips
Specific ORS/OAR section numbers and search keywords for the open-book exam.
```

The CI validator checks that all six section headings are present.

### TypeScript type

See `src/lib/types.ts` → `TopicFrontmatter`.

---

## Quiz JSON

Each topic has a companion quiz file at `src/content/quizzes/{slug}.json`.

```json
{
  "topic": "contracts",
  "version": "1.0.0",
  "questions": [
    {
      "id": "contracts-001",
      "prompt": "Which of the following is NOT one of the four essential elements required to form an enforceable contract?",
      "choices": [
        "Offer",
        "Consideration",
        "Written signature",
        "Acceptance"
      ],
      "answerIndex": 2,
      "difficulty": "foundation",
      "explanation": "The four common-law elements are offer, acceptance, consideration, and mutual assent. Written form is not universally required — Oregon's statute applies only to residential work over $2,000.",
      "sourceRefs": ["psi-cib-oregon-construction-contractors"],
      "tags": ["contract-formation"]
    }
  ]
}
```

### Quiz validation rules

| Rule | Detail |
|---|---|
| `topic` matches filename | `contracts.json` → `"topic": "contracts"` |
| `topic` exists in curriculum | CI checks `curriculum.json` |
| `version` is semver | `x.y.z` |
| Minimum 3 questions | CI fails below this threshold |
| Exactly 4 choices | No more, no fewer |
| `answerIndex` is 0–3 | 0-based index into `choices[]` |
| `id` format | `{slug-prefix}-{NNN}` — zero-padded 3 digits |
| IDs globally unique | Across all quiz files in the project |
| `difficulty` is valid enum | `foundation` \| `standard` \| `advanced` |
| `explanation` ≥ 20 chars | Must explain correct answer and key distractor |
| `sourceRefs` ≥ 1 | Every question must cite a source |
| All `sourceRefs` resolve | CI checks against `sources.json` |

### TypeScript types

See `src/lib/types.ts` → `QuizQuestion`, `QuizFile`.

---

## Source Registry

A single file at `src/content/metadata/sources.json` holds every citable source.

```json
{
  "id": "ors-701-305",
  "title": "ORS 701.305 — Written Contract Requirements for Residential Contractors",
  "url": null,
  "tier": 1,
  "description": "Oregon statute specifying when a written contract is required and what it must contain.",
  "lastCheckedAt": null
}
```

### Source tiers

- **Tier 1** — Oregon statutes (ORS), Oregon administrative rules (OAR), PSI Candidate Information Bulletin, official CCB pages. These are the authority. Content that contradicts a Tier 1 source is wrong.
- **Tier 2** — Secondary references (textbooks, trade associations) used to explain Tier 1 material. A Tier 2 source never overrides a Tier 1 source.

`url` is nullable because some official documents are PDFs that may move or require login. The `id` is the stable key used in frontmatter and quiz `sourceRefs`. `lastCheckedAt` is updated when a human confirms the source is still current.

---

## Curriculum Metadata

`src/content/metadata/curriculum.json` defines the ordered topic list.

```json
{
  "slug": "contracts",
  "title": "Contracts",
  "examWeightPct": 12,
  "order": 5,
  "estimatedMinutes": 75
}
```

`order` and `slug` must both be unique across all entries. `examWeightPct` values do not need to sum to exactly 100 (they are estimates from the PSI CIB).

---

## Glossary

`src/content/metadata/glossary.json` is the global term registry.

```json
{
  "slug": "change-order",
  "term": "Change Order",
  "definition": "A written, signed amendment to an existing construction contract that documents a change in scope, price, or schedule.",
  "sourceRefs": ["ors-chapter-701"],
  "relatedTerms": [],
  "topicSlugs": ["contracts"]
}
```

### Glossary rules

- `slug` is globally unique, kebab-case.
- `definition` is one to three plain-language sentences grounded in the source.
- `relatedTerms` are bidirectional: if `offer` lists `acceptance`, `acceptance` should list `offer`.
- `topicSlugs` must stay in sync with each topic's `glossaryTermSlugs` frontmatter field.
- All `sourceRefs` must resolve to entries in `sources.json`.
- The `Key Terms` section in a topic Markdown file should use the same wording as the glossary definition (copy-paste; do not paraphrase).

---

## Difficulty Levels

All topics currently ship at `difficulty: "standard"`. The field is present now
so that Phase 4 difficulty-split variants can be added without a schema migration.

### What each level means

| Level | Quiz question character | Topic variant purpose |
|---|---|---|
| `foundation` | Single-fact recall | Simplified lesson for learners who need basics |
| `standard` | Apply a rule to a scenario | Core exam-level content (current default) |
| `advanced` | Analyze across multiple rules or edge cases | Deep-dive for professionals; edge-case scenarios |

### Expansion plan (Phase 4)

When difficulty splits are needed, add variant topic files alongside the existing one:

```
src/content/wiki/terms/c/contracts.md                 ← standard (existing)
src/content/wiki/terms/c/contracts.foundation.md      ← simplified variant
src/content/wiki/terms/c/contracts.advanced.md        ← deep-dive variant
```

Frontmatter `difficulty` distinguishes them. Curriculum and quiz IDs remain
anchored to the slug; the UI selects which variant to render based on the
learner's chosen difficulty path.

Quiz items already carry individual `difficulty` values, so filtered quiz modes
(`foundation` review vs. full `standard` quiz) work today without schema changes.

---

## Naming Conventions

### Slugs

- **Pattern**: `^[a-z][a-z0-9-]*[a-z0-9]$` — lowercase letters, digits, and hyphens; no leading or trailing hyphens.
- **Topic slugs** match the curriculum. Use the shortest unambiguous form: `contracts`, `oregon-lien-law`, not `module-5-contracts`.
- **File names** match the slug exactly: `contracts.md`, `contracts.json`.
- **Glossary term slugs** use the kebab-case form of the term: `change-order`, `breach-of-contract`, `liquidated-damages`.

### Source IDs

Follow the pattern `{source-type}-{identifier}`:

| Source type | Format | Examples |
|---|---|---|
| ORS chapter | `ors-chapter-{n}` | `ors-chapter-701` |
| ORS section | `ors-{chapter}-{section}` | `ors-701-305` |
| OAR chapter | `oar-{division}-{chapter}` | `oar-812-009` |
| Official doc | `{org}-{doc-type}-{keyword}` | `psi-cib-oregon-construction-contractors` |
| CCB pages | `oregon-ccb-{topic}` | `oregon-ccb-prelicense` |

IDs are lowercase, hyphenated, and must be unique. Do not re-use or rename an
existing ID — add a new one if the source has changed.

### Quiz question IDs

- **Format**: `{topic-slug-prefix}-{NNN}` — a consistent prefix per topic and a zero-padded 3-digit integer.
- The prefix should be the shortest unambiguous slug abbreviation: `contracts-001`, `lien-003`, `safety-012`.
- IDs must be **globally unique** across all quiz files. Do not recycle numbers when questions are deleted; retire the ID.
- Example sequence: `contracts-001`, `contracts-002`, `contracts-003`, `contracts-004`, `contracts-005`, `contracts-006`.

### Version strings

Semver (`x.y.z`) on both topic files and quiz files:

| Change | Increment |
|---|---|
| Copy edits, typo fixes, minor wording | PATCH (`1.0.0` → `1.0.1`) |
| New section, new question, new glossary term | MINOR (`1.0.0` → `1.1.0`) |
| Structural rewrite or source update changes meaning | MAJOR (`1.0.0` → `2.0.0`) |

---

## Review Status Lifecycle

```
draft  →  source-backed  →  reviewed  →  published
                                 ↑              ↓
                           needs-revision  ←──────
```

| Status | Meaning | Renders in production? |
|---|---|---|
| `draft` | Created; sources not verified | No |
| `source-backed` | Every claim traced to a Tier 1 source; CI passes | No |
| `reviewed` | SME reviewer confirmed accuracy; `lastValidatedAt` set | No |
| `published` | Live on site | Yes |
| `needs-revision` | Source changed or error reported; remove from production | No |

Advancing from `draft` → `source-backed` requires:
1. All `sourceRefs` resolve in `sources.json`.
2. `npm run validate` exits with code 0.

Advancing to `reviewed` requires:
1. A human reviewer reads the lesson against its sources and updates `lastValidatedAt`.

---

## CI Validation

`scripts/validate-content.mjs` is the single validation entry point. Run it with:

```sh
npm run validate
```

It exits with code 0 on success and code 1 on any failure. GitHub Actions runs
this on every PR targeting `main`.

### What is checked

**`npm run validate`** (scripts/validate-content.mjs):

1. `sources.json` — shape, unique IDs, required fields
2. `curriculum.json` — shape, unique slugs and `order` values
3. `glossary.json` — shape, unique slugs, source ref integrity, related-term cross-references
4. Topic `.md` files (at `wiki/terms/{letter}/`) — frontmatter shape, enum values, semver format, source ref integrity, glossary term integrity, prerequisite integrity, required section headings, slug↔filename agreement
5. Quiz `.json` files — shape, question count ≥ 3, ID format, globally unique IDs, 4 choices per question, valid `answerIndex`, difficulty enum, source ref integrity, slug↔filename agreement
6. Coverage — every curriculum slug that has a topic file also has a quiz file and vice versa

**`npm run lint:wiki`** (scripts/validate-wiki-links.mjs):

1. Term file placement — each term is in the correct alphabetical subdirectory
2. Wiki cross-links — all `[[slug]]` links in term files resolve to existing pages
3. INDEX.md links — all index entries checked (missing pages are warnings, not failures)
4. Orphan detection — term files not listed in INDEX.md

Schema files in `schema/*.schema.json` (JSON Schema Draft-07) document the same
rules for IDE tooling. If your editor supports JSON Schema, point it at these
files for in-editor validation while authoring.
