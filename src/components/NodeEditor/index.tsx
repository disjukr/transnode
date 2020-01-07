import React, { memo, useState, useRef } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';

import {
  CapsuleId,
  useTransnodeDocument,
  useUpdateTransnodeDocument,
  addNode,
  capsuleContext,
  getCapsule,
  getEdges,
} from '../../state/document';
import useCombinedRefs from '../../misc/useCombinedRefs';
import useBoundingClientRectRef from '../../misc/useBoundingClientRectRef';
import { renderNode } from './node';
import {
  useUpdateSocketRect,
  SocketRects,
  getSocketRect,
} from './socket-rect';
import { getBottom, getTop } from '../../misc/geom';

interface NodeEditorProps {}
const NodeEditor: React.FC<NodeEditorProps> = ({}) => {
  const updateDocument = useUpdateTransnodeDocument();
  const [socketRects, setSocketRects] = useState<SocketRects>({});
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
    <Edges socketRects={socketRects}/>
    <Nodes setSocketRects={setSocketRects}/>
  </div>;
};

export default memo(NodeEditor);

interface EdgesProps {
  socketRects: SocketRects;
}
const Edges: React.FC<EdgesProps> = ({ socketRects }) => {
  const document = useTransnodeDocument();
  const edges = getEdges(document);
  return <Layer>
    <svg style={{ overflow: 'visible' }}>
      {Array.from(edges).map(
        ({ input, output }, index) => {
          const { x: sx, y: sy } = getTop(getSocketRect(socketRects, input));
          const { x: ex, y: ey } = getBottom(getSocketRect(socketRects, output));
          const cy = (sy + ey) * 0.5;
          return <Edge
            key={index}
            d={`M${sx},${sy}C${sx},${cy} ${ex},${cy} ${ex},${ey}`}
          />;
        }
      )}
    </svg>
  </Layer>;
};

interface NodesProps {
  setSocketRects: (socketRects: SocketRects) => void;
}
const Nodes: React.FC<NodesProps> = memo(({ setSocketRects }) => {
  const document = useTransnodeDocument();
  const layerRef = useRef<HTMLDivElement>(null);
  useUpdateSocketRect(layerRef, setSocketRects);
  return <Layer ref={layerRef}>
    {document.stage.nodes.map(
      nodeId => {
        const node = document.nodeTable[nodeId];
        const capsule = getCapsule(document, node.capsuleId);
        return <capsuleContext.Provider key={nodeId} value={capsule}>
          {renderNode(node)}
        </capsuleContext.Provider>
      }
    )}
  </Layer>;
});

const Layer = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
});

const Edge = styled('path')({
  stroke: 'black',
  fill: 'none',
  strokeWidth: 2,
});
