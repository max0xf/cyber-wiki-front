/**
 * EditorInner - Main editor layout with Milkdown integration (Obsidian-style)
 * Screen-local component for editor screen, must be inside MilkdownProvider
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation, useAppSelector } from '@hai3/react';
import { TextLoader } from '@/app/components/TextLoader';
import { Editor, defaultValueCtx, rootCtx, editorViewCtx, parserCtx } from '@milkdown/kit/core';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { gfm } from '@milkdown/kit/preset/gfm';
import { history } from '@milkdown/kit/plugin/history';
import { clipboard } from '@milkdown/kit/plugin/clipboard';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { trailing } from '@milkdown/kit/plugin/trailing';
import { indent } from '@milkdown/kit/plugin/indent';
import { useEditor, useInstance } from '@milkdown/react';
import { DEMO_SCREENSET_ID, EDITOR_SCREEN_ID } from '../../../ids';
import { EditorToolbar } from './EditorToolbar';
import { EditorArea } from './EditorArea';
import { EditorRightClickMenu } from './EditorRightClickMenu';
import { activeBlockPlugin } from '../plugins/activeBlockPlugin';
import { selectEditorState } from '../../../slices/editorSlice';
import { loadEditorDocument, updateEditorContent } from '../../../actions/editorActions';
import '../plugins/activeBlock.css';

/**
 * EditorLoaded - Milkdown editor that mounts only after document is available
 */
const EditorLoaded: React.FC<{
  initialContent: string;
  content: string;
  isSourceMode: boolean;
  onToggleSourceMode: () => void;
  onCopyMarkdown: () => Promise<void>;
}> = ({ initialContent, content, isSourceMode, onToggleSourceMode, onCopyMarkdown }) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${EDITOR_SCREEN_ID}`;

  const [, getInstance] = useInstance();
  const prevSourceModeRef = useRef(isSourceMode);
  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    const wasSource = prevSourceModeRef.current;
    prevSourceModeRef.current = isSourceMode;
    if (wasSource && !isSourceMode) {
      try {
        const editor = getInstance();
        if (editor) {
          editor.action((ctx) => {
            const view = ctx.get(editorViewCtx);
            const parser = ctx.get(parserCtx);
            const doc = parser(contentRef.current);
            if (doc && typeof doc !== 'string') {
              const tr = view.state.tr.replaceWith(0, view.state.doc.content.size, doc.content);
              view.dispatch(tr);
            }
            return true;
          });
        }
      } catch { /* editor not ready */ }
    }
  }, [isSourceMode, getInstance]);

  const editorInfo = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, initialContent);
        ctx.get(listenerCtx).markdownUpdated((_ctx, md) => {
          updateEditorContent(md);
        });
      })
      .use(commonmark)
      .use(gfm)
      .use(listener)
      .use(history)
      .use(clipboard)
      .use(trailing)
      .use(indent)
      .use(activeBlockPlugin);
  }, []);

  const stats = useMemo(() => {
    const words = content
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#>*_`\-[\]()]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    return {
      words,
      chars: content.length,
      lines: content.split('\n').length,
    };
  }, [content]);

  return (
    <>
      {editorInfo.loading && (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          <TextLoader skeletonClassName="h-5 w-32">
            {t(`${ns}:loading`)}
          </TextLoader>
        </div>
      )}

      {!editorInfo.loading && (
        <EditorToolbar
          isSourceMode={isSourceMode}
          onToggleSourceMode={onToggleSourceMode}
          onCopyMarkdown={onCopyMarkdown}
        />
      )}

      {/* EditorArea (Milkdown) is always mounted so the editor can initialise;
          hidden via CSS while loading or in source mode */}
      <div className={editorInfo.loading || isSourceMode ? 'hidden' : 'flex-1 overflow-auto'}>
        <EditorRightClickMenu onCopyMarkdown={onCopyMarkdown}>
          <EditorArea />
        </EditorRightClickMenu>
      </div>

      {!editorInfo.loading && isSourceMode && (
        <div className="flex flex-1 flex-col overflow-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-8 py-6">
            <textarea
              value={content}
              onChange={(e) => updateEditorContent(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full resize-none bg-background font-mono text-sm leading-relaxed outline-none"
            />
          </div>
        </div>
      )}

      {!editorInfo.loading && (
        <div className="flex items-center justify-between border-t border-border px-4 py-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <TextLoader skeletonClassName="h-3 w-10">
              <span>{stats.words} {t(`${ns}:stats.words`)}</span>
            </TextLoader>
            <TextLoader skeletonClassName="h-3 w-10">
              <span>{stats.chars} {t(`${ns}:stats.chars`)}</span>
            </TextLoader>
            <TextLoader skeletonClassName="h-3 w-10">
              <span>{stats.lines} {t(`${ns}:stats.lines`)}</span>
            </TextLoader>
          </div>
          <span className="text-[10px] uppercase tracking-wider opacity-50">Milkdown</span>
        </div>
      )}
    </>
  );
};

EditorLoaded.displayName = 'EditorLoaded';

export const EditorInner: React.FC = () => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${EDITOR_SCREEN_ID}`;

  const editorState = useAppSelector(selectEditorState);
  const [isSourceMode, setIsSourceMode] = useState(false);

  useEffect(() => {
    loadEditorDocument();
  }, []);

  const handleCopyMarkdown = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editorState.content);
    } catch {
      // noop
    }
  }, [editorState.content]);

  const handleToggleSourceMode = useCallback(() => {
    setIsSourceMode((v) => !v);
  }, []);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background">
      {editorState.document ? (
        <EditorLoaded
          initialContent={editorState.document.content}
          content={editorState.content}
          isSourceMode={isSourceMode}
          onToggleSourceMode={handleToggleSourceMode}
          onCopyMarkdown={handleCopyMarkdown}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          <TextLoader skeletonClassName="h-5 w-32">
            {t(`${ns}:loading`)}
          </TextLoader>
        </div>
      )}
    </div>
  );
};

EditorInner.displayName = 'EditorInner';
