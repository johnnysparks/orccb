import type { LearnerProgress } from './types.js';

const STORAGE_KEY = 'orccb-progress';

const DEFAULT_PROGRESS: LearnerProgress = {
  version: 1,
  completedTopics: [],
  bookmarks: [],
  quizAttempts: {},
  preferences: { studyMode: 'read' },
  lastVisitedTopic: null,
};

function isValidProgress(data: unknown): data is LearnerProgress {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    d['version'] === 1 &&
    Array.isArray(d['completedTopics']) &&
    Array.isArray(d['bookmarks']) &&
    d['quizAttempts'] !== null &&
    typeof d['quizAttempts'] === 'object' &&
    d['preferences'] !== null &&
    typeof d['preferences'] === 'object'
  );
}

export function loadProgress(): LearnerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_PROGRESS);
    const parsed: unknown = JSON.parse(raw);
    if (!isValidProgress(parsed)) {
      console.warn('orccb: invalid progress data, resetting to defaults');
      return structuredClone(DEFAULT_PROGRESS);
    }
    return parsed;
  } catch {
    return structuredClone(DEFAULT_PROGRESS);
  }
}

export function saveProgress(progress: LearnerProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn('orccb: failed to save progress to localStorage');
  }
}

export function markTopicComplete(slug: string): void {
  const p = loadProgress();
  if (!p.completedTopics.includes(slug)) {
    p.completedTopics.push(slug);
    saveProgress(p);
  }
}

export function markTopicIncomplete(slug: string): void {
  const p = loadProgress();
  p.completedTopics = p.completedTopics.filter((s) => s !== slug);
  saveProgress(p);
}

export function toggleBookmark(slug: string): boolean {
  const p = loadProgress();
  const idx = p.bookmarks.indexOf(slug);
  if (idx === -1) {
    p.bookmarks.push(slug);
    saveProgress(p);
    return true;
  } else {
    p.bookmarks.splice(idx, 1);
    saveProgress(p);
    return false;
  }
}

export function recordQuizAttempt(slug: string, score: number): void {
  const p = loadProgress();
  const existing = p.quizAttempts[slug];
  if (!existing) {
    p.quizAttempts[slug] = { bestScore: score, lastScore: score, attemptCount: 1 };
  } else {
    existing.lastScore = score;
    if (score > existing.bestScore) existing.bestScore = score;
    existing.attemptCount++;
  }
  saveProgress(p);
}

export function setLastVisited(slug: string): void {
  const p = loadProgress();
  p.lastVisitedTopic = slug;
  saveProgress(p);
}

export function setStudyMode(mode: 'read' | 'audio-script'): void {
  const p = loadProgress();
  p.preferences.studyMode = mode;
  saveProgress(p);
}
