import { FC } from 'react';
import { IUserSearchResultItemProps } from './IUserSearchResultItem';

const UserSearchResultItem: FC<IUserSearchResultItemProps> = ({
  fullName,
  email,
  isSelected,
  onSelect,
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`mb-1 flex w-full flex-col rounded-[10px] border px-3 py-1 text-left last:mb-0 ${
      isSelected
        ? 'border-[#5f8167] bg-[#dce7d9]'
        : 'border-[#d7dfd8] bg-[#f8f6f1] hover:bg-[#edf3ea]'
    }`}
    aria-label={`Select user ${fullName} ${email}`}
  >
    <span className="text-sm font-semibold text-[#1f2937]">{fullName}</span>
    <span className="text-xs font-semibold text-[#4a5d50]">{email}</span>
  </button>
);

export default UserSearchResultItem;
