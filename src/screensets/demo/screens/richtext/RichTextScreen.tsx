/**
 * Rich Text Screen
 * Universal content block within the demo screenset
 * Orchestrates: ContentToolbar, ContentBlock (which delegates to MdRenderer, CodeRenderer, PlainTextRenderer)
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useScreenTranslations,
  I18nRegistry,
  Language,
  useAppSelector,
  useTranslation,
} from '@hai3/react';
import { TextLoader } from '@/app/components/TextLoader';
import { DEMO_SCREENSET_ID, RICHTEXT_SCREEN_ID } from '../../ids';
import { selectRichtextState } from '../../slices/richtextSlice';
import {
  loadRichtextContent,
  loadRichtextContentList,
  loadRichtextContentById,
  updateRichtextContent,
  saveRichtextContent,
} from '../../actions/richtextActions';
import { ContentBlock } from './components/ContentBlock';

/**
 * Screen-level translations (loaded lazily when screen mounts)
 */
const translations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Arabic]: () => import('./i18n/ar.json'),
  [Language.Bengali]: () => import('./i18n/bn.json'),
  [Language.Czech]: () => import('./i18n/cs.json'),
  [Language.Danish]: () => import('./i18n/da.json'),
  [Language.German]: () => import('./i18n/de.json'),
  [Language.Greek]: () => import('./i18n/el.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  [Language.Persian]: () => import('./i18n/fa.json'),
  [Language.Finnish]: () => import('./i18n/fi.json'),
  [Language.French]: () => import('./i18n/fr.json'),
  [Language.Hebrew]: () => import('./i18n/he.json'),
  [Language.Hindi]: () => import('./i18n/hi.json'),
  [Language.Hungarian]: () => import('./i18n/hu.json'),
  [Language.Indonesian]: () => import('./i18n/id.json'),
  [Language.Italian]: () => import('./i18n/it.json'),
  [Language.Japanese]: () => import('./i18n/ja.json'),
  [Language.Korean]: () => import('./i18n/ko.json'),
  [Language.Malay]: () => import('./i18n/ms.json'),
  [Language.Dutch]: () => import('./i18n/nl.json'),
  [Language.Norwegian]: () => import('./i18n/no.json'),
  [Language.Polish]: () => import('./i18n/pl.json'),
  [Language.Portuguese]: () => import('./i18n/pt.json'),
  [Language.Romanian]: () => import('./i18n/ro.json'),
  [Language.Russian]: () => import('./i18n/ru.json'),
  [Language.Swedish]: () => import('./i18n/sv.json'),
  [Language.Swahili]: () => import('./i18n/sw.json'),
  [Language.Tamil]: () => import('./i18n/ta.json'),
  [Language.Thai]: () => import('./i18n/th.json'),
  [Language.Tagalog]: () => import('./i18n/tl.json'),
  [Language.Turkish]: () => import('./i18n/tr.json'),
  [Language.Ukrainian]: () => import('./i18n/uk.json'),
  [Language.Urdu]: () => import('./i18n/ur.json'),
  [Language.Vietnamese]: () => import('./i18n/vi.json'),
  [Language.ChineseSimplified]: () => import('./i18n/zh.json'),
  [Language.ChineseTraditional]: () => import('./i18n/zh-TW.json'),
});

/**
 * Content type badge colours
 */
const CONTENT_TYPE_COLORS: Record<string, string> = {
  md: 'bg-blue-500/20 text-blue-400',
  ts: 'bg-sky-500/20 text-sky-400',
  py: 'bg-yellow-500/20 text-yellow-400',
  json: 'bg-green-500/20 text-green-400',
  plain: 'bg-zinc-500/20 text-zinc-400',
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
  md: 'Markdown',
  ts: 'TypeScript',
  py: 'Python',
  json: 'JSON',
  plain: 'Plain Text',
};

/**
 * Rich Text Screen Component
 * Content selector header + ContentBlock (each renderer owns its toolbar)
 */
export const RichTextScreen: React.FC = () => {
  useScreenTranslations(DEMO_SCREENSET_ID, RICHTEXT_SCREEN_ID, translations);

  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${RICHTEXT_SCREEN_ID}`;

  const richtextState = useAppSelector(selectRichtextState);
  const [isEditing, setIsEditing] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);

  useEffect(() => {
    loadRichtextContentList();
    loadRichtextContent();
  }, []);

  useEffect(() => {
    if (richtextState.contentType !== 'md') {
      setIsSourceMode(false);
    }
  }, [richtextState.contentType]);

  const handleToggleEdit = useCallback(() => {
    setIsEditing((v) => !v);
  }, []);

  const handleToggleSourceMode = useCallback(() => {
    setIsSourceMode((v) => !v);
  }, []);

  const handleSave = useCallback(() => {
    if (richtextState.item) {
      saveRichtextContent(richtextState.item.id, richtextState.content);
    }
  }, [richtextState.item, richtextState.content]);

  const handleSelectContent = useCallback((id: string) => {
    setIsEditing(false);
    setIsSourceMode(false);
    loadRichtextContentById(id);
  }, []);

  const handleContentChange = useCallback((content: string) => {
    updateRichtextContent(content);
  }, []);

  const handleCopyContent = useCallback(() => {
    void navigator.clipboard.writeText(richtextState.content);
  }, [richtextState.content]);

  const hasChanges = useMemo(() => {
    return richtextState.item !== null && richtextState.content !== richtextState.item.content;
  }, [richtextState.item, richtextState.content]);

  if (richtextState.loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        <TextLoader skeletonClassName="h-5 w-32">
          {t(`${ns}:loading`)}
        </TextLoader>
      </div>
    );
  }

  if (richtextState.error) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-destructive">
        <TextLoader skeletonClassName="h-5 w-48">
          {t(`${ns}:error`)}
        </TextLoader>
      </div>
    );
  }

  if (!richtextState.item) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        <TextLoader skeletonClassName="h-5 w-32">
          {t(`${ns}:loading`)}
        </TextLoader>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4">
      {/* Content selector header */}
      <div className="mb-2 flex items-center gap-3">
        <select
          value={richtextState.item.id}
          onChange={(e) => handleSelectContent(e.target.value)}
          className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground outline-none"
        >
          {richtextState.contentList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${CONTENT_TYPE_COLORS[richtextState.contentType] ?? ''}`}>
          {CONTENT_TYPE_LABELS[richtextState.contentType] ?? richtextState.contentType}
        </span>
      </div>

      {/* Content block with integrated toolbar per renderer */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <ContentBlock
          content={richtextState.content}
          initialContent={richtextState.item.content}
          contentType={richtextState.contentType}
          language={richtextState.item.language}
          isEditing={isEditing}
          isSourceMode={isSourceMode}
          hasChanges={hasChanges}
          saving={richtextState.saving}
          onChange={handleContentChange}
          onToggleEdit={handleToggleEdit}
          onToggleSourceMode={handleToggleSourceMode}
          onSave={handleSave}
          onCopyContent={handleCopyContent}
        />
      </div>
    </div>
  );
};

RichTextScreen.displayName = 'RichTextScreen';

export default RichTextScreen;
