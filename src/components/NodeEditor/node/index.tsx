import React from 'react';

import {
  Node,
  BuiltInCapsuleId,
  BuiltInCapsuleNode,
} from '../../../state/document';
import { nodeComponents as onOffComponents } from './on-off';
import BaseNode from './BaseNode';
export { BaseNode };

export interface BuiltInNodeComponents {
  [capsuleId: string]: React.FC<{ node: any }>;
};

const nodeComponents = {
  ...onOffComponents,
};

export interface NodeProps {
  node: Node;
}

export type BNC<TCapsuleId extends BuiltInCapsuleId> = React.FC<{
  node: Extract<BuiltInCapsuleNode, { capsuleId: TCapsuleId }>;
}>;

export function renderNode(node: Node) {
  const NodeComponent = nodeComponents[node.capsuleId];
  if (NodeComponent) {
    return <NodeComponent node={node as any}/>;
  } else {
    return <BaseNode node={node}/>;
  }
}
