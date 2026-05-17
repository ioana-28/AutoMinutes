export interface IActionItemListToolbarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  sortKey: string;
  onSortKeyChange: (value: string) => void;
  isFilterOpen: boolean;
  onOpenFilter: () => void;
  onCloseFilter: () => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
  variant?: 'default' | 'popup';
}
