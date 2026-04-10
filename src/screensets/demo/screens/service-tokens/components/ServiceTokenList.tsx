/**
 * Service Token List Component
 * Displays configured service tokens with update/delete actions
 */

import { Card, Button, Alert } from '@hai3/uikit';
import { ButtonVariant } from '@hai3/uikit';
import { Trash2, Edit, CheckCircle } from 'lucide-react';
import type { ServiceToken } from '../../../types/serviceTokenTypes';

export interface ServiceTokenListProps {
  t: (key: string) => string;
  tokens: ServiceToken[];
  onUpdate: (token: ServiceToken) => void;
  onDelete: (provider: string, baseUrl: string) => void;
  isLoading?: boolean;
}

export function ServiceTokenList({
  t,
  tokens,
  onUpdate,
  onDelete,
  isLoading = false,
}: ServiceTokenListProps) {
  // Safety check: ensure tokens is an array
  const safeTokens = Array.isArray(tokens) ? tokens : [];

  if (safeTokens.length === 0) {
    return (
      <Alert>
        {t('list_empty')}
      </Alert>
    );
  }

  const getProviderLabel = (provider: string): string => {
    switch (provider) {
      case 'github':
        return 'GitHub';
      case 'bitbucket_server':
        return 'Bitbucket Server';
      default:
        return provider;
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleDelete = (provider: string, baseUrl: string) => {
    if (window.confirm(t('delete_confirm'))) {
      onDelete(provider, baseUrl);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('list_title')}</h3>

      <div className="grid gap-4">
        {safeTokens.map((token) => (
          <Card key={`${token.service_type}-${token.base_url}`} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold">{getProviderLabel(token.service_type)}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {token.service_type === 'github' ? 'GitHub' : 'Bitbucket Server'}
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">{t('list_base_url')}:</span> {token.base_url}
                  </p>
                  <p>
                    <span className="font-medium">{t('list_created')}:</span> {formatDate(token.created_at)}
                  </p>
                  <p>
                    <span className="font-medium">{t('list_updated')}:</span> {formatDate(token.updated_at)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={ButtonVariant.Outline}
                  size="sm"
                  onClick={() => onUpdate(token)}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {t('list_update_button')}
                </Button>
                <Button
                  variant={ButtonVariant.Destructive}
                  size="sm"
                  onClick={() => onDelete(token.service_type, token.base_url || '')}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('list_delete_button')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
