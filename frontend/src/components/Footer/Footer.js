import React from 'react';
import { FooterContainer, FooterText } from './Footer.styles';

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>© {new Date().getFullYear()} Shazam Clone. All rights reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer;