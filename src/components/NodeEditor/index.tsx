import React from 'react';
import { useDrop } from 'react-dnd';

interface NodeEditorProps {}
const NodeEditor: React.FC<NodeEditorProps> = ({}) => {
  const [, drop] = useDrop({
    accept: 'capsule',
    drop: (...args: any[]) => console.log('drop!', args),
  });
  return <div ref={drop} style={{
    flexGrow: 1,
    height: '100%',
  }}/>;
};

export default NodeEditor;
