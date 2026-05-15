import { FC } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { INavbarProps } from './INavbar';

const Navbar: FC<INavbarProps> = ({ leftSlot, rightSlot }) => (
  <header className="w-full border-b border-[#c7e8cd] bg-[#386641] px-6 py-4 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.45)]">
    <nav
      className="mx-auto flex max-w-[1200px] max-h-[30px] items-center justify-between gap-4"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-6">
        <Link
          to="/meeting-list"
          aria-label="Go to meeting list"
          className="flex items-center"
        >
          <img
            src={logo}
            alt="AutoMinutes logo"
            className="h-20 w-20 object-contain"
          />
        </Link>
        <div className="flex items-center gap-8">{leftSlot}</div>
      </div>

      <div className="flex items-center gap-4">{rightSlot}</div>
    </nav>
  </header>
);

export default Navbar;
