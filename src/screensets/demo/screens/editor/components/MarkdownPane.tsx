/**
 * MarkdownPane - Raw markdown side panel (Obsidian-style)
 * Screen-local component for editor screen
 */

import React from 'react';
import { useTranslation } from '@hai3/react';
import { TextLoader } from '@/app/components/TextLoader';
import { DEMO_SCREENSET_ID, EDITOR_SCREEN_ID } from '../../../ids';

interface MarkdownPaneProps {
  markdown: string;
  onMarkdownChange: (value: string) => void;
}

export const MarkdownPane: React.FC<MarkdownPaneProps> = ({
  markdown,
  onMarkdownChange,
}) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${EDITOR_SCREEN_ID}`;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-2">
        <TextLoader skeletonClassName="h-4 w-16">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t(`${ns}:markdown_pane_title`)}
          </span>
        </TextLoader>
      </div>
      <textarea
        value={markdown}
        onChange={(e) => onMarkdownChange(e.target.value)}
        spellCheck={false}
        className="flex-1 w-full resize-none bg-background p-4 font-mono text-xs leading-relaxed outline-none"
      />
    </div>
  );
};

MarkdownPane.displayName = 'MarkdownPane';
