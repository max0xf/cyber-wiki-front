import React from 'react';
import { RepositoryCard } from './RepositoryCard';
import type { Repository } from '../../../types';

interface RepositoryListProps {
  repositories: Repository[];
  onConfigure: (repository: Repository) => void;
  onView: (repository: Repository) => void;
  emptyMessage?: string;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  onConfigure,
  onView,
  emptyMessage = 'No repositories found',
}) => {
  if (repositories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repositories.map((repository) => (
        <RepositoryCard
          key={repository.id}
          repository={repository}
          onConfigure={onConfigure}
          onView={onView}
        />
      ))}
    </div>
  );
};

RepositoryList.displayName = 'RepositoryList';
