import React, { useState, useEffect } from 'react';
import { useTranslation, useScreenTranslations, I18nRegistry, Language, useAppSelector } from '@hai3/react';
import { TextLoader } from '@/app/components/TextLoader';
import { Card, CardContent, CardHeader, CardTitle, Button, Alert, AlertDescription } from '@hai3/uikit';
import { Save, X, Loader2, AlertCircle } from 'lucide-react';
import { DocumentIndexConfigComponent } from './components/DocumentIndexConfig';
import { TitleExtractionConfig } from './components/TitleExtractionConfig';
import { ViewModeSelector } from './components/ViewModeSelector';
import { CYBERWIKI_SCREENSET_ID, REPOSITORY_CONFIGURATION_SCREEN_ID } from '../../ids';
import { selectCurrentRepository } from '../../slices/repositorySettingsSlice';
import { updateDocumentIndex } from '../../actions/repositorySettingsActions';
import type { DocumentIndexConfig } from '../../../types';

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

const defaultConfig: DocumentIndexConfig = {
  includedExtensions: ['.md', '.mdx'],
  excludedPaths: ['**/node_modules/**', '**/.github/**'],
  titleExtraction: 'first-heading',
  defaultViewMode: 'document',
};

export const RepositoryConfigurationScreen: React.FC = () => {
  useScreenTranslations(CYBERWIKI_SCREENSET_ID, REPOSITORY_CONFIGURATION_SCREEN_ID, translations);
  const { t } = useTranslation();
  const ns = `screen.${CYBERWIKI_SCREENSET_ID}.${REPOSITORY_CONFIGURATION_SCREEN_ID}`;

  const currentRepository = useAppSelector(selectCurrentRepository);

  const [config, setConfig] = useState<DocumentIndexConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // @cpt-cyberwiki-fr-document-index
  // Load configuration from current repository
  useEffect(() => {
    if (!currentRepository) {
      setLoading(false);
      setError('No repository selected. Please select a repository from the Repository Selection screen.');
      return;
    }

    setConfig(currentRepository.documentIndex);
    setLoading(false);
  }, [currentRepository]);

  const handleSave = async () => {
    if (!currentRepository) return;

    try {
      setIsSaving(true);
      setError(null);
      setSaveSuccess(false);
      updateDocumentIndex(currentRepository.repositoryId, config);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
      console.error('Error saving configuration:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // TODO: Navigate back
    console.log('Cancel configuration');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-4xl">
      <div className="flex flex-col gap-2">
        <TextLoader skeletonClassName="h-10 w-64">
          <h1 className="text-4xl font-bold">{t(`${ns}:title`)}</h1>
        </TextLoader>
        <TextLoader skeletonClassName="h-6 w-96">
          <p className="text-muted-foreground">{t(`${ns}:subtitle`)}</p>
        </TextLoader>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saveSuccess && (
        <Alert>
          <AlertDescription>{t(`${ns}:saved`)}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t(`${ns}:document_index`)}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <DocumentIndexConfigComponent
            config={config}
            onChange={setConfig}
            labels={{
              includedExtensions: t(`${ns}:included_extensions`),
              includedExtensionsHelp: t(`${ns}:included_extensions_help`),
              excludedPaths: t(`${ns}:excluded_paths`),
              excludedPathsHelp: t(`${ns}:excluded_paths_help`),
            }}
          />

          <TitleExtractionConfig
            config={config}
            onChange={setConfig}
            labels={{
              titleExtraction: t(`${ns}:title_extraction`),
              titleExtractionHelp: t(`${ns}:title_extraction_help`),
              firstHeading: t(`${ns}:first_heading`),
              frontmatter: t(`${ns}:frontmatter`),
              firstLine: t(`${ns}:first_line`),
              filename: t(`${ns}:filename`),
            }}
          />

          <ViewModeSelector
            value={config.defaultViewMode}
            onChange={(mode) => setConfig({ ...config, defaultViewMode: mode })}
            labels={{
              defaultViewMode: t(`${ns}:default_view_mode`),
              documentView: t(`${ns}:document_view`),
              developerView: t(`${ns}:developer_view`),
            }}
          />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? t(`${ns}:saving`) : t(`${ns}:save`)}
        </Button>
        <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
          <X className="h-4 w-4" />
          {t(`${ns}:cancel`)}
        </Button>
      </div>
    </div>
  );
};

RepositoryConfigurationScreen.displayName = 'RepositoryConfigurationScreen';

export default RepositoryConfigurationScreen;
