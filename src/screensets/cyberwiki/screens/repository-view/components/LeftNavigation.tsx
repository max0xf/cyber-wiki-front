import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@hai3/uikit';
import { FileTreeView } from './FileTreeView';
import { DocumentTreeView } from './DocumentTreeView';
import type { ViewMode, TreeNode } from '../../../types';

interface LeftNavigationProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  tree: TreeNode[];
  selectedPath?: string;
  onSelectNode: (node: TreeNode) => void;
  labels: {
    documentMode: string;
    developerMode: string;
  };
}

export const LeftNavigation: React.FC<LeftNavigationProps> = ({
  viewMode,
  onViewModeChange,
  tree,
  selectedPath,
  onSelectNode,
  labels,
}) => {
  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="border-b p-4">
        <Select value={viewMode} onValueChange={(v) => onViewModeChange(v as ViewMode)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="document">{labels.documentMode}</SelectItem>
            <SelectItem value="developer">{labels.developerMode}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {viewMode === 'document' ? (
          <DocumentTreeView
            tree={tree}
            selectedPath={selectedPath}
            onSelectDocument={onSelectNode}
          />
        ) : (
          <FileTreeView
            tree={tree}
            selectedPath={selectedPath}
            onSelectFile={onSelectNode}
          />
        )}
      </div>
    </div>
  );
};

LeftNavigation.displayName = 'LeftNavigation';
