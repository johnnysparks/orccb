import type { RouteParams } from '../lib/router.js';

export function render(_params: RouteParams, container: HTMLElement): void {
  const page = document.createElement('div');
  page.className = 'page page--methodology';

  page.innerHTML = `
    <h1>Methodology</h1>
    <p class="page-intro">
      This page explains how content on this site is produced, validated, and published.
      Transparency about our process is essential given that learners may rely on this
      material when preparing for a real licensing exam.
    </p>

    <section class="method-section">
      <h2>How content is produced</h2>
      <p>
        Each topic follows a four-step loop before any content is published:
      </p>
      <ol class="method-steps">
        <li>
          <strong>Research</strong> — Primary sources (ORS statutes, Oregon CCB official pages,
          PSI Candidate Information Bulletin) are reviewed and key facts are extracted.
        </li>
        <li>
          <strong>Generate</strong> — Lesson text, audio script, glossary, and quiz questions
          are drafted. Every claim is linked to a source ID.
        </li>
        <li>
          <strong>Validate</strong> — The draft is checked against sources for accuracy.
          The <code>validate-content</code> CI script verifies that all source IDs are
          registered and all quiz questions have the required fields.
        </li>
        <li>
          <strong>Publish</strong> — Content that passes review is merged to <code>main</code>
          and deployed automatically to the live site.
        </li>
      </ol>
    </section>

    <section class="method-section">
      <h2>Source tiers</h2>
      <dl class="tier-list">
        <dt>Tier 1 — Official sources</dt>
        <dd>
          Oregon Revised Statutes (ORS), Oregon Administrative Rules (OAR),
          Oregon CCB official publications, and the PSI Candidate Information Bulletin.
          These are the ground truth. If Tier 2 conflicts with Tier 1, Tier 1 wins.
        </dd>
        <dt>Tier 2 — Secondary references</dt>
        <dd>
          Explanatory materials (textbooks, industry guides) used to clarify concepts.
          Always clearly identified and never used to override primary sources.
        </dd>
      </dl>
    </section>

    <section class="method-section">
      <h2>Exam weight estimates</h2>
      <p>
        Exam weight percentages shown throughout this site are <strong>estimates</strong>
        derived from the PSI content outline structure. They are not official percentages
        published by PSI or the Oregon CCB. These estimates will be refined as topic
        research progresses and primary sources are reviewed.
      </p>
    </section>

    <section class="method-section">
      <h2>What this site is not</h2>
      <ul>
        <li>Not affiliated with, endorsed by, or sponsored by the Oregon CCB or PSI.</li>
        <li>Not a substitute for the official CCB pre-license education requirement.</li>
        <li>Not legal advice. Consult a licensed attorney for legal questions.</li>
        <li>Not guaranteed to be complete or error-free.</li>
      </ul>
      <p>
        Always verify material against current official sources before relying on it
        for licensing decisions.
      </p>
    </section>

    <section class="method-section">
      <h2>Contributing</h2>
      <p>
        This project is open source. If you find an error, a missing source reference,
        or outdated information, please open an issue or pull request on GitHub.
        See <a href="https://github.com/johnnysparks/orccb/blob/main/CONTRIBUTING.md"
          target="_blank" rel="noopener">CONTRIBUTING.md</a> for guidelines.
      </p>
    </section>

    <p class="method-updated">
      <a href="#/sources">View all sources &rarr;</a>
    </p>
  `;

  container.appendChild(page);
}
