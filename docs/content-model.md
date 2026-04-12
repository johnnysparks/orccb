# Content Model

Defines the shape of every content artifact in the course.

## Topic package

Each exam topic maps to a single **topic package** — a set of files that together form the complete learner experience for that topic.

| Artifact | File | Format |
|----------|------|--------|
| Lesson | `src/content/topics/{slug}.md` | Markdown with YAML frontmatter |
| Quiz | `src/content/quizzes/{slug}.json` | JSON array of questions |
| Metadata | Entry in `src/content/metadata/curriculum.json` | JSON object |
| Sources | Referenced by ID from `src/content/metadata/sources.json` | JSON object |

### Topic Markdown frontmatter

```yaml
slug: laws-and-regulations
title: Oregon Construction Contractor Laws and Regulations
examWeightPct: 18
reviewStatus: draft          # draft | source-backed | reviewed | published | needs-revision
lastValidatedAt: null        # ISO 8601 date string or null
sourceRefs:
  - psi-cib-oregon-construction-contractors
  - oregon-ccb-prelicense
learningObjectives:
  - Explain the role of the CCB and PSI in licensing.
  - Recognize the high-level exam format and expectations.
  - Navigate source materials for open-book lookup.
```

### Topic Markdown body sections

After frontmatter, the Markdown body should contain these sections in order:

```markdown
## Summary
Brief 2-3 paragraph overview of the topic.

## Lesson
Full lesson content with headings, lists, and inline citations.

## Audio Script
Conversational version of the lesson, optimized for read-aloud.
Chunked into short paragraphs. Estimated listening time noted at top.

## Key Terms
Term definitions relevant to this topic.

## Common Mistakes
Misconceptions and trap interpretations to watch for.

## Open-Book Lookup Tips
Concrete advice for finding answers during the open-book exam.
```

### TypeScript type

See `src/lib/types.ts` for the `TopicFrontmatter` interface.

## Quiz JSON

Each topic has a companion quiz file at `src/content/quizzes/{slug}.json`.

```json
{
  "topic": "laws-and-regulations",
  "questions": [
    {
      "id": "laws-001",
      "prompt": "Which exam characteristic matters most for lookup strategy?",
      "choices": [
        "Essay format",
        "Closed book timing",
        "Open-book multiple choice",
        "Oral interview"
      ],
      "answerIndex": 2,
      "explanation": "The Oregon PSI exam is open-book and multiple choice, so lookup speed is key.",
      "sourceRefs": ["psi-cib-oregon-construction-contractors"]
    }
  ]
}
```

### Rules

- Question IDs must be globally unique across all quiz files (format: `{slug-prefix}-{NNN}`)
- Every question must have exactly 4 choices
- `answerIndex` is 0-based
- `explanation` is shown after the learner answers
- `sourceRefs` must reference valid IDs in `sources.json`

### TypeScript types

See `src/lib/types.ts` for `QuizQuestion` and `QuizFile`.

## Source registry

A single file at `src/content/metadata/sources.json` holds every citable source.

```json
{
  "id": "psi-cib-oregon-construction-contractors",
  "title": "PSI Candidate Information Bulletin — Oregon Construction Contractors",
  "url": null,
  "tier": 1,
  "description": "Official PSI exam blueprint."
}
```

### Source tiers

- **Tier 1**: Official Oregon CCB pages, Oregon statutes/administrative rules (ORS, OAR), PSI Candidate Information Bulletin
- **Tier 2**: Clearly identified secondary references used to explain — never to override — primary sources

URL is nullable because some official documents are PDFs that may move. The `id` is the stable reference key used in topic frontmatter and quiz `sourceRefs`.

## Curriculum metadata

`src/content/metadata/curriculum.json` defines the ordered topic list with weights.

```json
{
  "slug": "laws-and-regulations",
  "title": "Laws and Regulations",
  "examWeightPct": 18,
  "order": 1,
  "estimatedMinutes": 90
}
```

### Notes on exam weights

`examWeightPct` values are **approximate estimates** based on the PSI Candidate Information Bulletin content outline. They should sum to roughly 100. These will be validated and corrected as primary source material is reviewed during research passes.

## Naming conventions

- **Slugs**: lowercase, hyphenated (e.g., `laws-and-regulations`)
- **Source IDs**: lowercase, hyphenated, descriptive (e.g., `psi-cib-oregon-construction-contractors`)
- **Quiz question IDs**: `{topic-slug-prefix}-{NNN}` (e.g., `laws-001`, `contracts-003`)
- **File names**: match the slug exactly (e.g., `laws-and-regulations.md`, `laws-and-regulations.json`)
