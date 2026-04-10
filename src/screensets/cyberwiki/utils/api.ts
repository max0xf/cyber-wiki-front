/**
 * Repositories API Utilities
 * Direct backend API calls using existing git-provider and wiki endpoints
 *
 * Backend APIs:
 * - /api/git-provider/repositories/ - List repositories from Git providers
 * - /api/git-provider/repositories/{id}/tree - Get directory tree
 * - /api/git-provider/repositories/{id}/files/{path} - Get file content
 * - /api/wiki/spaces/ - Manage spaces (repository configurations)
 * - /api/wiki/documents/tree - Get document tree with mode support
 */

import type {
  Repository,
  TreeNode,
  DocumentIndexConfig,
  RepositoryConfig,
  FileContent,
  ViewMode,
} from '../types';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get CSRF token from cookies
 */
function getCsrfToken(): string {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return '';
}

// @cpt-cyberwiki-fr-vcs-backend
// Repository management using git-provider API
export async function fetchRepositories(provider: string, baseUrl: string): Promise<Repository[]> {
  const params = new URLSearchParams({ provider, base_url: baseUrl });
  return apiFetch<Repository[]>(`/api/git-provider/v1/repositories/repositories?${params.toString()}`);
}

export async function fetchRepository(id: string, provider: string, baseUrl: string): Promise<Repository> {
  const params = new URLSearchParams({ provider, base_url: baseUrl });
  return apiFetch<Repository>(`/api/git-provider/v1/repositories/${id}?${params.toString()}`);
}

// Tree navigation using git-provider API
export async function fetchTree(
  repositoryId: string,
  provider: string,
  baseUrl: string,
  branch: string = 'main',
  path: string = '',
  recursive: boolean = false
): Promise<TreeNode[]> {
  const params = new URLSearchParams({
    provider,
    base_url: baseUrl,
    branch,
    recursive: String(recursive),
    ...(path && { path }),
  });
  return apiFetch<TreeNode[]>(`/api/git-provider/v1/repositories/${repositoryId}/tree?${params.toString()}`);
}

// File content using git-provider API
export async function fetchFileContent(
  repositoryId: string,
  path: string,
  provider: string,
  baseUrl: string,
  branch: string = 'main'
): Promise<FileContent> {
  const params = new URLSearchParams({ provider, base_url: baseUrl, branch });
  return apiFetch<FileContent>(`/api/git-provider/v1/repositories/${repositoryId}/files/${encodeURIComponent(path)}?${params.toString()}`);
}

// Space/Repository configuration using wiki API
export async function fetchSpaces(): Promise<any[]> {
  return apiFetch<any[]>('/api/wiki/v1/spaces/');
}

export async function fetchSpace(slug: string): Promise<any> {
  return apiFetch<any>(`/api/wiki/v1/spaces/${slug}/`);
}

export async function createSpace(data: any): Promise<any> {
  const csrfToken = getCsrfToken();
  return apiFetch<any>('/api/wiki/v1/spaces/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(data),
  });
}

export async function updateSpace(slug: string, data: any): Promise<any> {
  const csrfToken = getCsrfToken();
  return apiFetch<any>(`/api/wiki/spaces/${slug}/`, {
    method: 'PUT',
    headers: {
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(data),
  });
}

// Document tree with mode support using wiki API
export async function fetchDocumentTree(
  spaceSlug: string,
  mode: ViewMode = 'document'
): Promise<TreeNode[]> {
  const params = new URLSearchParams({ space: spaceSlug, mode });
  return apiFetch<TreeNode[]>(`/api/wiki/documents/tree?${params.toString()}`);
}

// Repository settings using generic user settings endpoint
export async function fetchRepositoryConfig(repositoryId: string): Promise<RepositoryConfig> {
  try {
    const response = await apiFetch<any>(`/api/users/repository-settings/${encodeURIComponent(repositoryId)}`);

    return {
      repositoryId: response.repository_id || repositoryId,
      documentIndex: response.settings?.documentIndex || {
        includedExtensions: ['.md', '.mdx'],
        excludedPaths: ['**/node_modules/**', '**/.github/**'],
        titleExtraction: 'first-heading',
        defaultViewMode: 'document',
      },
    };
  } catch (err) {
    console.warn('Failed to fetch repository config, using defaults:', err);
    return {
      repositoryId,
      documentIndex: {
        includedExtensions: ['.md', '.mdx'],
        excludedPaths: ['**/node_modules/**', '**/.github/**'],
        titleExtraction: 'first-heading',
        defaultViewMode: 'document',
      },
    };
  }
}

export async function saveRepositoryConfig(
  repositoryId: string,
  config: DocumentIndexConfig
): Promise<RepositoryConfig> {
  const csrfToken = getCsrfToken();

  const response = await apiFetch<any>(`/api/users/repository-settings/${encodeURIComponent(repositoryId)}`, {
    method: 'PUT',
    headers: {
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({
      repository_id: repositoryId,
      settings: {
        documentIndex: config,
      },
    }),
  });

  return {
    repositoryId: response.repository_id || repositoryId,
    documentIndex: response.settings?.documentIndex || config,
  };
}

export async function fetchViewMode(repositoryId: string): Promise<ViewMode> {
  try {
    const response = await apiFetch<any>(`/api/users/repository-settings/${encodeURIComponent(repositoryId)}`);
    return response.settings?.viewMode || 'document';
  } catch (err) {
    return 'document';
  }
}

export async function saveViewMode(repositoryId: string, mode: ViewMode): Promise<void> {
  const csrfToken = getCsrfToken();

  // Get current settings first
  const current = await fetchRepositoryConfig(repositoryId);

  await apiFetch<void>(`/api/users/repository-settings/${encodeURIComponent(repositoryId)}`, {
    method: 'PUT',
    headers: {
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({
      repository_id: repositoryId,
      settings: {
        ...current.documentIndex,
        viewMode: mode,
      },
    }),
  });
}
