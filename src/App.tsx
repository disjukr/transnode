import React from 'react';
import { useImmer } from 'use-immer';
import Providers from 'join-react-context/lib/Providers';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import {
  DocumentProvider,
  initialTransnodeDocument,
} from './state/document';
import SearchBar from './components/SearchBar';
import NodeEditor from './components/NodeEditor';

const App: React.FC = () => {
  const [document, updateDocument] = useImmer(initialTransnodeDocument);
  return <Providers providers={<>
    <DndProvider backend={Backend}/>
    <DocumentProvider
      document={document}
      updateDocument={updateDocument}
    />
  </>}>
    <Container>
      <SearchBar/>
      <NodeEditor/>
    </Container>
  </Providers>;
}

export default App;

const Container = styled('div')({
  display: 'flex',
  width: '100%',
  height: '100%',
});
