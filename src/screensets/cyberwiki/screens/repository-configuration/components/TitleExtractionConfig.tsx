import React from 'react';
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@hai3/uikit';
import type { DocumentIndexConfig } from '../../../types';

interface TitleExtractionConfigProps {
  config: DocumentIndexConfig;
  onChange: (config: DocumentIndexConfig) => void;
  labels: {
    titleExtraction: string;
    titleExtractionHelp: string;
    firstHeading: string;
    frontmatter: string;
    firstLine: string;
    filename: string;
  };
}

export const TitleExtractionConfig: React.FC<TitleExtractionConfigProps> = ({
  config,
  onChange,
  labels,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="title-extraction">{labels.titleExtraction}</Label>
      <Select
        value={config.titleExtraction}
        onValueChange={(value) =>
          onChange({
            ...config,
            titleExtraction: value as DocumentIndexConfig['titleExtraction'],
          })
        }
      >
        <SelectTrigger id="title-extraction">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="first-heading">{labels.firstHeading}</SelectItem>
          <SelectItem value="frontmatter">{labels.frontmatter}</SelectItem>
          <SelectItem value="first-line">{labels.firstLine}</SelectItem>
          <SelectItem value="filename">{labels.filename}</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">{labels.titleExtractionHelp}</p>
    </div>
  );
};

TitleExtractionConfig.displayName = 'TitleExtractionConfig';
