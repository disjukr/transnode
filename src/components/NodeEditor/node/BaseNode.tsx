import React, { memo } from 'react';
import styled from 'styled-components';

import {
  Node,
  getCapsuleInputs,
  getCapsuleOutputs,
  useCapsule,
  Socket,
} from '../../../state/document';

export interface BaseNodeProps {
  node: Node;
  children?: React.ReactNode;
}
const BaseNode: React.FC<BaseNodeProps> = ({ node, children }) => {
  const capsule = useCapsule();
  const inputs = getCapsuleInputs(capsule);
  const outputs = getCapsuleOutputs(capsule);
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: node.pos.y + 'px',
    left: node.pos.x + 'px',
  }}>
    {!!inputs.length && <InputContainer>
      {inputs.map(input => <SocketComponent key={input.id} socket={input}/>)}
    </InputContainer>}
    <div style={{
      minHeight: '2em',
      minWidth: '5em',
      border: '1px solid black',
    }}>
      {node.capsuleId}
      {node.name}
      {children}
    </div>
    {!!outputs.length && <OutputContainer>
      {outputs.map(output => <SocketComponent key={output.id} socket={output}/>)}
    </OutputContainer>}
  </div>;
};

export default memo(BaseNode);

interface SocketComponentProps {
  socket: Socket;
}
const SocketComponent: React.FC<SocketComponentProps> = ({ socket }) => {
  return <div style={{
    border: '1px solid black',
  }}>
    v
  </div>;
};

const SocketContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  height: '1em',
});
const InputContainer = styled(SocketContainer)({
  alignSelf: 'flex-start',
  marginTop: '-1em',
});
const OutputContainer = styled(SocketContainer)({
  alignSelf: 'flex-end',
});
