import React from 'react';
import { Card, CardContent } from '@hai3/uikit';
import { FileText } from 'lucide-react';

interface DocumentViewerProps {
  content?: string;
  contentType?: string;
  path?: string;
  noFileMessage: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  content,
  contentType,
  path,
  noFileMessage,
}) => {
  if (!content || !path) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <FileText className="h-16 w-16 opacity-20" />
          <p>{noFileMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold">{path}</h2>
            <p className="text-sm text-muted-foreground">{contentType}</p>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {content}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

DocumentViewer.displayName = 'DocumentViewer';
