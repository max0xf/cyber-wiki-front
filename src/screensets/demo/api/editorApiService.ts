/**
 * Editor API Service
 * Domain-specific API service for editor documents
 */

import { BaseApiService, RestProtocol, RestMockPlugin, apiRegistry } from '@hai3/react';
import { editorMockMap } from './editorMocks';
import type { EditorDocument } from '../types/editorTypes';

/**
 * Editor API Service
 * Extends BaseApiService with editor-specific methods
 */
export class EditorApiService extends BaseApiService {
  constructor() {
    const restProtocol = new RestProtocol();

    super({ baseURL: '/api/editor' }, restProtocol);

    this.registerPlugin(
      restProtocol,
      new RestMockPlugin({
        mockMap: editorMockMap,
        delay: 100,
      })
    );
  }

  async getDefaultDocument(): Promise<EditorDocument> {
    return this.protocol(RestProtocol).get<EditorDocument>('/documents/default');
  }

  async getDocument(id: string): Promise<EditorDocument> {
    return this.protocol(RestProtocol).get<EditorDocument>(`/documents/${encodeURIComponent(id)}`);
  }

  async saveDocument(id: string, content: string): Promise<EditorDocument> {
    return this.protocol(RestProtocol).put<EditorDocument>(`/documents/${encodeURIComponent(id)}`, { content });
  }
}

apiRegistry.register(EditorApiService);
