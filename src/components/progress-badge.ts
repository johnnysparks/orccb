import { loadProgress } from '../lib/progress.js';

/** Compact badge showing overall completion percentage. */
export function createProgressBadge(): HTMLElement {
  const badge = document.createElement('div');
  badge.className = 'progress-badge';
  refresh(badge);
  return badge;
}

function refresh(badge: HTMLElement): void {
  const progress = loadProgress();
  const total = 14; // fixed curriculum size
  const done = progress.completedTopics.length;
  const pct = Math.round((done / total) * 100);

  badge.innerHTML = `
    <div class="progress-badge__bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Overall progress">
      <div class="progress-badge__fill" style="width: ${pct}%"></div>
    </div>
    <span class="progress-badge__label">${done} of ${total} topics complete (${pct}%)</span>
  `;
}
