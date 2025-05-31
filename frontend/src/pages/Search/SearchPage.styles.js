// backend/frontend/src/pages/SearchPage/SearchPage.styles.js

import styled from 'styled-components';
// Removed Link import as SongCard will now be rendered as an <a> tag
// import { Link } from 'react-router-dom'; // This line should be commented out or removed

export const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;

  h2 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

export const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
`;

// SongCard no longer extends Link directly, but can be rendered as an <a>
export const SongCard = styled.a` /* Changed from styled(Link) to styled.a */
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
  border-radius: 8px; /* Added for consistency */
  overflow: hidden; /* Ensures content respects border-radius */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: add a subtle shadow */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Optional: enhance shadow on hover */
  }

  img {
    width: 100%;
    /* Removed fixed height to prevent stretching/pixelation */
    /* height: 200px; */
    max-height: 200px; /* Optional: limit the image height */
    object-fit: contain; /* Changed to 'contain' to ensure the entire image is visible */
    border-radius: 8px 8px 0 0; /* Adjust border-radius for top corners */
    margin-bottom: 0.5rem;
    display: block; /* Ensures no extra space below image */
    background-color: #f0f0f0; /* Optional: background for placeholder/missing image */
  }

  h4 {
    font-size: 1.1rem;
    margin: 0.5rem 0.5rem 0.25rem;
    color: ${({ theme }) => theme.colors.text};
    text-align: center;
    white-space: nowrap; /* Prevent text wrapping */
    overflow: hidden; /* Hide overflowed text */
    text-overflow: ellipsis; /* Show ellipsis for overflowed text */
  }

  p {
    font-size: 0.9rem;
    margin: 0 0.5rem 0.5rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;