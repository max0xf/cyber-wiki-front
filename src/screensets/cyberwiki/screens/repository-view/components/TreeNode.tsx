import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, FileCode } from 'lucide-react';
import type { TreeNode as TreeNodeType } from '../../../types';

interface TreeNodeProps {
  node: TreeNodeType;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (path: string) => void;
  onSelect: (node: TreeNodeType) => void;
  showTitle?: boolean; // Document mode shows titles, developer mode shows names
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  showTitle = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDirectory = node.type === 'dir';
  const displayName = showTitle && node.title ? node.title : node.name;

  const handleClick = () => {
    if (isDirectory) {
      onToggle(node.path);
    } else {
      onSelect(node);
    }
  };

  const getIcon = () => {
    if (isDirectory) {
      return isExpanded ? (
        <FolderOpen className="h-4 w-4 text-blue-500" />
      ) : (
        <Folder className="h-4 w-4 text-blue-500" />
      );
    }

    if (showTitle) {
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    }

    return <FileCode className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors ${
          isSelected ? 'bg-accent font-medium' : ''
        } ${isHovered && !isSelected ? 'bg-accent/50' : ''}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {isDirectory && (
          <span className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
        {!isDirectory && <span className="w-4" />}
        <span className="flex-shrink-0">{getIcon()}</span>
        <span className="truncate flex-1 text-left">{displayName}</span>
      </button>

      {isDirectory && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              level={level + 1}
              isExpanded={false}
              isSelected={false}
              onToggle={onToggle}
              onSelect={onSelect}
              showTitle={showTitle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Recursive wrapper to handle nested rendering
const TreeNodeComponent: React.FC<TreeNodeProps> = (props) => {
  return <TreeNode {...props} />;
};

TreeNode.displayName = 'TreeNode';
