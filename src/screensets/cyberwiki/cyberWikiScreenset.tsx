/**
 * CyberWiki Screenset
 * Main screenset for repository browsing, document viewing, and configuration
 */

import { type ScreensetConfig, ScreensetCategory, I18nRegistry, Language, screensetRegistry, i18nRegistry, registerSlice } from '@hai3/react';
import {
  CYBERWIKI_SCREENSET_ID,
  REPOSITORY_SELECTION_SCREEN_ID,
  REPOSITORY_VIEW_SCREEN_ID,
  REPOSITORY_CONFIGURATION_SCREEN_ID,
  CONFIGURATION_SCREEN_ID
} from './ids';
import repositorySettingsSlice from './slices/repositorySettingsSlice';
import serviceTokenSlice from './slices/serviceTokenSlice';
import { initializeRepositorySettingsEffects } from './effects/repositorySettingsEffects';
import { initializeServiceTokenEffects } from './effects/serviceTokenEffects';

// Register translations
i18nRegistry.registerLoader(
  `screenset.${CYBERWIKI_SCREENSET_ID}`,
  I18nRegistry.createLoader({
    [Language.English]: () => import('./i18n/en.json'),
  })
);

// Register slices
registerSlice(repositorySettingsSlice, (dispatch) => {
  initializeRepositorySettingsEffects(dispatch);
});

registerSlice(serviceTokenSlice, (dispatch) => {
  initializeServiceTokenEffects(dispatch);
});

/**
 * CyberWiki Screenset Configuration
 * Includes repository navigation, document viewing, and system configuration
 */
export const cyberWikiScreenset: ScreensetConfig = {
  id: CYBERWIKI_SCREENSET_ID,
  name: 'CyberWiki',
  category: ScreensetCategory.Drafts,
  defaultScreen: REPOSITORY_SELECTION_SCREEN_ID,
  menu: [
    {
      menuItem: {
        id: REPOSITORY_SELECTION_SCREEN_ID,
        label: `screenset.${CYBERWIKI_SCREENSET_ID}:screens.${REPOSITORY_SELECTION_SCREEN_ID}.title`,
        icon: 'lucide:folder-git',
      },
      screen: () => import('./screens/repository-selection/RepositorySelectionScreen'),
    },
    {
      menuItem: {
        id: REPOSITORY_VIEW_SCREEN_ID,
        label: `screenset.${CYBERWIKI_SCREENSET_ID}:screens.${REPOSITORY_VIEW_SCREEN_ID}.title`,
        icon: 'lucide:file-text',
      },
      screen: () => import('./screens/repository-view/RepositoryViewScreen'),
    },
    {
      menuItem: {
        id: REPOSITORY_CONFIGURATION_SCREEN_ID,
        label: `screenset.${CYBERWIKI_SCREENSET_ID}:screens.${REPOSITORY_CONFIGURATION_SCREEN_ID}.title`,
        icon: 'lucide:settings',
      },
      screen: () => import('./screens/repository-configuration/RepositoryConfigurationScreen'),
    },
    {
      menuItem: {
        id: CONFIGURATION_SCREEN_ID,
        label: `screenset.${CYBERWIKI_SCREENSET_ID}:screens.${CONFIGURATION_SCREEN_ID}.title`,
        icon: 'lucide:cog',
      },
      screen: () => import('./screens/configuration/ConfigurationScreen'),
    },
  ],
};

/**
 * Self-register screenset
 * Auto-discovered via Vite glob import in screensetRegistry.tsx
 */
screensetRegistry.register(cyberWikiScreenset);
