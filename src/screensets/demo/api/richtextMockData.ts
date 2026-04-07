/**
 * Richtext Mock Data
 * Mock content items for the richtext API service
 */

import type { RichtextContent } from '../types/richtextTypes';

export const mockContentItems: Record<string, RichtextContent> = {
  'doc-md': {
    id: 'doc-md',
    title: 'Project README',
    content: `# Project README

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
`,
    contentType: 'md',
    language: 'markdown',
    createdAt: '2025-03-10T08:00:00Z',
    updatedAt: '2025-04-07T12:00:00Z',
  },
  'doc-ts': {
    id: 'doc-ts',
    title: 'utils.ts',
    content: `/**
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
`,
    contentType: 'ts',
    language: 'typescript',
    createdAt: '2025-02-20T14:30:00Z',
    updatedAt: '2025-04-01T10:00:00Z',
  },
  'doc-py': {
    id: 'doc-py',
    title: 'main.py',
    content: `"""
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
`,
    contentType: 'py',
    language: 'python',
    createdAt: '2025-01-05T09:00:00Z',
    updatedAt: '2025-03-28T16:45:00Z',
  },
  'doc-json': {
    id: 'doc-json',
    title: 'config.json',
    content: `{
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
`,
    contentType: 'json',
    language: 'json',
    createdAt: '2025-02-01T11:00:00Z',
    updatedAt: '2025-04-05T08:30:00Z',
  },
  'doc-plain': {
    id: 'doc-plain',
    title: 'notes.txt',
    content: `Meeting Notes — April 2025

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
`,
    contentType: 'plain',
    language: 'plaintext',
    createdAt: '2025-04-07T10:00:00Z',
    updatedAt: '2025-04-07T10:30:00Z',
  },
};

export const mockDefaultContentId = 'doc-md';

export const mockContentList = Object.values(mockContentItems).map(({ id, title, contentType }) => ({
  id,
  title,
  contentType,
}));
