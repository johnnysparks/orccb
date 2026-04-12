import type { QuizFile } from '../lib/types.js';
import { recordQuizAttempt } from '../lib/progress.js';

/**
 * Renders an interactive quiz into `container`.
 * Calls `onComplete(score, total)` when the learner finishes.
 */
export function renderQuizBlock(
  container: HTMLElement,
  quiz: QuizFile,
  onComplete?: (score: number, total: number) => void,
): void {
  if (quiz.questions.length === 0) {
    container.innerHTML = '<p class="quiz-empty">No questions available for this topic yet.</p>';
    return;
  }

  let currentIdx = 0;
  let score = 0;
  const answered = new Array<boolean | null>(quiz.questions.length).fill(null);

  function renderQuestion(): void {
    const q = quiz.questions[currentIdx]!;
    const isAnswered = answered[currentIdx] !== null;
    const wasCorrect = answered[currentIdx] === true;

    container.innerHTML = `
      <div class="quiz-block">
        <div class="quiz-progress">
          Question ${currentIdx + 1} of ${quiz.questions.length}
        </div>
        <div class="quiz-question" role="group" aria-labelledby="quiz-prompt-${currentIdx}">
          <p class="quiz-prompt" id="quiz-prompt-${currentIdx}">${escHtml(q.prompt)}</p>
          <ol class="quiz-choices">
            ${q.choices
              .map((choice, i) => {
                let cls = 'quiz-choice';
                if (isAnswered) {
                  if (i === q.answerIndex) cls += ' quiz-choice--correct';
                  else if (i === (answered[currentIdx] === false ? i : -1)) cls += ' quiz-choice--wrong';
                }
                return `<li>
                  <button class="${cls}" data-index="${i}" ${isAnswered ? 'disabled' : ''}>
                    <span class="quiz-choice__letter">${String.fromCharCode(65 + i)}</span>
                    <span class="quiz-choice__text">${escHtml(choice)}</span>
                  </button>
                </li>`;
              })
              .join('')}
          </ol>
          ${isAnswered ? `<div class="quiz-feedback quiz-feedback--${wasCorrect ? 'correct' : 'wrong'}">
            <p>${wasCorrect ? 'Correct!' : `Incorrect — the answer is <strong>${escHtml(q.choices[q.answerIndex]!)}</strong>.`}</p>
            <p class="quiz-explanation">${escHtml(q.explanation)}</p>
          </div>` : ''}
        </div>
        ${isAnswered ? `<button class="btn btn--primary quiz-next" ${currentIdx === quiz.questions.length - 1 ? 'data-last' : ''}>
          ${currentIdx === quiz.questions.length - 1 ? 'See Results' : 'Next Question'}
        </button>` : ''}
      </div>
    `;

    // Wire up choice buttons
    container.querySelectorAll<HTMLButtonElement>('.quiz-choice').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = parseInt(btn.dataset['index']!, 10);
        const correct = chosen === q.answerIndex;
        answered[currentIdx] = correct;
        if (correct) score++;
        // Re-render with feedback — mark the chosen wrong button
        renderQuestionWithChoice(chosen);
      });
    });

    // Wire up next button
    const nextBtn = container.querySelector<HTMLButtonElement>('.quiz-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if ('last' in (nextBtn.dataset)) {
          renderResults();
        } else {
          currentIdx++;
          renderQuestion();
        }
      });
    }
  }

  function renderQuestionWithChoice(chosenIndex: number): void {
    const q = quiz.questions[currentIdx]!;
    const wasCorrect = chosenIndex === q.answerIndex;

    container.innerHTML = `
      <div class="quiz-block">
        <div class="quiz-progress">
          Question ${currentIdx + 1} of ${quiz.questions.length}
        </div>
        <div class="quiz-question" role="group" aria-labelledby="quiz-prompt-${currentIdx}">
          <p class="quiz-prompt" id="quiz-prompt-${currentIdx}">${escHtml(q.prompt)}</p>
          <ol class="quiz-choices">
            ${q.choices
              .map((choice, i) => {
                let cls = 'quiz-choice';
                if (i === q.answerIndex) cls += ' quiz-choice--correct';
                else if (i === chosenIndex && !wasCorrect) cls += ' quiz-choice--wrong';
                return `<li>
                  <button class="${cls}" disabled>
                    <span class="quiz-choice__letter">${String.fromCharCode(65 + i)}</span>
                    <span class="quiz-choice__text">${escHtml(choice)}</span>
                  </button>
                </li>`;
              })
              .join('')}
          </ol>
          <div class="quiz-feedback quiz-feedback--${wasCorrect ? 'correct' : 'wrong'}">
            <p>${wasCorrect ? 'Correct!' : `Incorrect — the answer is <strong>${escHtml(q.choices[q.answerIndex]!)}</strong>.`}</p>
            <p class="quiz-explanation">${escHtml(q.explanation)}</p>
          </div>
        </div>
        <button class="btn btn--primary quiz-next" ${currentIdx === quiz.questions.length - 1 ? 'data-last' : ''}>
          ${currentIdx === quiz.questions.length - 1 ? 'See Results' : 'Next Question'}
        </button>
      </div>
    `;

    const nextBtn = container.querySelector<HTMLButtonElement>('.quiz-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if ('last' in (nextBtn.dataset)) {
          renderResults();
        } else {
          currentIdx++;
          renderQuestion();
        }
      });
    }
  }

  function renderResults(): void {
    const total = quiz.questions.length;
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 70;

    recordQuizAttempt(quiz.topic, score);

    container.innerHTML = `
      <div class="quiz-block quiz-results">
        <h3 class="quiz-results__title">Quiz Complete</h3>
        <div class="quiz-results__score quiz-results__score--${passed ? 'pass' : 'retry'}">
          <span class="quiz-results__number">${score}/${total}</span>
          <span class="quiz-results__pct">${pct}%</span>
        </div>
        <p class="quiz-results__verdict">
          ${passed ? 'Great work! You scored 70% or above.' : 'Keep studying — aim for 70% or above.'}
        </p>
        <div class="quiz-results__actions">
          <button class="btn btn--secondary quiz-retry">Try Again</button>
          <a href="#/topic/${quiz.topic}" class="btn btn--ghost">Back to Lesson</a>
        </div>
      </div>
    `;

    container.querySelector('.quiz-retry')?.addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      answered.fill(null);
      renderQuestion();
    });

    onComplete?.(score, total);
  }

  renderQuestion();
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
