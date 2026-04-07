/**
 * EditorToolbar - Minimal top bar with breadcrumb and ⋯ actions menu
 * Screen-local component for editor screen
 */

import React from 'react';
import { Button, Tooltip, TooltipTrigger, TooltipContent } from '@hai3/uikit';
import { useTranslation } from '@hai3/react';
import { TextLoader } from '@/app/components/TextLoader';
import { DEMO_SCREENSET_ID, EDITOR_SCREEN_ID } from '../../../ids';
import { BookOpenIcon, PenLineIcon } from 'lucide-react';
import { EditorActionsMenu } from './EditorContextMenu';

interface EditorToolbarProps {
  isSourceMode: boolean;
  onToggleSourceMode: () => void;
  onCopyMarkdown: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isSourceMode,
  onToggleSourceMode,
  onCopyMarkdown,
}) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${EDITOR_SCREEN_ID}`;

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <TextLoader skeletonClassName="h-3 w-16">
          <span className="font-medium text-foreground">{t(`${ns}:title`)}</span>
        </TextLoader>
      </div>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onToggleSourceMode}
            >
              {isSourceMode ? (
                <PenLineIcon className="h-4 w-4" />
              ) : (
                <BookOpenIcon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isSourceMode ? t(`${ns}:mode_reading`) : t(`${ns}:mode_source`)}
          </TooltipContent>
        </Tooltip>
        <EditorActionsMenu onCopyMarkdown={onCopyMarkdown} />
      </div>
    </div>
  );
};

EditorToolbar.displayName = 'EditorToolbar';
