import styled from 'styled-components';

export const RecorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Visualizer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 100px;
  width: 100%;
  margin-bottom: 1rem;

  div {
    flex: 1;
    background-color: ${({ theme }) => theme.colors.secondary};
    min-width: 2px;
    transition: height 0.1s;
  }
`;

export const ResultContainer = styled.div`
  text-align: center;
  margin-top: 2rem;

  img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin: 1rem 0;
  }

  h4 {
    margin: 0.5rem 0;
    font-size: 1.5rem;
  }

  p {
    margin: 0.25rem 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;