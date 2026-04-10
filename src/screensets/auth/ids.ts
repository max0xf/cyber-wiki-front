/**
 * Auth screenset and screen IDs
 */

export const SCREENSET_ID = 'auth' as const;

export const SCREEN_IDS = {
  LOGIN: 'login',
} as const;

export type ScreenId = (typeof SCREEN_IDS)[keyof typeof SCREEN_IDS];
