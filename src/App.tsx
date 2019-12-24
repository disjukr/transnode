import React from 'react';
import styled, { keyframes, css } from 'styled-components';

import logo from './logo.svg';

const App: React.FC = () => {
  return (
    <AppDiv>
      <AppHeader>
        <AppLogo src={logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <AppLink
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </AppLink>
      </AppHeader>
    </AppDiv>
  );
}

export default App;

const AppDiv = styled('div')({
  textAlign: 'center',
});

const AppHeader = styled('header')({
  backgroundColor: '#282c34',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'calc(10px + 2vmin)',
  color: 'white',
});

const AppLink = styled('a')({
  color: '#61dafb',
});

const AppLogoSpin = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
});

const AppLogo = styled('img')(
  {
    height: '40vmin',
    pointerEvents: 'none',
  },
  css`
    @media (prefers-reduced-motion: no-preference) {
      animation: ${ AppLogoSpin } infinite 20s linear;
    }
  `,
);
