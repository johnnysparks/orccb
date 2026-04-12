/** Creates the persistent site shell: header + skip link + main content area. */
export function createShell(): { shell: HTMLElement; main: HTMLElement } {
  const shell = document.createElement('div');
  shell.id = 'shell';

  // Skip-to-content link for keyboard/screen-reader users
  const skip = document.createElement('a');
  skip.href = '#page-content';
  skip.className = 'skip-link';
  skip.textContent = 'Skip to content';
  shell.appendChild(skip);

  // Site header
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="header-inner">
      <a href="#/" class="site-logo" aria-label="Oregon CCB Pre-License Course — Home">
        <span class="logo-mark" aria-hidden="true">OR</span>
        <span class="logo-text">CCB Pre-License Course</span>
      </a>
      <nav class="site-nav" aria-label="Main navigation">
        <a href="#/curriculum" class="nav-link">Curriculum</a>
        <a href="#/progress" class="nav-link">My Progress</a>
        <a href="#/sources" class="nav-link">Sources</a>
        <a href="#/methodology" class="nav-link">Methodology</a>
      </nav>
      <button class="nav-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav id="mobile-menu" class="mobile-nav" aria-label="Mobile navigation" hidden>
      <a href="#/curriculum" class="mobile-nav-link">Curriculum</a>
      <a href="#/progress" class="mobile-nav-link">My Progress</a>
      <a href="#/sources" class="mobile-nav-link">Sources</a>
      <a href="#/methodology" class="mobile-nav-link">Methodology</a>
    </nav>
  `;
  shell.appendChild(header);

  // Wire up mobile menu toggle
  const toggle = header.querySelector<HTMLButtonElement>('.nav-toggle')!;
  const mobileMenu = header.querySelector<HTMLElement>('#mobile-menu')!;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
  });

  // Close mobile menu on nav link click
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    });
  });

  // Highlight active nav link on hash change
  function updateActiveLink(): void {
    const hash = window.location.hash || '#/';
    header.querySelectorAll('.nav-link, .mobile-nav-link').forEach((el) => {
      const a = el as HTMLAnchorElement;
      const href = a.getAttribute('href') ?? '';
      a.classList.toggle('nav-link--active', hash.startsWith(href) && href !== '#/');
    });
  }
  window.addEventListener('hashchange', updateActiveLink);
  updateActiveLink();

  // Main content area (updated by router)
  const main = document.createElement('main');
  main.id = 'page-content';
  main.setAttribute('tabindex', '-1');
  shell.appendChild(main);

  // Footer with disclaimer
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <p class="disclaimer">
        <strong>Disclaimer:</strong> This site is an independent study resource and is not affiliated with,
        endorsed by, or sponsored by the Oregon Construction Contractors Board (CCB) or PSI Exams.
        Content is provided for educational purposes only. Verify all material against official
        Oregon CCB sources before relying on it for licensing decisions.
      </p>
      <p class="footer-links">
        <a href="#/methodology">How content is produced</a> &middot;
        <a href="#/sources">Sources</a> &middot;
        <a href="https://github.com/johnnysparks/orccb" target="_blank" rel="noopener">GitHub</a>
      </p>
    </div>
  `;
  shell.appendChild(footer);

  return { shell, main };
}
