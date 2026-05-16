import { FC } from 'react';
import { TranscriptPreviewProps } from './ITranscriptPreview';
import { getTranscriptFileUrl } from '@/api/transcriptApi';
import DocumentViewer from '@atoms/DocumentViewer/DocumentViewer';
import StateMessage from '@atoms/StateMessage/StateMessage';

const TranscriptPreview: FC<TranscriptPreviewProps> = ({ meetingId, fileName }) => {
  const fileUrl = getTranscriptFileUrl(meetingId);
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
