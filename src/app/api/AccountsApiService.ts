/**
 * Accounts Domain - API Service
 * Service for accounts domain (users, tenants, authentication, permissions)
 *
 * Application-specific service (copied from CLI template)
 */

import { BaseApiService, RestProtocol, RestMockPlugin } from '@hai3/react';
import type { GetCurrentUserResponse } from './types';
import { accountsMockMap } from './mocks';

/**
 * Accounts API Service
 * Manages accounts domain endpoints:
 * - User management (current user, profile, preferences)
 * - Tenant management (current tenant, switching)
 * - Authentication (login, logout, tokens)
 * - Permissions and roles
 */
export class AccountsApiService extends BaseApiService {
  constructor() {
    const restProtocol = new RestProtocol({
      timeout: 30000,
    });

    super({ baseURL: '/api/auth/v1' }, restProtocol);

    // Register mock plugin (framework controls when it's active based on mock mode toggle)
    this.registerPlugin(
      restProtocol,
      new RestMockPlugin({
        mockMap: accountsMockMap,
        delay: 100,
      })
    );
  }

  /**
   * Get current authenticated user
   * Uses session-based authentication via cookies
   */
  async getCurrentUser(): Promise<GetCurrentUserResponse> {
    // Make request with credentials to include session cookie
    const response = await fetch('/api/auth/v1/me', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If unauthorized, return empty user (not logged in)
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error('Failed to fetch current user');
    }

    return response.json();
  }
}

// NOTE: With class-based API registration, register services using:
// import { AccountsApiService, apiRegistry } from '@/api';
// apiRegistry.register(AccountsApiService);
