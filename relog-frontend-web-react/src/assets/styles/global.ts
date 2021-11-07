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
    background: ${props => props.theme.colors.blue[100]};
    color: ${props => props.theme.colors.white[100]};
    ${props => props.theme.fonts.title}
  }

  button, a {
    cursor: pointer;
  }
`;
