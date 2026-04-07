/**
 * Editor Effects
 * Listen to editor events and update editorSlice
 */

import { type AppDispatch, eventBus } from '@hai3/react';
import { EditorEvents } from '../events/editorEvents';
import type { EditorDocument } from '../types/editorTypes';
import {
  setDocument,
  setContent,
  setEditorError,
  setDocumentSaved,
} from '../slices/editorSlice';

export const initializeEditorEffects = (dispatch: AppDispatch): void => {
  eventBus.on(EditorEvents.DocumentLoaded, ({ document }: { document: EditorDocument }) => {
    dispatch(setDocument(document));
  });

  eventBus.on(EditorEvents.DocumentLoadFailed, ({ error }: { error: string }) => {
    dispatch(setEditorError(error));
  });

  eventBus.on(EditorEvents.ContentUpdated, ({ content }: { content: string }) => {
    dispatch(setContent(content));
  });

  eventBus.on(EditorEvents.DocumentSaved, ({ document }: { document: EditorDocument }) => {
    dispatch(setDocumentSaved(document));
  });
};
