#!/usr/bin/env node

/**
 * Wiki link validation script. Run via: npm run lint:wiki
 *
 * Scans all Markdown files under src/content/wiki/ for wiki-style links
 * ([[term-slug]]) and verifies that each target term file exists at the
 * expected path: src/content/wiki/terms/{first-letter}/{slug}.md
 *
 * Also validates:
 *   - INDEX.md links resolve to existing term files (reports missing as warnings)
 *   - No orphan term files exist that are not referenced from INDEX.md
 *   - Term files in the wrong alphabetical subdirectory
 *
 * Exits with code 1 on broken links so CI can block merges.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, join, basename } from "node:path";

const root = resolve(import.meta.dirname, "..");
const wikiDir = resolve(root, "src/content/wiki");
const termsDir = resolve(wikiDir, "terms");

let exitCode = 0;
let totalChecks = 0;
let totalFailures = 0;
let totalWarnings = 0;

function fail(msg) {
  console.error(`  FAIL: ${msg}`);
  exitCode = 1;
  totalFailures++;
}

function warn(msg) {
  console.warn(`  warn: ${msg}`);
  totalWarnings++;
}

function pass(msg) {
  console.log(`  ok   ${msg}`);
}

function section(title) {
  console.log(`\n── ${title}`);
}

// ---------------------------------------------------------------------------
// Collect all existing term files
// ---------------------------------------------------------------------------

function collectTermSlugs() {
  const slugs = new Set();
  if (!existsSync(termsDir)) return slugs;

  for (const letter of readdirSync(termsDir)) {
    const letterDir = resolve(termsDir, letter);
    if (!statSync(letterDir).isDirectory()) continue;

    for (const file of readdirSync(letterDir)) {
      if (!file.endsWith(".md")) continue;
      const slug = basename(file, ".md");
      slugs.add(slug);
    }
  }
  return slugs;
}

// ---------------------------------------------------------------------------
// Extract [[wiki-links]] from Markdown content
// ---------------------------------------------------------------------------

const WIKI_LINK_RE = /\[\[([a-z][a-z0-9-]*[a-z0-9]?)\]\]/g;

function extractWikiLinks(content) {
  const links = [];
  let match;
  while ((match = WIKI_LINK_RE.exec(content)) !== null) {
    links.push({ slug: match[1], index: match.index });
  }
  return links;
}

function lineNumberAt(content, charIndex) {
  return content.substring(0, charIndex).split("\n").length;
}

// ---------------------------------------------------------------------------
// Resolve a term slug to its expected file path
// ---------------------------------------------------------------------------

function termFilePath(slug) {
  const letter = slug.charAt(0);
  return resolve(termsDir, letter, `${slug}.md`);
}

// ---------------------------------------------------------------------------
// 1. Validate term file placement (correct alphabetical subdirectory)
// ---------------------------------------------------------------------------

section("term file placement");

const existingSlugs = collectTermSlugs();

if (existingSlugs.size === 0) {
  console.log("  (no term files yet)");
} else {
  for (const slug of existingSlugs) {
    totalChecks++;
    const expectedLetter = slug.charAt(0);
    const expectedPath = termFilePath(slug);

    if (!existsSync(expectedPath)) {
      fail(`term "${slug}" is not in the correct subdirectory (expected terms/${expectedLetter}/${slug}.md)`);
    }
  }
  pass(`${existingSlugs.size} term file(s) in correct alphabetical directories`);
}

// ---------------------------------------------------------------------------
// 2. Validate wiki links in all term files
// ---------------------------------------------------------------------------

section("wiki links in term files");

let termLinkCount = 0;

if (existingSlugs.size === 0) {
  console.log("  (no term files to check)");
} else {
  for (const slug of existingSlugs) {
    const filePath = termFilePath(slug);
    const content = readFileSync(filePath, "utf-8");
    const links = extractWikiLinks(content);

    for (const link of links) {
      totalChecks++;
      termLinkCount++;

      if (!existsSync(termFilePath(link.slug))) {
        const line = lineNumberAt(content, link.index);
        fail(`${slug}.md:${line} — broken wiki link [[${link.slug}]] (no file at terms/${link.slug.charAt(0)}/${link.slug}.md)`);
      }
    }
  }

  if (termLinkCount === 0) {
    console.log("  (no wiki links found in term files)");
  } else if (totalFailures === 0) {
    pass(`${termLinkCount} wiki link(s) in term files all resolve`);
  }
}

// ---------------------------------------------------------------------------
// 3. Validate INDEX.md links
// ---------------------------------------------------------------------------

section("INDEX.md wiki links");

const indexPath = resolve(wikiDir, "INDEX.md");

if (!existsSync(indexPath)) {
  warn("INDEX.md not found at src/content/wiki/INDEX.md");
} else {
  const indexContent = readFileSync(indexPath, "utf-8");
  const indexLinks = extractWikiLinks(indexContent);
  const indexedSlugs = new Set();
  let missingCount = 0;

  for (const link of indexLinks) {
    totalChecks++;
    indexedSlugs.add(link.slug);

    if (!existsSync(termFilePath(link.slug))) {
      const line = lineNumberAt(indexContent, link.index);
      missingCount++;
      warn(`INDEX.md:${line} — [[${link.slug}]] has no term file yet`);
    }
  }

  if (missingCount === 0) {
    pass(`${indexLinks.length} INDEX.md link(s) all resolve`);
  } else {
    pass(`${indexLinks.length} INDEX.md link(s) checked; ${missingCount} missing term file(s) (warnings only)`);
  }

  // Check for orphan term files not in the index
  for (const slug of existingSlugs) {
    totalChecks++;
    if (!indexedSlugs.has(slug)) {
      warn(`term "${slug}" exists but is not listed in INDEX.md`);
    }
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n── Summary`);
console.log(`   ${totalChecks} checks, ${totalFailures} failure(s), ${totalWarnings} warning(s)`);

if (exitCode !== 0) {
  console.error("\nWiki link validation FAILED. Fix broken links before merging.");
} else if (totalWarnings > 0) {
  console.log("\nAll hard checks passed. Warnings above are informational (missing term files are expected during content build-out).");
} else {
  console.log("\nAll checks passed.");
}

process.exit(exitCode);
