/**
 * Repository Settings domain events
 */

import '@hai3/react';
import type { RepositorySettings } from '../slices/repositorySettingsSlice';
import type { DocumentIndexConfig, ViewMode } from '../types';

const DOMAIN_ID = 'repositorySettings';
void DOMAIN_ID;

export enum RepositorySettingsEvents {
  RepositorySelected = 'repositories/settings/repositorySelected',
  SettingsLoadRequested = 'repositories/settings/settingsLoadRequested',
  SettingsLoaded = 'repositories/settings/settingsLoaded',
  SettingsSaveRequested = 'repositories/settings/settingsSaveRequested',
  SettingsSaved = 'repositories/settings/settingsSaved',
  ViewModeChanged = 'repositories/settings/viewModeChanged',
  DocumentIndexUpdated = 'repositories/settings/documentIndexUpdated',
  OperationFailed = 'repositories/settings/operationFailed',
}

declare module '@hai3/react' {
  interface EventPayloadMap {
    [RepositorySettingsEvents.RepositorySelected]: { repositoryId: string; provider: string; baseUrl: string };
    [RepositorySettingsEvents.SettingsLoadRequested]: { repositoryId: string };
    [RepositorySettingsEvents.SettingsLoaded]: { settings: RepositorySettings };
    [RepositorySettingsEvents.SettingsSaveRequested]: { repositoryId: string; settings: Partial<RepositorySettings> };
    [RepositorySettingsEvents.SettingsSaved]: { settings: RepositorySettings };
    [RepositorySettingsEvents.ViewModeChanged]: { repositoryId: string; viewMode: ViewMode };
    [RepositorySettingsEvents.DocumentIndexUpdated]: { repositoryId: string; documentIndex: DocumentIndexConfig };
    [RepositorySettingsEvents.OperationFailed]: { error: string };
  }
}
