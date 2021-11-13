import React, { useState } from 'react';

import { ThemeProvider } from 'styled-components';

import { BrowserRouter as Router } from 'react-router-dom';

import theme from './assets/styles/theme';
import Global from './assets/styles/global';

import { Aside } from './components/layout/Aside/Aside';
import { Header } from './components/layout/Header/Header';
import Routes from './routes.js';

function App(): JSX.Element {
  const [isActive, setIsActive] = useState(false);

  function openMenu() {
    setIsActive(!isActive);
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Global />
          <div id="app-react">
            <Aside openMenu={openMenu} isActive={isActive} />
            <main id="main">
              <Header title="Dashboard" />
              <div id="pages">
                <Routes />
              </div>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
