/**
 * Auth domain effects
 */

import { type AppDispatch, eventBus } from '@hai3/react';
import { authEvents } from '../events/auth';
import { setLoading, setUser, setError, clearAuth } from '../auth';
import { authApi } from '../../../api/auth';

export function initAuthEffects(dispatch: AppDispatch): void {
  console.log('[AuthEffects] Initializing auth effects');

  // Restore auth state from localStorage on initialization
  try {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      const user = JSON.parse(storedUser);
      console.log('[AuthEffects] Restoring auth from localStorage:', user.username);
      dispatch(setUser({ user, token: storedToken }));
    }
  } catch (error) {
    console.warn('[AuthEffects] Failed to restore auth from localStorage:', error);
    // Clear invalid data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  // Handle login request
  eventBus.on(authEvents.loginRequested, (credentials) => {
    console.log('[AuthEffects] Login requested:', credentials.username);
    dispatch(setLoading(true));

    // Fire-and-forget async
    void authApi
      .login(credentials)
      .then((response) => {
        console.log('[AuthEffects] Login API success:', response);
        // Dispatch action directly instead of emitting event (FLUX pattern)
        dispatch(setUser({ user: response.user, token: response.token }));
        // Store in localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      })
      .catch((error: Error) => {
        console.log('[AuthEffects] Login API error:', error);
        // Dispatch error action directly
        dispatch(setError(error.message));
      });
  });

  // Handle logout request
  eventBus.on(authEvents.logoutRequested, () => {
    // Fire-and-forget async
    void authApi
      .logout()
      .then(() => {
        // Dispatch action directly
        dispatch(clearAuth());
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      })
      .catch(() => {
        // Still clear local state even if API call fails
        dispatch(clearAuth());
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      });
  });
}
