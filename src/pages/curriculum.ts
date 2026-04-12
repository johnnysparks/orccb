import type { RouteParams } from '../lib/router.js';
import { loadProgress } from '../lib/progress.js';
import { createTopicCard } from '../components/topic-card.js';
import { createProgressBadge } from '../components/progress-badge.js';
import curriculum from '../content/metadata/curriculum.json';

export function render(_params: RouteParams, container: HTMLElement): void {
  const progress = loadProgress();
  const totalMinutes = curriculum.reduce((sum, e) => sum + e.estimatedMinutes, 0);

  const page = document.createElement('div');
  page.className = 'page page--curriculum';

  // Page header
  const header = document.createElement('div');
  header.className = 'page-header';
  header.innerHTML = `
    <h1>Curriculum</h1>
    <p class="page-header__meta">
      ${curriculum.length} topics &middot; ~${Math.round(totalMinutes / 60)} hours of study material
    </p>
  `;
  page.appendChild(header);

  // Progress badge
  const badge = createProgressBadge();
  page.appendChild(badge);

  // Filter controls
  const controls = document.createElement('div');
  controls.className = 'curriculum-controls';
  controls.innerHTML = `
    <button class="filter-btn filter-btn--active" data-filter="all">All (${curriculum.length})</button>
    <button class="filter-btn" data-filter="remaining">Remaining (${curriculum.length - progress.completedTopics.length})</button>
    <button class="filter-btn" data-filter="complete">Complete (${progress.completedTopics.length})</button>
  `;
  page.appendChild(controls);

  // Topic grid
  const grid = document.createElement('div');
  grid.className = 'topic-grid';
  curriculum.forEach((entry) => {
    grid.appendChild(createTopicCard(entry));
  });
  page.appendChild(grid);

  // Wire up filter buttons
  let activeFilter = 'all';
  controls.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset['filter']!;
      controls.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      applyFilter();
    });
  });

  function applyFilter(): void {
    grid.querySelectorAll<HTMLElement>('.topic-card').forEach((card, i) => {
      const slug = curriculum[i]!.slug;
      const isComplete = progress.completedTopics.includes(slug);
      let visible = true;
      if (activeFilter === 'complete') visible = isComplete;
      if (activeFilter === 'remaining') visible = !isComplete;
      card.style.display = visible ? '' : 'none';
    });
  }

  container.appendChild(page);
}
