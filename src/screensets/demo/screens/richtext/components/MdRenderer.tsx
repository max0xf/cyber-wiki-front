/**
 * MdRenderer - Markdown WYSIWYG / source editor using Milkdown
 * Mirrors the /editor screen pattern:
 *   MilkdownProvider wraps everything → useEditor creates the instance →
 *   toolbar & right-click menu use useInstance() after loading gate.
 *
 * Exported sub-components:
 *  - MdLoaded   – the Milkdown-aware editor (must be inside MilkdownProvider)
 *  - MdRenderer – orchestrator that provides MilkdownProvider
 */

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '@hai3/react';
import { TextLoader } from '@/app/components/TextLoader';
import { Editor, defaultValueCtx, rootCtx, editorViewCtx, parserCtx, schemaCtx } from '@milkdown/kit/core';
import { commonmark,
  toggleStrongCommand,
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  wrapInHeadingCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  wrapInBlockquoteCommand,
  insertHrCommand,
} from '@milkdown/kit/preset/commonmark';
import { gfm, toggleStrikethroughCommand } from '@milkdown/kit/preset/gfm';
import { history } from '@milkdown/kit/plugin/history';
import { clipboard } from '@milkdown/kit/plugin/clipboard';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { trailing } from '@milkdown/kit/plugin/trailing';
import { indent } from '@milkdown/kit/plugin/indent';
import { useEditor, useInstance, MilkdownProvider, Milkdown } from '@milkdown/react';
import { callCommand } from '@milkdown/kit/utils';
import { DOMParser as PmDOMParser, DOMSerializer } from '@milkdown/kit/prose/model';
import type { EditorState } from '@milkdown/kit/prose/state';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@hai3/uikit';
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  Code2Icon,
  QuoteIcon,
  ListIcon,
  ListOrderedIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  TypeIcon,
  PilcrowIcon,
  PlusIcon,
  ScissorsIcon,
  CopyIcon,
  ClipboardPasteIcon,
  MinusIcon,
  MoreHorizontalIcon,
  BookOpenIcon,
  PenLineIcon,
  SaveIcon,
} from 'lucide-react';
import { DEMO_SCREENSET_ID, RICHTEXT_SCREEN_ID } from '../../../ids';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface MdRendererProps {
  initialContent: string;
  isSourceMode: boolean;
  content: string;
  hasChanges: boolean;
  saving: boolean;
  onChange: (content: string) => void;
  onToggleSourceMode: () => void;
  onSave: () => void;
  onCopyMarkdown: () => void;
}

/* ------------------------------------------------------------------ */
/*  MdActionsMenu – "⋯" dropdown (like EditorActionsMenu)             */
/* ------------------------------------------------------------------ */

const MdActionsMenu: React.FC<{ onCopyMarkdown: () => void }> = ({ onCopyMarkdown }) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${RICHTEXT_SCREEN_ID}`;
  const [loading, getEditor] = useInstance();
  const savedSelectionRef = useRef<EditorState | null>(null);

  const focusEditor = useCallback(() => {
    if (loading) return;
    try {
      const editor = getEditor();
      editor.action((ctx) => {
        const view = ctx.get(editorViewCtx);
        view.focus();
        if (savedSelectionRef.current) {
          const tr = view.state.tr.setSelection(savedSelectionRef.current.selection);
          view.dispatch(tr);
        }
        return true;
      });
    } catch { /* context not ready */ }
  }, [loading, getEditor]);

  const exec = useCallback(
    (action: (ctx: import('@milkdown/kit/ctx').Ctx) => boolean) => {
      if (loading) return;
      focusEditor();
      requestAnimationFrame(() => {
        try { getEditor().action(action); } catch { /* context not ready */ }
      });
    },
    [loading, getEditor, focusEditor],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && !loading) {
        try {
          getEditor().action((ctx) => {
            savedSelectionRef.current = ctx.get(editorViewCtx).state;
            return true;
          });
        } catch { /* context not ready */ }
      }
    },
    [loading, getEditor],
  );

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <TypeIcon className="mr-2 h-4 w-4" />
            {t(`${ns}:context.format`)}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => exec(callCommand(toggleStrongCommand.key))}>
              <BoldIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.bold`)}
              <span className="ml-auto text-xs text-muted-foreground">⌘B</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(toggleEmphasisCommand.key))}>
              <ItalicIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.italic`)}
              <span className="ml-auto text-xs text-muted-foreground">⌘I</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(toggleStrikethroughCommand.key))}>
              <StrikethroughIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.strike`)}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(toggleInlineCodeCommand.key))}>
              <Code2Icon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.code`)}
              <span className="ml-auto text-xs text-muted-foreground">⌘E</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Heading1Icon className="mr-2 h-4 w-4" />
            {t(`${ns}:toolbar.headings`)}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 1))}>
              <Heading1Icon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.h1`)}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 2))}>
              <Heading2Icon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.h2`)}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 3))}>
              <Heading3Icon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.h3`)}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ListIcon className="mr-2 h-4 w-4" />
            {t(`${ns}:toolbar.blocks`)}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => exec(callCommand(wrapInBulletListCommand.key))}>
              <ListIcon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.bullet_list`)}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(wrapInOrderedListCommand.key))}>
              <ListOrderedIcon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.ordered_list`)}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(wrapInBlockquoteCommand.key))}>
              <QuoteIcon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.quote`)}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onCopyMarkdown}>
          <CopyIcon className="mr-2 h-4 w-4" />{t(`${ns}:copy_md`)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

MdActionsMenu.displayName = 'MdActionsMenu';

/* ------------------------------------------------------------------ */
/*  MdRightClickMenu – right-click context menu (like EditorRCM)       */
/* ------------------------------------------------------------------ */

const MdRightClickMenu: React.FC<{
  children: React.ReactNode;
  onCopyMarkdown: () => void;
}> = ({ children, onCopyMarkdown }) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${RICHTEXT_SCREEN_ID}`;
  const [loading, getEditor] = useInstance();
  const savedSelectionRef = useRef<EditorState | null>(null);

  const focusEditor = useCallback(() => {
    if (loading) return;
    try {
      const editor = getEditor();
      editor.action((ctx) => {
        const view = ctx.get(editorViewCtx);
        view.focus();
        if (savedSelectionRef.current) {
          const tr = view.state.tr.setSelection(savedSelectionRef.current.selection);
          view.dispatch(tr);
        }
        return true;
      });
    } catch { /* context not ready */ }
  }, [loading, getEditor]);

  const exec = useCallback(
    (action: (ctx: import('@milkdown/kit/ctx').Ctx) => boolean) => {
      if (loading) return;
      focusEditor();
      requestAnimationFrame(() => {
        try { getEditor().action(action); } catch { /* context not ready */ }
      });
    },
    [loading, getEditor, focusEditor],
  );

  const handleCut = useCallback(() => {
    focusEditor();
    requestAnimationFrame(() => document.execCommand('cut'));
  }, [focusEditor]);

  const handleCopy = useCallback(() => {
    focusEditor();
    requestAnimationFrame(() => document.execCommand('copy'));
  }, [focusEditor]);

  const handlePaste = useCallback(() => {
    if (loading) return;
    focusEditor();
    void navigator.clipboard.readText().then((text) => {
      requestAnimationFrame(() => {
        try {
          getEditor().action((ctx) => {
            const view = ctx.get(editorViewCtx);
            const parser = ctx.get(parserCtx);
            const schema = ctx.get(schemaCtx);
            const doc = parser(text);
            if (!doc || typeof doc === 'string') return false;
            const domSerializer = DOMSerializer.fromSchema(schema);
            const fragment = domSerializer.serializeFragment(doc.content);
            const domParser = PmDOMParser.fromSchema(schema);
            const slice = domParser.parseSlice(fragment);
            view.dispatch(view.state.tr.replaceSelection(slice));
            return true;
          });
        } catch { /* context not ready */ }
      });
    });
  }, [loading, getEditor, focusEditor]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && !loading) {
        try {
          getEditor().action((ctx) => {
            savedSelectionRef.current = ctx.get(editorViewCtx).state;
            return true;
          });
        } catch { /* context not ready */ }
      }
    },
    [loading, getEditor],
  );

  return (
    <ContextMenu onOpenChange={handleOpenChange}>
      <ContextMenuTrigger className="block min-h-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        {/* Format */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <TypeIcon className="mr-2 h-4 w-4" />{t(`${ns}:context.format`)}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onSelect={() => exec(callCommand(toggleStrongCommand.key))}>
              <BoldIcon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.bold`)}
              <span className="ml-auto text-xs text-muted-foreground">⌘B</span>
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(toggleEmphasisCommand.key))}>
              <ItalicIcon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.italic`)}
              <span className="ml-auto text-xs text-muted-foreground">⌘I</span>
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(toggleStrikethroughCommand.key))}>
              <StrikethroughIcon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.strike`)}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(toggleInlineCodeCommand.key))}>
              <Code2Icon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.code`)}
              <span className="ml-auto text-xs text-muted-foreground">⌘E</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Paragraph */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <PilcrowIcon className="mr-2 h-4 w-4" />{t(`${ns}:context.paragraph`)}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 1))}>
              <Heading1Icon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.h1`)}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 2))}>
              <Heading2Icon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.h2`)}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 3))}>
              <Heading3Icon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.h3`)}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInBulletListCommand.key))}>
              <ListIcon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.bullet_list`)}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInOrderedListCommand.key))}>
              <ListOrderedIcon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.ordered_list`)}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInBlockquoteCommand.key))}>
              <QuoteIcon className="mr-2 h-4 w-4" />{t(`${ns}:toolbar.quote`)}
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Insert */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <PlusIcon className="mr-2 h-4 w-4" />{t(`${ns}:context.insert`)}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onSelect={() => exec(callCommand(insertHrCommand.key))}>
              <MinusIcon className="mr-2 h-4 w-4" />{t(`${ns}:context.horizontal_rule`)}
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        {/* Clipboard */}
        <ContextMenuItem onSelect={handleCut}>
          <ScissorsIcon className="mr-2 h-4 w-4" />{t(`${ns}:context.cut`)}
          <span className="ml-auto text-xs text-muted-foreground">⌘X</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleCopy}>
          <CopyIcon className="mr-2 h-4 w-4" />{t(`${ns}:context.copy`)}
          <span className="ml-auto text-xs text-muted-foreground">⌘C</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={handlePaste}>
          <ClipboardPasteIcon className="mr-2 h-4 w-4" />{t(`${ns}:context.paste`)}
          <span className="ml-auto text-xs text-muted-foreground">⌘V</span>
        </ContextMenuItem>

        <ContextMenuSeparator />
        <ContextMenuItem onSelect={onCopyMarkdown}>
          <CopyIcon className="mr-2 h-4 w-4" />{t(`${ns}:copy_md`)}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

MdRightClickMenu.displayName = 'MdRightClickMenu';

/* ------------------------------------------------------------------ */
/*  MdToolbar – top bar (breadcrumb + source toggle + save + ⋯ menu)   */
/* ------------------------------------------------------------------ */

const MdToolbar: React.FC<{
  isSourceMode: boolean;
  hasChanges: boolean;
  saving: boolean;
  onToggleSourceMode: () => void;
  onSave: () => void;
  onCopyMarkdown: () => void;
}> = ({ isSourceMode, hasChanges, saving, onToggleSourceMode, onSave, onCopyMarkdown }) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${RICHTEXT_SCREEN_ID}`;

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <TextLoader skeletonClassName="h-3 w-16">
          <span className="font-medium text-foreground">{t(`${ns}:title`)}</span>
        </TextLoader>
        {hasChanges && (
          <span className="ml-2 text-yellow-500">
            <TextLoader skeletonClassName="h-3 w-16">
              {t(`${ns}:unsaved`)}
            </TextLoader>
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {hasChanges && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onSave} disabled={saving}>
                <SaveIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {saving ? t(`${ns}:saving`) : t(`${ns}:save`)}
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleSourceMode}>
              {isSourceMode ? <PenLineIcon className="h-4 w-4" /> : <BookOpenIcon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isSourceMode ? t(`${ns}:mode_read`) : t(`${ns}:mode_source`)}
          </TooltipContent>
        </Tooltip>
        <MdActionsMenu onCopyMarkdown={onCopyMarkdown} />
      </div>
    </div>
  );
};

MdToolbar.displayName = 'MdToolbar';

/* ------------------------------------------------------------------ */
/*  MdLoaded – the Milkdown editor instance + toolbar + right-click    */
/*  Must be inside MilkdownProvider. Only renders after editor ready.  */
/* ------------------------------------------------------------------ */

const MdLoaded: React.FC<{
  initialContent: string;
  content: string;
  isSourceMode: boolean;
  hasChanges: boolean;
  saving: boolean;
  onChange: (content: string) => void;
  onToggleSourceMode: () => void;
  onSave: () => void;
  onCopyMarkdown: () => void;
}> = ({ initialContent, content, isSourceMode, hasChanges, saving, onChange, onToggleSourceMode, onSave, onCopyMarkdown }) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${RICHTEXT_SCREEN_ID}`;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [, getInstance] = useInstance();
  const prevSourceModeRef = useRef(isSourceMode);

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
            const doc = parser(content);
            if (doc && typeof doc !== 'string') {
              const tr = view.state.tr.replaceWith(0, view.state.doc.content.size, doc.content);
              view.dispatch(tr);
            }
            return true;
          });
        }
      } catch { /* editor not ready */ }
    }
  }, [isSourceMode, content, getInstance]);

  const editorInfo = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, initialContent);
        ctx.get(listenerCtx).markdownUpdated((_ctx, md) => {
          onChangeRef.current(md);
        });
      })
      .use(commonmark)
      .use(gfm)
      .use(listener)
      .use(history)
      .use(clipboard)
      .use(trailing)
      .use(indent);
  }, []);

  const stats = useMemo(() => {
    const words = content
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#>*_`\-[\]()]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return { words, chars: content.length, lines: content.split('\n').length };
  }, [content]);

  return (
    <>
      {editorInfo.loading && (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          <TextLoader skeletonClassName="h-5 w-32">{t(`${ns}:loading`)}</TextLoader>
        </div>
      )}

      {!editorInfo.loading && (
        <MdToolbar
          isSourceMode={isSourceMode}
          hasChanges={hasChanges}
          saving={saving}
          onToggleSourceMode={onToggleSourceMode}
          onSave={onSave}
          onCopyMarkdown={onCopyMarkdown}
        />
      )}

      {/* Milkdown is always mounted so the editor can initialise;
          hidden via CSS while loading or in source mode */}
      <div className={editorInfo.loading || isSourceMode ? 'hidden' : 'flex-1 overflow-auto'}>
        <MdRightClickMenu onCopyMarkdown={onCopyMarkdown}>
          <div className="mx-auto max-w-3xl px-8 py-6 prose prose-zinc dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed min-h-[500px] focus-within:outline-none">
            <Milkdown />
          </div>
        </MdRightClickMenu>
      </div>

      {!editorInfo.loading && isSourceMode && (
        <div className="flex flex-1 flex-col overflow-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-8 py-6">
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
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

MdLoaded.displayName = 'MdLoaded';

/* ------------------------------------------------------------------ */
/*  MdRenderer – public component wrapping everything in Provider      */
/* ------------------------------------------------------------------ */

export const MdRenderer: React.FC<MdRendererProps> = (props) => {
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <MilkdownProvider>
        <MdLoaded {...props} />
      </MilkdownProvider>
    </div>
  );
};

MdRenderer.displayName = 'MdRenderer';
