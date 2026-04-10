/**
 * Service Token Effects
 * Listen to service token events and update serviceTokenSlice
 */

import { type AppDispatch, eventBus } from '@hai3/react';
import { ServiceTokenEvents } from '../events/serviceTokenEvents';
import type { ServiceToken } from '../types/serviceTokenTypes';
import {
  setTokens,
  addToken,
  removeToken,
  setLoading,
  setError,
} from '../slices/serviceTokenSlice';

export const initializeServiceTokenEffects = (dispatch: AppDispatch): void => {
  eventBus.on(ServiceTokenEvents.TokensLoadRequested, () => {
    dispatch(setLoading(true));
  });

  eventBus.on(ServiceTokenEvents.TokensLoaded, ({ tokens }: { tokens: ServiceToken[] }) => {
    dispatch(setTokens(tokens));
  });

  eventBus.on(ServiceTokenEvents.TokenSaveRequested, () => {
    dispatch(setLoading(true));
  });

  eventBus.on(ServiceTokenEvents.TokenSaved, ({ token }: { token: ServiceToken }) => {
    dispatch(addToken(token));
  });

  eventBus.on(ServiceTokenEvents.TokenDeleteRequested, () => {
    dispatch(setLoading(true));
  });

  eventBus.on(ServiceTokenEvents.TokenDeleted, ({ provider, baseUrl }: { provider: string; baseUrl: string }) => {
    dispatch(removeToken({ provider, baseUrl }));
  });

  eventBus.on(ServiceTokenEvents.TokenOperationFailed, ({ error }: { error: string }) => {
    dispatch(setError(error));
  });
};
