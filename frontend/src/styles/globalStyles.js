import { createGlobalStyle } from 'styled-components';

// Define your theme object
export const theme = {
  colors: {
    background: '#ffffff',       // or your preferred background color
    text: '#333333',             // main text color
    primary: '#1DB954',          // spotify green or your primary color
    secondary: '#191414',        // spotify black or your secondary color
    accent: '#4b0082',           // an accent color
    // add more colors as needed
  },
  fonts: {
    main: " Tahoma, Geneva, Verdana, sans-serif",
    heading: "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  // add other theme properties
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    line-height: 1.6;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
  }

  input, textarea, button {
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.secondary};
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