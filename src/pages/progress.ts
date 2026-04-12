import type { RouteParams } from '../lib/router.js';
import { loadProgress, markTopicIncomplete } from '../lib/progress.js';
import curriculum from '../content/metadata/curriculum.json';

export function render(_params: RouteParams, container: HTMLElement): void {
  const page = document.createElement('div');
  page.className = 'page page--progress';
  renderContent(page);
  container.appendChild(page);
}

function renderContent(page: HTMLElement): void {
  const progress = loadProgress();
  const total = curriculum.length;
  const completed = progress.completedTopics;
  const bookmarked = progress.bookmarks;
  const pct = Math.round((completed.length / total) * 100);

  const completedEntries = curriculum.filter((e) => completed.includes(e.slug));
  const remainingEntries = curriculum.filter((e) => !completed.includes(e.slug));
  const bookmarkedEntries = curriculum.filter((e) => bookmarked.includes(e.slug));

  page.innerHTML = `
    <h1>My Progress</h1>

    <div class="progress-overview">
      <div class="progress-ring-container" aria-hidden="true">
        <svg class="progress-ring" viewBox="0 0 80 80">
          <circle class="progress-ring__track" cx="40" cy="40" r="34" />
          <circle class="progress-ring__fill" cx="40" cy="40" r="34"
            stroke-dasharray="${2 * Math.PI * 34}"
            stroke-dashoffset="${2 * Math.PI * 34 * (1 - pct / 100)}" />
        </svg>
        <span class="progress-ring__label">${pct}%</span>
      </div>
      <div class="progress-overview__text">
        <p class="progress-overview__summary">
          ${completed.length === 0
            ? "You haven't started any topics yet."
            : completed.length === total
              ? 'You completed all topics!'
              : `${completed.length} of ${total} topics complete.`}
        </p>
        ${completed.length > 0 && completed.length < total
          ? `<p class="progress-overview__remaining">${remaining(remainingEntries.reduce((s, e) => s + e.estimatedMinutes, 0))} of study material remaining.</p>`
          : ''}
      </div>
    </div>

    ${bookmarkedEntries.length > 0 ? `
    <section class="progress-section">
      <h2>Bookmarks (${bookmarkedEntries.length})</h2>
      <ul class="progress-list">
        ${bookmarkedEntries.map((e) => `
          <li class="progress-list__item">
            <a href="#/topic/${e.slug}" class="progress-list__title">${e.title}</a>
            <span class="progress-list__meta">~${e.examWeightPct}%</span>
          </li>`).join('')}
      </ul>
    </section>` : ''}

    ${remainingEntries.length > 0 ? `
    <section class="progress-section">
      <h2>Remaining (${remainingEntries.length})</h2>
      <ul class="progress-list">
        ${remainingEntries.map((e) => `
          <li class="progress-list__item">
            <a href="#/topic/${e.slug}" class="progress-list__title">${e.title}</a>
            <span class="progress-list__meta">~${e.examWeightPct}%</span>
            <a href="#/quiz/${e.slug}" class="progress-list__quiz">Quiz</a>
          </li>`).join('')}
      </ul>
    </section>` : ''}

    ${completedEntries.length > 0 ? `
    <section class="progress-section">
      <h2>Completed (${completedEntries.length})</h2>
      <ul class="progress-list progress-list--done">
        ${completedEntries.map((e) => {
          const attempt = progress.quizAttempts[e.slug];
          return `
          <li class="progress-list__item">
            <span class="progress-list__check">&#10003;</span>
            <a href="#/topic/${e.slug}" class="progress-list__title">${e.title}</a>
            ${attempt ? `<span class="progress-list__score">Best: ${attempt.bestScore} (${attempt.attemptCount} attempt${attempt.attemptCount !== 1 ? 's' : ''})</span>` : ''}
            <button class="progress-list__undo" data-slug="${e.slug}">Undo</button>
          </li>`;
        }).join('')}
      </ul>
    </section>` : ''}

    ${completed.length === 0 ? `
    <div class="progress-empty">
      <p>Start studying by browsing the curriculum and marking topics complete as you go.</p>
      <a href="#/curriculum" class="btn btn--primary">Go to Curriculum</a>
    </div>` : ''}
  `;

  // Wire up undo buttons
  page.querySelectorAll<HTMLButtonElement>('.progress-list__undo').forEach((btn) => {
    btn.addEventListener('click', () => {
      markTopicIncomplete(btn.dataset['slug']!);
      page.innerHTML = '';
      renderContent(page);
    });
  });
}

function remaining(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
