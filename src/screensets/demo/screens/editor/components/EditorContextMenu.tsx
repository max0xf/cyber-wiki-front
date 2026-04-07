/**
 * EditorActionsMenu - Obsidian-style ⋯ dropdown menu with editor actions
 * Screen-local component for editor screen
 */

import React, { useCallback, useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  Button,
} from '@hai3/uikit';
import { useTranslation } from '@hai3/react';
import { DEMO_SCREENSET_ID, EDITOR_SCREEN_ID } from '../../../ids';
import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/kit/utils';
import { editorViewCtx } from '@milkdown/kit/core';
import {
  toggleStrongCommand,
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  wrapInHeadingCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  wrapInBlockquoteCommand,
} from '@milkdown/kit/preset/commonmark';
import { toggleStrikethroughCommand } from '@milkdown/kit/preset/gfm';
import type { EditorState } from '@milkdown/kit/prose/state';
import {
  MoreHorizontalIcon,
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
  CopyIcon,
  TypeIcon,
} from 'lucide-react';

interface EditorActionsMenuProps {
  onCopyMarkdown: () => void;
}

export const EditorActionsMenu: React.FC<EditorActionsMenuProps> = ({
  onCopyMarkdown,
}) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${EDITOR_SCREEN_ID}`;
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
    } catch {
      // Editor context not ready yet
    }
  }, [loading, getEditor]);

  const exec = useCallback(
    (action: (ctx: import('@milkdown/kit/ctx').Ctx) => boolean) => {
      if (loading) return;
      focusEditor();
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
            {t(`${ns}:toolbar.formatting`)}
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
              <Heading1Icon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.h1`)}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 2))}>
              <Heading2Icon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.h2`)}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(wrapInHeadingCommand.key, 3))}>
              <Heading3Icon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.h3`)}
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
              <ListIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.bullet_list`)}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(wrapInOrderedListCommand.key))}>
              <ListOrderedIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.ordered_list`)}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => exec(callCommand(wrapInBlockquoteCommand.key))}>
              <QuoteIcon className="mr-2 h-4 w-4" />
              {t(`${ns}:toolbar.quote`)}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={onCopyMarkdown}>
          <CopyIcon className="mr-2 h-4 w-4" />
          {t(`${ns}:copy_md`)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

EditorActionsMenu.displayName = 'EditorActionsMenu';
