/**
 * Richtext API Mocks
 * Mock map for the richtext API service
 */

import type { MockMap } from '@hai3/react';
import { mockContentItems, mockDefaultContentId, mockContentList } from './richtextMockData';

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
  'PUT /api/richtext/contents/doc-md': (requestData) => {
    const data = requestData as Record<string, unknown> | undefined;
    const content = data?.content;
    if (typeof content === 'string' && mockContentItems['doc-md']) {
      mockContentItems['doc-md'].content = content;
      mockContentItems['doc-md'].updatedAt = new Date().toISOString();
    }
    return mockContentItems['doc-md'];
  },
  'PUT /api/richtext/contents/doc-ts': (requestData) => {
    const data = requestData as Record<string, unknown> | undefined;
    const content = data?.content;
    if (typeof content === 'string' && mockContentItems['doc-ts']) {
      mockContentItems['doc-ts'].content = content;
      mockContentItems['doc-ts'].updatedAt = new Date().toISOString();
    }
    return mockContentItems['doc-ts'];
  },
  'PUT /api/richtext/contents/doc-py': (requestData) => {
    const data = requestData as Record<string, unknown> | undefined;
    const content = data?.content;
    if (typeof content === 'string' && mockContentItems['doc-py']) {
      mockContentItems['doc-py'].content = content;
      mockContentItems['doc-py'].updatedAt = new Date().toISOString();
    }
    return mockContentItems['doc-py'];
  },
  'PUT /api/richtext/contents/doc-json': (requestData) => {
    const data = requestData as Record<string, unknown> | undefined;
    const content = data?.content;
    if (typeof content === 'string' && mockContentItems['doc-json']) {
      mockContentItems['doc-json'].content = content;
      mockContentItems['doc-json'].updatedAt = new Date().toISOString();
    }
    return mockContentItems['doc-json'];
  },
  'PUT /api/richtext/contents/doc-plain': (requestData) => {
    const data = requestData as Record<string, unknown> | undefined;
    const content = data?.content;
    if (typeof content === 'string' && mockContentItems['doc-plain']) {
      mockContentItems['doc-plain'].content = content;
      mockContentItems['doc-plain'].updatedAt = new Date().toISOString();
    }
    return mockContentItems['doc-plain'];
  },
};
