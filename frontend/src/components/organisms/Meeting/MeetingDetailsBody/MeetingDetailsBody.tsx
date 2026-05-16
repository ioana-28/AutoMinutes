import { FC } from 'react';
import { IMeetingDetailsBodyProps } from './IMeetingDetailsBody';

const MeetingDetailsBody: FC<IMeetingDetailsBodyProps> = ({
  leftSlot,
  rightSlot,
  layout = 'page',
}) =>
  layout === 'page' ? (
    <section className="mx-auto w-full max-w-[1200px] p-6">
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="flex items-start">{leftSlot}</div>
        <div className="min-h-[360px] lg:pl-6">{rightSlot}</div>
      </div>
    </section>
  ) : (
    <section className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden px-5 py-5">
      <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
        <div className="flex min-h-0 items-start">{leftSlot}</div>
        <div className="min-h-0 overflow-hidden rounded-3xl border border-[#c7e8cd] bg-[#edf3ea] p-4 shadow-[0_10px_28px_-22px_rgba(15,23,42,0.45)]">
          {rightSlot}
        </div>
      </div>
    </section>
  );

export default MeetingDetailsBody;
