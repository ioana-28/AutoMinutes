import { FC, useEffect, useState } from 'react';
import { TranscriptPreviewProps } from './ITranscriptPreview';
import { getTranscriptFile } from '@/api/transcriptApi';
import DocumentViewer from '@atoms/DocumentViewer/DocumentViewer';
import StateMessage from '@atoms/StateMessage/StateMessage';

const TranscriptPreview: FC<TranscriptPreviewProps> = ({ meetingId, fileName }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl = '';

    const loadFile = async () => {
      try {
        setIsLoading(true);
        const blob = await getTranscriptFile(meetingId);
        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      } catch (err) {
        setError('Unable to load document preview.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();

    // Memory Cleanup: Crucial for preventing browser memory leaks
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [meetingId]);

  if (isLoading) return <StateMessage variant="loading" message="Fetching document..." />;
  if (error) return <StateMessage variant="error" message={error} />;
  if (!fileUrl) return <StateMessage variant="info" message="No transcript available for this meeting." />;

  return (
    <div className="h-full overflow-hidden rounded-2xl border-2 border-[#24452a] bg-white">
      <DocumentViewer
        url={fileUrl}
        title={fileName}
        className="h-full rounded-none border-0 shadow-none"
      />
    </div>
  );
};

export default TranscriptPreview;