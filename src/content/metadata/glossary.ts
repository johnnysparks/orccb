import type { GlossaryTerm } from '../../lib/types.js';

type GlossaryModule = {
  default: GlossaryTerm;
};

const glossaryModules = import.meta.glob<GlossaryModule>('./glossary/*.json', {
  eager: true,
});

const glossary = Object.values(glossaryModules)
  .map((module) => module.default)
  .sort((a, b) => a.slug.localeCompare(b.slug));

export default glossary;
