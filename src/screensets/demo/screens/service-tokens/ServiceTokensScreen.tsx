/**
 * Service Tokens Screen
 * Configuration screen for service tokens (Git providers, Atlassian services, etc.)
 */

import React, { useEffect, useState } from 'react';
import {
  useScreenTranslations,
  I18nRegistry,
  Language,
  useAppSelector,
  useTranslation,
} from '@hai3/react';
import { DEMO_SCREENSET_ID, CONFIGURATION_SCREEN_ID } from '../../ids';
import { selectServiceTokenState } from '../../slices/serviceTokenSlice';
import {
  loadServiceTokens,
  saveServiceToken,
  deleteServiceToken,
} from '../../actions/serviceTokenActions';
import { ServiceTokenForm } from './components/ServiceTokenForm';
import { ServiceTokenList } from './components/ServiceTokenList';
import { Alert } from '@hai3/uikit';
import type { ServiceToken, ServiceTokenFormData } from '../../types/serviceTokenTypes';

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

export const ServiceTokensScreen: React.FC = () => {
  useScreenTranslations(DEMO_SCREENSET_ID, CONFIGURATION_SCREEN_ID, translations);
  const { t } = useTranslation();
  const tk = (key: string) => t(`screen.${DEMO_SCREENSET_ID}.${CONFIGURATION_SCREEN_ID}:${key}`);

  const state = useAppSelector(selectServiceTokenState);
  const [editingToken, setEditingToken] = useState<ServiceToken | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadServiceTokens();
  }, []);

  const handleSubmit = (values: ServiceTokenFormData) => {
    saveServiceToken({
      service_type: values.provider as any,
      base_url: values.base_url,
      token: values.token,
      username: values.username,
    });
    setShowForm(false);
    setEditingToken(null);
  };

  const handleUpdate = (token: ServiceToken) => {
    setEditingToken(token);
    setShowForm(true);
  };

  const handleDelete = (provider: string, baseUrl: string) => {
    deleteServiceToken(provider, baseUrl);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingToken(null);
  };

  const handleAddNew = () => {
    setEditingToken(null);
    setShowForm(true);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-background p-4">
        <h1 className="text-2xl font-bold">{tk('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{tk('description')}</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {state.error && (
            <Alert variant="destructive">
              {state.error}
            </Alert>
          )}

          {!showForm && (
            <div className="flex justify-end">
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                disabled={state.loading}
              >
                {tk('add_new_button')}
              </button>
            </div>
          )}

          {showForm && (
            <div className="border rounded-lg p-6 bg-card">
              <h2 className="text-xl font-semibold mb-4">
                {editingToken ? tk('form_title_edit') : tk('form_title_new')}
              </h2>
              <ServiceTokenForm
                t={tk}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialData={editingToken || undefined}
                isLoading={state.loading}
                error={state.error}
              />
            </div>
          )}

          <ServiceTokenList
            t={tk}
            tokens={state.tokens || []}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isLoading={state.loading}
          />
        </div>
      </div>
    </div>
  );
};

ServiceTokensScreen.displayName = 'ServiceTokensScreen';

export default ServiceTokensScreen;
