/**
 * Rich Text Domain Types
 * Data structures for the universal content block
 */

export type RichtextContentType = 'md' | 'ts' | 'py' | 'json' | 'plain';

export type RichtextContent = {
  id: string;
  title: string;
  content: string;
  contentType: RichtextContentType;
  language: string;
  createdAt: string;
  updatedAt: string;
};
