import type { RouteParams } from '../lib/router.js';
import type { QuizFile } from '../lib/types.js';
import { markTopicComplete } from '../lib/progress.js';
import { renderQuizBlock } from '../components/quiz-block.js';
import curriculum from '../content/metadata/curriculum.json';

// Vite glob: bundles all quiz JSON files for dynamic lookup
const quizFiles = import.meta.glob('../content/quizzes/*.json', { eager: false });

export function render(params: RouteParams, container: HTMLElement): void {
  const slug = params['slug'] ?? '';
  const entry = curriculum.find((e) => e.slug === slug);

  if (!entry) {
    container.innerHTML = `<div class="page"><p class="error">Topic not found: <code>${slug}</code></p></div>`;
    return;
  }

  container.innerHTML = '<div class="page page--quiz"><p class="loading">Loading quiz&hellip;</p></div>';
  const page = container.querySelector<HTMLElement>('.page--quiz')!;

  loadQuiz(slug).then((quiz) => {
    renderQuizPage(page, slug, entry, quiz);
  });
}

async function loadQuiz(slug: string): Promise<QuizFile | null> {
  const key = `../content/quizzes/${slug}.json`;
  const loader = quizFiles[key];
  if (!loader) return null;
  const mod = (await loader()) as { default: QuizFile };
  return mod.default;
}

function renderQuizPage(
  page: HTMLElement,
  slug: string,
  entry: (typeof curriculum)[number],
  quiz: QuizFile | null,
): void {
  page.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="#/curriculum">Curriculum</a>
      <span aria-hidden="true"> / </span>
      <a href="#/topic/${slug}">${entry.title}</a>
      <span aria-hidden="true"> / </span>
      <span aria-current="page">Quiz</span>
    </nav>
    <h1 class="page-title">Quiz: ${entry.title}</h1>
    <p class="muted">~${entry.examWeightPct}% of exam &middot; Open book</p>
    <div id="quiz-container"></div>
  `;

  const quizContainer = page.querySelector<HTMLElement>('#quiz-container')!;

  if (!quiz) {
    quizContainer.innerHTML = `
      <div class="content-placeholder">
        <p><strong>Quiz coming soon.</strong></p>
        <p>Practice questions for <em>${entry.title}</em> are being written.
        In the meantime, <a href="#/topic/${slug}">review the lesson &rarr;</a></p>
      </div>
    `;
    return;
  }

  renderQuizBlock(quizContainer, quiz, (score, total) => {
    if (score / total >= 0.7) {
      markTopicComplete(slug);
    }
  });
}
