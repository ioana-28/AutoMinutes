import { FC } from 'react';
import '@atoms/Button/Button.css';
import { ButtonProps } from './IButton';

const Button: FC<ButtonProps> = ({ label, onClick, type = 'button' }) => (
  <button type={type} className="button" onClick={onClick}>
    {label}
  </button>
);

export default Button;
