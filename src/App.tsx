import React from 'react';
import Providers from 'join-react-context/lib/Providers';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import {
  DocumentProvider,
  useTransnodeDocument,
} from './state/document';
import SearchBar from './components/SearchBar';

const App: React.FC = () => {
  const document = useTransnodeDocument();
  return <Providers providers={<>
    <DndProvider backend={Backend}/>
    <DocumentProvider document={document}/>
  </>}>
    <Container>
      <SearchBar/>
    </Container>
  </Providers>;
}

export default App;

const Container = styled('div')({
  display: 'flex',
  width: '100%',
  height: '100%',
});
