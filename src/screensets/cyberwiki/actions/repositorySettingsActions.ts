/**
 * Repository Settings Actions
 * Emit events AND interact with APIs (Flux pattern)
 */

import { eventBus } from '@hai3/react';
import { RepositorySettingsEvents } from '../events/repositorySettingsEvents';
import { fetchRepositoryConfig, saveRepositoryConfig, saveViewMode } from '../utils/api';
import type { RepositorySettings } from '../slices/repositorySettingsSlice';
import type { DocumentIndexConfig, ViewMode } from '../types';

const DEFAULT_DOCUMENT_INDEX: DocumentIndexConfig = {
  includedExtensions: ['.md', '.mdx'],
  excludedPaths: ['**/node_modules/**', '**/.github/**'],
  titleExtraction: 'first-heading',
  defaultViewMode: 'document',
};

export const selectRepository = (repositoryId: string, provider: string, baseUrl: string): void => {
  eventBus.emit(RepositorySettingsEvents.RepositorySelected, { repositoryId, provider, baseUrl });

  // Load settings for this repository
  eventBus.emit(RepositorySettingsEvents.SettingsLoadRequested, { repositoryId });

  void fetchRepositoryConfig(repositoryId).then((config) => {
    const settings: RepositorySettings = {
      repositoryId,
      provider,
      baseUrl,
      branch: 'main',
      documentIndex: config.documentIndex,
      viewMode: config.documentIndex.defaultViewMode,
    };
    eventBus.emit(RepositorySettingsEvents.SettingsLoaded, { settings });
  }).catch((err) => {
    console.warn('[repositorySettings] loadSettings failed:', err);
    // Use defaults if loading fails
    const settings: RepositorySettings = {
      repositoryId,
      provider,
      baseUrl,
      branch: 'main',
      documentIndex: DEFAULT_DOCUMENT_INDEX,
      viewMode: 'document',
    };
    eventBus.emit(RepositorySettingsEvents.SettingsLoaded, { settings });
  });
};

export const saveSettings = (repositoryId: string, settings: Partial<RepositorySettings>): void => {
  eventBus.emit(RepositorySettingsEvents.SettingsSaveRequested, { repositoryId, settings });

  if (settings.documentIndex) {
    void saveRepositoryConfig(repositoryId, settings.documentIndex).then((config) => {
      const fullSettings: RepositorySettings = {
        repositoryId,
        provider: settings.provider || '',
        baseUrl: settings.baseUrl || '',
        branch: settings.branch || 'main',
        documentIndex: config.documentIndex,
        viewMode: settings.viewMode || config.documentIndex.defaultViewMode,
      };
      eventBus.emit(RepositorySettingsEvents.SettingsSaved, { settings: fullSettings });
    }).catch((err) => {
      console.warn('[repositorySettings] saveSettings failed:', err);
      eventBus.emit(RepositorySettingsEvents.OperationFailed, {
        error: err.message || 'Failed to save settings'
      });
    });
  }
};

export const changeViewMode = (repositoryId: string, viewMode: ViewMode): void => {
  eventBus.emit(RepositorySettingsEvents.ViewModeChanged, { repositoryId, viewMode });

  void saveViewMode(repositoryId, viewMode).catch((err) => {
    console.warn('[repositorySettings] saveViewMode failed:', err);
  });
};

export const updateDocumentIndex = (repositoryId: string, documentIndex: DocumentIndexConfig): void => {
  eventBus.emit(RepositorySettingsEvents.DocumentIndexUpdated, { repositoryId, documentIndex });

  void saveRepositoryConfig(repositoryId, documentIndex).catch((err) => {
    console.warn('[repositorySettings] updateDocumentIndex failed:', err);
    eventBus.emit(RepositorySettingsEvents.OperationFailed, {
      error: err.message || 'Failed to update document index'
    });
  });
};
