import styled, { css } from 'styled-components';

type ContainerProps = {
  isActive: boolean;
};

export const Container = styled.aside<ContainerProps>`
  background: ${props => props.theme.colors.white[50]};
  width: 4rem;
  height: 100vh;
  /*
    Implementação da slidebar utilizando position fixed
    position: fixed;
    left: 0;
    top: 0;
  */
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.5s;
  box-shadow: 2px 1px 10px rgba(0, 0, 0, 0.1);

  ${props =>
    props.isActive &&
    css`
      width: 12.5rem;
      align-items: flex-start;
    `}

  button {
    width: 100%;
    border: 0;
    background: none;
    margin-top: 1rem;
    justify-content: center;

    img {
      width: 64px;
      padding: 0 4px;
      transition: width 0.5s;

      ${props =>
        props.isActive &&
        css`
          width: 7.5rem;
        `}
    }
  }
`;
