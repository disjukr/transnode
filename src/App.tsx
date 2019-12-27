import React from 'react';
import styled from 'styled-components';

import SearchBar from './components/SearchBar';

const App: React.FC = () => {
  return <Container>
    <SearchBar/>
  </Container>;
}

export default App;

const Container = styled('div')({
  display: 'flex',
  width: '100%',
  height: '100%',
});
