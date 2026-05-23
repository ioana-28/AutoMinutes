import { FC } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { INavbarProps } from './INavbar';

const Navbar: FC<INavbarProps> = ({ leftSlot, rightSlot }) => (
  <header className="relative z-[100] w-full border-b border-[#c7e8cd] bg-[#386641] px-3 py-2.5 sm:px-6 sm:py-4 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.45)]">
    <nav
      className="mx-auto flex max-h-[30px] max-w-[1200px] items-center justify-between gap-1 sm:gap-4"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-1 sm:gap-6">
        <Link to="/meeting-list" aria-label="Go to meeting list" className="flex items-center">
          <img src={logo} alt="AutoMinutes logo" className="h-10 w-10 sm:h-20 sm:w-20 object-contain" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-8">{leftSlot}</div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">{rightSlot}</div>
    </nav>
  </header>
);

export default Navbar;
