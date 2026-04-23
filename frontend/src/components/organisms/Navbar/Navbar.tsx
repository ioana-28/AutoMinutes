import { FC } from 'react';
import '@organisms/Navbar/Navbar.css';
import NavbarLogoutButton from '@atoms/NavbarLogoutButton/NavbarLogoutButton';
import NavbarTextButton from '@atoms/NavbarTextButton/NavbarTextButton';
import { INavbarProps } from './INavbar';

const Navbar: FC<INavbarProps> = ({
  onMeetingListClick,
  onToDoListClick,
  onAddMeetingClick,
  onLogoutClick,
}) => (
  <header className="navbar">
    <nav className="navbar-content" aria-label="Main navigation">
      <div className="navbar-left">
        <NavbarTextButton label="MEETING LIST" onClick={onMeetingListClick} />
        <NavbarTextButton label="TO DO LIST" onClick={onToDoListClick} />
      </div>

      <div className="navbar-right">
        <NavbarTextButton
          label="ADD MEETING"
          className="navbar-button navbar-button-primary"
          onClick={onAddMeetingClick}
        />

        <NavbarLogoutButton onClick={onLogoutClick} />
      </div>
    </nav>
  </header>
);

export default Navbar;
