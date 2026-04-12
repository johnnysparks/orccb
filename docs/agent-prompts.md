# Agent Prompts

Reusable prompts for agent-driven workflows. Each prompt targets a specific step in the content pipeline.

These are reference material for operators driving the project with AI agents. They are not used by the site itself.

---

## 1. MVP Scoping

```text
You are building the MVP scope for a free, open Oregon CCB pre-license course site.

Constraints:
- host on GitHub Pages
- static-first architecture
- assets stored in Git
- localStorage only for learner progress
- no backend, no auth, no payments

Produce:
1. a sharply scoped MVP definition
2. a list of non-goals
3. a feature-by-feature cut list
4. a release order for what must exist before first public launch

Optimize for the smallest credible launch, not feature completeness.

Return as: MVP goals, must-have features, nice-to-have later, explicit exclusions, launch checklist.
```

## 2. Architecture Design

```text
Design the technical architecture for a static GitHub Pages course site.

Constraints:
- public GitHub repo
- GitHub Pages hosting
- no backend
- localStorage for progress only
- all curriculum assets stored in Git
- easy for agents to add lessons and quizzes later

Produce:
1. final stack decision
2. repo folder structure
3. content storage format
4. deployment strategy
5. local development commands
6. future migration path if we later add APIs

Optimize for maintainability, content authoring ease, and minimal moving parts.
```

## 3. Content Schema Design

```text
Design a content schema for a static licensing course site.

Requirements:
- each course topic must support lesson text, audio-style script, quiz items, glossary terms, source citations, and review state
- schema must be easy to validate in CI
- schema must support later expansion into multiple difficulty levels
- schema must keep one canonical source-backed topic record and derived learner artifacts

Produce:
1. content model
2. TypeScript types or JSON schema
3. example markdown topic file
4. example quiz JSON file
5. validation rules
6. naming conventions for slugs and source references
```

## 4. Site Plumbing

```text
Build the initial static site plumbing for a course website.

Pages required: home, curriculum index, topic detail, quiz page, progress page, sources page, methodology page.

Constraints:
- static site suitable for GitHub Pages
- no backend
- accessible semantic HTML
- responsive layout
- minimal styling
- reusable components

Deliver:
1. route map
2. component map
3. starter implementation plan
4. acceptance criteria for each page
5. recommended CSS strategy
```

## 5. Curriculum Map Generation

```text
Use the public Oregon PSI Construction Contractors outline to generate a curriculum map for a free course site.

Goals:
- create one course module per exam category
- assign rough lesson order
- estimate learner effort per module
- tag high-weight topics for deeper coverage
- identify modules that likely need Oregon-specific source validation beyond the PSI outline

Return:
1. curriculum table
2. module order
3. rationale for the order
4. module metadata fields
5. a recommendation for which 3 modules to build first
```

## 6. Topic Research

```text
Run a research pass for one Oregon CCB exam topic: [TOPIC NAME].

Requirements:
- prioritize official Oregon CCB sources, Oregon laws/rules, and the PSI bulletin
- separate confirmed facts from inference
- identify claims that require citation on the course page
- flag gaps where the public sources are too vague

Return:
1. source inventory (tier 1 and tier 2)
2. topic facts with citation anchors
3. exact claims safe to teach
4. unresolved ambiguities
5. citation map
6. recommended boundaries for what the course should and should not assert
```

## 7. Lesson Generation

```text
Generate a source-backed lesson package for the Oregon CCB topic: [TOPIC NAME].

Inputs: topic name, source inventory, fact list, citation map.

Produce:
1. concise learner summary (2-3 paragraphs)
2. full lesson page draft with citations
3. audio-style script for auditory learners
4. glossary terms
5. common mistakes and trap interpretations
6. open-book lookup advice
7. 10 to 15 quiz questions with explanations

Rules:
- keep factual claims aligned to cited source material
- distinguish source facts from study advice
- optimize for clarity, not legalistic wording
- avoid unsupported speculation
```

## 8. Content Review

```text
Review this generated course artifact against its cited sources.

Check for:
- unsupported claims
- source drift (claim says more than the source supports)
- ambiguity in quiz answers
- missing caveats where the source is narrower than the lesson wording
- quiz problems with weak distractors or unclear answers
- mismatch between lesson, audio script, and quiz

Return:
1. pass/fail by section
2. exact lines that need revision
3. severity levels (critical / moderate / minor)
4. proposed fixes
5. final publication recommendation (publish / revise / reject)
```

## 9. Content Polish

```text
Polish this already-reviewed lesson package for learning quality.

Improve:
- clarity and plain language
- scannability (headings, lists, short paragraphs)
- auditory flow for read-aloud use
- memory hooks and practical examples

Do not:
- add new unsupported facts
- change citation meaning
- expand scope beyond the reviewed source-backed content

Return:
1. revised lesson text
2. revised audio script
3. revised quiz wording if needed
4. a brief changelog of instructional improvements
```

## 10. CI Validation Design

```text
Design CI checks for a static course repo with markdown and JSON content.

Validate:
- content schema (frontmatter fields, types)
- quiz schema (4 choices, valid answerIndex, unique IDs)
- source reference integrity (all refs exist in sources.json)
- duplicate IDs across quiz files
- broken internal links
- required metadata fields

Produce:
1. CI workflow plan
2. scripts to implement checks
3. failure messages that help contributors fix issues quickly
4. a future-ready test plan for content quality signals (reading level, citation coverage)
```
