import type { SourceRef } from '../../lib/types.js';

type SourceModule = {
  default: SourceRef;
};

const sourceModules = import.meta.glob<SourceModule>('./sources/*.json', {
  eager: true,
});

const sources = Object.values(sourceModules)
  .map((module) => module.default)
  .sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    return a.id.localeCompare(b.id);
  });

export default sources;
