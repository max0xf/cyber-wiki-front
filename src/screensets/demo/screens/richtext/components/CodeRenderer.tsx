/**
 * CodeRenderer - Code viewing/editing using Monaco editor
 * Mirrors the /editor screen pattern: own toolbar with edit toggle, save, and
 * code-specific ⋯ actions menu.
 */

import React, { useCallback, useMemo } from 'react';
import MonacoEditor, { type OnMount } from '@monaco-editor/react';
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
  DropdownMenuSeparator,
} from '@hai3/uikit';
import {
  MoreHorizontalIcon,
  PenLineIcon,
  BookOpenIcon,
  SaveIcon,
  CopyIcon,
  WrapTextIcon,
} from 'lucide-react';
import { DEMO_SCREENSET_ID, RICHTEXT_SCREEN_ID } from '../../../ids';

interface CodeRendererProps {
  content: string;
  language: string;
  isEditing: boolean;
  hasChanges: boolean;
  saving: boolean;
  onChange: (content: string) => void;
  onToggleEdit: () => void;
  onSave: () => void;
}

const LANGUAGE_MAP: Record<string, string> = {
  typescript: 'typescript',
  javascript: 'javascript',
  json: 'json',
  markdown: 'markdown',
  html: 'html',
  css: 'css',
  python: 'python',
  rust: 'rust',
  go: 'go',
  yaml: 'yaml',
};

/* ------------------------------------------------------------------ */
/*  Code toolbar                                                       */
/* ------------------------------------------------------------------ */

const CodeToolbar: React.FC<{
  language: string;
  isEditing: boolean;
  hasChanges: boolean;
  saving: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  onCopyCode: () => void;
}> = ({ language, isEditing, hasChanges, saving, onToggleEdit, onSave, onCopyCode }) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${RICHTEXT_SCREEN_ID}`;

  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <TextLoader skeletonClassName="h-3 w-16">
          <span className="font-medium text-foreground">{t(`${ns}:title`)}</span>
        </TextLoader>
        <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-medium text-sky-400">
          {language}
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

        {/* Code ⋯ menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={onCopyCode}>
              <CopyIcon className="mr-2 h-4 w-4" />{t(`${ns}:copy_code`)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <WrapTextIcon className="mr-2 h-4 w-4" />{t(`${ns}:word_wrap`)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

CodeToolbar.displayName = 'CodeToolbar';

/* ------------------------------------------------------------------ */
/*  CodeRenderer – public component                                    */
/* ------------------------------------------------------------------ */

export const CodeRenderer: React.FC<CodeRendererProps> = ({
  content,
  language,
  isEditing,
  hasChanges,
  saving,
  onChange,
  onToggleEdit,
  onSave,
}) => {
  const { t } = useTranslation();
  const ns = `screen.${DEMO_SCREENSET_ID}.${RICHTEXT_SCREEN_ID}`;
  const monacoLanguage = LANGUAGE_MAP[language] ?? 'plaintext';

  const stats = useMemo(() => {
    return { chars: content.length, lines: content.split('\n').length };
  }, [content]);

  const editorRef = React.useRef<Parameters<OnMount>[0] | null>(null);

  const isEditingRef = React.useRef(isEditing);
  isEditingRef.current = isEditing;

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.updateOptions({
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      folding: true,
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      tabSize: 2,
      readOnly: !isEditingRef.current,
      minimap: { enabled: isEditingRef.current },
      renderWhitespace: isEditingRef.current ? 'selection' : 'none',
    });
    if (isEditingRef.current) editor.focus();
  }, []);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        readOnly: !isEditing,
        minimap: { enabled: isEditing },
        renderWhitespace: isEditing ? 'selection' : 'none',
      });
      if (isEditing) editorRef.current.focus();
    }
  }, [isEditing]);

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      if (newValue !== undefined && isEditingRef.current) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const handleCopyCode = useCallback(() => {
    void navigator.clipboard.writeText(content);
  }, [content]);

  return (
    <div className="flex h-full flex-col">
      <CodeToolbar
        language={language}
        isEditing={isEditing}
        hasChanges={hasChanges}
        saving={saving}
        onToggleEdit={onToggleEdit}
        onSave={onSave}
        onCopyCode={handleCopyCode}
      />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto h-full max-w-3xl px-8 py-6">
          <MonacoEditor
            height="100%"
            language={monacoLanguage}
            value={content}
            onChange={handleChange}
            onMount={handleMount}
            theme="vs"
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-border px-4 py-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <TextLoader skeletonClassName="h-3 w-10">
            <span>{stats.chars} {t(`${ns}:stats.chars`)}</span>
          </TextLoader>
          <TextLoader skeletonClassName="h-3 w-10">
            <span>{stats.lines} {t(`${ns}:stats.lines`)}</span>
          </TextLoader>
        </div>
        <span className="text-[10px] uppercase tracking-wider opacity-50">{language}</span>
      </div>
    </div>
  );
};

CodeRenderer.displayName = 'CodeRenderer';
