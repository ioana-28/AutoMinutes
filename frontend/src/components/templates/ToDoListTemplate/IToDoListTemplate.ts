import React from 'react';
import { TNavbarPage } from '@organisms/Navbar/INavbar';

export interface IToDoListTemplateProps {
  activePage: TNavbarPage;

  items: any[];

  search: string;
  setSearch: (value: string) => void;

  sortBy: string;
  setSortBy: (value: string) => void;

  showFilters: boolean;

  setShowFilters: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  selectedItem: any | null;

  setSelectedItem: (
    value: any | null
  ) => void;

  handleDelete: (id: number) => void;

  handleSave: (payload: any) => void;
}