import React, { useState, useEffect } from 'react';
import { useTranslation, useScreenTranslations, I18nRegistry, Language, useAppSelector } from '@hai3/react';
import { Alert, AlertDescription } from '@hai3/uikit';
import { AlertCircle, Loader2 } from 'lucide-react';
import { LeftNavigation } from './components/LeftNavigation';
import { DocumentViewer } from './components/DocumentViewer';
import { CYBERWIKI_SCREENSET_ID, REPOSITORY_VIEW_SCREEN_ID } from '../../ids';
import { fetchTree, fetchFileContent } from '../../utils/api';
import { selectCurrentRepository } from '../../slices/repositorySettingsSlice';
import { changeViewMode } from '../../actions/repositorySettingsActions';
import type { ViewMode, TreeNode, FileContent } from '../../../types';

const translations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Arabic]: () => import('./i18n/ar.json'),
  [Language.Bengali]: () => import('./i18n/bn.json'),
  [Language.Czech]: () => import('./i18n/cs.json'),
  [Language.Danish]: () => import('./i18n/da.json'),
  [Language.German]: () => import('./i18n/de.json'),
  [Language.Greek]: () => import('./i18n/el.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  [Language.Persian]: () => import('./i18n/fa.json'),
  [Language.Finnish]: () => import('./i18n/fi.json'),
  [Language.French]: () => import('./i18n/fr.json'),
  [Language.Hebrew]: () => import('./i18n/he.json'),
  [Language.Hindi]: () => import('./i18n/hi.json'),
  [Language.Hungarian]: () => import('./i18n/hu.json'),
  [Language.Indonesian]: () => import('./i18n/id.json'),
  [Language.Italian]: () => import('./i18n/it.json'),
  [Language.Japanese]: () => import('./i18n/ja.json'),
  [Language.Korean]: () => import('./i18n/ko.json'),
  [Language.Malay]: () => import('./i18n/ms.json'),
  [Language.Dutch]: () => import('./i18n/nl.json'),
  [Language.Norwegian]: () => import('./i18n/no.json'),
  [Language.Polish]: () => import('./i18n/pl.json'),
  [Language.Portuguese]: () => import('./i18n/pt.json'),
  [Language.Romanian]: () => import('./i18n/ro.json'),
  [Language.Russian]: () => import('./i18n/ru.json'),
  [Language.Swedish]: () => import('./i18n/sv.json'),
  [Language.Swahili]: () => import('./i18n/sw.json'),
  [Language.Tamil]: () => import('./i18n/ta.json'),
  [Language.Thai]: () => import('./i18n/th.json'),
  [Language.Tagalog]: () => import('./i18n/tl.json'),
  [Language.Turkish]: () => import('./i18n/tr.json'),
  [Language.Ukrainian]: () => import('./i18n/uk.json'),
  [Language.Urdu]: () => import('./i18n/ur.json'),
  [Language.Vietnamese]: () => import('./i18n/vi.json'),
  [Language.ChineseSimplified]: () => import('./i18n/zh.json'),
  [Language.ChineseTraditional]: () => import('./i18n/zh-TW.json'),
});


export const RepositoryViewScreen: React.FC = () => {
  useScreenTranslations(CYBERWIKI_SCREENSET_ID, REPOSITORY_VIEW_SCREEN_ID, translations);
  const { t } = useTranslation();
  const ns = `screen.${CYBERWIKI_SCREENSET_ID}.${REPOSITORY_VIEW_SCREEN_ID}`;

  const currentRepository = useAppSelector(selectCurrentRepository);

  const [selectedPath, setSelectedPath] = useState<string>();
  const [fileContent, setFileContent] = useState<FileContent>();
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingFile, setLoadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewMode = currentRepository?.viewMode || 'document';

  // @cpt-cyberwiki-fr-file-tree-navigation
  // Load tree on mount and when view mode or repository changes
  useEffect(() => {
    if (!currentRepository) {
      setLoadingTree(false);
      setError('No repository selected. Please select a repository from the Repository Selection screen.');
      return;
    }

    const loadTree = async () => {
      try {
        setLoadingTree(true);
        setError(null);
        const data = await fetchTree(
          currentRepository.repositoryId,
          currentRepository.provider,
          currentRepository.baseUrl,
          currentRepository.branch,
          '',
          true // recursive
        );
        setTree(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tree');
        console.error('Error loading tree:', err);
      } finally {
        setLoadingTree(false);
      }
    };

    loadTree();
  }, [currentRepository, viewMode]);

  // @cpt-cyberwiki-fr-left-nav-dual-mode
  const handleViewModeChange = (mode: ViewMode) => {
    if (!currentRepository) return;
    changeViewMode(currentRepository.repositoryId, mode);
  };

  // @cpt-cyberwiki-fr-file-content-display
  const handleSelectNode = async (node: TreeNode) => {
    if (!currentRepository || node.type !== 'file') return;

    setSelectedPath(node.path);
    setLoadingFile(true);
    try {
      const content = await fetchFileContent(
        currentRepository.repositoryId,
        node.path,
        currentRepository.provider,
        currentRepository.baseUrl,
        currentRepository.branch
      );
      setFileContent(content);
    } catch (err) {
      console.error('Error loading file:', err);
      setFileContent({
        path: node.path,
        content: `Error loading file: ${err instanceof Error ? err.message : 'Unknown error'}`,
        contentType: 'text/plain',
        branch: currentRepository.branch,
      });
    } finally {
      setLoadingFile(false);
    }
  };

  // Show loading state
  if (loadingTree) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">{t(`${ns}:loading_tree`)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 flex-shrink-0">
          <LeftNavigation
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            tree={tree}
            selectedPath={selectedPath}
            onSelectNode={handleSelectNode}
            labels={{
              documentMode: t(`${ns}:document_mode`),
              developerMode: t(`${ns}:developer_mode`),
            }}
          />
        </div>

        <div className="flex-1 relative">
          {loadingFile && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          <DocumentViewer
            content={fileContent?.content}
            contentType={fileContent?.contentType}
            path={fileContent?.path}
            noFileMessage={t(`${ns}:no_file_selected`)}
          />
        </div>
      </div>
    </div>
  );
};

RepositoryViewScreen.displayName = 'RepositoryViewScreen';

export default RepositoryViewScreen;
