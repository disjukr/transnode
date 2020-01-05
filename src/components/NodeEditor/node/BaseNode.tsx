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
  addEdge,
  useUpdateTransnodeDocument,
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
  node: Node;
  socket: Socket;
  divRef: React.Ref<any>;
  isOver?: boolean;
  canDrop?: boolean;
}
const SocketComponent: React.FC<SocketComponentProps> = ({
  node,
  socket,
  divRef,
  isOver,
  canDrop,
}) => {
  return <div
    ref={divRef}
    data-tn-node-id={node.id}
    data-tn-socket-id={socket.id}
    style={{
      padding: '0 0.5em',
      border: '1px solid black',
      backgroundColor: canDrop ? 'green' : isOver ? 'red' : 'white',
    }}>
    v
  </div>;
};

interface InputSocketProps {
  node: Node;
  socket: Socket;
}
const InputSocket: React.FC<InputSocketProps> = ({ node, socket }) => {
  const updateDocument = useUpdateTransnodeDocument();
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'output',
    canDrop: item => {
      const { output }: { output: { node: Node, socket: Socket } } = item as any;
      // TODO: 이미 연결된 다른 output이 있으면 false
      return isSubtypeOf(output.socket.types, socket.types);
    },
    drop: item => {
      const { output }: { output: { node: Node, socket: Socket } } = item as any;
      addEdge(
        updateDocument,
        { nodeId: output.node.id, socketId: output.socket.id },
        { nodeId: node.id, socketId: socket.id },
      );
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  return <SocketComponent
    node={node}
    socket={socket}
    divRef={dropRef}
    isOver={isOver}
    canDrop={canDrop}
  />;
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
  return <SocketComponent
    node={node}
    socket={socket}
    divRef={dragRef}
  />;
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
