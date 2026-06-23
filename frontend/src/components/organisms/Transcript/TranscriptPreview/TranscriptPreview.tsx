import { FC, useEffect, useState } from 'react';
import { TranscriptPreviewProps } from './ITranscriptPreview';
import { getTranscriptFile } from '@/api/transcriptApi';
import DocumentViewer from '@atoms/DocumentViewer/DocumentViewer';
import StateMessage from '@atoms/StateMessage/StateMessage';

const TranscriptPreview: FC<TranscriptPreviewProps> = ({ meetingId, fileName }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isMounted = true;

    const loadTranscript = async () => {
      if (isMounted) {
        setIsLoading(true);
        setFileUrl(null);
      }

      try {
        const blob = await getTranscriptFile(meetingId);
        objectUrl = URL.createObjectURL(blob);
        if (isMounted) {
          setFileUrl(objectUrl);
        }
      } catch {
        if (isMounted) {
          setFileUrl(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTranscript();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [meetingId]);

  if (isLoading) {
    return <StateMessage variant="info" message="Loading transcript preview..." />;
  }

  if (!fileUrl) {
    return <StateMessage variant="info" message="No transcript available for this meeting." />;
  }

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
