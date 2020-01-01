import React, { memo } from 'react';
import { useDrop } from 'react-dnd';

import {
  CapsuleId,
  useTransnodeDocument,
  useUpdateTransnodeDocument,
  addNode,
} from '../../state/document';
import { renderNode } from './node';

interface NodeEditorProps {}
const NodeEditor: React.FC<NodeEditorProps> = ({}) => {
  const document = useTransnodeDocument();
  const updateDocument = useUpdateTransnodeDocument();
  const [, drop] = useDrop({
    accept: 'capsule',
    drop: (item, monitor) => {
      const { id }: { id: CapsuleId } = item as any;
      addNode(updateDocument, {
        capsuleId: id,
        name: '',
        pos: monitor.getClientOffset()!,
      });
    },
  });
  return <div ref={drop} style={{
    position: 'relative',
    flexGrow: 1,
    height: '100%',
  }}>
    {document.stageNodes.map(
      nodeId => renderNode(document.nodeTable[nodeId])
    )}
  </div>;
};

export default memo(NodeEditor);
