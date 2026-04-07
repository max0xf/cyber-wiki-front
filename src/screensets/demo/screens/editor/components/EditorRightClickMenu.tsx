/**
 * EditorRightClickMenu - Right-click context menu for WYSIWYG editor area
 * Screen-local component for editor screen
 *
 * Re-focuses the ProseMirror editor before executing any command so that
 * the selection/cursor is restored after the Radix menu steals focus.
 */

import React, { useCallback, useRef } from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@hai3/uikit';
import { useTranslation } from '@hai3/react';
import { DEMO_SCREENSET_ID, EDITOR_SCREEN_ID } from '../../../ids';
import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/kit/utils';
import { editorViewCtx, parserCtx, schemaCtx } from '@milkdown/kit/core';
import { DOMParser as PmDOMParser, DOMSerializer } from '@milkdown/kit/prose/model';
import {
  toggleStrongCommand,
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  wrapInHeadingCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  wrapInBlockquoteCommand,
  insertHrCommand,
} from '@milkdown/kit/preset/commonmark';
import { toggleStrikethroughCommand } from '@milkdown/kit/preset/gfm';
import type { EditorState } from '@milkdown/kit/prose/state';
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
} from 'lucide-react';

interface EditorRightClickMenuProps {
  children: React.ReactNode;
  onCopyMarkdown: () => void;
}

export const EditorRightClickMenu: React.FC<EditorRightClickMenuProps> = ({
  children,
  onCopyMarkdown,
}) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${EDITOR_SCREEN_ID}`;
  const [loading, getEditor] = useInstance();

  // Stash the ProseMirror selection when the context menu opens so we can
  // restore focus + selection before dispatching editor commands.
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
    } catch {
      // Editor context not ready yet
    }
  }, [loading, getEditor]);

  const exec = useCallback(
    (action: (ctx: import('@milkdown/kit/ctx').Ctx) => boolean) => {
      if (loading) return;
      focusEditor();
      // Use rAF to let focus settle before running the command
      requestAnimationFrame(() => {
        try {
          getEditor().action(action);
        } catch {
          // Editor context not ready yet
        }
      });
    },
    [loading, getEditor, focusEditor],
  );

  const getSelectedText = useCallback((): string | null => {
    if (loading) return null;
    try {
      let text: string | null = null;
      getEditor().action((ctx) => {
        const view = ctx.get(editorViewCtx);
        const { from, to } = view.state.selection;
        if (from !== to) {
          text = view.state.doc.textBetween(from, to, '\n');
        }
        return true;
      });
      return text;
    } catch {
      return null;
    }
  }, [loading, getEditor]);

  const deleteEditorSelection = useCallback(() => {
    try {
      const editor = getEditor();
      if (!editor) return;
      editor.action((ctx) => {
        const view = ctx.get(editorViewCtx);
        view.dispatch(view.state.tr.deleteSelection());
        return true;
      });
    } catch {
      // Editor context not ready
    }
  }, [getEditor]);

  const handleCut = useCallback(() => {
    focusEditor();
    requestAnimationFrame(() => {
      const text = getSelectedText();
      if (!text) return;
      navigator.clipboard.writeText(text)
        .then(deleteEditorSelection)
        .catch(() => { /* clipboard write failed */ });
    });
  }, [focusEditor, getSelectedText, deleteEditorSelection]);

  const handleCopy = useCallback(() => {
    focusEditor();
    requestAnimationFrame(() => {
      const text = getSelectedText();
      if (!text) return;
      navigator.clipboard.writeText(text).catch(() => {
        // Clipboard write failed
      });
    });
  }, [focusEditor, getSelectedText]);

  const pasteIntoEditor = useCallback((text: string) => {
    try {
      const editor = getEditor();
      if (!editor) return;
      editor.action((ctx) => {
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
    } catch {
      // Editor context not ready
    }
  }, [getEditor]);

  const handlePaste = useCallback(() => {
    if (loading) return;
    focusEditor();
    navigator.clipboard.readText().then((text) => {
      requestAnimationFrame(() => pasteIntoEditor(text));
    });
  }, [loading, focusEditor, pasteIntoEditor]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && !loading) {
        try {
          const editor = getEditor();
          editor.action((ctx) => {
            const view = ctx.get(editorViewCtx);
            savedSelectionRef.current = view.state;
            return true;
          });
        } catch {
          // Editor context not ready yet
        }
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
        {/* Format sub-menu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <TypeIcon className="mr-2 h-4 w-4" />
            {t(`${ns}:context.format`)}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onSelect={() => exec(callCommand(toggleStrongCommand.key))}>
              <BoldIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.bold`)}
              <span className="ml-auto text-xs text-muted-foreground">⌘B</span>
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(toggleEmphasisCommand.key))}>
              <ItalicIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.italic`)}
              <span className="ml-auto text-xs text-muted-foreground">⌘I</span>
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(toggleStrikethroughCommand.key))}>
              <StrikethroughIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.strike`)}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(toggleInlineCodeCommand.key))}>
              <Code2Icon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.code`)}
              <span className="ml-auto text-xs text-muted-foreground">⌘E</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Paragraph sub-menu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <PilcrowIcon className="mr-2 h-4 w-4" />
            {t(`${ns}:context.paragraph`)}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 1))}>
              <Heading1Icon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.h1`)}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 2))}>
              <Heading2Icon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.h2`)}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 3))}>
              <Heading3Icon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.h3`)}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInBulletListCommand.key))}>
              <ListIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.bullet_list`)}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInOrderedListCommand.key))}>
              <ListOrderedIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.ordered_list`)}
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => exec(callCommand(wrapInBlockquoteCommand.key))}>
              <QuoteIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.quote`)}
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Insert sub-menu */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <PlusIcon className="mr-2 h-4 w-4" />
            {t(`${ns}:context.insert`)}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onSelect={() => exec(callCommand(insertHrCommand.key))}>
              <MinusIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:context.horizontal_rule`)}
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        {/* Clipboard actions */}
        <ContextMenuItem onSelect={handleCut}>
          <ScissorsIcon className="mr-2 h-4 w-4" />
          {t(`${ns}:context.cut`)}
          <span className="ml-auto text-xs text-muted-foreground">⌘X</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleCopy}>
          <CopyIcon className="mr-2 h-4 w-4" />
          {t(`${ns}:context.copy`)}
          <span className="ml-auto text-xs text-muted-foreground">⌘C</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={handlePaste}>
          <ClipboardPasteIcon className="mr-2 h-4 w-4" />
          {t(`${ns}:context.paste`)}
          <span className="ml-auto text-xs text-muted-foreground">⌘V</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={onCopyMarkdown}>
          <CopyIcon className="mr-2 h-4 w-4" />
          {t(`${ns}:copy_md`)}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

EditorRightClickMenu.displayName = 'EditorRightClickMenu';
