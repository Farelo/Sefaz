import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1 {
    ${props => props.theme.fonts.title};
    opacity: 0.4;
  }
  svg {
    opacity: 0.5;
  }
`;
