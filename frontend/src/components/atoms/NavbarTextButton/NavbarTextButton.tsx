import { FC } from 'react';
import '@atoms/NavbarTextButton/NavbarTextButton.css';
import { INavbarTextButtonProps } from './INavbarTextButton';

const NavbarTextButton: FC<INavbarTextButtonProps> = ({
  label,
  onClick,
  className = 'navbar-button',
  type = 'button',
  ...rest
}) => (
  <button type={type} className={className} onClick={onClick} {...rest}>
    {label}
  </button>
);

export default NavbarTextButton;
