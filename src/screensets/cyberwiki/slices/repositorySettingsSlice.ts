/**
 * Repository Settings Slice
 * State for repository configuration and preferences
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@hai3/react';
import type { DocumentIndexConfig, ViewMode } from '../types';

const SLICE_KEY = 'repositories/settings' as const;

export interface RepositorySettings {
  repositoryId: string;
  provider: string;
  baseUrl: string;
  branch: string;
  documentIndex: DocumentIndexConfig;
  viewMode: ViewMode;
}

export interface RepositorySettingsState {
  currentRepository: RepositorySettings | null;
  savedRepositories: Record<string, RepositorySettings>;
  loading: boolean;
  error: string | null;
}

const initialState: RepositorySettingsState = {
  currentRepository: null,
  savedRepositories: {},
  loading: false,
  error: null,
};

export const repositorySettingsSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    setCurrentRepository: (state, action: PayloadAction<RepositorySettings>) => {
      state.currentRepository = action.payload;
      state.savedRepositories[action.payload.repositoryId] = action.payload;
    },
    updateCurrentRepositorySettings: (state, action: PayloadAction<Partial<RepositorySettings>>) => {
      if (state.currentRepository) {
        state.currentRepository = { ...state.currentRepository, ...action.payload };
        state.savedRepositories[state.currentRepository.repositoryId] = state.currentRepository;
      }
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      if (state.currentRepository) {
        state.currentRepository.viewMode = action.payload;
        state.savedRepositories[state.currentRepository.repositoryId].viewMode = action.payload;
      }
    },
    setDocumentIndex: (state, action: PayloadAction<DocumentIndexConfig>) => {
      if (state.currentRepository) {
        state.currentRepository.documentIndex = action.payload;
        state.savedRepositories[state.currentRepository.repositoryId].documentIndex = action.payload;
      }
    },
    loadSavedRepositories: (state, action: PayloadAction<Record<string, RepositorySettings>>) => {
      state.savedRepositories = action.payload;
      state.loading = false;
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
    clearCurrentRepository: (state) => {
      state.currentRepository = null;
    },
  },
});

export const {
  setCurrentRepository,
  updateCurrentRepositorySettings,
  setViewMode,
  setDocumentIndex,
  loadSavedRepositories,
  setLoading,
  setError,
  clearCurrentRepository,
} = repositorySettingsSlice.actions;

export default repositorySettingsSlice;

declare module '@hai3/react' {
  interface RootState {
    [SLICE_KEY]: RepositorySettingsState;
  }
}

export const selectRepositorySettingsState = (state: RootState): RepositorySettingsState => {
  return state[SLICE_KEY] ?? initialState;
};

export const selectCurrentRepository = (state: RootState): RepositorySettings | null => {
  return selectRepositorySettingsState(state).currentRepository;
};

export const selectSavedRepository = (state: RootState, repositoryId: string): RepositorySettings | undefined => {
  return selectRepositorySettingsState(state).savedRepositories[repositoryId];
};
