import styled from 'styled-components';

export const Container = styled.div`
  width: 49.5rem;
  height: 100%;
  background-color: ${props => props.theme.colors.white[100]};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  padding: 1rem 0rem;
  div {
    display: flex;
    gap: 0.5rem;
    input {
      width: 40.75rem;
      height: 2rem;
      border: none;
      border-radius: 8px;
      background-color: ${props => props.theme.colors.white[10]};
      padding-left: 1rem;
      &::placeholder {
        font-style: italic;
      }
    }
    button {
      width: 5.25rem;
      height: 2rem;
      border: none;
      border-radius: 8px;
      background-color: ${props => props.theme.colors.negative};

      display: flex;
      align-items: center;
      justify-content: center;
      ${props => props.theme.fonts.text}
      color: ${props => props.theme.colors.white[100]};
      font-weight: 700;
    }
  }
  table tr {
    gap: 2rem;
  }
`;
