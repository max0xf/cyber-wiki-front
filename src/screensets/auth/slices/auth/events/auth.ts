/**
 * Auth domain events
 */

import type { LoginCredentials, LoginResponse } from '../../../types/auth';
import { SCREENSET_ID } from '../../../ids';

const DOMAIN_ID = 'auth';

export const authEvents = {
  loginRequested: `${SCREENSET_ID}/${DOMAIN_ID}/loginRequested` as const,
  loginSucceeded: `${SCREENSET_ID}/${DOMAIN_ID}/loginSucceeded` as const,
  loginFailed: `${SCREENSET_ID}/${DOMAIN_ID}/loginFailed` as const,
  logoutRequested: `${SCREENSET_ID}/${DOMAIN_ID}/logoutRequested` as const,
  logoutSucceeded: `${SCREENSET_ID}/${DOMAIN_ID}/logoutSucceeded` as const,
};

declare module '@hai3/framework' {
  interface EventPayloadMap {
    [authEvents.loginRequested]: LoginCredentials;
    [authEvents.loginSucceeded]: LoginResponse;
    [authEvents.loginFailed]: { error: string };
    [authEvents.logoutRequested]: void;
    [authEvents.logoutSucceeded]: void;
  }
}
