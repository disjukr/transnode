import { Draft } from 'immer';

import {
  CapsuleId,
  BuiltInCapsuleNode,
  UpdateDocument,
} from '.';

export interface Vec2D {
  x: number;
  y: number;
}

export type NodeId = string;
export type Node =
  | BaseNode
  | BuiltInCapsuleNode
;
export interface BaseNode {
  id: NodeId;
  capsuleId: CapsuleId;
  name: string;
  pos: Vec2D;
}

export interface NodeTable {
  [id: string]: Node;
}

export type UpdateNodeFn<TNode extends Node> = (draft: Draft<TNode>) => (Node | void);
export function updateNode<TNode extends Node>(
  updateDocument: UpdateDocument,
  node: TNode,
  updateFn: UpdateNodeFn<TNode>,
) {
  updateDocument(document => {
    const updateResult = updateFn(document.nodeTable[node.id] as Draft<TNode>);
    if (updateResult) {
      document.nodeTable[node.id] = updateResult;
    }
  });
}
