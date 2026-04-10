/**
 * Git API Service
 * Handles service token management for git providers
 */

import { BaseApiService, RestProtocol, apiRegistry } from '@hai3/react';
import type {
  ServiceToken,
  ServiceTokenCreateRequest,
} from '../types/serviceTokenTypes';

/**
 * Git API Service
 * Manages service tokens for git providers (GitHub, Bitbucket, etc.)
 */
export class GitApiService extends BaseApiService {
  constructor() {
    const restProtocol = new RestProtocol();
    super({ baseURL: '/api/service-tokens/v1' }, restProtocol);
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
