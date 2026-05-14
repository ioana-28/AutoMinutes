import { FC } from 'react';
import Button from '@atoms/Button/Button';
import Icon from '@atoms/Icon/Icon';
import { IDashboardHeaderProps } from './IDashboardHeader';

const DashboardHeader: FC<IDashboardHeaderProps> = ({ title, onClose }) => (
  <header className="relative rounded-[14px] border-[3px] border-[#1e3522] bg-[#386641] px-6 py-4">
    <h1 className="m-0 text-center text-2xl font-bold uppercase tracking-[0.08em] text-[#f8f6f1]">
      {title}
    </h1>
    <Button
      variant="icon-close"
      onClick={onClose}
      aria-label="Close dashboard"
      className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 border-none bg-transparent text-[#ffb6c9] shadow-none"
      icon={<Icon name="close" className="h-7 w-7" />}
    />
  </header>
);

export default DashboardHeader;
