/**
 * Richtext Slice
 * State for the universal content block
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@hai3/react';
import type { RichtextContent, RichtextContentType } from '../types/richtextTypes';

type RichtextListItem = Pick<RichtextContent, 'id' | 'title' | 'contentType'>;

const SLICE_KEY = 'demo/richtext' as const;

export interface RichtextState {
  contentList: RichtextListItem[];
  item: RichtextContent | null;
  content: string;
  contentType: RichtextContentType;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: RichtextState = {
  contentList: [],
  item: null,
  content: '',
  contentType: 'plain',
  loading: false,
  saving: false,
  error: null,
};

export const richtextSlice = createSlice({
  name: SLICE_KEY,
  initialState,
  reducers: {
    setRichtextContentList: (state, action: PayloadAction<RichtextListItem[]>) => {
      state.contentList = action.payload;
    },
    setRichtextItem: (state, action: PayloadAction<RichtextContent>) => {
      state.item = action.payload;
      state.content = action.payload.content;
      state.contentType = action.payload.contentType;
      state.loading = false;
      state.error = null;
    },
    setRichtextContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setRichtextLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setRichtextSaving: (state, action: PayloadAction<boolean>) => {
      state.saving = action.payload;
    },
    setRichtextError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setRichtextSaved: (state, action: PayloadAction<RichtextContent>) => {
      state.item = action.payload;
      state.saving = false;
    },
  },
});

export const {
  setRichtextContentList,
  setRichtextItem,
  setRichtextContent,
  setRichtextLoading,
  setRichtextSaving,
  setRichtextError,
  setRichtextSaved,
} = richtextSlice.actions;

export default richtextSlice;

declare module '@hai3/react' {
  interface RootState {
    [SLICE_KEY]: RichtextState;
  }
}

export const selectRichtextState = (state: RootState): RichtextState => {
  return state[SLICE_KEY] ?? initialState;
};
