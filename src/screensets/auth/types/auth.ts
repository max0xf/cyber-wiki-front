/**
 * Auth domain types
 */

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Login response from API
 * - user: User information
 * - token: API token for external clients (curl, Postman, etc.)
 *   UI uses session-based auth via cookies, token is optional
 */
export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * Auth state
 * - user: Current authenticated user (required for UI access)
 * - token: API token (optional for UI, used by external API clients)
 *   UI authentication is session-based via cookies
 */
export interface AuthState {
  user: User | null;
  token: string | null;  // Optional: only for API clients, not used by UI
  isLoading: boolean;
  error: string | null;
}
