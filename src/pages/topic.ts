import type { RouteParams } from '../lib/router.js';
import {
  loadProgress,
  markTopicComplete,
  markTopicIncomplete,
  toggleBookmark,
  setLastVisited,
} from '../lib/progress.js';
import { renderMarkdown, stripFrontmatter } from '../lib/markdown.js';
import curriculum from '../content/metadata/curriculum.json';

// Vite glob: bundles all wiki term markdown files for dynamic lookup
const topicFiles = import.meta.glob<string>('../content/wiki/terms/**/*.md', {
  query: '?raw',
  import: 'default',
});

export function render(params: RouteParams, container: HTMLElement): void {
  const slug = params['slug'] ?? '';
  const entry = curriculum.find((e) => e.slug === slug);

  if (!entry) {
    container.innerHTML = `<div class="page"><p class="error">Topic not found: <code>${slug}</code></p></div>`;
    return;
  }

  setLastVisited(slug);

  container.innerHTML = '<div class="page page--topic"><p class="loading">Loading content&hellip;</p></div>';
  const page = container.querySelector<HTMLElement>('.page--topic')!;

  loadContent(slug).then((rawMd) => {
    renderTopicPage(page, slug, entry, rawMd);
  });
}

async function loadContent(slug: string): Promise<string | null> {
  const letter = slug.charAt(0);
  const key = `../content/wiki/terms/${letter}/${slug}.md`;
  const loader = topicFiles[key];
  if (!loader) return null;
  return loader();
}

function renderTopicPage(
  page: HTMLElement,
  slug: string,
  entry: (typeof curriculum)[number],
  rawMd: string | null,
): void {
  const progress = loadProgress();
  const isComplete = progress.completedTopics.includes(slug);
  const isBookmarked = progress.bookmarks.includes(slug);
  const attempt = progress.quizAttempts[slug];

  const topicIdx = curriculum.findIndex((e) => e.slug === slug);
  const prev = topicIdx > 0 ? curriculum[topicIdx - 1] : null;
  const next = topicIdx < curriculum.length - 1 ? curriculum[topicIdx + 1] : null;

  page.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="#/curriculum">Curriculum</a>
      <span aria-hidden="true"> / </span>
      <span aria-current="page">${entry.title}</span>
    </nav>

    <header class="topic-header">
      <div class="topic-header__meta">
        <span class="tag">Topic ${entry.order} of ${curriculum.length}</span>
        <span class="tag tag--weight">~${entry.examWeightPct}% of exam</span>
        <span class="tag">${entry.estimatedMinutes} min</span>
      </div>
      <h1 class="topic-header__title">${entry.title}</h1>
      <div class="topic-header__actions">
        <button class="btn btn--ghost btn--sm topic-bookmark" data-slug="${slug}" aria-pressed="${isBookmarked}">
          ${isBookmarked ? '&#9733; Bookmarked' : '&#9734; Bookmark'}
        </button>
        <button class="btn ${isComplete ? 'btn--ghost' : 'btn--secondary'} btn--sm topic-complete" data-slug="${slug}" aria-pressed="${isComplete}">
          ${isComplete ? '&#10003; Mark Incomplete' : 'Mark Complete'}
        </button>
      </div>
    </header>

    ${attempt ? `<div class="quiz-attempt-summary">Quiz best score: ${attempt.bestScore} (${attempt.attemptCount} attempt${attempt.attemptCount !== 1 ? 's' : ''})</div>` : ''}

    <div class="topic-body">
      ${rawMd ? renderMarkdown(stripFrontmatter(rawMd)) : `
        <div class="content-placeholder">
          <p><strong>Content coming soon.</strong></p>
          <p>Lesson material for <em>${entry.title}</em> is being researched and written.
          Check back as the curriculum fills in, starting with the three highest-weight topics.</p>
          <p><a href="#/curriculum">Browse available topics &rarr;</a></p>
        </div>
      `}
    </div>

    <div class="topic-footer">
      <a href="#/quiz/${slug}" class="btn btn--primary">Take the Quiz</a>
    </div>

    <nav class="topic-pagination" aria-label="Topic navigation">
      ${prev ? `<a href="#/topic/${prev.slug}" class="pagination-link pagination-link--prev">
        <span class="pagination-label">Previous</span>
        <span class="pagination-title">${prev.title}</span>
      </a>` : '<span></span>'}
      ${next ? `<a href="#/topic/${next.slug}" class="pagination-link pagination-link--next">
        <span class="pagination-label">Next</span>
        <span class="pagination-title">${next.title}</span>
      </a>` : '<span></span>'}
    </nav>
  `;

  // Bookmark button
  page.querySelector('.topic-bookmark')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const nowBookmarked = toggleBookmark(slug);
    btn.setAttribute('aria-pressed', String(nowBookmarked));
    btn.innerHTML = nowBookmarked ? '&#9733; Bookmarked' : '&#9734; Bookmark';
  });

  // Complete button
  page.querySelector('.topic-complete')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const nowComplete = btn.getAttribute('aria-pressed') !== 'true';
    if (nowComplete) {
      markTopicComplete(slug);
      btn.setAttribute('aria-pressed', 'true');
      btn.innerHTML = '&#10003; Mark Incomplete';
      btn.className = 'btn btn--ghost btn--sm topic-complete';
    } else {
      markTopicIncomplete(slug);
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = 'Mark Complete';
      btn.className = 'btn btn--secondary btn--sm topic-complete';
    }
  });
}
