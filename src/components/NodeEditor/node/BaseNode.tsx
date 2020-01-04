import React, { memo } from 'react';
import styled from 'styled-components';
import {
  useDrag,
  useDrop,
} from 'react-dnd';

import {
  Node,
  getCapsuleInputs,
  getCapsuleOutputs,
  useCapsule,
  Socket,
  isSubtypeOf,
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
      {inputs.map(
        input => <InputSocket key={input.id} node={node} socket={input}/>
      )}
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
      {outputs.map(
        output => <OutputSocket key={output.id} node={node} socket={output}/>
      )}
    </OutputContainer>}
  </div>;
};

export default memo(BaseNode);

interface SocketComponentProps {
  socket: Socket;
  divRef: React.Ref<any>;
}
const SocketComponent: React.FC<SocketComponentProps> = ({ socket, divRef }) => {
  return <div ref={divRef} style={{
    border: '1px solid black',
  }}>
    v
  </div>;
};

interface InputSocketProps {
  node: Node;
  socket: Socket;
}
const InputSocket: React.FC<InputSocketProps> = ({ node, socket }) => {
  const [, dropRef] = useDrop({
    accept: 'output',
    canDrop: item => {
      const { output }: { output: { node: Node, socket: Socket } } = item as any;
      return isSubtypeOf(output.socket.types, socket.types);
    },
    drop: (item, monitor) => {
      console.log(item);
    },
  });
  return <SocketComponent socket={socket} divRef={dropRef}/>;
};

interface OutputSocketProps {
  node: Node;
  socket: Socket;
}
const OutputSocket: React.FC<OutputSocketProps> = ({ node, socket }) => {
  const [, dragRef] = useDrag({
    item: {
      type: 'output',
      output: { node, socket },
    },
  });
  return <SocketComponent socket={socket} divRef={dragRef}/>;
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
