import { FC } from 'react';
import Button from '@atoms/Button/Button';
import ListRow from '@molecules/ListRow/ListRow';
import { GenericListProps } from './IGenericList';

const GenericList = <T,>({
  items,
  getItemId,
  renderLeft,
  renderRight,
  renderExpanded,
  expandedId,
  onToggleExpand,
  emptyMessage = 'No items found.',
}: GenericListProps<T>) => {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#7f9d86] bg-[#efebe2] p-10 text-center text-[#1f2937]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {items.map((item) => {
        const itemId = getItemId(item);
        const isExpandable = Boolean(renderExpanded);
        const isExpanded = isExpandable && expandedId === itemId;
        const detailsId = `generic-details-${itemId}`;

        return (
          <div
            key={itemId}
            className="rounded-2xl border border-[#7f9d86] bg-[#f6f1e8] px-5 py-4 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.45)]"
          >
            <ListRow
              className="gap-6"
              leftSlot={
                <div className="flex min-w-0 items-center gap-4">
                  {isExpandable ? (
                    <Button
                      variant="icon-ghost"
                      onClick={() => onToggleExpand?.(itemId)}
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
                  ) : null}

                  <div className="min-w-0 flex-1">{renderLeft(item)}</div>
                </div>
              }
              rightSlot={renderRight(item)}
            />

            {isExpandable && isExpanded ? (
              <div
                id={detailsId}
                className="mt-4 rounded-xl border border-[#c7e8cd] bg-[#edf3ea] px-4 py-3 text-sm text-[#1f2937]"
              >
                {renderExpanded?.(item)}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default GenericList;
