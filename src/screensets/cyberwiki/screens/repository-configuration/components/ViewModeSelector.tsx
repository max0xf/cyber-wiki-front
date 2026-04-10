import React from 'react';
import { Label, RadioGroup, RadioGroupItem } from '@hai3/uikit';
import type { ViewMode } from '../../../types';

interface ViewModeSelectorProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  labels: {
    defaultViewMode: string;
    documentView: string;
    developerView: string;
  };
}

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  value,
  onChange,
  labels,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Label>{labels.defaultViewMode}</Label>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as ViewMode)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="document" id="document" />
          <Label htmlFor="document" className="font-normal cursor-pointer">
            {labels.documentView}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="developer" id="developer" />
          <Label htmlFor="developer" className="font-normal cursor-pointer">
            {labels.developerView}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

ViewModeSelector.displayName = 'ViewModeSelector';
