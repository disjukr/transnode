import React from 'react';

import {
  Node,
} from '../../../state/document';
import BaseNode from './BaseNode';

export function renderNode(node: Node) {
  return <BaseNode key={node.id} node={node}/>;
}
