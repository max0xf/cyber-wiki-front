/**
 * Editor Mock Data
 * Mock documents for the editor API service
 */

import type { EditorDocument } from '../types/editorTypes';

export const mockDocuments: Record<string, EditorDocument> = {
  'notes-1': {
    id: 'notes-1',
    title: 'Notes',
    content: `# Notes

Rich text editing with Markdown as the source of truth:

- **bold** and _italic_
- ~~strikethrough~~
- \`inline code\`

## Quick Commands

> Cmd/Ctrl+B — bold
> Cmd/Ctrl+I — italic

\`\`\`
export function hello(name: string) {
  return \`Hello, \${name}\`;
}
\`\`\`
`,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-04-07T09:00:00Z',
  },
};

export const mockDefaultDocumentId = 'notes-1';
