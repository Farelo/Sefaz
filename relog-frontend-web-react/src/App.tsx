import React from 'react';

import { ThemeProvider } from 'styled-components';
import theme from './assets/styles/theme';
import Global from './assets/styles/global';

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Global />
        <div>
          <h1>Olá mundo</h1>
          <p>
            Inicio da aplicação front end evoy <strong>react</strong>
          </p>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
