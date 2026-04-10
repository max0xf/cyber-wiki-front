/**
 * Auth slice - manages authentication state
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types/auth';
import { SCREENSET_ID } from '../../ids';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: `${SCREENSET_ID}/auth`,
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setLoading, setUser, setError, clearAuth } = authSlice.actions;

export default authSlice;

// RootState augmentation
declare module '@hai3/react' {
  interface RootState {
    [authSlice.name]: AuthState;
  }
}

// Selector
export const selectAuthState = (state: import('@hai3/react').RootState): AuthState => {
  return state[authSlice.name] ?? initialState;
};
