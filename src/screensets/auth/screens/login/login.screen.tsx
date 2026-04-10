/**
 * Login Screen
 */

import { useEffect } from 'react';
import { useAppSelector, useScreenTranslations, useTranslation, type RootState } from '@hai3/react';
import { Card } from '@hai3/uikit';
import { Logo } from '../../components/Logo';
import { LoginForm } from './components/LoginForm';
import { loginTranslations } from './i18n';
import { SCREENSET_ID, SCREEN_IDS } from '../../ids';

export function LoginScreen() {
  // Register screen translations
  useScreenTranslations(SCREENSET_ID, SCREEN_IDS.LOGIN, loginTranslations);

  // Get translation function
  const { t } = useTranslation();

  const authState = useAppSelector((state: RootState) => state['auth/auth']);

  // Debug: Log auth state
  useEffect(() => {
    console.log('[LoginScreen] Auth state:', authState);
  }, [authState]);

  // Safely access auth state with fallback
  const user = authState?.user ?? null;
  const isLoading = authState?.isLoading ?? false;
  const error = authState?.error ?? null;

  // Redirect to dashboard on successful login (only if user and token exist)
  useEffect(() => {
    console.log('[LoginScreen] Checking redirect:', { user, token: authState?.token });
    if (user && authState?.token) {
      console.log('[LoginScreen] Redirecting to home...');
      // Navigate to home/dashboard
      window.location.href = '/';
    }
  }, [user, authState?.token]);

  // Helper to get screen-specific translation
  const ts = (key: string) => t(`screen.${SCREENSET_ID}.${SCREEN_IDS.LOGIN}:${key}`);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <Logo />
        <h1 className="text-2xl font-bold text-center mb-6">{ts('title')}</h1>
        <LoginForm error={error} isLoading={isLoading} t={ts} />
      </Card>
    </div>
  );
}
