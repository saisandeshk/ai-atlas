'use client';

import { useEffect, useState } from 'react';

// Temporary: lets the learner compare design directions before one is kept.
const palettes = [
  { id: 'paper', label: 'Paper' },
  { id: 'graphite', label: 'Graphite' },
  { id: 'forest', label: 'Forest' },
] as const;
type PaletteId = (typeof palettes)[number]['id'];
const paletteKey = 'ai-atlas-palette';

export function PalettePreview() {
  const [palette, setPalette] = useState<PaletteId>('paper');

  useEffect(() => {
    const task = window.setTimeout(() => {
      const saved = document.documentElement.dataset.palette;
      if (palettes.some((entry) => entry.id === saved))
        setPalette(saved as PaletteId);
    }, 0);
    return () => window.clearTimeout(task);
  }, []);

  function choose(id: PaletteId) {
    setPalette(id);
    document.documentElement.setAttribute('data-palette', id);
    try {
      window.localStorage.setItem(paletteKey, id);
    } catch {
      // The choice still applies for this visit.
    }
  }

  return (
    <fieldset className="palette-preview">
      <legend>Design</legend>
      {palettes.map((entry) => (
        <button
          key={entry.id}
          type="button"
          aria-pressed={palette === entry.id}
          onClick={() => choose(entry.id)}
        >
          {entry.label}
        </button>
      ))}
    </fieldset>
  );
}
