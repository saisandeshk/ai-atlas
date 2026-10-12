'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

type ThemeChoice = 'system' | 'light' | 'dark';

export const themeStorageKey = 'ai-atlas-theme';

const order: ThemeChoice[] = ['system', 'light', 'dark'];
const labels: Record<ThemeChoice, string> = {
  system: 'Theme follows your system',
  light: 'Light theme',
  dark: 'Dark theme',
};

// The layout's inline script applies the saved choice before first paint;
// this button only changes it.
export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>('system');

  useEffect(() => {
    const task = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(themeStorageKey);
        if (saved === 'light' || saved === 'dark') setChoice(saved);
      } catch {
        // Without storage the theme simply follows the system.
      }
    }, 0);
    return () => window.clearTimeout(task);
  }, []);

  function cycle() {
    const next = order[(order.indexOf(choice) + 1) % order.length];
    setChoice(next);
    const root = document.documentElement;
    if (next === 'system') delete root.dataset.theme;
    else root.dataset.theme = next;
    try {
      if (next === 'system') window.localStorage.removeItem(themeStorageKey);
      else window.localStorage.setItem(themeStorageKey, next);
    } catch {
      // The choice still applies for this visit.
    }
  }

  const Icon = choice === 'light' ? Sun : choice === 'dark' ? Moon : Monitor;
  return (
    <button
      type="button"
      className="icon-button"
      onClick={cycle}
      aria-label={`${labels[choice]}. Change theme`}
      title={labels[choice]}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}
