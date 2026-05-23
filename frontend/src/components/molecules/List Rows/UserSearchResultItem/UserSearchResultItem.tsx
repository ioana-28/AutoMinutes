import { FC } from 'react';
import ListRow from '@molecules/List Rows/ListRow/ListRow';
import { IUserSearchResultItemProps } from './IUserSearchResultItem';

const UserSearchResultItem: FC<IUserSearchResultItemProps> = ({
  fullName,
  email,
  isSelected,
  onSelect,
}) => {
  const leftSlot = (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-[#1f2937]">{fullName}</span>
      <span className="text-xs font-semibold text-[#4a5d50]">{email}</span>
    </div>
  );

  return (
    <ListRow
      variant="card"
      leftSlot={leftSlot}
      onClick={onSelect}
      className={`mb-1 last:mb-0 ${
        isSelected
          ? 'border-[#5f8167] bg-[#dce7d9]'
          : 'border-[#d7dfd8] bg-[#f8f6f1] hover:bg-[#edf3ea]'
      }`}
    />
  );
};

export default UserSearchResultItem;
