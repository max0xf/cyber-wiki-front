/**
 * Service Token domain events
 */

import '@hai3/react';
import type { ServiceToken } from '../types/serviceTokenTypes';

const DOMAIN_ID = 'serviceToken';
void DOMAIN_ID;

export enum ServiceTokenEvents {
  TokensLoadRequested = 'demo/serviceToken/tokensLoadRequested',
  TokensLoaded = 'demo/serviceToken/tokensLoaded',
  TokenSaveRequested = 'demo/serviceToken/tokenSaveRequested',
  TokenSaved = 'demo/serviceToken/tokenSaved',
  TokenDeleteRequested = 'demo/serviceToken/tokenDeleteRequested',
  TokenDeleted = 'demo/serviceToken/tokenDeleted',
  TokenOperationFailed = 'demo/serviceToken/tokenOperationFailed',
}

declare module '@hai3/react' {
  interface EventPayloadMap {
    [ServiceTokenEvents.TokensLoadRequested]: Record<string, never>;
    [ServiceTokenEvents.TokensLoaded]: { tokens: ServiceToken[] };
    [ServiceTokenEvents.TokenSaveRequested]: { provider: string; baseUrl: string };
    [ServiceTokenEvents.TokenSaved]: { token: ServiceToken };
    [ServiceTokenEvents.TokenDeleteRequested]: { provider: string; baseUrl: string };
    [ServiceTokenEvents.TokenDeleted]: { provider: string; baseUrl: string };
    [ServiceTokenEvents.TokenOperationFailed]: { error: string };
  }
}
