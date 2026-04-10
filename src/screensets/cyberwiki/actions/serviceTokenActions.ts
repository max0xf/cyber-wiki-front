/**
 * Service Token Actions
 * Emit events AND interact with APIs (Flux pattern)
 */

import { eventBus, apiRegistry } from '@hai3/react';
import { ServiceTokenEvents } from '../events/serviceTokenEvents';
import { GitApiService } from '../api/gitApiService';
import type { ServiceTokenCreateRequest } from '../types/serviceTokenTypes';

export const loadServiceTokens = (): void => {
  eventBus.emit(ServiceTokenEvents.TokensLoadRequested, {});
  void apiRegistry.getService(GitApiService).getServiceTokens().then((tokens) => {
    eventBus.emit(ServiceTokenEvents.TokensLoaded, { tokens });
  }).catch((err) => {
    console.warn('[serviceToken] loadServiceTokens failed:', err);
    eventBus.emit(ServiceTokenEvents.TokenOperationFailed, {
      error: err.message || 'Failed to load service tokens'
    });
  });
};

export const saveServiceToken = (data: ServiceTokenCreateRequest): void => {
  eventBus.emit(ServiceTokenEvents.TokenSaveRequested, {
    provider: data.service_type,
    baseUrl: data.base_url || ''
  });
  void apiRegistry.getService(GitApiService).saveServiceToken(data).then((token) => {
    eventBus.emit(ServiceTokenEvents.TokenSaved, { token });
    // Reload all tokens to ensure UI is updated with latest data
    loadServiceTokens();
  }).catch((err) => {
    console.warn('[serviceToken] saveServiceToken failed:', err);
    eventBus.emit(ServiceTokenEvents.TokenOperationFailed, {
      error: err.message || 'Failed to save service token'
    });
  });
};

export const deleteServiceToken = (provider: string, baseUrl: string): void => {
  eventBus.emit(ServiceTokenEvents.TokenDeleteRequested, { provider, baseUrl });
  void apiRegistry.getService(GitApiService).deleteServiceToken(provider, baseUrl).then(() => {
    eventBus.emit(ServiceTokenEvents.TokenDeleted, { provider, baseUrl });
  }).catch((err) => {
    console.warn('[serviceToken] deleteServiceToken failed:', err);
    eventBus.emit(ServiceTokenEvents.TokenOperationFailed, {
      error: err.message || 'Failed to delete service token'
    });
  });
};
