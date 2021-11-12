import styled, { createGlobalStyle, css } from 'styled-components';

type ContainerProps = {
  isActive: boolean;
};

export default createGlobalStyle<ContainerProps>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  @media (max-width: 1080px) {
    html {
      font-size: 93.75%;
    }
  }

  @media (max-width: 720px) {
    html {
      font-size: 87.5%;
    }
  }
  a {
    text-decoration: none;
  }
  body {
    background-color: ${props => props.theme.colors.white[10]};
   /* padding-left: 4rem;
    transition: padding 0.5s;
    ${props =>
      props.isActive &&
      css`
        padding-left: 12.5rem;
      `}*/
  }
  body #app-react {
    display: flex;
  }
  body #main {
    width: 100%;
  }

  body #pages {
    width: 100%;
    display: flex;
    justify-content:center;
  }
  button {
    cursor: pointer;
  }
`;
