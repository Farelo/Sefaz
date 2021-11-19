import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    ${props => props.theme.fonts.title};
    opacity: 0.4;
  }
  svg {
    opacity: 0.5;
  }
`;
