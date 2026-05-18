import { FC } from 'react';
import { IMeetingDetailsTemplateProps } from './IMeetingDetailsTemplate';

const MeetingDetailsTemplate: FC<IMeetingDetailsTemplateProps> = ({
  layout = 'page',
  headerSlot,
  summarySlot,
  panelTopSlot,
  rightSlot,
  children,
}) =>
  layout === 'page' ? (
    <main className="min-h-screen bg-[#cad2c5]">
      {headerSlot}

      <section className="mx-auto w-full max-w-[1200px] p-6">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex items-start">
            <div className="flex w-full flex-col gap-6">
              {summarySlot}
              {children}
            </div>
          </div>
          <div className="min-h-[360px] lg:pl-6">{rightSlot}</div>
        </div>
      </section>
    </main>
  ) : (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-l border-[#7f9d86]/30 bg-[#f6f1e8]">
      {headerSlot}

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3 py-4">
        {summarySlot}
        {panelTopSlot ?? null}

        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#7f9d86]/20 bg-[#efebe2] shadow-sm">
          {rightSlot}
        </div>

        {children}
      </div>
    </div>
  );

export default MeetingDetailsTemplate;
