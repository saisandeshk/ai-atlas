import katex from 'katex';
import type { ReactNode } from 'react';

// Content strings mark inline math as LaTeX between \( and \). A plain $ cannot
// be the delimiter, because shell variables and prices in the content use it.
const MATH = /\\\(([\s\S]+?)\\\)/g;

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

// Renders a content string, typesetting its math and leaving the rest as text.
export function tex(text: string | undefined): ReactNode {
  if (!text || !text.includes('\\(')) return text;
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(MATH)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <span
        key={match.index}
        className="math"
        // KaTeX output for formulas written in this repository's content.
        dangerouslySetInnerHTML={{ __html: renderMath(match[1]) }}
      />,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// A plain-text reading of a content string, for search, labels and titles.
export function plain(text: string): string {
  if (!text.includes('\\(')) return text;
  return text.replace(MATH, (_, source: string) =>
    source
      .replace(/\\(?:operatorname|mathrm|mathbf|mathbb|mathcal|text)\{([^}]*)\}/g, '$1')
      .replace(/\\([a-zA-Z]+)/g, '$1')
      .replace(/\\(.)/g, '$1')
      .replace(/[{}]/g, ''),
  );
}
