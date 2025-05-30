import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

export const SongCard = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  h4 {
    margin: 0.25rem 0;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;