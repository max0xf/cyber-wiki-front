/**
 * Bootstrap Effects
 *
 * Effects for app-level bootstrap operations.
 * Following flux architecture: Listen to events from actions, dispatch to slices.
 */

import { trim } from 'lodash';
import { eventBus, setUser, setHeaderLoading, apiRegistry, type AppDispatch, type HeaderUser } from '@hai3/react';
import { AccountsApiService, type ApiUser } from '@/app/api';
import { setUser as setAuthUser } from '@/screensets/auth/slices/auth/auth';

/**
 * Convert API user to header user info
 */
function toHeaderUser(user: ApiUser): HeaderUser {
  const displayName = trim(`${user.firstName || ''} ${user.lastName || ''}`);
  return {
    displayName: displayName || undefined,
    email: user.email || undefined,
    avatarUrl: user.avatarUrl,
  };
}

/**
 * Register bootstrap effects
 * Called once during app initialization
 */
export function registerBootstrapEffects(appDispatch: AppDispatch): void {
  // Store dispatch for use in event listeners
  const dispatch = appDispatch;

  // Listen for 'app/user/fetch' event
  eventBus.on('app/user/fetch', async () => {
    try {
      // Check if accounts service is registered before trying to use it
      if (!apiRegistry.has(AccountsApiService)) {
        // Accounts service not registered - skip user fetch
        return;
      }

      dispatch(setHeaderLoading(true));
      // Get accounts service using class-based registration
      const accountsService = apiRegistry.getService(AccountsApiService);
      const response = await accountsService.getCurrentUser();
      if (response?.user) {
        const apiUser = response.user as any; // Backend returns UserInfoSerializer
        dispatch(setUser(toHeaderUser(response.user)));

        // Also set auth state to maintain session (use 'session' as token placeholder)
        const authUser = {
          id: apiUser.id,
          username: apiUser.username,
          email: apiUser.email || '',
          role: apiUser.role || 'user',
        };
        const authToken = 'session'; // Placeholder for session-based auth

        dispatch(setAuthUser({ user: authUser, token: authToken }));

        // Save to localStorage for persistence across page reloads
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(authUser));
      }
    } catch (error) {
      console.warn('Failed to fetch user:', error);
      dispatch(setHeaderLoading(false));

      // If session is invalid (401), clear localStorage auth data
      if (error instanceof Error && error.message.includes('Not authenticated')) {
        console.log('[Bootstrap] Session invalid, clearing localStorage auth');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Also clear auth state to force re-login
        const { clearAuth } = await import('@/screensets/auth/slices/auth/auth');
        dispatch(clearAuth());
      }
    }
  });

  // Listen for 'app/user/loaded' event - updates header when any screen loads user data
  eventBus.on('app/user/loaded', ({ user }) => {
    dispatch(setUser(toHeaderUser(user)));
  });
}
