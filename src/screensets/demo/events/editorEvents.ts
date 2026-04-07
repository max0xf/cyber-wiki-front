/**
 * Editor domain events
 */

import '@hai3/react';
import type { EditorDocument } from '../types/editorTypes';

const DOMAIN_ID = 'editor';
void DOMAIN_ID;

export enum EditorEvents {
  DocumentLoaded = 'demo/editor/documentLoaded',
  DocumentLoadFailed = 'demo/editor/documentLoadFailed',
  ContentUpdated = 'demo/editor/contentUpdated',
  DocumentSaved = 'demo/editor/documentSaved',
}

declare module '@hai3/react' {
  interface EventPayloadMap {
    [EditorEvents.DocumentLoaded]: { document: EditorDocument };
    [EditorEvents.DocumentLoadFailed]: { error: string };
    [EditorEvents.ContentUpdated]: { content: string };
    [EditorEvents.DocumentSaved]: { document: EditorDocument };
  }
}
