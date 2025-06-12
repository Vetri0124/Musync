// src/styles/globalStyles.js
import { createGlobalStyle, keyframes } from 'styled-components';

// --- Keyframe Animations for Grandeur (only those *not* in BackgroundAnimations) ---

// General entry animation
const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// Subtle float for elements
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

// Text reveal with clip-path
const textClipReveal = keyframes`
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
`;

// Border glow/pulse
const borderGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0px ${({ theme }) => theme.colors.focus}; }
  50% { box-shadow: 0 0 15px ${({ theme }) => theme.colors.focus}; }
`;

// Button ripple effect
const ripple = keyframes`
  from { transform: scale(0); opacity: 0.8; }
  to { transform: scale(2); opacity: 0; }
`;

// Shimmer effect for loading states
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Bouncy effect for fixed elements
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

// --- End Keyframe Animations ---


const GlobalStyle = createGlobalStyle`
  /* Import Google Fonts for display and heading */
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Roboto:wght@300;400;500;700&family=Oswald:wght@700&display=swap');

  /* Global Reset & Box-sizing */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent; /* Remove tap highlight on mobile */
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden; /* Ensure no horizontal scrolling */
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative; /* For content layering, not for background animation */
    overflow-x: hidden;
    overflow-y: auto; /* Allow vertical scrolling for content */
    background-color: ${({ theme }) => theme.colors.background}; /* Set base background*/
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.textLight}; /* Gold for excellent contrast*/
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: 1.2;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.15); /* Keep text shadow for depth */

    &.clip-reveal {
      overflow: hidden;
      display: inline-block;
      clip-path: inset(0 100% 0 0);
      animation: ${textClipReveal} ${({ theme }) => theme.animations.slideInDuration} ${({ theme }) => theme.transitions.easeOutQuint} forwards;
      animation-delay: ${({ theme }) => theme.animations.delayMd};
    }
  }

  h1 { font-size: 3.5rem; font-family: ${({ theme }) => theme.fonts.display}; }
  h2 { font-size: 2.8rem; }
  h3 { font-size: 2.2rem; }
  h4 { font-size: 1.8rem; }
  h5 { font-size: 1.4rem; }
  h6 { font-size: 1.1rem; }

  /* Links */
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.secondary}; /* Bright Orange for links*/
    transition: all ${({ theme }) => theme.transitions.normal} ${({ theme }) => theme.transitions.easeOutQuint};
    position: relative;
    display: inline-block;

    &:hover {
      color: ${({ theme }) => theme.colors.primaryAccent}; /* Gold on hover*/
      transform: translateY(-4px) scale(1.03);
      filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4));
    }
    &:active {
      color: ${({ theme }) => theme.colors.active}; /* Blue Violet for active state*/
      transform: translateY(0) scale(1);
    }
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.focus}; /* Gold focus outline*/
      outline-offset: 4px;
      border-radius: ${({ theme }) => theme.borderRadius.sm};
      animation: ${borderGlow} 1s infinite alternate;
    }

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
      left: 0;
      background-color: ${({ theme }) => theme.colors.secondaryLight}; /* Amber underline*/
      transition: width ${({ theme }) => theme.transitions.normal} ${({ theme }) => theme.transitions.easeOutQuint};
    }
    &:hover::after {
      width: 100%;
    }
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    background: ${({ theme }) => theme.colors.gradientPrimary}; /* Purple to Orange gradient*/
    color: ${({ theme }) => theme.colors.light};
    font-weight: 700;
    letter-spacing: 1px;
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transition: all ${({ theme }) => theme.transitions.normal} ${({ theme }) => theme.transitions.easeOutQuint};
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
    will-change: transform, box-shadow, background-color;

    &:hover {
      background: ${({ theme }) => theme.colors.gradientPrimary};
      transform: translateY(-6px) scale(1.03);
      box-shadow: ${({ theme }) => theme.shadows.xxl};
      filter: brightness(1.2);
    }
    &:active {
      background: ${({ theme }) => theme.colors.primaryDark};
      transform: translateY(0);
      box-shadow: ${({ theme }) => theme.shadows.inset};
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.focus}, ${({ theme }) => theme.shadows.lg}; /* Gold focus outline*/
      animation: ${borderGlow} 1s infinite alternate;
    }

    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.7);
      animation: ${ripple} 0.6s linear forwards;
      pointer-events: none;
      transform: scale(0);
      opacity: 0;
    }

    &.secondary {
      background: ${({ theme }) => theme.colors.gradientSecondary}; /* Blue Violet to OrangeRed gradient*/
      &:hover {
        background: ${({ theme }) => theme.colors.gradientSecondary};
        filter: brightness(1.2);
      }
      &:active {
        background: ${({ theme }) => theme.colors.secondaryDark};
      }
    }

    &.ghost {
      background: transparent;
      color: ${({ theme }) => theme.colors.secondary}; /* Orange for ghost button text*/
      border: 2px solid ${({ theme }) => theme.colors.secondary}; /* Orange border*/
      box-shadow: none;
      &:hover {
        background: ${({ theme }) => theme.colors.secondary}; /* Fill with orange on hover*/
        color: ${({ theme }) => theme.colors.textLight}; /* Gold text on hover*/
        box-shadow: ${({ theme }) => theme.shadows.sm};
        transform: translateY(-2px);
      }
      &:active {
        background: ${({ theme }) => theme.colors.secondary};
        border-color: ${({ theme }) => theme.colors.secondary};
      }
    }

    &.animated-button {
      animation: ${fadeInScale} ${({ theme }) => theme.animations.fadeInDuration} ${({ theme }) => theme.transitions.easeOutQuint} forwards;
      opacity: 0;
    }
  }

  /* Form Elements */
  input, textarea, select {
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border}; /* Darker Purple border*/
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-family: inherit;
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text}; /* Warm light gray text*/
    background-color: ${({ theme }) => theme.colors.dark}; /* Dark background for inputs*/
    transition: all ${({ theme }) => theme.transitions.normal} ease-in-out;
    box-shadow: ${({ theme }) => theme.shadows.sm};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primaryAccent}; /* Gold border on focus*/
      box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2), ${({ theme }) => theme.shadows.md};
      transform: scale(1.01);
    }
    &::placeholder {
      color: ${({ theme }) => theme.colors.textSecondary};
      opacity: 0.7;
    }
    &:hover {
      border-color: ${({ theme }) => theme.colors.textSecondary};
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  /* Images & Media */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    transition: transform ${({ theme }) => theme.transitions.normal} ease-out,
                box-shadow ${({ theme }) => theme.transitions.normal} ease-out;

    &:hover {
      transform: scale(1.05);
      box-shadow: ${({ theme }) => theme.shadows.lg};
    }

    &.bordered-animated-image {
      border: 3px solid transparent;
      background-clip: padding-box;
      background-origin: border-box;
      background-image: ${({ theme }) => theme.colors.gradientVibrant}; /* Dramatic multi-color gradient border!*/
      animation: ${({ theme }) => theme.animations.gradientBackground} ${({ theme }) => theme.animations.gradientCycleDuration} linear infinite;
      background-size: 200% 200%;
    }

    &.floating-image {
        animation: ${float} 3s ease-in-out infinite;
    }
  }

  /* Utility Classes */
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.lg};
    z-index: 1;
    position: relative;
  }

  .text-center {
    text-align: center;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* Interactive Cards/Elements */
  .card {
    background-color: ${({ theme }) => theme.colors.dark}; /* Dark background for cards*/
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    box-shadow: ${({ theme }) => theme.shadows.md};
    padding: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.xxl};
    perspective: 1000px; /* For 3D tilt effect */
    transform-style: preserve-3d;
    transition: all ${({ theme }) => theme.transitions.normal} ${({ theme }) => theme.transitions.easeOutQuint};
    will-change: transform, box-shadow;
    color: ${({ theme }) => theme.colors.text}; /* Warm light gray text on dark card*/

    &:hover {
      transform: translateY(-10px) rotateX(5deg) rotateY(-5deg);
      box-shadow: ${({ theme }) => theme.shadows.xxl};
      position: relative;
      z-index: ${({ theme }) => theme.zIndex.base + 1};
    }
    &:active {
      transform: translateY(-2px) rotateX(0deg) rotateY(0deg);
      box-shadow: ${({ theme }) => theme.shadows.lg};
    }

    &.animated-card {
      animation: ${fadeInScale} ${({ theme }) => theme.animations.fadeInDuration} ${({ theme }) => theme.transitions.easeOutQuint} forwards;
      opacity: 0;
      transform: scale(0.9);
    }
  }

  /* Specific class for the "Hear a song you like?" containers to make text visible*/
  .light-card {
    background-color: ${({ theme }) => theme.colors.light}; /* Beige background*/
    color: ${({ theme }) => theme.colors.backgroundDark}; /* Very dark text on light background*/

    h3, p, span { /* Target text within these specific light cards*/
      color: ${({ theme }) => theme.colors.backgroundDark}; // Ensure headings and paragraphs are dark
    }
  }


  /* Placeholder for Loading States / Skeleton Screens */
  .skeleton-line {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    height: 1rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    width: 100%;
    overflow: hidden;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      animation: ${shimmer} 1.5s infinite linear;
    }
  }

  /* Scroll-to-Top Button or other fixed elements */
  .fixed-bottom-right {
    position: fixed;
    bottom: ${({ theme }) => theme.spacing.xl};
    right: ${({ theme }) => theme.spacing.xl};
    z-index: ${({ theme }) => theme.zIndex.sticky};
    animation: ${bounce} 2s infinite ${({ theme }) => theme.transitions.ease};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    background-color: ${({ theme }) => theme.colors.primary}; /* Deep Purple background*/
    color: ${({ theme }) => theme.colors.light};
    transition: background-color 0.3s ease, transform 0.3s ease;
    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryLight}; /* Blue Violet on hover*/
      transform: translateY(-5px);
    }
  }

  /* New: Animated Scroll Indicator */
  .scroll-indicator-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: ${({ theme }) => theme.colors.secondaryLight}; /* Amber scroll indicator*/
    width: 0%;
    z-index: ${({ theme }) => theme.zIndex.sticky};
    transition: width 0.1s linear;
  }

  /* Custom Scrollbar (for webkit browsers) */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background}; /* Very Dark Charcoal track*/
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primaryAccent}; /* Gold thumb*/
    border-radius: 10px;
    border: 3px solid ${({ theme }) => theme.colors.background};
    &:hover {
      background: ${({ theme }) => theme.colors.primaryDark};
    }
  }

  /* Media Queries for Responsive Design */
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    h1 { font-size: 3rem; }
    h2 { font-size: 2.4rem; }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    h1 { font-size: 2.5rem; }
    h2 { font-size: 2rem; }
    h3 { font-size: 1.8rem; }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    html { font-size: 15px; }
    h1 { font-size: 2rem; }
    h2 { font-size: 1.75rem; }
    button {
      padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
      font-size: 0.9rem;
    }
    .fixed-bottom-right {
      bottom: ${({ theme }) => theme.spacing.md};
      right: ${({ theme }) => theme.spacing.md};
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
    }
  }
`;

export default GlobalStyle;