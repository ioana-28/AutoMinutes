import { FC } from 'react';
import Button from '@atoms/Button/Button';
import ListRow from '@molecules/ListRow/ListRow';
import { IMeetingListProps, MeetingStatus } from './IMeetingList';

const getStatusStyles = (status: MeetingStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'border-[#2f6f3b] bg-[#cfe7d2] text-[#1f3f26]';
    case 'PROCESSING':
      return 'border-[#9a7d3a] bg-[#f2e1b8] text-[#5f4a1e]';
    case 'FAILED':
      return 'border-[#b33a3a] bg-[#f4c7c7] text-[#6b1f1f]';
    case 'IDLE':
      return 'border-[#6b7280] bg-[#e5e7eb] text-[#374151]';
    default:
      return 'border-[#7f9d86] bg-[#efebe2] text-[#1f2937]';
  }
};

const MeetingList: FC<IMeetingListProps> = ({ items, expandedId, onToggleExpand, onInfoClick }) => {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#7f9d86] bg-[#efebe2] p-10 text-center text-[#1f2937]">
        No meetings found.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        const detailsId = `meeting-details-${item.id}`;

        return (
          <div
            key={item.id}
            className="rounded-2xl border border-[#7f9d86] bg-[#f6f1e8] px-5 py-4 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.45)]"
          >
            <ListRow
              className="gap-6"
              leftSlot={
                <div className="flex min-w-0 items-center gap-4">
                  <Button
                    variant="icon-ghost"
                    onClick={() => onToggleExpand(item.id)}
                    aria-expanded={isExpanded}
                    aria-controls={detailsId}
                    className="h-9 w-9"
                    icon={
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d={isExpanded ? 'M6 14L12 8L18 14' : 'M6 10L12 16L18 10'}
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />

                  <div className="flex min-w-0 flex-col">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d5f46]">
                      {item.dateLabel}
                    </span>
                    <span className="truncate text-lg font-semibold text-[#1f2937]">
                      {item.title}
                    </span>
                  </div>
                </div>
              }
              rightSlot={
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full border ${getStatusStyles(item.status)}`.trim()}
                    aria-label={`Status: ${item.status}`}
                    title={item.status}
                  />

                  <Button
                    variant="icon-ghost"
                    onClick={() => onInfoClick(item.id)}
                    aria-label="Meeting details"
                    className="h-9 w-9"
                    icon={
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
              }
            />

            {isExpanded ? (
              <div
                id={detailsId}
                className="mt-4 rounded-xl border border-[#c7e8cd] bg-[#edf3ea] px-4 py-3 text-sm text-[#1f2937]"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-[#1f2937]">
                    {item.description || 'No description available yet.'}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a5d50]">
                    Status: {item.status}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default MeetingList;
