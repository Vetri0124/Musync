import { createGlobalStyle } from 'styled-components';

// Define your theme object based on the CSS variables you provided
export const theme = {
  colors: {
    background: '#ffffff',
    text: '#333333',
    primary: '#95b9ee', // Your primary color
    secondary: '#f0d39e', // Your secondary color
    accent: '#b05bec', // Your accent color
    // If you had 'light', 'border', 'textSecondary' in other styled-components,
    // you should add them here as well based on your previous theme structure.
    // Example from previous styled-components files:
    light: '#F8F8F8', // Assuming a light color was used in Features
    border: '#DDDDDD', // Assuming a border color was used in SearchInput
    textSecondary: '#666666', // Assuming a secondary text color was used
  },
  fonts: {
    main: "Tahoma, Geneva, Verdana, sans-serif",
    heading: "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  // Add other theme properties if you had them (e.g., spacing, shadows)
};

const GlobalStyle = createGlobalStyle`
  /* Global Styles (converted from your CSS) */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main}; /* Uses theme font */
    line-height: 1.6;
    background-color: ${({ theme }) => theme.colors.background}; /* Uses theme color */
    color: ${({ theme }) => theme.colors.text}; /* Uses theme color */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading}; /* Uses theme font */
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s ease;

    &:hover { /* Nested pseudo-selector for styled-components */
      color: ${({ theme }) => theme.colors.primary}; /* Uses theme color */
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
  }

  input, textarea, button {
    &:focus { /* Nested pseudo-selector for styled-components */
      outline: 2px solid ${({ theme }) => theme.colors.secondary}; /* Uses theme color */
      outline-offset: 2px;
    }
  }

  /* Add smooth scrolling for anchor links */
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }
`;

export default GlobalStyle;