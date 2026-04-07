/**
 * Editor Actions
 * Emit events AND interact with APIs (Flux pattern)
 */

import { eventBus, apiRegistry } from '@hai3/react';
import { EditorEvents } from '../events/editorEvents';
import { EditorApiService } from '../api/editorApiService';

/**
 * Load the default editor document
 */
export const loadEditorDocument = (): void => {
  apiRegistry.getService(EditorApiService).getDefaultDocument().then((document) => {
    eventBus.emit(EditorEvents.DocumentLoaded, { document });
  }).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[editor] loadEditorDocument failed:', err);
    eventBus.emit(EditorEvents.DocumentLoadFailed, { error: message });
  });
};

/**
 * Update editor content locally (no API call)
 */
export const updateEditorContent = (content: string): void => {
  eventBus.emit(EditorEvents.ContentUpdated, { content });
};

/**
 * Save the current editor document
 */
export const saveEditorDocument = (id: string, content: string): void => {
  apiRegistry.getService(EditorApiService).saveDocument(id, content).then((document) => {
    eventBus.emit(EditorEvents.DocumentSaved, { document });
  }).catch((err: unknown) => {
    console.warn('[editor] saveEditorDocument failed:', err);
  });
};
