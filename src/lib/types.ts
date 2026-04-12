// ---------------------------------------------------------------------------
// Difficulty
// ---------------------------------------------------------------------------

/**
 * Difficulty tier for a topic variant or individual quiz question.
 *
 * Current convention: all Phase 2 topics ship as "standard".
 * "foundation" and "advanced" are reserved for difficulty-split variants
 * introduced in Phase 4. See docs/content-model.md §Difficulty Expansion.
 *
 * foundation  — single-fact recall; suitable for a first-pass review
 * standard    — application of a rule to a scenario; core exam level
 * advanced    — analysis across multiple rules or edge cases
 */
export type DifficultyLevel = "foundation" | "standard" | "advanced";

// ---------------------------------------------------------------------------
// Review lifecycle
// ---------------------------------------------------------------------------

/**
 * Lifecycle state for a topic package.
 *
 * draft           — content created, sources not yet verified
 * source-backed   — every claim traced to a Tier 1 source; passes CI
 * reviewed        — a subject-matter reviewer has confirmed accuracy
 * published       — rendered on the live site; learners can see it
 * needs-revision  — a source change or error report requires a content update
 *
 * Only "published" topics are rendered in production. CI blocks topics
 * with unresolved source refs from advancing past "draft".
 */
export type ReviewStatus =
  | "draft"
  | "source-backed"
  | "reviewed"
  | "published"
  | "needs-revision";

// ---------------------------------------------------------------------------
// Source registry
// ---------------------------------------------------------------------------

/** A single entry in the global source registry (sources.json). */
export interface SourceRef {
  id: string;
  title: string;
  /** Canonical URL, or null when the source is a PDF that may move. */
  url: string | null;
  /** 1 = primary (ORS, OAR, PSI CIB, official CCB). 2 = secondary/explanatory. */
  tier: 1 | 2;
  description: string;
  /** ISO 8601 date the URL/document was last confirmed current. */
  lastCheckedAt: string | null;
}

// ---------------------------------------------------------------------------
// Glossary
// ---------------------------------------------------------------------------

/** A term entry in the global glossary (glossary.json). */
export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  /** IDs from sources.json that define or authoritatively describe this term. */
  sourceRefs: string[];
  /** Slugs of related glossary terms. Keep bidirectional. */
  relatedTerms?: string[];
  /** Topic slugs where this term is prominently featured. */
  topicSlugs?: string[];
}

// ---------------------------------------------------------------------------
// Topic frontmatter
// ---------------------------------------------------------------------------

/** YAML frontmatter for a topic Markdown file (src/content/wiki/terms/{letter}/{slug}.md). */
export interface TopicFrontmatter {
  /** Kebab-case identifier. Matches filename, curriculum.json entry, and quiz file. */
  slug: string;
  title: string;
  /** Approximate exam weight from the PSI CIB. Must match curriculum.json. */
  examWeightPct: number;
  /**
   * Difficulty tier for this topic variant.
   * All Phase 2 topics use "standard". See DifficultyLevel for expansion guide.
   */
  difficulty: DifficultyLevel;
  reviewStatus: ReviewStatus;
  /**
   * Semver string.
   * PATCH = copy edits. MINOR = content additions. MAJOR = structural rewrite.
   */
  version: string;
  /** ISO 8601 date of last subject-matter review, or null if unreviewed. */
  lastValidatedAt: string | null;
  /** Estimated listening time in minutes for the Audio Script section. */
  audioScriptEstMinutes: number;
  /** IDs from sources.json. At least one Tier 1 source required for published topics. */
  sourceRefs: string[];
  /** Observable, exam-relevant objectives. Start each with an action verb. */
  learningObjectives: string[];
  /** Slugs of glossary terms defined or prominently featured in this topic. */
  glossaryTermSlugs: string[];
  /** Optional. Topic slugs learners should complete before this one. */
  prerequisites?: string[];
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

/** A single quiz question. */
export interface QuizQuestion {
  /**
   * Globally unique ID across all quiz files.
   * Format: {topic-slug-prefix}-{NNN} (zero-padded 3 digits).
   * Example: contracts-001, lien-003.
   */
  id: string;
  prompt: string;
  /** Exactly 4 answer options. */
  choices: [string, string, string, string];
  /** 0-based index of the correct answer in choices[]. */
  answerIndex: 0 | 1 | 2 | 3;
  difficulty: DifficultyLevel;
  /** Shown after the learner answers. Explains correct answer and key distractors. */
  explanation: string;
  /** IDs from sources.json supporting this specific question. */
  sourceRefs: string[];
  /** Optional labels for filtering (e.g. "change-order", "written-requirement"). */
  tags?: string[];
}

/** The root shape of a quiz JSON file (src/content/quizzes/{slug}.json). */
export interface QuizFile {
  /** Slug matching the companion topic file and curriculum.json entry. */
  topic: string;
  version: string;
  questions: QuizQuestion[];
}

// ---------------------------------------------------------------------------
// Curriculum
// ---------------------------------------------------------------------------

/** One entry in curriculum.json defining topic order and exam weight. */
export interface CurriculumEntry {
  /** Primary key. Matches topic file slug, quiz file topic, and frontmatter slug. */
  slug: string;
  title: string;
  examWeightPct: number;
  /** 1-based display order in the curriculum index. Must be unique. */
  order: number;
  /** Estimated total study time in minutes for lesson + quiz. */
  estimatedMinutes: number;
}

// ---------------------------------------------------------------------------
// Learner progress (localStorage, derived artifact)
// ---------------------------------------------------------------------------

/**
 * Learner progress stored in localStorage.
 * This is a derived artifact — produced at runtime from learner interactions,
 * not authored in source files.
 */
export interface LearnerProgress {
  version: 1;
  completedTopics: string[];
  bookmarks: string[];
  quizAttempts: Record<
    string,
    {
      bestScore: number;
      lastScore: number;
      attemptCount: number;
    }
  >;
  preferences: {
    studyMode: "read" | "audio-script";
  };
  lastVisitedTopic: string | null;
}
