/**
 * git API Service
 * Domain-specific API service for this screenset
 */

import { BaseApiService, RestProtocol, RestMockPlugin, apiRegistry } from '@hai3/react';
import { gitMockMap } from './gitMocks';
import type {
  GitRepository,
  GitTreeEntry,
  GitBranch,
  GitFileContent,
  GitComment,
} from '../types/gitTypes';
import type {
  ServiceToken,
  ServiceTokenCreateRequest,
} from '../types/serviceTokenTypes';

/**
 * git API Service
 * Extends BaseApiService with domain-specific methods
 */
export class GitApiService extends BaseApiService {
  constructor() {
    const restProtocol = new RestProtocol();

    super({ baseURL: '/api/git' }, restProtocol);

    // Register mock plugin (framework controls when it's active based on mock mode toggle)
    this.registerPlugin(
      restProtocol,
      new RestMockPlugin({
        mockMap: gitMockMap,
        delay: 100,
      })
    );
  }

  async getRepository(): Promise<GitRepository> {
    return this.protocol(RestProtocol).get<GitRepository>('/repos/current');
  }

  async getTree(path: string): Promise<GitTreeEntry[]> {
    return this.protocol(RestProtocol).get<GitTreeEntry[]>(`/tree/${encodeURIComponent(path || '_root')}`);
  }

  async getBranches(): Promise<GitBranch[]> {
    return this.protocol(RestProtocol).get<GitBranch[]>('/branches');
  }

  async getFileContent(path: string): Promise<GitFileContent> {
    return this.protocol(RestProtocol).get<GitFileContent>(`/contents/${encodeURIComponent(path)}`);
  }

  async getComments(path: string): Promise<GitComment[]> {
    return this.protocol(RestProtocol).get<GitComment[]>(`/comments/${encodeURIComponent(path)}`);
  }

  private getCsrfToken(): string {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return '';
  }

  // Unified service token methods (Git providers, JIRA, ZTA, etc.)
  async getServiceTokens(): Promise<ServiceToken[]> {
    const response = await fetch('/api/service-tokens/v1/tokens/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service tokens: ${response.status}`);
    }

    return response.json();
  }

  async saveServiceToken(data: ServiceTokenCreateRequest): Promise<ServiceToken> {
    const csrfToken = this.getCsrfToken();

    const response = await fetch('/api/service-tokens/v1/tokens/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Failed to save token' }));
      throw new Error(error.detail || `Failed to save service token: ${response.status}`);
    }

    return response.json();
  }

  async deleteServiceToken(serviceType: string, baseUrl: string = ''): Promise<void> {
    const csrfToken = this.getCsrfToken();

    const response = await fetch(`/api/service-tokens/v1/tokens/?service_type=${encodeURIComponent(serviceType)}&base_url=${encodeURIComponent(baseUrl)}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete service token: ${response.status}`);
    }
  }
}

// Register API service using class-based registration
apiRegistry.register(GitApiService);
