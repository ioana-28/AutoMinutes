import { FC } from 'react';
import TranscriptPreview from '@organisms/Transcript/TranscriptPreview/TranscriptPreview';
import { TranscriptSectionProps } from './ITranscriptSection';

const TranscriptSection: FC<TranscriptSectionProps> = ({ meetingId, fileName, filePath }) => {
  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="mb-4 flex items-center justify-end">
        <span className="rounded-full border border-[#7f9d86]/30 px-2 py-0.5 text-[10px] font-bold text-[#3d5f46]/60">
          {fileName}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <TranscriptPreview meetingId={meetingId} fileName={fileName} filePath={filePath} />
      </div>
    </div>
  );
};

export default TranscriptSection;
