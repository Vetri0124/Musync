import styled from 'styled-components';

export const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;

  h2 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 2rem;
  }
`;

export const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  text-align: left;

  div {
    padding: 1.5rem;
    background-color: ${({ theme }) => theme.colors.light};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h3 {
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.colors.textSecondary};
      font-size: 0.9rem;
    }

    p {
      font-size: 1.1rem;
      margin: 0;
    }
  }
`;