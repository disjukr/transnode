import React, { memo } from 'react';
import { useDrop } from 'react-dnd';

import {
  CapsuleId,
  useTransnodeDocument,
  useUpdateTransnodeDocument,
  addNode,
} from '../../state/document';
import useCombinedRefs from '../../misc/useCombinedRefs';
import { useBoundingClientRectRef } from '../../misc/bounding-client-rect';
import { renderNode } from './node';

interface NodeEditorProps {}
const NodeEditor: React.FC<NodeEditorProps> = ({}) => {
  const document = useTransnodeDocument();
  const updateDocument = useUpdateTransnodeDocument();
  const [rectRef, rect] = useBoundingClientRectRef<HTMLDivElement>();
  const [, dropRef] = useDrop({
    accept: 'capsule',
    drop: (item, monitor) => {
      const { id }: { id: CapsuleId } = item as any;
      const { x, y } = monitor.getClientOffset()!;
      addNode(updateDocument, {
        capsuleId: id,
        name: '',
        pos: { x: x - rect.x, y },
      });
    },
  });
  const ref = useCombinedRefs<HTMLDivElement>(dropRef, rectRef);
  return <div ref={ref} style={{
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
