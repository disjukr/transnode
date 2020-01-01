import React, { memo } from 'react';

import {
  Node,
} from '../../../state/document';

export interface BaseNodeProps {
  node: Node;
  children?: React.ReactNode;
}
const BaseNode: React.FC<BaseNodeProps> = ({ node, children }) => {
  return <div style={{
    position: 'absolute',
    border: '1px solid black',
    minHeight: '2em',
    minWidth: '5em',
    top: node.pos.y + 'px',
    left: node.pos.x + 'px',
  }}>
    {node.capsuleId}
    {node.name}
    {children}
  </div>;
};

export default memo(BaseNode);
