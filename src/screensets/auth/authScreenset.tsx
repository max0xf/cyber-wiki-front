/**
 * Auth Screenset
 *
 * Handles authentication flows including login, logout, and SSO.
 */

import { type ScreensetConfig, ScreensetCategory, registerSlice } from '@hai3/react';
import authSlice from './slices/auth/auth';
import { initAuthEffects } from './slices/auth/effects/auth';
import { SCREENSET_ID, SCREEN_IDS } from './ids';

// Import events for type augmentation
import './slices/auth/events/auth';

// Register slice with effects
registerSlice(authSlice, initAuthEffects);

// Export screens
export { LoginScreen } from './screens/login/login.screen';

/**
 * Auth Screenset Configuration
 * Note: This screenset is not shown in the menu - it's only used for the login page
 */
export const authScreenset: ScreensetConfig = {
  id: SCREENSET_ID,
  name: 'Authentication',
  category: ScreensetCategory.Drafts,
  defaultScreen: SCREEN_IDS.LOGIN,
  menu: [], // Empty menu - auth screens should not appear in sidebar
};

// Don't register the screenset - we handle login outside the normal app flow
// screensetRegistry.register(authScreenset);

export default authScreenset;
