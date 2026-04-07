/**
 * Richtext Effects
 * Listen to richtext events and update richtextSlice
 */

import { type AppDispatch, eventBus } from '@hai3/react';
import { RichtextEvents, type RichtextListItem } from '../events/richtextEvents';
import type { RichtextContent } from '../types/richtextTypes';
import {
  setRichtextContentList,
  setRichtextItem,
  setRichtextContent,
  setRichtextError,
  setRichtextSaved,
} from '../slices/richtextSlice';

export const initializeRichtextEffects = (dispatch: AppDispatch): void => {
  eventBus.on(RichtextEvents.ContentListLoaded, ({ items }: { items: RichtextListItem[] }) => {
    dispatch(setRichtextContentList(items));
  });

  eventBus.on(RichtextEvents.ContentLoaded, ({ content }: { content: RichtextContent }) => {
    dispatch(setRichtextItem(content));
  });

  eventBus.on(RichtextEvents.ContentLoadFailed, ({ error }: { error: string }) => {
    dispatch(setRichtextError(error));
  });

  eventBus.on(RichtextEvents.ContentUpdated, ({ content }: { content: string }) => {
    dispatch(setRichtextContent(content));
  });

  eventBus.on(RichtextEvents.ContentSaved, ({ content }: { content: RichtextContent }) => {
    dispatch(setRichtextSaved(content));
  });
};
