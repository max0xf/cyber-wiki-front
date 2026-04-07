/**
 * Richtext domain events
 */

import '@hai3/react';
import type { RichtextContent } from '../types/richtextTypes';

export type RichtextListItem = Pick<RichtextContent, 'id' | 'title' | 'contentType'>;

const DOMAIN_ID = 'richtext';
void DOMAIN_ID;

export enum RichtextEvents {
  ContentListLoaded = 'demo/richtext/contentListLoaded',
  ContentLoaded = 'demo/richtext/contentLoaded',
  ContentLoadFailed = 'demo/richtext/contentLoadFailed',
  ContentUpdated = 'demo/richtext/contentUpdated',
  ContentSaved = 'demo/richtext/contentSaved',
}

declare module '@hai3/react' {
  interface EventPayloadMap {
    [RichtextEvents.ContentListLoaded]: { items: RichtextListItem[] };
    [RichtextEvents.ContentLoaded]: { content: RichtextContent };
    [RichtextEvents.ContentLoadFailed]: { error: string };
    [RichtextEvents.ContentUpdated]: { content: string };
    [RichtextEvents.ContentSaved]: { content: RichtextContent };
  }
}
