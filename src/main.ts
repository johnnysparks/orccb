import { Router } from './lib/router.js';
import { createShell } from './layouts/main.js';
import { render as renderHome } from './pages/home.js';
import { render as renderCurriculum } from './pages/curriculum.js';
import { render as renderTopic } from './pages/topic.js';
import { render as renderQuiz } from './pages/quiz.js';
import { render as renderProgress } from './pages/progress.js';
import { render as renderSources } from './pages/sources.js';
import { render as renderMethodology } from './pages/methodology.js';

const appEl = document.getElementById('app');
if (!appEl) throw new Error('#app element not found');

const { shell, main } = createShell();
appEl.appendChild(shell);

const router = new Router(main, (_p, c) => {
  c.innerHTML = `
    <div class="page">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="#/" class="btn btn--primary">Go Home</a>
    </div>
  `;
});

router
  .add('/', renderHome)
  .add('/curriculum', renderCurriculum)
  .add('/topic/:slug', renderTopic)
  .add('/quiz/:slug', renderQuiz)
  .add('/progress', renderProgress)
  .add('/sources', renderSources)
  .add('/methodology', renderMethodology)
  .start();
