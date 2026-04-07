/**
 * StatsPanel - Word/char/line counts and info display
 * Screen-local component for editor screen
 */

import React from 'react';
import { Card, CardHeader, CardContent, Separator } from '@hai3/uikit';
import { useTranslation } from '@hai3/react';
import { TextLoader } from '@/app/components/TextLoader';
import { DEMO_SCREENSET_ID, EDITOR_SCREEN_ID } from '../../../ids';

interface StatsPanelProps {
  words: number;
  chars: number;
  lines: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  words,
  chars,
  lines,
}) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${EDITOR_SCREEN_ID}`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <TextLoader skeletonClassName="h-5 w-32">
          <h3 className="text-base font-semibold">{t(`${ns}:stats_title`)}</h3>
        </TextLoader>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-md border border-border p-3">
            <TextLoader skeletonClassName="h-3 w-10">
              <div className="text-xs text-muted-foreground">{t(`${ns}:stats.words`)}</div>
            </TextLoader>
            <div className="mt-1 text-xl font-semibold">{words}</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <TextLoader skeletonClassName="h-3 w-10">
              <div className="text-xs text-muted-foreground">{t(`${ns}:stats.chars`)}</div>
            </TextLoader>
            <div className="mt-1 text-xl font-semibold">{chars}</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <TextLoader skeletonClassName="h-3 w-10">
              <div className="text-xs text-muted-foreground">{t(`${ns}:stats.lines`)}</div>
            </TextLoader>
            <div className="mt-1 text-xl font-semibold">{lines}</div>
          </div>
        </div>
        <Separator />
        <div className="space-y-2 text-muted-foreground">
          <TextLoader skeletonClassName="h-4 w-full">
            <p>{t(`${ns}:info.markdown_editable`)}</p>
          </TextLoader>
          <TextLoader skeletonClassName="h-4 w-full">
            <p>{t(`${ns}:info.rich_text_sync`)}</p>
          </TextLoader>
          <TextLoader skeletonClassName="h-4 w-full">
            <p>{t(`${ns}:info.use_case`)}</p>
          </TextLoader>
        </div>
      </CardContent>
    </Card>
  );
};

StatsPanel.displayName = 'StatsPanel';
