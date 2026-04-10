import React from 'react';
import { Label, Input, Textarea } from '@hai3/uikit';
import type { DocumentIndexConfig } from '../../../types';

interface DocumentIndexConfigProps {
  config: DocumentIndexConfig;
  onChange: (config: DocumentIndexConfig) => void;
  labels: {
    includedExtensions: string;
    includedExtensionsHelp: string;
    excludedPaths: string;
    excludedPathsHelp: string;
  };
}

export const DocumentIndexConfigComponent: React.FC<DocumentIndexConfigProps> = ({
  config,
  onChange,
  labels,
}) => {
  const handleExtensionsChange = (value: string) => {
    const extensions = value.split(',').map((ext) => ext.trim()).filter(Boolean);
    onChange({ ...config, includedExtensions: extensions });
  };

  const handlePathsChange = (value: string) => {
    const paths = value.split('\n').map((path) => path.trim()).filter(Boolean);
    onChange({ ...config, excludedPaths: paths });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="extensions">{labels.includedExtensions}</Label>
        <Input
          id="extensions"
          type="text"
          value={config.includedExtensions.join(', ')}
          onChange={(e) => handleExtensionsChange(e.target.value)}
          placeholder=".md, .mdx, .txt"
        />
        <p className="text-sm text-muted-foreground">{labels.includedExtensionsHelp}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="excluded">{labels.excludedPaths}</Label>
        <Textarea
          id="excluded"
          value={config.excludedPaths.join('\n')}
          onChange={(e) => handlePathsChange(e.target.value)}
          placeholder="**/node_modules/**&#10;**/.github/**"
          rows={4}
        />
        <p className="text-sm text-muted-foreground">{labels.excludedPathsHelp}</p>
      </div>
    </div>
  );
};

DocumentIndexConfigComponent.displayName = 'DocumentIndexConfig';
