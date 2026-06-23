import Button from '@atoms/Button/Button';
import ListRow from '@molecules/List Rows/ListRow/ListRow';
import { GenericListProps } from './IGenericList';

const GenericList = <T,>({
  items,
  getItemId,
  selectedId,
  renderLeft,
  renderRight,
  renderExpanded,
  expandedId,
  onToggleExpand,
  onItemClick,
  emptyMessage = 'No items found.',
  variant = 'default',
}: GenericListProps<T>) => {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[#7f9d86]/40 bg-[#efebe2] p-8 text-center text-[#1f2937]/60">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="generic-list-container flex w-full flex-col gap-1 sm:gap-2">
      {items.map((item) => {
        const itemId = getItemId(item);
        const isExpandable = Boolean(renderExpanded);
        const isExpanded = isExpandable && expandedId === itemId;
        const isSelected = selectedId === itemId;
        const detailsId = `generic-details-${itemId}`;

        return (
          <div
            key={itemId}
            onClick={() => onItemClick?.(itemId)}
            className={`rounded-lg border shadow-sm transition-colors ${
              onItemClick ? 'cursor-pointer' : ''
            } ${
              variant === 'panel' ? 'px-1.5 py-0.5' : 'px-2 py-1 sm:px-4 sm:py-3'
            } ${
              isSelected
                ? 'border-[#386641] bg-[#edf3ea] ring-1 ring-[#386641]/20'
                : 'border-[#7f9d86]/30 bg-[#efebe2] hover:bg-[#e6e0d7]'
            }`}
          >
            <ListRow
              className="gap-1 sm:gap-4"
              leftSlot={
                <div className="flex min-w-0 items-center gap-1.5 sm:gap-4">
                  {isExpandable ? (
                    <Button
                      variant="icon-ghost"
                      onClick={() => onToggleExpand?.(itemId)}
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      className="h-6 w-6 sm:h-8 sm:w-8"
                      icon={
                        <svg
                          className="h-3.5 w-3.5 sm:h-5 sm:w-5"
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
                className={`mt-2 rounded-lg border border-[#7f9d86]/40 bg-[#efebe2] text-[#1f2937] ${
                  variant === 'panel' ? 'px-2 py-1.5 text-[10px]' : 'px-2 py-1.5 sm:px-4 sm:py-3 text-[10px] sm:text-sm'
                }`}
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
