import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation, useScreenTranslations, I18nRegistry, Language } from '@hai3/react';
import { TextLoader } from '@/app/components/TextLoader';
import { Tabs, TabsContent, TabsList, TabsTrigger, Alert, AlertDescription } from '@hai3/uikit';
import { AlertCircle, Loader2 } from 'lucide-react';
import { RepositorySearchBar } from './components/RepositorySearchBar';
import { RepositoryList } from './components/RepositoryList';
import { CYBERWIKI_SCREENSET_ID, REPOSITORY_SELECTION_SCREEN_ID } from '../../ids';
import { fetchRepositories } from '../../utils/api';
import { useDefaultProvider, useHasGitProviderCredentials } from '../../utils/serviceTokenHelper';
import { selectRepository } from '../../actions/repositorySettingsActions';
import type { Repository } from '../../../types';

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


export const RepositorySelectionScreen: React.FC = () => {
  useScreenTranslations(CYBERWIKI_SCREENSET_ID, REPOSITORY_SELECTION_SCREEN_ID, translations);
  const { t } = useTranslation();
  const ns = `screen.${CYBERWIKI_SCREENSET_ID}.${REPOSITORY_SELECTION_SCREEN_ID}`;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultProvider = useDefaultProvider();
  const hasCredentials = useHasGitProviderCredentials();

  // @cpt-cyberwiki-fr-browse-spaces
  // Fetch repositories on mount
  useEffect(() => {
    if (!hasCredentials || !defaultProvider) {
      setLoading(false);
      setError('No git provider credentials configured. Please configure your credentials in the Configuration screen.');
      return;
    }

    const loadRepositories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRepositories(defaultProvider.provider, defaultProvider.baseUrl);
        setRepositories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load repositories');
        console.error('Error loading repositories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRepositories();
  }, [hasCredentials, defaultProvider]);

  const filteredRepositories = useMemo(() => {
    let repos = repositories;

    // Filter by tab
    if (activeTab === 'favorite') {
      repos = repos.filter((r) => r.isFavorite);
    } else if (activeTab === 'recent') {
      repos = [...repos].sort(
        (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
    }

    // Filter by search query
    if (searchQuery) {
      repos = repos.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return repos;
  }, [searchQuery, activeTab]);

  const handleConfigure = (repository: Repository) => {
    if (!defaultProvider) return;
    // Select repository and load its settings
    selectRepository(repository.id, defaultProvider.provider, defaultProvider.baseUrl);
    // TODO: Navigate to configuration screen
    console.log('Configure repository:', repository);
  };

  const handleView = (repository: Repository) => {
    if (!defaultProvider) return;
    // Select repository and load its settings
    selectRepository(repository.id, defaultProvider.provider, defaultProvider.baseUrl);
    // TODO: Navigate to repository view screen
    console.log('View repository:', repository);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">{t(`${ns}:loading`)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
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

      <RepositorySearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={t(`${ns}:search_placeholder`)}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t(`${ns}:all`)}</TabsTrigger>
          <TabsTrigger value="favorite">{t(`${ns}:favorite`)}</TabsTrigger>
          <TabsTrigger value="recent">{t(`${ns}:recent`)}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <RepositoryList
            repositories={filteredRepositories}
            onConfigure={handleConfigure}
            onView={handleView}
            emptyMessage={t(`${ns}:no_repositories`)}
          />
        </TabsContent>

        <TabsContent value="favorite" className="mt-6">
          <RepositoryList
            repositories={filteredRepositories}
            onConfigure={handleConfigure}
            onView={handleView}
            emptyMessage={t(`${ns}:no_repositories`)}
          />
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <RepositoryList
            repositories={filteredRepositories}
            onConfigure={handleConfigure}
            onView={handleView}
            emptyMessage={t(`${ns}:no_repositories`)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

RepositorySelectionScreen.displayName = 'RepositorySelectionScreen';

export default RepositorySelectionScreen;
