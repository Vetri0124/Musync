import styled from 'styled-components';

export const RecognizeContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;

  h2 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;