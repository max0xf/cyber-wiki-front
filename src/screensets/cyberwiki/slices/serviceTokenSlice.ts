/**
 * Service Token Slice
 * State for service token configuration
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@hai3/react';
import type { ServiceToken, ServiceProvider } from '../types/serviceTokenTypes';

const SLICE_KEY = 'demo/serviceToken' as const;

export interface ServiceTokenState {
  tokens: ServiceToken[];
  loading: boolean;
  error: string | null;
  selectedProvider: ServiceProvider | null;
}

const initialState: ServiceTokenState = {
  tokens: [],
  loading: false,
  error: null,
  selectedProvider: null,
};

export const serviceTokenSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<ServiceToken[]>) => {
      state.tokens = action.payload;
      state.loading = false;
      state.error = null;
    },
    addToken: (state, action: PayloadAction<ServiceToken>) => {
      const existingIndex = state.tokens.findIndex(
        t => t.service_type === action.payload.service_type && t.base_url === action.payload.base_url
      );
      if (existingIndex >= 0) {
        state.tokens[existingIndex] = action.payload;
      } else {
        state.tokens.push(action.payload);
      }
      state.loading = false;
      state.error = null;
    },
    removeToken: (state, action: PayloadAction<{ provider: string; baseUrl: string }>) => {
      state.tokens = state.tokens.filter(
        t => !(t.service_type === action.payload.provider && t.base_url === action.payload.baseUrl)
      );
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedProvider: (state, action: PayloadAction<ServiceProvider | null>) => {
      state.selectedProvider = action.payload;
    },
  },
});

export const {
  setTokens,
  addToken,
  removeToken,
  setLoading,
  setError,
  setSelectedProvider,
} = serviceTokenSlice.actions;

export default serviceTokenSlice;

declare module '@hai3/react' {
  interface RootState {
    [SLICE_KEY]: ServiceTokenState;
  }
}

export const selectServiceTokenState = (state: RootState): ServiceTokenState => {
  return state[SLICE_KEY] ?? initialState;
};
