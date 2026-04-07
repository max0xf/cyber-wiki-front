/**
 * Richtext API Mocks
 * Mock map for the richtext API service
 */

import type { MockMap } from '@hai3/react';
import { mockContentItems, mockDefaultContentId, mockContentList } from './richtextMockData';

/**
 * Create a mock PUT handler that updates content for a given item ID
 */
const mockPutHandler = (id: string) => (requestData: unknown) => {
  const data = requestData as Record<string, unknown> | undefined;
  const content = data?.content;
  if (typeof content === 'string' && mockContentItems[id]) {
    mockContentItems[id].content = content;
    mockContentItems[id].updatedAt = new Date().toISOString();
  }
  return mockContentItems[id];
};

/**
 * Mock map for richtext API service
 */
export const richtextMockMap: MockMap = {
  'GET /api/richtext/contents': () => mockContentList,
  'GET /api/richtext/contents/default': () => mockContentItems[mockDefaultContentId],
  'GET /api/richtext/contents/doc-md': () => mockContentItems['doc-md'],
  'GET /api/richtext/contents/doc-ts': () => mockContentItems['doc-ts'],
  'GET /api/richtext/contents/doc-py': () => mockContentItems['doc-py'],
  'GET /api/richtext/contents/doc-json': () => mockContentItems['doc-json'],
  'GET /api/richtext/contents/doc-plain': () => mockContentItems['doc-plain'],
  'PUT /api/richtext/contents/doc-md': mockPutHandler('doc-md'),
  'PUT /api/richtext/contents/doc-ts': mockPutHandler('doc-ts'),
  'PUT /api/richtext/contents/doc-py': mockPutHandler('doc-py'),
  'PUT /api/richtext/contents/doc-json': mockPutHandler('doc-json'),
  'PUT /api/richtext/contents/doc-plain': mockPutHandler('doc-plain'),
};
