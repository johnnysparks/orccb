# ROADMAP.md

# Open CCB License Course Site

A deliberately bare-bones roadmap for building a free, open Oregon CCB pre-license course site.

## Purpose

Build a simple course website for Oregon CCB license prep that is:
- free and open
- hosted on GitHub Pages
- static-first
- backed by Git for all course assets
- personalized only through browser localStorage for progress and lightweight study state
- structured so agents can iteratively research, generate, validate, and polish curriculum artifacts

This roadmap assumes the initial goal is **useful, credible, and shippable**, not comprehensive perfection.

## Ground truth and constraints

The official Oregon CCB pre-license flow says most candidates complete a 16-hour training and then take a PSI **open-book** exam with **80 multiple-choice questions**, **3 hours**, and a **70% passing score**. The PSI Candidate Information Bulletin is the most specific public blueprint for what is covered, and GitHub Pages can host a static site directly from a repository. citeturn504154search0turn504154search1turn504154search5turn504154search11

## Product principle

The first version is not “the full best course.”

The first version is:
- one static website
- one clear curriculum map
- one course page per topic
- one quiz mode
- one audio-friendly study mode
- one source-of-truth citation trail
- one lightweight progress model in localStorage

Everything else is optional until real usage proves it matters.

---

# 1. Scope the MVP

## MVP outcome

A learner can:
- land on the site
- understand the Oregon CCB exam structure
- see a topic-by-topic curriculum
- open a lesson page
- read a concise lesson
- play or read an audio-style script
- take a short quiz
- save progress locally
- see what they have completed
- trust where the material came from

## Non-goals for v1

Do not build yet:
- accounts
- backend
- payments
- CMS
- AI chat in production
- user-submitted content
- certification claims
- mobile app wrapper
- complex spaced repetition engine
- fancy design systems

## Deliverables

- repo scaffold
- GitHub Pages deployment
- minimal course UI
- initial curriculum skeleton
- 2 to 4 complete lesson artifacts
- progress tracking via localStorage
- source citation model

## Copy-paste prompt for agent

```text
You are building the MVP scope for a free, open Oregon CCB pre-license course site.

Constraints:
- host on GitHub Pages
- static-first architecture
- assets stored in Git
- localStorage only for learner progress
- no backend
- no auth
- no payments

Produce:
1. a sharply scoped MVP definition
2. a list of non-goals
3. a feature-by-feature cut list
4. a release order for what must exist before first public launch

Optimize for the smallest credible launch, not feature completeness.
Return the answer as:
- MVP goals
- must-have features
- nice-to-have later
- explicit exclusions
- launch checklist
```

---

# 2. Choose the stack and repo shape

## Recommendation

Use a boring stack:
- **Vite + plain static site**
- Markdown or JSON content files in-repo
- GitHub Actions for build/deploy if needed
- GitHub Pages for hosting
- no external database
- no framework-heavy state beyond minimal client-side progress hydration

If you want the simplest authoring path, use **Markdown/JSON content collections**.
If you want the absolute least abstraction, use **Vite + hand-rolled content loading**.

## Suggested repo structure

```text
/ccb-license-course
  /public
    /audio
    /images
  /src
    /components
    /layouts
    /pages
    /lib
    /styles
    /content
      /topics
        laws-and-rules.md
        contracts.md
        lien-law.md
      /quizzes
        laws-and-rules.json
      /metadata
        curriculum.json
        glossary.json
        sources.json
  /scripts
    build-search-index.mjs
    validate-content.mjs
    export-audio-manifest.mjs
  /docs
    curriculum-policy.md
    editorial-guidelines.md
    source-validation.md
  ROADMAP.md
  README.md
```

## Notes

GitHub Pages supports project and user/organization sites, so either a dedicated repo or a project subpath is viable. citeturn504154search5turn504154search11turn504154search17

## Copy-paste prompt for agent

```text
Design the technical architecture for a static GitHub Pages course site.

Constraints:
- public GitHub repo
- GitHub Pages hosting
- no backend
- localStorage for progress only
- all curriculum assets stored in Git
- easy for agents to add lessons and quizzes later

Then produce:
1. final stack decision
2. repo folder structure
3. content storage format
4. deployment strategy
5. local development commands
6. future migration path if we later add APIs

Optimize for maintainability, content authoring ease, and minimal moving parts.
```

---

# 3. Define the content model

## Core principle

Every topic gets one canonical source-backed lesson package.
Derived artifacts come from that package.

## Topic package shape

Each topic should have:
- `slug`
- `title`
- `examWeight`
- `learningObjectives`
- `lessonSummary`
- `lessonBody`
- `audioScript`
- `keyTerms`
- `commonMistakes`
- `openBookLookupTips`
- `quizQuestions`
- `sourceRefs`
- `reviewStatus`
- `lastValidatedAt`

## Example topic frontmatter

```yaml
slug: laws-and-rules
title: Oregon Construction Contractor Laws and Regulations
examWeight: 18
reviewStatus: draft
lastValidatedAt: null
sourceRefs:
  - psi-cib-oregon-construction-contractors
  - oregon-ccb-prelicense
learningObjectives:
  - Explain the role of the CCB and PSI in licensing.
  - Recognize the high-level exam format and expectations.
  - Navigate source materials for open-book lookup.
```

## Quiz shape

```json
{
  "topic": "laws-and-rules",
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
      "explanation": "The Oregon PSI exam is open-book and multiple choice.",
      "sourceRefs": ["psi-cib-oregon-construction-contractors"]
    }
  ]
}
```

## Copy-paste prompt for agent

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

---

# 4. Build the basic site plumbing

## Pages to create first

- Home
- About / Methodology
- Curriculum Index
- Topic Detail page
- Quiz page
- Progress page
- Sources page

## UX rules

- fast loading
- mobile-friendly
- low distraction
- obvious progress state
- clear source citations on every lesson
- audio-first presentation option

## Minimal UI components

- header/nav
- topic card
- lesson section
- source citation list
- quiz question block
- progress badge
- completion toggle
- audio script panel

## Copy-paste prompt for agent

```text
Build the initial static site plumbing for a course website.

Pages required:
- home
- curriculum index
- topic detail
- quiz page
- progress page
- sources page
- methodology page

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

---

# 5. Implement localStorage progress

## What to track

Track only learner convenience data:
- completed topics
- quiz attempts
- last visited topic
- bookmarked topics
- preferred study mode like read or audio-script

Do not store sensitive data.
Do not pretend progress is portable.

## Suggested progress object

```json
{
  "version": 1,
  "completedTopics": ["laws-and-rules", "contracts"],
  "bookmarks": ["lien-law"],
  "quizAttempts": {
    "laws-and-rules": {
      "bestScore": 8,
      "lastScore": 6,
      "attemptCount": 3
    }
  },
  "preferences": {
    "studyMode": "audio-script"
  },
  "lastVisitedTopic": "contracts"
}
```

## Copy-paste prompt for agent

```text
Implement client-side learner progress for a static course site using localStorage only.

Track:
- completed topics
- bookmarks
- quiz attempt stats
- last visited topic
- preferred study mode

Produce:
1. data model
2. storage key strategy
3. migration/versioning plan
4. helper functions
5. React or vanilla hooks/utilities depending on the chosen stack
6. UI states for empty, partial, and completed progress

Prioritize resilience to malformed localStorage data.
```

---

# 6. Create the first curriculum map

## Initial topic list

Use the public PSI outline as the first curriculum spine:
- Laws and Regulations
- Choosing Your Business Structure
- Hiring and Managing Employees
- Working with Subcontractors
- Contracts
- Oregon Lien Law
- Bidding and Estimating
- Scheduling and Project Management
- Oregon Building Codes
- Jobsite Safety
- Environmental Factors
- Building Exterior Shell
- Financial Management
- Tax Basics citeturn504154search1

## Rule

Do not confuse the outline with a finished lesson set.
The first artifact here is a **curriculum map**, not polished content.

## Copy-paste prompt for agent

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

---

# 7. Set up the research loop

## Goal

Before generating lesson content, capture trustworthy source material and citation anchors.

## Source tiers

Tier 1:
- Oregon CCB official pages
- Oregon statutes and administrative rules
- PSI Candidate Information Bulletin

Tier 2:
- clearly identified secondary public references used only to explain, never to override primary sources

## Research output format

For each topic, create:
- a source inventory
- a claim list
- citation anchors
- unresolved questions
- confidence rating

## Copy-paste prompt for agent

```text
Run a research pass for one Oregon CCB exam topic.

Requirements:
- prioritize official Oregon CCB sources, Oregon laws/rules, and the PSI bulletin
- separate confirmed facts from inference
- identify claims that require citation on the course page
- flag gaps where the public sources are too vague

Return:
1. source inventory
2. topic facts
3. exact claims safe to teach
4. unresolved ambiguities
5. citation map
6. recommended boundaries for what the course should and should not assert
```

---

# 8. Set up the curriculum-generation loop

## Goal

Turn research into a learner-ready topic package.

## Generation sequence

For each topic:
1. canonical summary
2. lesson body
3. audio-style script
4. glossary
5. common confusions
6. open-book lookup tips
7. quiz items

## Rule

Every generated claim must be traceable to a source ref or explicitly marked as learning guidance rather than source fact.

## Copy-paste prompt for agent

```text
Generate a source-backed lesson package for a single Oregon CCB topic.

Inputs:
- topic name
- source inventory
- fact list
- citation map

Produce:
1. concise learner summary
2. full lesson page draft
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

---

# 9. Set up the validation and review loop

## Goal

Do not publish raw generated lesson content without review.

## Review checklist

For each topic:
- are the main claims source-backed?
- is Oregon-specific wording accurate?
- is anything outdated or overclaimed?
- are quiz answers unambiguous?
- is the audio script faithful to the lesson?
- do citations actually support the sentences they are attached to?

## Review states

- draft
- source-backed
- reviewed
- published
- needs-revision

## Copy-paste prompt for agent

```text
Review this generated course artifact against its cited sources.

Check for:
- unsupported claims
- source drift
- ambiguity
- missing caveats where the source is narrower than the lesson wording
- quiz problems with weak distractors or unclear answers
- mismatch between lesson, audio script, and quiz

Return:
1. pass/fail by section
2. exact lines that need revision
3. severity levels
4. proposed fixes
5. final publication recommendation
```

---

# 10. Set up the polish loop

## Goal

After a topic is accurate, make it easier to learn.

## Polish targets

- simplify wording
- improve chunking
- improve headings
- shorten long paragraphs
- strengthen examples
- improve auditory rhythm in scripts
- make open-book lookup tactics more concrete

## Copy-paste prompt for agent

```text
Polish this already-reviewed lesson package for learning quality.

Improve:
- clarity
- scannability
- auditory flow for read-aloud use
- memory hooks
- practical examples

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

---

# 11. Add CI checks so the repo does not rot immediately

## Checks to implement

- schema validation for topic and quiz files
- broken internal links
- missing source refs
- missing required frontmatter
- duplicate question IDs
- invalid progress schema fixtures

## Later checks

- reading level lint
- citation coverage report
- per-topic completeness score

## Copy-paste prompt for agent

```text
Design CI checks for a static course repo with markdown and JSON content.

Validate:
- content schema
- quiz schema
- source reference integrity
- duplicate IDs
- broken links
- required metadata

Produce:
1. CI workflow plan
2. scripts to implement checks
3. failure messages that help contributors fix issues quickly
4. a future-ready test plan for content quality signals
```

---

# 12. Publish the first thin slice

## First publish target

Launch with:
- home page
- methodology page
- curriculum index
- 3 complete topic pages
- 3 quizzes
- sources page
- progress page

## Best first 3 topics

Based on the PSI outline weights, likely start with:
- Laws and Regulations
- Contracts
- Hiring and Managing Employees

These carry strong exam weight and give the course credibility fast. citeturn504154search1

## Copy-paste prompt for agent

```text
Plan the first public launch for the Oregon CCB course site.

Requirements:
- smallest credible release
- enough content to prove the system works
- transparent methodology and sourcing
- clear disclaimer that users should verify with official sources

Return:
1. release contents
2. launch checklist
3. risk list
4. repo labels or milestones
5. post-launch feedback questions to guide the next iteration
```

---

# 13. Add audio-first affordances early

## Because this matters for the actual user experience

Even before full audio generation, each topic page should support:
- a clearly separated audio-style script block
- paragraph chunking suitable for read-aloud tools
- estimated listening time
- download or copy-friendly transcript formatting

## Later audio options

- generated MP3 files committed to repo
- separate RSS or pseudo-podcast feed
- playlist pages by topic cluster

## Copy-paste prompt for agent

```text
Design the audio-first learning experience for a static study site.

Goals:
- support auditory learners without requiring a backend
- keep artifacts repo-based
- make lesson pages easy to consume via browser read-aloud or committed audio files

Produce:
1. UI pattern for audio-mode lessons
2. transcript formatting rules
3. metadata fields needed for listening time and script variants
4. future path to generated audio assets in GitHub Pages
5. acceptance criteria for an 'audio-first' topic page
```

---

# 14. Prepare for open contribution without letting quality collapse

## Contribution rules

External contributors can help, but not by freehand improvising legal-exam content.

Require:
- source refs for factual claims
- schema-valid content
- review state tags
- no direct publish without review

## Files to add

- `CONTRIBUTING.md`
- `docs/editorial-guidelines.md`
- `docs/source-validation.md`
- PR template

## Copy-paste prompt for agent

```text
Create contribution and editorial guardrails for an open course repo.

Requirements:
- contributors may add lessons, quizzes, and source mappings
- factual content must be source-backed
- generated content must pass review before publish
- repo should be friendly to contributors without lowering trust

Produce:
1. CONTRIBUTING.md outline
2. editorial rules
3. source validation policy
4. pull request template
5. reviewer checklist
```

---

# 15. Suggested execution order

## Phase 0: foundation
1. define MVP
2. choose stack
3. scaffold repo
4. deploy blank GitHub Pages site
5. implement content schema

## Phase 1: plumbing
6. build page skeletons
7. implement localStorage progress
8. add source registry
9. add CI validation

## Phase 2: thin curriculum slice
10. build curriculum map
11. research first 3 topics
12. generate first 3 topic packages
13. validate and revise
14. publish first 3 topics

## Phase 3: improve learning quality
15. polish audio-first mode
16. improve quizzes
17. add glossary and lookup drills
18. refine progress UX

## Phase 4: scale content responsibly
19. expand remaining topics
20. open contributions
21. add optional committed audio assets
22. add search and filtering

---

# 16. The loops that actually matter

## Loop A: research -> create -> validate -> publish
Use this for every new topic.

## Loop B: publish -> observe weak spots -> revise
Use this after real learners start using the course.

## Loop C: source changes -> diff -> revalidate affected topics
Use this whenever official exam or licensing materials change.

## Loop D: topic exists -> derive better formats
Use this to turn one topic into:
- short recap
- audio script
- quiz
- lookup drill
- glossary cards

---

# 17. Recommended first issues

1. Initialize site for GitHub Pages
2. Add content schemas for topics, quizzes, and sources
3. Create curriculum index page from metadata
4. Add topic detail template
5. Implement localStorage progress store
6. Add sources registry and rendering
7. Draft methodology page
8. Add CI schema validation
9. Build Laws and Regulations research packet
10. Generate and review Laws and Regulations lesson package
11. Repeat for Contracts
12. Repeat for Hiring and Managing Employees

---

# 18. Definition of done for the first real launch

The project is ready for first public launch when:
- site deploys reliably on GitHub Pages
- curriculum index renders from content files
- at least 3 modules are source-backed and reviewed
- each published module includes lesson text, audio script, quiz, and citations
- learner progress works and survives reloads
- methodology and source pages explain how the material is produced and checked
- CI blocks malformed content from landing in main

---

# 19. Final recommendation

Start with this exact build posture:
- Markdown + JSON content
- GitHub Pages
- localStorage progress
- one source registry file
- one topic schema
- one quiz schema
- one podcast script
- one publish state machine
- first 3 topics only
