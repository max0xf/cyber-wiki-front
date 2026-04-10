/**
 * HAI3 Application Component
 *
 * Wraps the app with authentication check.
 * Shows login page if not authenticated, otherwise shows the main app.
 *
 * HAI3Provider (in main.tsx) handles:
 * - Redux Provider setup
 * - HAI3 context (app instance)
 *
 * AuthenticatedApp handles:
 * - Authentication check
 * - Login page vs main app routing
 *
 * Layout handles:
 * - Header, Menu, Footer, Sidebar rendering
 * - Theme-aware styling via hooks
 *
 * AppRouter handles:
 * - Screen lazy loading
 * - Navigation state
 *
 * StudioOverlay (dev mode only):
 * - Development tools for theme/screenset switching
 * - Language selection
 * - API mode toggle (services register their own mocks)
 */

import { AuthenticatedApp } from './AuthenticatedApp';

function App() {
  return <AuthenticatedApp />;
}

export default App;
