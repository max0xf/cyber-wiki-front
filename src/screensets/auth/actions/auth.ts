/**
 * Auth actions
 */

import { eventBus } from '@hai3/react';
import type { LoginCredentials } from '../types/auth';

// Event constants (duplicated to avoid importing from slices)
const AUTH_EVENTS = {
  loginRequested: 'auth/auth/loginRequested' as const,
  logoutRequested: 'auth/auth/logoutRequested' as const,
};

/**
 * Request login with credentials
 */
export function loginAction(credentials: LoginCredentials): void {
  eventBus.emit(AUTH_EVENTS.loginRequested, credentials);
}

/**
 * Request logout
 */
export function logoutAction(): void {
  eventBus.emit(AUTH_EVENTS.logoutRequested);
}
