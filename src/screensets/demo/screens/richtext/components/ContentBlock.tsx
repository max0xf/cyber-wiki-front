/**
 * ContentBlock - Universal content block that delegates to the appropriate renderer
 * Each renderer owns its own toolbar and context menus (like /editor screen pattern).
 * Detects content type → MdRenderer, CodeRenderer, or PlainTextRenderer
 */

import React from 'react';
import { MdRenderer } from './MdRenderer';
import { CodeRenderer } from './CodeRenderer';
import { PlainTextRenderer } from './PlainTextRenderer';
import type { RichtextContentType } from '../../../types/richtextTypes';

interface ContentBlockProps {
  content: string;
  initialContent: string;
  contentType: RichtextContentType;
  language: string;
  isEditing: boolean;
  isSourceMode: boolean;
  hasChanges: boolean;
  saving: boolean;
  onChange: (content: string) => void;
  onToggleEdit: () => void;
  onToggleSourceMode: () => void;
  onSave: () => void;
  onCopyContent: () => void;
}

const CODE_TYPES: ReadonlySet<RichtextContentType> = new Set(['ts', 'py', 'json']);

export const ContentBlock: React.FC<ContentBlockProps> = ({
  content,
  initialContent,
  contentType,
  language,
  isEditing,
  isSourceMode,
  hasChanges,
  saving,
  onChange,
  onToggleEdit,
  onToggleSourceMode,
  onSave,
  onCopyContent,
}) => {
  if (contentType === 'md') {
    return (
      <MdRenderer
        initialContent={initialContent}
        content={content}
        isSourceMode={isSourceMode}
        hasChanges={hasChanges}
        saving={saving}
        onChange={onChange}
        onToggleSourceMode={onToggleSourceMode}
        onSave={onSave}
        onCopyMarkdown={onCopyContent}
      />
    );
  }

  if (CODE_TYPES.has(contentType)) {
    return (
      <CodeRenderer
        content={content}
        language={language}
        isEditing={isEditing}
        hasChanges={hasChanges}
        saving={saving}
        onChange={onChange}
        onToggleEdit={onToggleEdit}
        onSave={onSave}
      />
    );
  }

  return (
    <PlainTextRenderer
      content={content}
      isEditing={isEditing}
      hasChanges={hasChanges}
      saving={saving}
      onChange={onChange}
      onToggleEdit={onToggleEdit}
      onSave={onSave}
    />
  );
};

ContentBlock.displayName = 'ContentBlock';
