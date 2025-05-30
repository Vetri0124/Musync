import React from 'react';
import { ButtonBase } from './Button.styles';

const Button = ({ children, ...props }) => {
  return <ButtonBase {...props}>{children}</ButtonBase>;
};

export default Button;