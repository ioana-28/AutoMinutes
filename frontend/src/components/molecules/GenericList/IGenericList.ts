import { ReactNode } from 'react';

export interface GenericListProps<T> {
  items: T[];
  getItemId: (item: T) => string | number;
  selectedId?: string | number | null;
  renderLeft: (item: T) => ReactNode;
  renderRight: (item: T) => ReactNode;
  renderExpanded?: (item: T) => ReactNode;
  expandedId?: string | number | null;
  onToggleExpand?: (id: string | number) => void;
  onItemClick?: (id: string | number) => void;
  emptyMessage?: string;
  variant?: 'default' | 'panel';
}
