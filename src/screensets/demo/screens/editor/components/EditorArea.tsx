/**
 * EditorArea - Milkdown WYSIWYG editor wrapper (Obsidian-style)
 * Screen-local component for editor screen
 */

import React from 'react';
import { Milkdown } from '@milkdown/react';

export const EditorArea: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl px-8 py-6 prose prose-zinc dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed min-h-[500px] focus-within:outline-none">
      <Milkdown />
    </div>
  );
};

EditorArea.displayName = 'EditorArea';
