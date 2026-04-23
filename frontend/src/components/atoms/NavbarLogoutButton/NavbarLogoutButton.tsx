import { FC } from 'react';
import '@atoms/NavbarLogoutButton/NavbarLogoutButton.css';
import { INavbarLogoutButtonProps } from './INavbarLogoutButton';

const NavbarLogoutButton: FC<INavbarLogoutButtonProps> = ({ onClick }) => (
  <button
    type="button"
    className="navbar-icon-button"
    onClick={onClick}
    aria-label="Log out"
    title="Log out"
  >
    <svg className="logout-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 7L19 12L14 17M19 12H9M10 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default NavbarLogoutButton;
