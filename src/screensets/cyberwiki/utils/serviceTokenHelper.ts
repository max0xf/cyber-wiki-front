/**
 * Service Token Helper
 * Utilities to get git provider credentials from service tokens
 */

import { useAppSelector } from '@hai3/react';
import { selectServiceTokenState } from '../slices/serviceTokenSlice';
import type { ServiceToken } from '../types/serviceTokenTypes';

/**
 * React hook to get all git provider tokens
 */
export function useGitProviderTokens(): ServiceToken[] {
  const tokenState = useAppSelector(selectServiceTokenState);

  return tokenState.tokens.filter(t =>
    t.service_type === 'github' || t.service_type === 'bitbucket_server'
  );
}

/**
 * React hook to get default provider info (first available)
 */
export function useDefaultProvider(): { provider: string; baseUrl: string } | null {
  const tokens = useGitProviderTokens();

  if (tokens.length === 0) return null;

  const token = tokens[0];
  return {
    provider: token.service_type,
    baseUrl: token.base_url || (token.service_type === 'github' ? 'https://api.github.com' : ''),
  };
}

/**
 * React hook to check if user has git provider credentials
 */
export function useHasGitProviderCredentials(): boolean {
  const tokens = useGitProviderTokens();
  return tokens.length > 0;
}

/**
 * React hook to get token for specific provider
 */
export function useServiceToken(provider?: string, baseUrl?: string): ServiceToken | null {
  const tokenState = useAppSelector(selectServiceTokenState);

  if (!provider) return null;

  const token = tokenState.tokens.find(t => {
    if (t.service_type !== provider) return false;
    if (baseUrl && t.base_url !== baseUrl) return false;
    return true;
  });

  return token || null;
}
