# Editorial Guidelines

Rules for creating, reviewing, and publishing course content.

## Core rule

Every factual claim in a published lesson must be traceable to a source in `sources.json` or explicitly marked as **study guidance** (not a source-backed fact).

## Source tiers

### Tier 1 — Primary (authoritative)

- Oregon CCB official pages and publications
- Oregon Revised Statutes (ORS) and Oregon Administrative Rules (OAR)
- PSI Candidate Information Bulletin

Tier 1 sources are the ground truth. Course content must not contradict them.

### Tier 2 — Secondary (explanatory)

- Industry guides, textbooks, and educational materials that explain or contextualize Tier 1 sources
- Used only to clarify — never to override or extend primary sources

Tier 2 sources must be clearly identified as secondary when cited.

## Research output

Before generating any lesson content, an importer agent runs a research pass
that produces a dump file in `src/content/raw/`. Each research dump must contain:

1. **Source inventory** — list of Tier 1 and Tier 2 sources consulted
2. **Claim list** — specific facts extracted from sources
3. **Citation anchors** — which claims map to which sources
4. **Unresolved questions** — gaps where sources are silent or ambiguous
5. **Confidence rating** — high / medium / low for the topic overall

An organizer agent then converts the raw dump into wiki term pages at
`src/content/wiki/terms/{letter}/{slug}.md` and deletes the raw file once
fully processed. See [Agent Prompts](agent-prompts.md) for the importer and
organizer roles.

## Content review states

Every topic file has a `reviewStatus` in its frontmatter:

| State | Meaning |
|-------|---------|
| `draft` | Initial generation, not yet checked against sources |
| `source-backed` | Claims verified against source inventory |
| `reviewed` | Passed editorial review checklist |
| `published` | Live on the site |
| `needs-revision` | Flagged for update (source changed, error found, etc.) |

Content must pass through `draft` -> `source-backed` -> `reviewed` -> `published` in order. It can move to `needs-revision` from any state.

## Review checklist

Before a topic moves from `source-backed` to `reviewed`:

- [ ] Main claims are backed by Tier 1 sources
- [ ] Oregon-specific wording is accurate (not generic multi-state advice)
- [ ] Nothing is outdated or overclaimed beyond what sources support
- [ ] Quiz answers are unambiguous — only one choice is defensibly correct
- [ ] Audio script is faithful to the lesson body (no added unsupported claims)
- [ ] Citations actually support the sentences they are attached to
- [ ] Key terms match definitions in source material
- [ ] Open-book lookup tips reference real sections/pages in source documents

## Writing rules

- **Clarity over formality.** Write for someone studying after work, not a legal audience.
- **Short paragraphs.** 2-4 sentences max for lesson text; 1-2 for audio scripts.
- **No speculation.** If a source doesn't cover it, say so — don't fill the gap with guesses.
- **Distinguish fact from advice.** "ORS 701.005 defines a contractor as..." (fact) vs. "A good study strategy is to tab your reference binder to this section" (guidance).
- **No legal advice.** The course helps learners study; it does not provide legal counsel.

## Validation rules (enforced in CI)

These are checked automatically on every PR:

**Content validation** (`npm run validate`):
- Topic files (at `wiki/terms/{letter}/`) must have valid YAML frontmatter matching the schema
- All `sourceRefs` in frontmatter and quizzes must exist in `sources.json`
- Quiz question IDs must be globally unique
- Quiz files must have exactly 4 choices per question
- `answerIndex` must be 0-3
- Required frontmatter fields must be present

**Wiki link validation** (`npm run lint:wiki`):
- All `[[slug]]` cross-links in term files must resolve to existing pages
- Term files must be in the correct alphabetical subdirectory
- INDEX.md entries are checked (missing pages produce warnings)

## Content update policy

When official source material changes (new PSI bulletin, ORS amendment, CCB rule change):

1. Identify affected topics via `sourceRefs`
2. Set `reviewStatus` to `needs-revision`
3. Run a targeted research pass on the changed source
4. Update lesson content, quiz items, and citations
5. Re-validate through the normal review process
