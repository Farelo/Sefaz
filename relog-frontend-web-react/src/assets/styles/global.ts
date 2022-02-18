import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
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
  }
  body #app-react {
    height: 100%;
    width: 100%;
    display: flex;
  }
  body #main {
    height: 100%;
    width: 100%;
    padding-bottom: 2rem;
  }
  button {
    cursor: pointer;
  }

`;
