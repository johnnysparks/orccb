/** Review lifecycle for content artifacts. */
export type ReviewStatus =
  | "draft"
  | "source-backed"
  | "reviewed"
  | "published"
  | "needs-revision";

/** A single source reference entry in the global source registry. */
export interface SourceRef {
  id: string;
  title: string;
  url?: string;
  tier: 1 | 2;
  description: string;
}

/** YAML frontmatter for a topic Markdown file. */
export interface TopicFrontmatter {
  slug: string;
  title: string;
  examWeightPct: number;
  reviewStatus: ReviewStatus;
  lastValidatedAt: string | null;
  sourceRefs: string[];
  learningObjectives: string[];
}

/** A single quiz question. */
export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  sourceRefs: string[];
}

/** A quiz file for one topic. */
export interface QuizFile {
  topic: string;
  questions: QuizQuestion[];
}

/** Learner progress stored in localStorage. */
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

/** Curriculum metadata entry (one per topic). */
export interface CurriculumEntry {
  slug: string;
  title: string;
  examWeightPct: number;
  order: number;
  estimatedMinutes: number;
}
