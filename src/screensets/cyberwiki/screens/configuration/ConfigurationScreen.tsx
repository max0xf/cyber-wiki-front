/**
 * Configuration Screen
 * Compact table-based configuration for Bitbucket, JIRA, and Custom Tokens
 */

import React, { useEffect, useMemo } from 'react';
import {
  useScreenTranslations,
  I18nRegistry,
  Language,
  useAppSelector,
  useTranslation,
} from '@hai3/react';
import { CYBERWIKI_SCREENSET_ID, CONFIGURATION_SCREEN_ID } from '../../ids';
import { selectServiceTokenState } from '../../slices/serviceTokenSlice';
import {
  loadServiceTokens,
  saveServiceToken,
} from '../../actions/serviceTokenActions';
import { ConfigurationTable, type ServiceConfig } from './components/ConfigurationTable';
import { Alert } from '@hai3/uikit';

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

export const ConfigurationScreen: React.FC = () => {
  useScreenTranslations(CYBERWIKI_SCREENSET_ID, CONFIGURATION_SCREEN_ID, translations);
  const { t } = useTranslation();
  const tk = (key: string) => t(`screen.${CYBERWIKI_SCREENSET_ID}.${CONFIGURATION_SCREEN_ID}:${key}`);

  const state = useAppSelector(selectServiceTokenState);

  useEffect(() => {
    console.log('[ConfigurationScreen] Initial state:', state);
    loadServiceTokens();
  }, []);

  // Map backend tokens to service configs
  const configs = useMemo((): ServiceConfig[] => {
    console.log('[ConfigurationScreen] State in useMemo:', state);
    console.log('[ConfigurationScreen] state.tokens:', state.tokens, 'isArray:', Array.isArray(state.tokens));

    // Ensure tokens is always an array
    const tokens = Array.isArray(state.tokens) ? state.tokens : [];

    // Find tokens by service type
    const bitbucketToken = tokens.find(t => t.service_type === 'bitbucket_server');
    const jiraToken = tokens.find(t => t.service_type === 'jira');
    const customToken = tokens.find(t => t.service_type === 'custom_header');

    return [
      {
        service: 'bitbucket',
        baseUrl: bitbucketToken?.base_url || '',
        username: bitbucketToken?.username || '',
        token: '',
        configured: !!bitbucketToken,
      },
      {
        service: 'jira',
        baseUrl: jiraToken?.base_url || '',
        username: jiraToken?.username || '',
        token: '',
        configured: !!jiraToken,
      },
      {
        service: 'custom_token',
        baseUrl: '',
        username: '',
        token: '',
        configured: !!customToken,
        headerName: customToken?.header_name || '',
        name: customToken?.name || '',
      },
    ];
  }, [state, state.tokens]);

  const handleSave = (service: string, config: Partial<ServiceConfig>) => {
    console.log('[ConfigurationScreen] handleSave called with:', { service, config });
    if (service === 'bitbucket') {
      // Save Bitbucket Server configuration
      const payload: any = {
        service_type: 'bitbucket_server',
        base_url: config.baseUrl || '',
        username: config.username,
      };
      // Only include token if user entered one
      if (config.token) {
        payload.token = config.token;
      }
      saveServiceToken(payload);
    } else if (service === 'jira') {
      // Save JIRA configuration
      const payload: any = {
        service_type: 'jira',
        base_url: config.baseUrl || '',
        username: config.username,
      };
      // Only include token if user entered one
      if (config.token) {
        payload.token = config.token;
      }
      saveServiceToken(payload);
    } else if (service === 'custom_token') {
      // Save Custom Token configuration
      const payload: any = {
        service_type: 'custom_header',
        header_name: config.headerName || 'X-Auth-Token',
        name: config.name || 'Custom Token',
      };
      // Only include token if user entered one
      if (config.token) {
        payload.token = config.token;
      }
      saveServiceToken(payload);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-background p-4">
        <h1 className="text-2xl font-bold">{tk('title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{tk('description')}</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {state.error && (
            <Alert variant="destructive">
              {state.error}
            </Alert>
          )}

          <ConfigurationTable
            t={tk}
            configs={configs}
            onSave={handleSave}
            isLoading={state.loading}
          />

          <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <p className="font-semibold mb-2">{tk('note_title')}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{tk('note_encryption')}</li>
              <li>{tk('note_jira_coming_soon')}</li>
              <li>{tk('note_custom_token_info')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfigurationScreen.displayName = 'ConfigurationScreen';

export default ConfigurationScreen;
