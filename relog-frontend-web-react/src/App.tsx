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
          <h1>Titulo</h1>
          <p>
            Aqui tenho um exemplo de um texto feito no propio app da aplicação
            <br />
            esse texto é meramente ilustrativo com a finalidade de testar as
            <strong> fontes importadas</strong>
          </p>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
