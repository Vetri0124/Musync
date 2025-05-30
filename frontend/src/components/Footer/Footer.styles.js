import styled from 'styled-components';

export const FooterContainer = styled.footer`
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.dark};
  color: white;
  margin-top: auto;
`;

export const FooterText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;