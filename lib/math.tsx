import katex from 'katex';
import type { ReactNode } from 'react';

// Content strings mark inline math as LaTeX between \( and \), and inline code
// between backticks. A plain $ cannot be the math delimiter, because shell
// variables and prices in the content use it. Whichever span opens first wins,
// so a regex in code may contain \( and math never holds a backtick.
const SPAN = /\\\(([\s\S]+?)\\\)|`([^`\n]+)`/g;
// A bare address in prose. Trailing sentence punctuation is not part of it.
const URL = /https?:\/\/[^\s<>"'`)\]]+[^\s<>"'`)\].,;:!?]/g;

const rendered = new Map<string, string>();

function renderMath(source: string) {
  let html = rendered.get(source);
  if (html === undefined) {
    // validate-content.mjs parses every formula strictly, so nothing here is
    // expected to fail; throwOnError: false shows the source in red if one does.
    html = katex.renderToString(source, { throwOnError: false });
    rendered.set(source, html);
  }
  return html;
}

function linkify(text: string, key: number): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(URL)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <a
        key={`${key}-${match.index}`}
        className="inline-link"
        href={match[0]}
        target="_blank"
        rel="noopener noreferrer"
      >
        {match[0]}
      </a>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function render(text: string | undefined, links: boolean): ReactNode {
  if (!text) return text;
  const hasLink = links && text.includes('://');
  if (!text.includes('\\(') && !text.includes('`') && !hasLink) return text;
  const parts: ReactNode[] = [];
  const prose = (slice: string, key: number) => {
    if (slice) parts.push(...(hasLink ? linkify(slice, key) : [slice]));
  };
  let last = 0;
  for (const match of text.matchAll(SPAN)) {
    prose(text.slice(last, match.index), last);
    parts.push(
      match[1] !== undefined ? (
        <span
          key={match.index}
          className="math"
          // KaTeX output for formulas written in this repository's content.
          dangerouslySetInnerHTML={{ __html: renderMath(match[1]) }}
        />
      ) : (
        <code key={match.index} className="inline-code">
          {match[2]}
        </code>
      ),
    );
    last = match.index + match[0].length;
  }
  prose(text.slice(last), last);
  return parts;
}

// Renders a content string with its math typeset and its code in monospace.
// Use it for titles and anything already inside a link or button.
export function tex(text: string | undefined): ReactNode {
  return render(text, false);
}

// Like tex, and also turns bare addresses in the prose into links.
export function rich(text: string | undefined): ReactNode {
  return render(text, true);
}

// A plain-text reading of a content string, for search, labels and titles.
export function plain(text: string): string {
  if (!text.includes('\\(') && !text.includes('`')) return text;
  return text.replace(SPAN, (_, source: string | undefined, code: string | undefined) =>
    source === undefined
      ? (code ?? '')
      : source
          .replace(/\\(?:operatorname|mathrm|mathbf|mathbb|mathcal|text)\{([^}]*)\}/g, '$1')
          .replace(/\\([a-zA-Z]+)/g, '$1')
          .replace(/\\(.)/g, '$1')
          .replace(/[{}]/g, ''),
  );
}
