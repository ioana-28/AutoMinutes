import { FC } from 'react';
import { DocumentViewerProps } from './IDocumentViewer';

const DocumentViewer: FC<DocumentViewerProps> = ({ url, title, className }) => {
  return (
    <iframe
      src={url}
      title={title}
      className={`h-[600px] w-full rounded-lg border-2 border-[#24452a] bg-white shadow-md ${className ?? ''}`}
    />
  );
};

export default DocumentViewer;
