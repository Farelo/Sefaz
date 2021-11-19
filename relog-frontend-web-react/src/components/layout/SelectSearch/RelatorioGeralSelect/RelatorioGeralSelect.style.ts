import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 1rem;
  height: 5.5rem;
  width: 62.5rem;
  gap: 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0rem 1.5rem;

  background-color: ${props => props.theme.colors.white[100]};
  .select-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    p {
      ${props => props.theme.fonts.text};
      color: ${props => props.theme.colors.blue[100]};
      font-weight: bold;
    }
    select {
      width: 29.5rem;
      height: 2rem;
      border-radius: 8px;
      background-color: transparent;
      opacity: 0.6;
    }
  }
`;
