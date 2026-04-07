/**
 * Richtext Mock Data
 * Mock content items for the richtext API service
 */

import { map } from 'lodash';
import type { RichtextContent, RichtextContentType } from '../types/richtextTypes';

/**
 * Factory to create a mock content item with shared defaults
 */
const createItem = (
  id: string,
  title: string,
  content: string,
  contentType: RichtextContentType,
  language: string,
  createdAt: string,
  updatedAt: string,
): RichtextContent => ({ id, title, content, contentType, language, createdAt, updatedAt });

export const mockContentItems: Record<string, RichtextContent> = {
  'doc-md': createItem('doc-md', 'Project README', `# Project README

Welcome to the **Rich Text** content block.

This module detects content type and renders the appropriate editor:

- **Markdown** files use the Milkdown WYSIWYG editor
- **Code** files (TS, PY, JSON) use the syntax-highlighted code editor
- **Plain text** falls back to a simple textarea

## Features

1. Auto-detection of content type via API
2. Editable in all modes
3. Save back to API

> All content is fetched and persisted through the API layer.

\`\`\`ts
const greeting = (name: string) => \`Hello, \${name}!\`;
\`\`\`
`, 'md', 'markdown', '2025-03-10T08:00:00Z', '2025-04-07T12:00:00Z'),

  'doc-ts': createItem('doc-ts', 'utils.ts', `/**
 * Utility helpers
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);
`, 'ts', 'typescript', '2025-02-20T14:30:00Z', '2025-04-01T10:00:00Z'),

  'doc-py': createItem('doc-py', 'main.py', `"""
Simple Python script example
"""

from typing import List


def fibonacci(n: int) -> List[int]:
    """Generate first n Fibonacci numbers."""
    if n <= 0:
        return []
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]


if __name__ == "__main__":
    print(fibonacci(10))
`, 'py', 'python', '2025-01-05T09:00:00Z', '2025-03-28T16:45:00Z'),

  'doc-json': createItem('doc-json', 'config.json', `{
  "name": "my-project",
  "version": "1.0.0",
  "settings": {
    "theme": "dark",
    "language": "en",
    "autoSave": true,
    "tabSize": 2
  },
  "features": [
    "richtext",
    "code-highlight",
    "markdown-preview"
  ]
}
`, 'json', 'json', '2025-02-01T11:00:00Z', '2025-04-05T08:30:00Z'),

  'doc-plain': createItem('doc-plain', 'notes.txt', `Meeting Notes — April 2025

Attendees: Alice, Bob, Charlie

Agenda:
  1. Review Q1 results
  2. Discuss roadmap for Q2
  3. Budget allocation

Action Items:
  - Alice: prepare detailed report by Friday
  - Bob: schedule follow-up with design team
  - Charlie: update project timeline

Next meeting: April 14, 2025 at 10:00 AM
`, 'plain', 'plaintext', '2025-04-07T10:00:00Z', '2025-04-07T10:30:00Z'),
};

export const mockDefaultContentId = 'doc-md';

export const mockContentList = map(mockContentItems, ({ id, title, contentType }) => ({
  id,
  title,
  contentType,
}));
