import { TimeFilterType } from '@organisms/ActionItems/ActionItemListToolbar/IActionItemListToolbar';

export interface IQuickFilterGroupProps {
  activeFilter: TimeFilterType;
  onFilterChange: (filter: TimeFilterType) => void;
  className?: string;
}
