import styled from 'styled-components';

export const SongDetailContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    margin: 0.5rem 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;