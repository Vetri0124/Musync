// src/components/Footer/Footer.styles.js
import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.backgroundDark}; /* Very deep dark background for footer */
  color: ${({ theme }) => theme.colors.textSecondary}; /* Muted text color */
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  margin-top: auto; /* Pushes footer to the bottom */
  display: flex;
  flex-direction: column; /* Stack items vertically on small screens */
  align-items: center;
  justify-content: center; /* Center horizontally */
  gap: ${({ theme }) => theme.spacing.md}; /* Space between text and icon */

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row; /* Layout items horizontally on larger screens */
    justify-content: space-between; /* Space out text and icon */
  }
`;

export const FooterText = styled.p`
  font-size: 0.9rem;
  margin: 0;
  white-space: nowrap; /* Prevent text from wrapping unnecessarily */
`;

export const GitHubLink = styled.a`
  display: flex; /* Ensures image is centered if it's the only content */
  align-items: center;
  justify-content: center;
  /* color property won't directly affect img src, but still good for text links if any */
  transition: transform 0.2s ease-in-out; /* Only transform for image */
  margin-left: ${({ theme }) => theme.spacing.md}; /* Space from text on larger screens */

  &:hover {
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0; /* Remove left margin on smaller screens if stacking */
  }

  // Style the img element directly within the link
  img {
    width: 24px; /* Adjust size as needed, e.g., 24px, 32px, etc. */
    height: 24px; /* Maintain aspect ratio */
    filter: brightness(0.8); /* Make it slightly dimmer by default to match textSecondary, adjust as needed */
    transition: filter 0.3s ease-in-out; /* Add transition for filter */
  }

  &:hover img {
    filter: brightness(1.2); /* Make it brighter on hover (like primaryAccent), adjust as needed */
  }
`;

// IMPORTANT: If you had 'export const GitHubIcon' defined here previously, remove it.
// Example of what to remove if it existed:
// export const GitHubIcon = styled.svg.attrs({ ... })` ... `;