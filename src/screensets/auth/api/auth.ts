/**
 * Auth API service
 */

import type { LoginCredentials, LoginResponse } from '../types/auth';

const API_BASE_URL = '';

/**
 * Get CSRF token from cookie
 */
function getCsrfToken(): string | null {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

/**
 * Get CSRF token - fetch it first if not available
 */
async function ensureCsrfToken(): Promise<string> {
  let token = getCsrfToken();

  if (!token) {
    // Fetch CSRF token by making a GET request to any endpoint
    await fetch(`${API_BASE_URL}/api/auth/v1/me`, {
      method: 'GET',
      credentials: 'include',
    }).catch(() => {
      // Ignore errors, we just need the cookie
    });
    token = getCsrfToken();
  }

  return token || '';
}

export const authApi = {
  /**
   * Login with username and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Ensure we have a CSRF token
    const csrfToken = await ensureCsrfToken();

    const response = await fetch(`${API_BASE_URL}/api/auth/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Include cookies for session
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Login failed',
      }));
      throw new Error(error.message || 'Invalid credentials');
    }

    return response.json();
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    const csrfToken = await ensureCsrfToken();

    const response = await fetch(`${API_BASE_URL}/api/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },
};
