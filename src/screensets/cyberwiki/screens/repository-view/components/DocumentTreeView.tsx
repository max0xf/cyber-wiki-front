import React, { useState } from 'react';
import { TreeNode } from './TreeNode';
import type { TreeNode as TreeNodeType } from '../../../types';

interface DocumentTreeViewProps {
  tree: TreeNodeType[];
  selectedPath?: string;
  onSelectDocument: (node: TreeNodeType) => void;
}

export const DocumentTreeView: React.FC<DocumentTreeViewProps> = ({
  tree,
  selectedPath,
  onSelectDocument,
}) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const handleToggle = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col">
      {tree.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          level={0}
          isExpanded={expandedPaths.has(node.path)}
          isSelected={node.path === selectedPath}
          onToggle={handleToggle}
          onSelect={onSelectDocument}
          showTitle={true}
        />
      ))}
    </div>
  );
};

DocumentTreeView.displayName = 'DocumentTreeView';
