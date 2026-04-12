#!/usr/bin/env node

/**
 * Validates curriculum.json and quiz JSON files against expected shapes.
 * Expanded in later phases to cover topic frontmatter, source-ref integrity, etc.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

let exitCode = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  exitCode = 1;
}

// --- Validate curriculum.json ---
try {
  const raw = readFileSync(
    resolve(root, "src/content/metadata/curriculum.json"),
    "utf-8"
  );
  const entries = JSON.parse(raw);
  if (!Array.isArray(entries)) {
    fail("curriculum.json must be an array");
  } else {
    const slugs = new Set();
    for (const entry of entries) {
      if (!entry.slug || !entry.title) {
        fail(`curriculum entry missing slug or title: ${JSON.stringify(entry)}`);
      }
      if (slugs.has(entry.slug)) {
        fail(`duplicate curriculum slug: ${entry.slug}`);
      }
      slugs.add(entry.slug);
    }
    console.log(`curriculum.json: ${entries.length} entries, OK`);
  }
} catch (e) {
  fail(`cannot read curriculum.json: ${e.message}`);
}

// --- Validate sources.json ---
try {
  const raw = readFileSync(
    resolve(root, "src/content/metadata/sources.json"),
    "utf-8"
  );
  const sources = JSON.parse(raw);
  if (!Array.isArray(sources)) {
    fail("sources.json must be an array");
  } else {
    const ids = new Set();
    for (const src of sources) {
      if (!src.id || !src.title || ![1, 2].includes(src.tier)) {
        fail(`invalid source entry: ${JSON.stringify(src)}`);
      }
      if (ids.has(src.id)) {
        fail(`duplicate source id: ${src.id}`);
      }
      ids.add(src.id);
    }
    console.log(`sources.json: ${sources.length} entries, OK`);
  }
} catch (e) {
  fail(`cannot read sources.json: ${e.message}`);
}

process.exit(exitCode);
