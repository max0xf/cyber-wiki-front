/**
 * Editor API Mocks
 * Mock map for the editor API service
 */

import type { MockMap } from '@hai3/react';
import { mockDocuments, mockDefaultDocumentId } from './editorMockData';

/**
 * Mock map for editor API service
 */
export const editorMockMap: MockMap = {
  'GET /api/editor/documents/default': () => mockDocuments[mockDefaultDocumentId],
  'GET /api/editor/documents/notes-1': () => mockDocuments['notes-1'],
  'PUT /api/editor/documents/notes-1': (requestData) => {
    const data = requestData as Record<string, unknown> | undefined;
    const content = data?.content;
    if (typeof content === 'string' && mockDocuments[mockDefaultDocumentId]) {
      mockDocuments[mockDefaultDocumentId].content = content;
      mockDocuments[mockDefaultDocumentId].updatedAt = new Date().toISOString();
    }
    return mockDocuments[mockDefaultDocumentId];
  },
};
