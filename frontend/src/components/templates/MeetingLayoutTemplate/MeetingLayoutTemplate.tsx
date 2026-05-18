import { FC } from 'react';
import { IMeetingLayoutTemplateProps } from './IMeetingLayoutTemplate';

const MeetingLayoutTemplate: FC<IMeetingLayoutTemplateProps> = ({
  navbarSlot,
  children,
  contentClassName,
  toolbarSlot,
}) => (
  <main className="flex min-h-screen flex-col bg-[#cad2c5]">
    {navbarSlot ?? null}

    <section className={`flex min-h-0 flex-1 flex-col ${contentClassName ?? 'p-4'}`.trim()}>
      <div className="flex min-h-0 flex-1 flex-col">
        {toolbarSlot ? <div className="mb-4 flex w-full flex-col">{toolbarSlot}</div> : null}
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </section>
  </main>
);

export default MeetingLayoutTemplate;
