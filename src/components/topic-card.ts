import type { CurriculumEntry } from '../lib/types.js';
import { loadProgress } from '../lib/progress.js';

export function createTopicCard(entry: CurriculumEntry): HTMLElement {
  const progress = loadProgress();
  const isComplete = progress.completedTopics.includes(entry.slug);
  const isBookmarked = progress.bookmarks.includes(entry.slug);
  const attempt = progress.quizAttempts[entry.slug];

  const card = document.createElement('article');
  card.className = `topic-card${isComplete ? ' topic-card--complete' : ''}`;

  const weightBar = Math.round((entry.examWeightPct / 20) * 100); // normalize to max ~20%

  card.innerHTML = `
    <a href="#/topic/${entry.slug}" class="topic-card__link" aria-label="${entry.title}">
      <div class="topic-card__header">
        <span class="topic-card__order">${entry.order}</span>
        <div class="topic-card__badges">
          ${isComplete ? '<span class="badge badge--complete" title="Completed">&#10003;</span>' : ''}
          ${isBookmarked ? '<span class="badge badge--bookmark" title="Bookmarked">&#9733;</span>' : ''}
        </div>
      </div>
      <h2 class="topic-card__title">${entry.title}</h2>
      <div class="topic-card__meta">
        <span class="topic-card__weight" title="Approximate exam weight">~${entry.examWeightPct}% of exam</span>
        <span class="topic-card__time">${entry.estimatedMinutes} min</span>
      </div>
      <div class="topic-card__weight-bar" aria-hidden="true">
        <div class="topic-card__weight-fill" style="width: ${weightBar}%"></div>
      </div>
      ${attempt ? `<p class="topic-card__quiz-score">Quiz: ${attempt.bestScore} best</p>` : ''}
    </a>
  `;

  return card;
}
