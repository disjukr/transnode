import React from 'react';
import { useDrop } from 'react-dnd';

import {
  CapsuleId,
  useTransnodeDocument,
  addNode,
} from '../../state/document';

interface NodeEditorProps {}
const NodeEditor: React.FC<NodeEditorProps> = ({}) => {
  const document = useTransnodeDocument();
  const [, drop] = useDrop({
    accept: 'capsule',
    drop: (item, monitor) => {
      const { id }: { id: CapsuleId } = item as any;
      addNode(document, {
        capsuleId: id,
        name: '',
        pos: monitor.getClientOffset()!,
      });
    },
  });
  return <div ref={drop} style={{
    flexGrow: 1,
    height: '100%',
  }}/>;
};

export default NodeEditor;
