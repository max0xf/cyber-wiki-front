/**
 * Editor Slice
 * State for the markdown editor document
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@hai3/react';
import type { EditorDocument } from '../types/editorTypes';

const SLICE_KEY = 'demo/editor' as const;

export interface EditorState {
  document: EditorDocument | null;
  content: string;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: EditorState = {
  document: null,
  content: '',
  loading: false,
  saving: false,
  error: null,
};

export const editorSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    setDocument: (state, action: PayloadAction<EditorDocument>) => {
      state.document = action.payload;
      state.content = action.payload.content;
      state.loading = false;
      state.error = null;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setEditorLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEditorSaving: (state, action: PayloadAction<boolean>) => {
      state.saving = action.payload;
    },
    setEditorError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setDocumentSaved: (state, action: PayloadAction<EditorDocument>) => {
      state.document = action.payload;
      state.saving = false;
    },
  },
});

export const {
  setDocument,
  setContent,
  setEditorLoading,
  setEditorSaving,
  setEditorError,
  setDocumentSaved,
} = editorSlice.actions;

export default editorSlice;

declare module '@hai3/react' {
  interface RootState {
    [SLICE_KEY]: EditorState;
  }
}

export const selectEditorState = (state: RootState): EditorState => {
  return state[SLICE_KEY] ?? initialState;
};
