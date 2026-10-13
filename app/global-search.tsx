'use client';

import {
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { Search } from 'lucide-react';

import { tex } from '@/lib/math';

export type SearchKind = 'unit' | 'project' | 'section' | 'topic' | 'resource';

export type SearchEntry = {
  id: string;
  kind: SearchKind;
  title: string;
  context: string;
  // Lowercased title, and the title plus extra words such as a unit's topics.
  titleText: string;
  text: string;
  target: {
    routeId: string;
    sectionId?: string;
    unitId?: string;
    anchor?: string;
  };
};

const kindLabels: Record<SearchKind, string> = {
  unit: 'Unit',
  project: 'Project',
  section: 'Section',
  topic: 'Topic',
  resource: 'Resource',
};

const kindOrder: Record<SearchKind, number> = {
  unit: 0,
  project: 1,
  section: 2,
  topic: 3,
  resource: 4,
};

const resultLimit = 30;

// Every word must appear somewhere. Title matches rank first, then units
// before projects, sections, topics and resources.
function search(entries: SearchEntry[], rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return { hits: [], total: 0 };
  const words = query.split(/\s+/);
  const ranked: Array<{ entry: SearchEntry; score: number; order: number }> =
    [];
  entries.forEach((entry, order) => {
    if (!words.every((word) => entry.text.includes(word))) return;
    const score = entry.titleText.startsWith(query)
      ? 0
      : entry.titleText.includes(query)
        ? 1
        : words.every((word) => entry.titleText.includes(word))
          ? 2
          : 3;
    ranked.push({ entry, score, order });
  });
  ranked.sort(
    (a, b) =>
      a.score - b.score ||
      kindOrder[a.entry.kind] - kindOrder[b.entry.kind] ||
      a.order - b.order,
  );
  return {
    hits: ranked.slice(0, resultLimit).map(({ entry }) => entry),
    total: ranked.length,
  };
}

export function GlobalSearch({
  entries,
  onSelect,
  inputRef,
}: {
  entries: SearchEntry[];
  onSelect: (entry: SearchEntry) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const { hits, total } = useMemo(
    () => search(entries, query),
    [entries, query],
  );
  const showResults = open && query.trim().length > 0;
  const activeHit = showResults ? hits[active] : undefined;

  function choose(entry: SearchEntry) {
    onSelect(entry);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!hits.length) return;
      event.preventDefault();
      setOpen(true);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((current) => (current + step + hits.length) % hits.length);
    } else if (event.key === 'Enter') {
      if (activeHit) {
        event.preventDefault();
        choose(activeHit);
      }
    } else if (event.key === 'Escape') {
      if (query) setQuery('');
      else inputRef.current?.blur();
    }
  }

  return (
    <div className="global-search">
      <label className="search-field">
        <Search aria-hidden="true" />
        <span className="sr-only">Search units, topics and resources</span>
        <input
          ref={inputRef}
          type="search"
          aria-controls={listId}
          aria-keyshortcuts="/"
          value={query}
          placeholder="Search units, topics and resources"
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKey}
        />
        <kbd>/</kbd>
      </label>
      <output className="sr-only">
        {showResults
          ? `${total} ${total === 1 ? 'result' : 'results'}. Use the arrow keys and Enter to open one.`
          : ''}
      </output>

      {showResults && (
        <div className="search-results">
          {hits.length ? (
            <ul id={listId} aria-label="Search results">
              {hits.map((entry, index) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    tabIndex={-1}
                    className={index === active ? 'active' : undefined}
                    // Keep focus in the input so it does not close first.
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(entry)}
                  >
                    <span className={`hit-kind ${entry.kind}`}>
                      {kindLabels[entry.kind]}
                    </span>
                    <span className="hit-copy">
                      <strong>{tex(entry.title)}</strong>
                      <small>{tex(entry.context)}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="search-note">Nothing matches “{query.trim()}”.</p>
          )}
          {total > hits.length && (
            <p className="search-note">
              Showing {hits.length} of {total}. Add a word to narrow it.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
