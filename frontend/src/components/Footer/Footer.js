import React from 'react';
import { FooterContainer, FooterText, GitHubLink } from './Footer.styles'; // Remove GitHubIcon import
import GitHubLogo from './github.png'; // Import your GitHub logo image from the same folder

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>© {new Date().getFullYear()} MU-SYNC. All rights reserved.</FooterText>
      {/* GitHub Link and Image */}
      <GitHubLink
        href="https://github.com/Vetri0124" // Your actual GitHub profile URL
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit our GitHub profile"
      >
        <img src={GitHubLogo} alt="GitHub Logo" /> {/* Use a standard img tag */}
      </GitHubLink>
    </FooterContainer>
  );
};

export default Footer;