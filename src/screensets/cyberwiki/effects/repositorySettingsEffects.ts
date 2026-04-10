/**
 * Repository Settings Effects
 * Listen to repository settings events and update repositorySettingsSlice
 */

import { type AppDispatch, eventBus } from '@hai3/react';
import { RepositorySettingsEvents } from '../events/repositorySettingsEvents';
import type { RepositorySettings } from '../slices/repositorySettingsSlice';
import type { DocumentIndexConfig, ViewMode } from '../types';
import {
  setCurrentRepository,
  updateCurrentRepositorySettings,
  setViewMode,
  setDocumentIndex,
  setLoading,
  setError,
} from '../slices/repositorySettingsSlice';

export const initializeRepositorySettingsEffects = (dispatch: AppDispatch): void => {
  eventBus.on(RepositorySettingsEvents.SettingsLoadRequested, () => {
    dispatch(setLoading(true));
  });

  eventBus.on(RepositorySettingsEvents.SettingsLoaded, ({ settings }: { settings: RepositorySettings }) => {
    dispatch(setCurrentRepository(settings));
  });

  eventBus.on(RepositorySettingsEvents.SettingsSaveRequested, () => {
    dispatch(setLoading(true));
  });

  eventBus.on(RepositorySettingsEvents.SettingsSaved, ({ settings }: { settings: RepositorySettings }) => {
    dispatch(setCurrentRepository(settings));
  });

  eventBus.on(RepositorySettingsEvents.ViewModeChanged, ({ viewMode }: { viewMode: ViewMode }) => {
    dispatch(setViewMode(viewMode));
  });

  eventBus.on(RepositorySettingsEvents.DocumentIndexUpdated, ({ documentIndex }: { documentIndex: DocumentIndexConfig }) => {
    dispatch(setDocumentIndex(documentIndex));
  });

  eventBus.on(RepositorySettingsEvents.OperationFailed, ({ error }: { error: string }) => {
    dispatch(setError(error));
  });
};
