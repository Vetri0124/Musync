// src/styles/theme.js
import { keyframes } from 'styled-components';

// Define any global keyframes here if you want them in the theme object
const gradientBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const theme = {
  colors: {
    // --- Bohemian Rhapsody Inspired Palette ---
    primary: '#8B0000',            // Deep Maroon/Burgundy (Regal, Dramatic)
    primaryLight: '#C70039',       // Vibrant Crimson (Passion, Energy)
    primaryAccent: '#DAA520',      // Goldenrod (Operatic, Grandeur)
    primaryDark: '#4A0000',        // Very Dark Maroon

    secondary: '#006D6D',          // Deep Teal (Moody, Sophisticated)
    secondaryLight: '#20B2AA',     // Lighter Sea Green (Subtle contrast)
    secondaryDark: '#003D3D',      // Very Dark Teal

    info: '#FF8C00',               // Dark Orange (Vibrant Pop, Warning-like info)
    success: '#228B22',            // Forest Green (Classic success)
    warning: '#FFD700',            // Pure Gold (Highlights, crucial elements)
    danger: '#DC143C',             // Crimson Red (Strong warnings/errors)

    // --- Backgrounds & Text (Warm & Deep) ---
    background: '#21212B',         // Deep Indigo-Charcoal (Moody background)
    backgroundDark: '#171720',     // Even Darker for depth
    dark: '#171720',               // For cards/sections, consistent dark
    light: '#006D6D',              // Soft Off-White/Cream (Warm light tone)

    text: '#D0D0C0',               // Warm Light Gray (Readable on darks)
    textLight: '#FFFFFF',          // Pure White (High contrast for headings)
    textSecondary: '#909080',      // Muted Warm Gray (Subtle text)

    border: '#5C4033',             // Dark Brown (Subtle, warm border)
    focus: '#DAA520',              // Goldenrod for focus states
    active: '#C70039',             // Crimson for active states

    // --- Theatrical Gradients ---
    gradientPrimary: 'linear-gradient(135deg, #8B0000 0%, #DAA520 100%)', // Maroon to Gold
    gradientSecondary: 'linear-gradient(135deg, #006D6D 0%, #FF8C00 100%)', // Deep Teal to Dark Orange
    gradientVibrant: 'linear-gradient(45deg, #8B0000, #006D6D, #DAA520, #C70039)', // Multi-stop drama!
  },
  spacing: {
    xxs: '4px',
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  fonts: {
    main: 'Roboto, sans-serif',
    heading: 'Montserrat, sans-serif',
    display: 'Oswald, sans-serif',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    lg: '1200px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    xxl: '0 19px 38px rgba(0,0,0,0.3), 0 15px 12px rgba(0,0,0,0.22)',
    inset: 'inset 0 2px 4px rgba(0,0,0,0.2)',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '20px',
    full: '9999px',
  },
  transitions: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
  animations: {
    fadeInDuration: '0.8s',
    slideInDuration: '1s',
    blobDanceDuration: '30s',
    gradientCycleDuration: '25s',
    delaySm: '0.1s',
    delayMd: '0.2s',
    delayLg: '0.4s',
    gradientBackground: gradientBackground,
  },
  zIndex: {
    base: 100,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    overlay: 1300,
    loader: 1400,
  },
};

export default theme;