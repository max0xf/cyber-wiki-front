/**
 * Richtext API Service
 * Domain-specific API service for richtext content
 */

import { BaseApiService, RestProtocol, RestMockPlugin, apiRegistry } from '@hai3/react';
import { richtextMockMap } from './richtextMocks';
import type { RichtextContent } from '../types/richtextTypes';

type RichtextListItem = Pick<RichtextContent, 'id' | 'title' | 'contentType'>;

/**
 * Richtext API Service
 * Extends BaseApiService with richtext-specific methods
 */
export class RichtextApiService extends BaseApiService {
  constructor() {
    const restProtocol = new RestProtocol();

    super({ baseURL: '/api/richtext' }, restProtocol);

    this.registerPlugin(
      restProtocol,
      new RestMockPlugin({
        mockMap: richtextMockMap,
        delay: 100,
      })
    );
  }

  async listContents(): Promise<RichtextListItem[]> {
    return this.protocol(RestProtocol).get<RichtextListItem[]>('/contents');
  }

  async getDefaultContent(): Promise<RichtextContent> {
    return this.protocol(RestProtocol).get<RichtextContent>('/contents/default');
  }

  async getContent(id: string): Promise<RichtextContent> {
    return this.protocol(RestProtocol).get<RichtextContent>(`/contents/${encodeURIComponent(id)}`);
  }

  async saveContent(id: string, content: string): Promise<RichtextContent> {
    return this.protocol(RestProtocol).put<RichtextContent>(`/contents/${encodeURIComponent(id)}`, { content });
  }
}

apiRegistry.register(RichtextApiService);
