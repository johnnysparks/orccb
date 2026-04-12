import type { RouteParams } from '../lib/router.js';
import { loadProgress } from '../lib/progress.js';
import { createProgressBadge } from '../components/progress-badge.js';
import curriculum from '../content/metadata/curriculum.json';

export function render(_params: RouteParams, container: HTMLElement): void {
  const progress = loadProgress();
  const lastSlug = progress.lastVisitedTopic;
  const lastEntry = lastSlug ? curriculum.find((e) => e.slug === lastSlug) : null;
  const completedCount = progress.completedTopics.length;

  const page = document.createElement('div');
  page.className = 'page page--home';

  page.innerHTML = `
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">Oregon CCB Pre-License Course</h1>
        <p class="hero__lead">
          Free, open-source study materials for the Oregon Construction Contractors Board
          pre-license exam. 14 topics, practice quizzes, and source-backed content.
        </p>
        <div class="hero__actions">
          <a href="#/curriculum" class="btn btn--primary btn--lg">Browse Curriculum</a>
          ${lastEntry ? `<a href="#/topic/${lastEntry.slug}" class="btn btn--ghost btn--lg">Continue: ${lastEntry.title}</a>` : ''}
        </div>
      </div>
    </section>

    <section class="home-stats">
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-card__value">80</span>
          <span class="stat-card__label">Exam questions</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">3 hrs</span>
          <span class="stat-card__label">Exam time</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">Open book</span>
          <span class="stat-card__label">Exam format</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__value">70%</span>
          <span class="stat-card__label">Passing score</span>
        </div>
      </div>
    </section>

    ${completedCount > 0 ? '<div id="progress-section"></div>' : ''}

    <section class="home-topics">
      <h2>High-Weight Topics</h2>
      <p class="muted">Focus here first — these cover roughly 40% of the exam.</p>
      <div class="topic-highlights">
        ${curriculum
          .filter((e) => ['laws-and-regulations', 'contracts', 'hiring-and-managing-employees'].includes(e.slug))
          .map(
            (e) => `
          <a href="#/topic/${e.slug}" class="topic-highlight ${progress.completedTopics.includes(e.slug) ? 'topic-highlight--done' : ''}">
            <span class="topic-highlight__weight">~${e.examWeightPct}%</span>
            <span class="topic-highlight__title">${e.title}</span>
            ${progress.completedTopics.includes(e.slug) ? '<span class="topic-highlight__check">&#10003;</span>' : ''}
          </a>`,
          )
          .join('')}
      </div>
    </section>

    <section class="home-cta">
      <h2>How to use this site</h2>
      <ol class="how-to-list">
        <li>Read each topic lesson at your own pace.</li>
        <li>Use the audio script for hands-free review.</li>
        <li>Take the practice quiz to test your recall.</li>
        <li>Check the sources to verify key facts.</li>
        <li>Mark topics complete to track your progress.</li>
      </ol>
      <a href="#/curriculum" class="btn btn--secondary">View all 14 topics</a>
    </section>
  `;

  if (completedCount > 0) {
    const progressSection = page.querySelector('#progress-section');
    if (progressSection) {
      const badge = createProgressBadge();
      progressSection.appendChild(badge);
    }
  }

  container.appendChild(page);
}
