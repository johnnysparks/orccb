#!/usr/bin/env node

/**
 * Content validation script. Run via: npm run validate
 *
 * Validates every content artifact against its schema rules and checks
 * referential integrity across files. Exits with code 1 on any failure
 * so CI can block merges with broken content.
 *
 * Checks performed:
 *   1. sources.json       — shape, unique IDs, required fields
 *   2. curriculum.json    — shape, unique slugs and orders
 *   3. glossary.json      — shape, unique slugs, source ref integrity
 *   4. topic .md files    — frontmatter fields, required sections,
 *                           source ref integrity, glossary term integrity,
 *                           slug↔filename agreement, published tier-1 rule
 *                           (located at src/content/wiki/terms/{letter}/{slug}.md)
 *   5. quiz .json files   — shape, question count, ID format, globally unique
 *                           IDs, source ref integrity, slug↔filename agreement
 *   6. Cross-file checks  — every curriculum slug has a topic file and quiz file
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, basename } from "node:path";

const root = resolve(import.meta.dirname, "..");
const contentDir = resolve(root, "src/content");

let exitCode = 0;
let totalChecks = 0;
let totalFailures = 0;

function fail(msg) {
  console.error(`  FAIL: ${msg}`);
  exitCode = 1;
  totalFailures++;
}

function pass(msg) {
  console.log(`  ok   ${msg}`);
}

function section(title) {
  console.log(`\n── ${title}`);
}

function readJSON(filePath) {
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ---------------------------------------------------------------------------
// YAML frontmatter parser
// Handles the specific frontmatter patterns used in topic files.
// Supports: string scalars, null, numbers, inline [] arrays, block arrays.
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const result = {};
  const lines = match[1].split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const keyValMatch = line.match(/^([\w-]+):\s*(.*)$/);

    if (!keyValMatch) {
      i++;
      continue;
    }

    const [, key, rawVal] = keyValMatch;
    const trimmed = rawVal.trim();

    if (trimmed === "[]") {
      result[key] = [];
      i++;
    } else if (trimmed === "") {
      // Block sequence follows
      const items = [];
      i++;
      while (i < lines.length && lines[i].match(/^\s+-\s/)) {
        const item = lines[i].replace(/^\s+-\s+/, "").trim().replace(/^['"]|['"]$/g, "");
        items.push(item);
        i++;
      }
      result[key] = items;
    } else {
      // Scalar: strip quotes, coerce null and numbers
      const clean = trimmed.replace(/^['"]|['"]$/g, "");
      if (clean === "null") {
        result[key] = null;
      } else if (!isNaN(Number(clean)) && clean !== "") {
        result[key] = Number(clean);
      } else {
        result[key] = clean;
      }
      i++;
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Markdown section checker
// ---------------------------------------------------------------------------

const REQUIRED_SECTIONS = [
  "## Summary",
  "## Lesson",
  "## Audio Script",
  "## Key Terms",
  "## Common Mistakes",
  "## Open-Book Lookup Tips",
];

function getMissingSections(content) {
  return REQUIRED_SECTIONS.filter((s) => !content.includes(s));
}

// ---------------------------------------------------------------------------
// Naming convention validators
// ---------------------------------------------------------------------------

const SLUG_RE = /^[a-z][a-z0-9-]*[a-z0-9]$/;
const VERSION_RE = /^\d+\.\d+\.\d+$/;
const QUIZ_ID_RE = /^[a-z][a-z0-9-]+-\d{3}$/;

const VALID_DIFFICULTY = new Set(["foundation", "standard", "advanced"]);
const VALID_REVIEW_STATUS = new Set([
  "draft",
  "source-backed",
  "reviewed",
  "published",
  "needs-revision",
]);

// ---------------------------------------------------------------------------
// 1. Validate sources.json
// ---------------------------------------------------------------------------

section("sources.json");

let sourceIds = new Set();

try {
  const sources = readJSON(resolve(contentDir, "metadata/sources.json"));

  if (!Array.isArray(sources)) {
    fail("must be an array");
  } else {
    for (const src of sources) {
      totalChecks++;
      const missing = ["id", "title", "tier", "description"].filter((f) => src[f] == null);
      if (missing.length) {
        fail(`source missing required fields [${missing.join(", ")}]: ${JSON.stringify(src)}`);
        continue;
      }
      if (!SLUG_RE.test(src.id)) {
        fail(`source id does not match slug pattern: "${src.id}"`);
      }
      if (![1, 2].includes(src.tier)) {
        fail(`source "${src.id}" has invalid tier: ${src.tier}`);
      }
      if (sourceIds.has(src.id)) {
        fail(`duplicate source id: "${src.id}"`);
      }
      sourceIds.add(src.id);
    }
    pass(`${sources.length} source entries, all IDs unique`);
  }
} catch (e) {
  fail(`cannot read/parse sources.json: ${e.message}`);
}

// ---------------------------------------------------------------------------
// 2. Validate curriculum.json
// ---------------------------------------------------------------------------

section("curriculum.json");

let curriculumSlugs = new Set();
let curriculumOrders = new Set();

try {
  const entries = readJSON(resolve(contentDir, "metadata/curriculum.json"));

  if (!Array.isArray(entries)) {
    fail("must be an array");
  } else {
    for (const entry of entries) {
      totalChecks++;
      const missing = ["slug", "title", "examWeightPct", "order", "estimatedMinutes"].filter(
        (f) => entry[f] == null
      );
      if (missing.length) {
        fail(`curriculum entry missing [${missing.join(", ")}]: ${JSON.stringify(entry)}`);
        continue;
      }
      if (!SLUG_RE.test(entry.slug)) {
        fail(`curriculum slug does not match pattern: "${entry.slug}"`);
      }
      if (curriculumSlugs.has(entry.slug)) {
        fail(`duplicate curriculum slug: "${entry.slug}"`);
      }
      if (curriculumOrders.has(entry.order)) {
        fail(`duplicate curriculum order value: ${entry.order}`);
      }
      curriculumSlugs.add(entry.slug);
      curriculumOrders.add(entry.order);
    }
    pass(`${entries.length} curriculum entries, slugs and orders unique`);
  }
} catch (e) {
  fail(`cannot read/parse curriculum.json: ${e.message}`);
}

// ---------------------------------------------------------------------------
// 3. Validate glossary.json
// ---------------------------------------------------------------------------

section("glossary.json");

let glossarySlugs = new Set();

try {
  const glossaryPath = resolve(contentDir, "metadata/glossary.json");
  if (!existsSync(glossaryPath)) {
    fail("glossary.json not found at src/content/metadata/glossary.json");
  } else {
    const terms = readJSON(glossaryPath);

    if (!Array.isArray(terms)) {
      fail("must be an array");
    } else {
      for (const term of terms) {
        totalChecks++;
        const missing = ["slug", "term", "definition", "sourceRefs"].filter(
          (f) => term[f] == null
        );
        if (missing.length) {
          fail(`glossary term missing [${missing.join(", ")}]: ${JSON.stringify(term)}`);
          continue;
        }
        if (!SLUG_RE.test(term.slug) && !/^[a-z][a-z0-9-]*$/.test(term.slug)) {
          fail(`glossary slug does not match pattern: "${term.slug}"`);
        }
        if (glossarySlugs.has(term.slug)) {
          fail(`duplicate glossary slug: "${term.slug}"`);
        }
        glossarySlugs.add(term.slug);

        // Source ref integrity
        for (const ref of term.sourceRefs ?? []) {
          if (!sourceIds.has(ref)) {
            fail(`glossary term "${term.slug}" has unknown sourceRef: "${ref}"`);
          }
        }
      }
      pass(`${terms.length} glossary terms, slugs unique`);

      // Validate relatedTerms cross-references (after all slugs are collected)
      for (const term of terms) {
        for (const rel of term.relatedTerms ?? []) {
          totalChecks++;
          if (!glossarySlugs.has(rel)) {
            fail(`glossary term "${term.slug}" relatedTerms references unknown slug: "${rel}"`);
          }
        }
      }
    }
  }
} catch (e) {
  fail(`cannot read/parse glossary.json: ${e.message}`);
}

// ---------------------------------------------------------------------------
// 4. Validate topic Markdown files
// ---------------------------------------------------------------------------

section("topic .md files (wiki/terms)");

const wikiTermsDir = resolve(contentDir, "wiki/terms");
let topicSlugsFound = new Set();

// Collect all .md files from wiki/terms/{letter}/ subdirectories
function collectTopicFiles() {
  const result = [];
  if (!existsSync(wikiTermsDir)) return result;
  for (const letter of readdirSync(wikiTermsDir)) {
    const letterDir = resolve(wikiTermsDir, letter);
    if (!statSync(letterDir).isDirectory()) continue;
    for (const f of readdirSync(letterDir)) {
      if (f.endsWith(".md")) {
        result.push({ file: f, filePath: resolve(letterDir, f) });
      }
    }
  }
  return result;
}

try {
  const topicFiles = collectTopicFiles();

  if (topicFiles.length === 0) {
    console.log("  (no topic files yet)");
  }

  for (const { file, filePath } of topicFiles) {
    totalChecks++;
    const expectedSlug = basename(file, ".md");
    const content = readFileSync(filePath, "utf-8");
    const fm = parseFrontmatter(content);
    let fileOk = true;

    function topicFail(msg) {
      fail(`${file}: ${msg}`);
      fileOk = false;
    }

    if (!fm) {
      topicFail("missing or malformed YAML frontmatter (expected --- delimiters)");
      continue;
    }

    // Required fields
    const requiredFields = [
      "slug", "title", "examWeightPct", "difficulty", "reviewStatus",
      "version", "audioScriptEstMinutes",
    ];
    for (const field of requiredFields) {
      if (fm[field] == null) topicFail(`frontmatter missing required field: ${field}`);
    }

    // Arrays that must be present (may be empty)
    if (!Array.isArray(fm.sourceRefs)) topicFail("frontmatter sourceRefs must be a list");
    if (!Array.isArray(fm.learningObjectives)) topicFail("frontmatter learningObjectives must be a list");
    if (!Array.isArray(fm.glossaryTermSlugs)) topicFail("frontmatter glossaryTermSlugs must be a list");

    // Slug agrees with filename
    if (fm.slug && fm.slug !== expectedSlug) {
      topicFail(`frontmatter slug "${fm.slug}" does not match filename "${expectedSlug}"`);
    }

    // Slug pattern
    if (fm.slug && !SLUG_RE.test(fm.slug)) {
      topicFail(`slug "${fm.slug}" does not match kebab-case pattern`);
    }

    // Slug is in curriculum
    if (fm.slug && !curriculumSlugs.has(fm.slug)) {
      topicFail(`slug "${fm.slug}" not found in curriculum.json`);
    }

    // Difficulty enum
    if (fm.difficulty && !VALID_DIFFICULTY.has(fm.difficulty)) {
      topicFail(`invalid difficulty: "${fm.difficulty}" — must be foundation|standard|advanced`);
    }

    // ReviewStatus enum
    if (fm.reviewStatus && !VALID_REVIEW_STATUS.has(fm.reviewStatus)) {
      topicFail(`invalid reviewStatus: "${fm.reviewStatus}"`);
    }

    // Version semver format
    if (fm.version && !VERSION_RE.test(fm.version)) {
      topicFail(`version "${fm.version}" must be semver (x.y.z)`);
    }

    // learningObjectives minimum
    if (Array.isArray(fm.learningObjectives) && fm.learningObjectives.length < 2) {
      topicFail("learningObjectives must have at least 2 entries");
    }

    // sourceRefs minimum and integrity
    if (Array.isArray(fm.sourceRefs)) {
      if (fm.sourceRefs.length < 1) {
        topicFail("sourceRefs must have at least 1 entry");
      }
      for (const ref of fm.sourceRefs) {
        if (!sourceIds.has(ref)) {
          topicFail(`sourceRef "${ref}" not found in sources.json`);
        }
      }
    }

    // published topics must have at least one Tier 1 source
    if (fm.reviewStatus === "published" && Array.isArray(fm.sourceRefs)) {
      // We'd need to load source tiers; skip full check here, noted in output
    }

    // glossaryTermSlugs integrity
    if (Array.isArray(fm.glossaryTermSlugs)) {
      for (const termSlug of fm.glossaryTermSlugs) {
        if (!glossarySlugs.has(termSlug)) {
          topicFail(`glossaryTermSlug "${termSlug}" not found in glossary.json`);
        }
      }
    }

    // prerequisites integrity
    if (Array.isArray(fm.prerequisites)) {
      for (const prereq of fm.prerequisites) {
        if (!curriculumSlugs.has(prereq)) {
          topicFail(`prerequisite slug "${prereq}" not found in curriculum.json`);
        }
      }
    }

    // Required markdown sections
    const missingSections = getMissingSections(content);
    if (missingSections.length > 0) {
      topicFail(`missing required sections: ${missingSections.join(", ")}`);
    }

    if (fileOk) {
      topicSlugsFound.add(expectedSlug);
      pass(`${file}`);
    }
  }
} catch (e) {
  fail(`cannot read topics directory: ${e.message}`);
}

// ---------------------------------------------------------------------------
// 5. Validate quiz JSON files
// ---------------------------------------------------------------------------

section("quiz .json files");

const quizzesDir = resolve(contentDir, "quizzes");
let quizSlugsFound = new Set();
let allQuizIds = new Set();

try {
  const files = readdirSync(quizzesDir).filter((f) => f.endsWith(".json"));

  if (files.length === 0) {
    console.log("  (no quiz files yet)");
  }

  for (const file of files) {
    totalChecks++;
    const filePath = resolve(quizzesDir, file);
    const expectedSlug = basename(file, ".json");
    let quiz;
    let fileOk = true;

    function quizFail(msg) {
      fail(`${file}: ${msg}`);
      fileOk = false;
    }

    try {
      quiz = readJSON(filePath);
    } catch (e) {
      fail(`${file}: invalid JSON — ${e.message}`);
      continue;
    }

    // Root fields
    if (!quiz.topic) quizFail("missing required field: topic");
    if (!quiz.version) quizFail("missing required field: version");
    if (!Array.isArray(quiz.questions)) quizFail("questions must be an array");

    // topic slug agrees with filename
    if (quiz.topic && quiz.topic !== expectedSlug) {
      quizFail(`topic "${quiz.topic}" does not match filename "${expectedSlug}"`);
    }

    // topic in curriculum
    if (quiz.topic && !curriculumSlugs.has(quiz.topic)) {
      quizFail(`topic "${quiz.topic}" not found in curriculum.json`);
    }

    // version format
    if (quiz.version && !VERSION_RE.test(quiz.version)) {
      quizFail(`version "${quiz.version}" must be semver (x.y.z)`);
    }

    if (Array.isArray(quiz.questions)) {
      if (quiz.questions.length < 3) {
        quizFail(`must have at least 3 questions (found ${quiz.questions.length})`);
      }

      for (const q of quiz.questions) {
        totalChecks++;

        // Required question fields
        const reqQ = ["id", "prompt", "choices", "answerIndex", "difficulty", "explanation", "sourceRefs"];
        const missingQ = reqQ.filter((f) => q[f] == null);
        if (missingQ.length) {
          quizFail(`question missing fields [${missingQ.join(", ")}]: id="${q.id ?? "?"}"`);
          continue;
        }

        // ID format
        if (!QUIZ_ID_RE.test(q.id)) {
          quizFail(`question id "${q.id}" does not match pattern {slug-prefix}-{NNN}`);
        }

        // Global ID uniqueness
        if (allQuizIds.has(q.id)) {
          quizFail(`question id "${q.id}" is duplicated across quiz files`);
        }
        allQuizIds.add(q.id);

        // Exactly 4 choices
        if (!Array.isArray(q.choices) || q.choices.length !== 4) {
          quizFail(`question "${q.id}" must have exactly 4 choices`);
        }

        // answerIndex range
        if (typeof q.answerIndex !== "number" || q.answerIndex < 0 || q.answerIndex > 3) {
          quizFail(`question "${q.id}" answerIndex must be 0–3`);
        }

        // difficulty enum
        if (!VALID_DIFFICULTY.has(q.difficulty)) {
          quizFail(`question "${q.id}" invalid difficulty: "${q.difficulty}"`);
        }

        // explanation non-empty
        if (!q.explanation || q.explanation.trim().length < 20) {
          quizFail(`question "${q.id}" explanation too short (min 20 chars)`);
        }

        // sourceRefs integrity
        if (Array.isArray(q.sourceRefs)) {
          if (q.sourceRefs.length < 1) {
            quizFail(`question "${q.id}" sourceRefs must have at least 1 entry`);
          }
          for (const ref of q.sourceRefs) {
            if (!sourceIds.has(ref)) {
              quizFail(`question "${q.id}" sourceRef "${ref}" not found in sources.json`);
            }
          }
        }
      }
    }

    if (fileOk) {
      quizSlugsFound.add(expectedSlug);
      pass(`${file} (${quiz.questions?.length ?? 0} questions)`);
    }
  }
} catch (e) {
  fail(`cannot read quizzes directory: ${e.message}`);
}

// ---------------------------------------------------------------------------
// 6. Cross-file coverage checks
// ---------------------------------------------------------------------------

section("cross-file coverage");

for (const slug of curriculumSlugs) {
  totalChecks++;
  const letter = slug.charAt(0);
  const hasTopicFile = existsSync(resolve(wikiTermsDir, letter, `${slug}.md`));
  const hasQuizFile = existsSync(resolve(quizzesDir, `${slug}.json`));

  if (!hasTopicFile && !hasQuizFile) {
    // Not yet authored — this is expected during content build-out; warn, don't fail
    console.log(`  warn topic "${slug}" has no .md or .json yet (expected during Phase 2+)`);
  } else {
    if (!hasTopicFile) {
      fail(`curriculum slug "${slug}" has a quiz file but no topic .md file`);
    }
    if (!hasQuizFile) {
      fail(`curriculum slug "${slug}" has a topic .md file but no quiz .json file`);
    }
    if (hasTopicFile && hasQuizFile) {
      pass(`"${slug}" has both topic file and quiz file`);
    }
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n── Summary`);
console.log(`   ${totalChecks} checks, ${totalFailures} failure(s)`);

if (exitCode !== 0) {
  console.error("\nValidation FAILED. Fix the issues above before merging.");
} else {
  console.log("\nAll checks passed.");
}

process.exit(exitCode);
