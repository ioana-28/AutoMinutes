import { FC } from 'react';
import { IMeetingDetailsBodyProps } from './IMeetingDetailsBody';

const MeetingDetailsBody: FC<IMeetingDetailsBodyProps> = ({ leftSlot, rightSlot }) => (
  <section className="mx-auto w-full max-w-[1200px] p-6">
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="flex items-start">{leftSlot}</div>
      <div className="min-h-[360px] lg:pl-6">{rightSlot}</div>
    </div>
  </section>
);

export default MeetingDetailsBody;
