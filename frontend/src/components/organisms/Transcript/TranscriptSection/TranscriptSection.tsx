import { FC } from 'react';
import TranscriptPreview from '@organisms/Transcript/TranscriptPreview/TranscriptPreview';
import { TranscriptSectionProps } from './ITranscriptSection';

const TranscriptSection: FC<TranscriptSectionProps> = ({
  meetingId,
  fileName,
  filePath,
}) => {
  return (
    <div className="flex h-[calc(100vh-150px)] flex-col rounded-[28px] bg-[#F4F0EA] p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-heading">
            Transcript
          </h2>
          {filePath ? (
            <p
              className="mt-1 max-w-[320px] truncate text-xs text-text-heading/70"
              title={filePath}
            >
              {filePath}
            </p>
          ) : null}
        </div>
        <span className="rounded-full border border-[#24452a] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#24452a]">
          {fileName}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <TranscriptPreview
          meetingId={meetingId}
          fileName={fileName}
          filePath={filePath}
        />
      </div>
    </div>
  );
};

export default TranscriptSection;
