import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@hai3/uikit';
import { GitBranch, Star, Settings, Eye } from 'lucide-react';
import type { Repository } from '../../../types';

interface RepositoryCardProps {
  repository: Repository;
  onConfigure: (repository: Repository) => void;
  onView: (repository: Repository) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  onConfigure,
  onView,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              {repository.name}
              {repository.isFavorite && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
            </CardTitle>
            {repository.description && (
              <CardDescription className="mt-2">
                {repository.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="capitalize">{repository.provider}</span>
            <span>•</span>
            <span>{repository.defaultBranch}</span>
            <span>•</span>
            <span>{new Date(repository.lastUpdated).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigure(repository)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configure
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onView(repository)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

RepositoryCard.displayName = 'RepositoryCard';
