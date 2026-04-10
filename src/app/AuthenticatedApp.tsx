/**
 * Authenticated App Wrapper
 * Shows login page if not authenticated, otherwise shows the main app
 */

import { useEffect } from 'react';
import { useAppSelector, type RootState } from '@hai3/react';
import { LoginPage } from '../pages/Login';
import { AppRouter } from '@hai3/react';
import { Layout } from '@/app/layout';
import { StudioOverlay } from '@hai3/studio';

export function AuthenticatedApp() {
  const authState = useAppSelector((state: RootState) => state['auth/auth']);

  const user = authState?.user ?? null;

  // For UI, we only check if user exists (session-based auth via cookies)
  // Token is only for API clients (curl, Postman, etc.)
  const isAuthenticated = !!user;

  // Debug log
  useEffect(() => {
    console.log('[AuthenticatedApp] Auth state:', { user, isAuthenticated });
  }, [user, isAuthenticated]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show main app if authenticated
  return (
    <>
      <Layout>
        <AppRouter />
      </Layout>
      <StudioOverlay />
    </>
  );
}
