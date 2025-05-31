import styled, { keyframes } from 'styled-components'; // Import keyframes here

// 1. Define the initial animation for fading in and zooming
const fadeInZoom = keyframes`
  from {
    opacity: 0;           /* Start completely transparent */
    transform: scale(0.95); /* Start slightly zoomed out */
  }
  to {
    opacity: 1;           /* End fully opaque */
    transform: scale(1);  /* End at original size */
  }
`;

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 2rem;
`;

export const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Initial subtle shadow */

  /* Apply the initial animation when the component mounts */
  animation: ${fadeInZoom} 2s ease-out forwards; /* 1s duration, ease-out timing, stays at final state */

  /* Existing hover transition (for interactivity after initial load) */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: default; /* Default cursor */

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }

  /* Hover Effect */
  &:hover {
    transform: translateY(-5px); /* Lifts the container up slightly */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* More prominent shadow on hover */
    cursor: pointer; /* Changes cursor to a pointer to indicate interactivity */
  }
`;

export const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  div {
    padding: 1.5rem;
    background-color: ${({ theme }) => theme.colors.light};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;

    h3 {
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;