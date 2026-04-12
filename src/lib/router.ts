export type RouteParams = Record<string, string>;

export type RenderFn = (params: RouteParams, container: HTMLElement) => void;

interface Route {
  pattern: string;
  render: RenderFn;
}

export class Router {
  private routes: Route[] = [];
  private container: HTMLElement;
  private fallback: RenderFn;

  constructor(
    container: HTMLElement,
    fallback: RenderFn = (_p, c) => {
      c.innerHTML = '<div class="page"><p>Page not found.</p></div>';
    },
  ) {
    this.container = container;
    this.fallback = fallback;
    window.addEventListener('hashchange', () => this.dispatch());
  }

  add(pattern: string, render: RenderFn): this {
    this.routes.push({ pattern, render });
    return this;
  }

  navigate(path: string): void {
    window.location.hash = path;
  }

  start(): void {
    this.dispatch();
  }

  private dispatch(): void {
    const hash = window.location.hash.replace(/^#/, '') || '/';
    for (const route of this.routes) {
      const params = matchPattern(route.pattern, hash);
      if (params !== null) {
        this.container.innerHTML = '';
        route.render(params, this.container);
        window.scrollTo(0, 0);
        return;
      }
    }
    this.container.innerHTML = '';
    this.fallback({}, this.container);
  }
}

function matchPattern(pattern: string, path: string): RouteParams | null {
  const pParts = pattern.split('/').filter(Boolean);
  const vParts = path.split('/').filter(Boolean);
  if (pParts.length !== vParts.length) return null;
  const params: RouteParams = {};
  for (let i = 0; i < pParts.length; i++) {
    const p = pParts[i]!;
    const v = vParts[i]!;
    if (p.startsWith(':')) {
      params[p.slice(1)] = decodeURIComponent(v);
    } else if (p !== v) {
      return null;
    }
  }
  return params;
}
