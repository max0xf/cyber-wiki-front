/**
 * Repository domain types
 */

// @cpt-cyberwiki-fr-left-nav-dual-mode
export type ViewMode = 'document' | 'developer';

export interface Repository {
  id: string;
  name: string;
  description?: string;
  url: string;
  provider: 'github' | 'bitbucket';
  defaultBranch: string;
  lastUpdated: string;
  isFavorite?: boolean;
}

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: TreeNode[];
  title?: string; // Only in document mode
}

// @cpt-cyberwiki-fr-document-index
// @cpt-cyberwiki-fr-title-extraction
export interface DocumentIndexConfig {
  includedExtensions: string[];
  excludedPaths: string[];
  titleExtraction: 'first-heading' | 'frontmatter' | 'first-line' | 'filename';
  defaultViewMode: ViewMode;
  customMapping?: string; // Path to custom index file
}

export interface RepositoryConfig {
  repositoryId: string;
  documentIndex: DocumentIndexConfig;
}

export interface FileContent {
  path: string;
  content: string;
  contentType: string;
  branch: string;
}
