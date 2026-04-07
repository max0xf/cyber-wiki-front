/**
 * PlainTextRenderer - Plain text viewing/editing with toolbar
 * Mirrors the /editor screen pattern: own toolbar with edit toggle, save,
 * and basic ⋯ actions menu.
 */

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from '@hai3/react';
import { TextLoader } from '@/app/components/TextLoader';
import {
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@hai3/uikit';
import {
  MoreHorizontalIcon,
  PenLineIcon,
  BookOpenIcon,
  SaveIcon,
  CopyIcon,
} from 'lucide-react';
import { DEMO_SCREENSET_ID, RICHTEXT_SCREEN_ID } from '../../../ids';

interface PlainTextRendererProps {
  content: string;
  isEditing: boolean;
  hasChanges: boolean;
  saving: boolean;
  onChange: (content: string) => void;
  onToggleEdit: () => void;
  onSave: () => void;
}

/* ------------------------------------------------------------------ */
/*  Plain text toolbar                                                 */
/* ------------------------------------------------------------------ */

const PlainToolbar: React.FC<{
  isEditing: boolean;
  hasChanges: boolean;
  saving: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  onCopy: () => void;
}> = ({ isEditing, hasChanges, saving, onToggleEdit, onSave, onCopy }) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${RICHTEXT_SCREEN_ID}`;

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <TextLoader skeletonClassName="h-3 w-16">
          <span className="font-medium text-foreground">{t(`${ns}:title`)}</span>
        </TextLoader>
        <span className="rounded bg-zinc-500/20 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
          plain
        </span>
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
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onToggleEdit}>
              {isEditing ? <BookOpenIcon className="h-4 w-4" /> : <PenLineIcon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isEditing ? t(`${ns}:mode_read`) : t(`${ns}:mode_edit`)}
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={onCopy}>
              <CopyIcon className="mr-2 h-4 w-4" />{t(`${ns}:copy_text`)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

PlainToolbar.displayName = 'PlainToolbar';

/* ------------------------------------------------------------------ */
/*  PlainTextRenderer – public component                               */
/* ------------------------------------------------------------------ */

export const PlainTextRenderer: React.FC<PlainTextRendererProps> = ({
  content,
  isEditing,
  hasChanges,
  saving,
  onChange,
  onToggleEdit,
  onSave,
}) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${RICHTEXT_SCREEN_ID}`;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(content);
  }, [content]);

  const stats = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return { words, chars: content.length, lines: content.split('\n').length };
  }, [content]);

  return (
    <div className="flex h-full flex-col">
      <PlainToolbar
        isEditing={isEditing}
        hasChanges={hasChanges}
        saving={saving}
        onToggleEdit={onToggleEdit}
        onSave={onSave}
        onCopy={handleCopy}
      />
      <div className="flex flex-1 flex-col overflow-auto">
        {isEditing ? (
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-8 py-6">
            <textarea
              value={content}
              onChange={handleChange}
              spellCheck={false}
              className="flex-1 w-full resize-none bg-background font-mono text-sm leading-relaxed text-foreground outline-none"
            />
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl px-8 py-6">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">{content}</pre>
          </div>
        )}
      </div>

      {/* Status bar */}
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
        <span className="text-[10px] uppercase tracking-wider opacity-50">Plain Text</span>
      </div>
    </div>
  );
};

PlainTextRenderer.displayName = 'PlainTextRenderer';
