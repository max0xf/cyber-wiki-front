/**
 * Richtext Actions
 * Emit events AND interact with APIs (Flux pattern)
 */

import { eventBus, apiRegistry } from '@hai3/react';
import { RichtextEvents } from '../events/richtextEvents';
import { RichtextApiService } from '../api/richtextApiService';

/**
 * Load the list of available content items
 */
export const loadRichtextContentList = (): void => {
  apiRegistry.getService(RichtextApiService).listContents().then((items) => {
    eventBus.emit(RichtextEvents.ContentListLoaded, { items });
  }).catch((err: unknown) => {
    console.warn('[richtext] loadRichtextContentList failed:', err);
  });
};

/**
 * Load the default richtext content
 */
export const loadRichtextContent = (): void => {
  apiRegistry.getService(RichtextApiService).getDefaultContent().then((content) => {
    eventBus.emit(RichtextEvents.ContentLoaded, { content });
  }).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[richtext] loadRichtextContent failed:', err);
    eventBus.emit(RichtextEvents.ContentLoadFailed, { error: message });
  });
};

/**
 * Load specific richtext content by ID
 */
export const loadRichtextContentById = (id: string): void => {
  apiRegistry.getService(RichtextApiService).getContent(id).then((content) => {
    eventBus.emit(RichtextEvents.ContentLoaded, { content });
  }).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[richtext] loadRichtextContentById failed:', err);
    eventBus.emit(RichtextEvents.ContentLoadFailed, { error: message });
  });
};

/**
 * Update richtext content locally (no API call)
 */
export const updateRichtextContent = (content: string): void => {
  eventBus.emit(RichtextEvents.ContentUpdated, { content });
};

/**
 * Save the current richtext content
 */
export const saveRichtextContent = (id: string, content: string): void => {
  apiRegistry.getService(RichtextApiService).saveContent(id, content).then((saved) => {
    eventBus.emit(RichtextEvents.ContentSaved, { content: saved });
  }).catch((err: unknown) => {
    console.warn('[richtext] saveRichtextContent failed:', err);
  });
};
