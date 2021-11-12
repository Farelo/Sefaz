import styled from 'styled-components';

export const Container = styled.header`
  height: 3.5rem;
  width: 100%;
  background-color: ${props => props.theme.colors.white[50]};

  display: flex;
  align-items: center;
  padding-left: 3rem;
  opacity: 0.8;
  box-shadow: 2px 1px 10px rgba(0, 0, 0, 0.1);

  h1 {
    ${props => props.theme.fonts.title};
  }
`;
