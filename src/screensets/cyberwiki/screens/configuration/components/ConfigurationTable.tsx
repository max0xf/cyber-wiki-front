/**
 * Configuration Table Component
 * Compact table-based view for service configurations
 */

import { useState } from 'react';
import { Input, Button } from '@hai3/uikit';
import { ButtonVariant } from '@hai3/uikit';
import { Save, Edit2 } from 'lucide-react';

export interface ServiceConfig {
  service: 'bitbucket' | 'jira' | 'custom_token';
  baseUrl: string;
  username: string;
  token: string;
  configured: boolean;
  headerName?: string;  // For custom tokens: custom header name
  name?: string;        // For custom tokens: descriptive name
  _isExisting?: boolean; // Internal flag to track if this is an existing config
}

export interface ConfigurationTableProps {
  t: (key: string) => string;
  configs: ServiceConfig[];
  onSave: (service: string, config: Partial<ServiceConfig>) => void;
  isLoading?: boolean;
}

export function ConfigurationTable({
  t,
  configs,
  onSave,
  isLoading = false,
}: ConfigurationTableProps) {
  const [editingService, setEditingService] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, Partial<ServiceConfig>>>({});

  const getServiceLabel = (service: string): string => {
    switch (service) {
      case 'bitbucket':
        return 'Bitbucket Server';
      case 'jira':
        return 'JIRA';
      case 'custom_token':
        return 'Custom Token';
      default:
        return service;
    }
  };

  const handleEdit = (service: string, config: ServiceConfig) => {
    setEditingService(service);
    setFormData({
      ...formData,
      [service]: {
        baseUrl: config.baseUrl,
        username: config.username || '',
        token: '', // Empty - will only be sent if user enters a new value
        headerName: config.headerName || '',
        name: config.name || '',
        _isExisting: config.configured,
      },
    });
  };

  const handleCancel = (service: string) => {
    setEditingService(null);
    const newFormData = { ...formData };
    delete newFormData[service];
    setFormData(newFormData);
  };

  const handleSave = (service: string) => {
    const data = formData[service];
    console.log('[ConfigurationTable] handleSave - formData:', formData);
    console.log('[ConfigurationTable] handleSave - data for service:', service, data);
    if (data) {
      onSave(service, data);
      setEditingService(null);
      const newFormData = { ...formData };
      delete newFormData[service];
      setFormData(newFormData);
    }
  };

  const handleChange = (service: string, field: string, value: string) => {
    setFormData({
      ...formData,
      [service]: {
        ...formData[service],
        [field]: value,
      },
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3 font-semibold">{t('table_service')}</th>
            <th className="text-left p-3 font-semibold">{t('table_base_url')}</th>
            <th className="text-left p-3 font-semibold">{t('table_username')}</th>
            <th className="text-left p-3 font-semibold">{t('table_token')}</th>
            <th className="text-left p-3 font-semibold">{t('table_status')}</th>
            <th className="text-right p-3 font-semibold">{t('table_actions')}</th>
          </tr>
        </thead>
        <tbody>
          {configs.map((config) => {
            const isEditing = editingService === config.service;
            const data = formData[config.service] || {};

            return (
              <tr key={config.service} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium">{getServiceLabel(config.service)}</td>

                {/* Base URL / Header Name */}
                <td className="p-3">
                  {config.service === 'custom_token' ? (
                    isEditing ? (
                      <Input
                        value={data.headerName || ''}
                        onChange={(e) => handleChange(config.service, 'headerName', e.target.value)}
                        placeholder="X-Auth-Token"
                        className="w-full"
                        disabled={isLoading}
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {config.headerName || t('table_not_configured')}
                      </span>
                    )
                  ) : (
                    isEditing ? (
                      <Input
                        value={data.baseUrl || ''}
                        onChange={(e) => handleChange(config.service, 'baseUrl', e.target.value)}
                        placeholder={config.service === 'bitbucket' ? 'https://git.acme.work' : 'https://jira.acme.work'}
                        className="w-full"
                        disabled={isLoading}
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {config.baseUrl || t('table_not_configured')}
                      </span>
                    )
                  )}
                </td>

                {/* Username / Token Name */}
                <td className="p-3">
                  {config.service === 'custom_token' ? (
                    isEditing ? (
                      <Input
                        value={data.name || ''}
                        onChange={(e) => handleChange(config.service, 'name', e.target.value)}
                        placeholder="My Custom Token"
                        className="w-full"
                        disabled={isLoading}
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {config.name || t('table_not_configured')}
                      </span>
                    )
                  ) : (
                    isEditing ? (
                      <Input
                        value={data.username || ''}
                        onChange={(e) => handleChange(config.service, 'username', e.target.value)}
                        placeholder="username"
                        className="w-full"
                        disabled={isLoading}
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {config.username || t('table_not_configured')}
                      </span>
                    )
                  )}
                </td>

                {/* Token */}
                <td className="p-3">
                  {isEditing ? (
                    <Input
                      type="password"
                      value={data.token || ''}
                      onChange={(e) => handleChange(config.service, 'token', e.target.value)}
                      placeholder={data._isExisting ? '••••••••••••' : 'Enter token'}
                      className="w-full"
                      disabled={isLoading}
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {config.configured ? '••••••••••••' : t('table_not_configured')}
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="p-3">
                  {config.configured ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      ✓ {t('table_configured')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                      {t('table_not_configured')}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-3 text-right">
                  {isEditing ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant={ButtonVariant.Default}
                        size="sm"
                        onClick={() => handleSave(config.service)}
                        disabled={isLoading}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {t('table_save')}
                      </Button>
                      <Button
                        variant={ButtonVariant.Outline}
                        size="sm"
                        onClick={() => handleCancel(config.service)}
                        disabled={isLoading}
                      >
                        {t('table_cancel')}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant={ButtonVariant.Outline}
                      size="sm"
                      onClick={() => handleEdit(config.service, config)}
                      disabled={isLoading}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      {config.configured ? t('table_edit') : t('table_configure')}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
