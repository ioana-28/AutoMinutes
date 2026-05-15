import { FC } from 'react';
import TranscriptPreview from '@organisms/Transcript/TranscriptPreview/TranscriptPreview';
import { TranscriptSectionProps } from './ITranscriptSection';

const TranscriptSection: FC<TranscriptSectionProps> = ({
  meetingId,
  fileName,
  filePath,
}) => {
  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#1f2937]/70">
            Transcript
          </h2>
          {filePath ? (
            <p
              className="max-w-[280px] truncate text-[10px] text-[#3d5f46]/50"
              title={filePath}
            >
              {filePath}
            </p>
          ) : null}
        </div>
        <span className="rounded-full border border-[#7f9d86]/30 px-2 py-0.5 text-[10px] font-bold text-[#3d5f46]/60">
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
