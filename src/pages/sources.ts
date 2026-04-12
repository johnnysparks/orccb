import type { RouteParams } from '../lib/router.js';
import sources from '../content/metadata/sources.json';

export function render(_params: RouteParams, container: HTMLElement): void {
  const tier1 = sources.filter((s) => s.tier === 1);
  const tier2 = sources.filter((s) => s.tier === 2);

  const page = document.createElement('div');
  page.className = 'page page--sources';

  page.innerHTML = `
    <h1>Sources</h1>
    <p class="page-intro">
      All content on this site is derived from citable primary and secondary sources.
      Tier 1 sources are official government or regulatory documents.
      Tier 2 sources are clearly-identified secondary references used only to explain,
      never to override, primary sources.
    </p>

    <section class="sources-section">
      <h2>Tier 1 — Official Sources (${tier1.length})</h2>
      <ul class="source-list">
        ${tier1.map(renderSource).join('')}
      </ul>
    </section>

    ${tier2.length > 0 ? `
    <section class="sources-section">
      <h2>Tier 2 — Secondary References (${tier2.length})</h2>
      <ul class="source-list">
        ${tier2.map(renderSource).join('')}
      </ul>
    </section>` : ''}

    <section class="sources-note">
      <h2>Source integrity</h2>
      <p>
        Every quiz question and lesson claim must reference at least one Tier 1 source.
        Source IDs are stable identifiers used in topic frontmatter and quiz JSON files.
        The <code>validate-content</code> CI script checks that all referenced source IDs
        exist in this registry before content reaches <code>main</code>.
      </p>
      <a href="#/methodology">Read the full methodology &rarr;</a>
    </section>
  `;

  container.appendChild(page);
}

function renderSource(s: (typeof sources)[number]): string {
  return `
    <li class="source-item">
      <div class="source-item__header">
        <span class="source-item__id"><code>${s.id}</code></span>
        <span class="source-item__tier tier-badge tier-badge--${s.tier}">Tier ${s.tier}</span>
      </div>
      <p class="source-item__title">
        ${s.url ? `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a>` : s.title}
      </p>
      <p class="source-item__desc">${s.description}</p>
    </li>
  `;
}
