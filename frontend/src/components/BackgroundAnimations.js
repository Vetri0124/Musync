// src/components/BackgroundAnimations.jsx
import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components'; // Import useTheme

// --- Keyframe Animations for Background Elements ---
// These keyframes are defined here because they are specific to these animations
// and are not intended for global use via the theme object.

const blobDance = keyframes`
  0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate3d(0, 0, 0) rotateZ(0deg); }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: translate3d(15vw, 10vh, -150px) rotateZ(45deg); }
  50% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate3d(-10vw, 20vh, 100px) rotateZ(90deg); }
  75% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: translate3d(25vw, -5vh, -80px) rotateZ(135deg); }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate3d(0, 0, 0) rotateZ(180deg); }
`;

const starfieldMove = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: -10000px -10000px; } /* Long, slow movement */
`;

const rotateBlob1 = keyframes`
  0% { transform: rotate(0deg) rotateX(0deg); }
  100% { transform: rotate(360deg) rotateX(20deg); }
`;

const rotateBlob2 = keyframes`
  0% { transform: rotate(0deg) rotateY(0deg); }
  100% { transform: rotate(360deg) rotateY(15deg); }
`;

// --- Styled Components for Background Elements ---

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* Contains the blobs */
  z-index: -2; /* Ensures it's behind everything */
  pointer-events: none; /* Allows clicks to pass through */
  /* Main background gradient is applied here, to avoid interfering with body's scroll */
  background: radial-gradient(
    circle at 50% 50%,
    ${({ theme }) => theme.colors.backgroundDark} 0%,
    ${({ theme }) => theme.colors.background} 100%
  );
  background-size: 200% 200%; /* Larger size for animation */
  animation: ${({ theme }) => theme.animations.gradientBackground} 40s ease infinite; /* Use theme's gradientBackground keyframe */
`;

const Blob = styled.div`
  position: absolute; /* Relative to BackgroundContainer */
  border-radius: 50%;
  pointer-events: none;
  transform-style: preserve-3d;
  will-change: transform, filter, opacity; /* Optimize animations */
  animation-timing-function: cubic-bezier(0.65, 0.05, 0.36, 1); /* Smooth easing */
`;

const BlobOne = styled(Blob)`
  top: -30vh;
  left: -30vw;
  width: 180vw; /* Very large blob */
  height: 180vh; /* Very large blob */
  background: radial-gradient(
    circle at 30% 70%,
    ${({ theme }) => theme.colors.primaryLight} 0%,
    transparent 70%
  );
  filter: blur(150px); /* More blur for ethereal look */
  opacity: 0.2; /* Subtle transparency */
  animation: ${blobDance} 45s ease-in-out infinite alternate, ${rotateBlob1} 60s linear infinite;
  transform-origin: 70% 30%; /* Different origin for rotation */
`;

const BlobTwo = styled(Blob)`
  bottom: -35vh; /* Positioned from bottom */
  right: -35vw;  /* Positioned from right */
  width: 200vw; /* Even larger blob */
  height: 200vh; /* Even larger blob */
  background: radial-gradient(
    circle at 80% 20%,
    ${({ theme }) => theme.colors.secondaryLight} 0%,
    transparent 60%
  );
  filter: blur(180px); /* Even more blur */
  opacity: 0.15; /* More subtle */
  animation: ${blobDance} 50s ease-in-out infinite reverse, ${rotateBlob2} 70s linear infinite;
  transform-origin: 20% 80%; /* Different origin for rotation */
  animation-delay: 5s; /* Stagger this blob */
`;

const Starfield = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.05) 1px,
    transparent 1px
  );
  background-size: 100px 100px; /* Density of "stars" */
  animation: ${starfieldMove} 300s linear infinite; /* Very slow, long movement */
  z-index: -3; /* Lowest layer of background */
  opacity: 0.5; /* Subtle */
`;


const BackgroundAnimations = () => {
  const theme = useTheme(); // Access the theme directly here for animations

  // IMPORTANT: The 'gradientBackground' keyframe definition was removed from here.
  // It is now expected to be defined ONLY in src/styles/theme.js and accessed via theme.animations.gradientBackground.

  return (
    <BackgroundContainer theme={theme}>
      <Starfield /> {/* Render the deepest layer first */}
      <BlobOne theme={theme} />
      <BlobTwo theme={theme} />
    </BackgroundContainer>
  );
};

export default BackgroundAnimations;