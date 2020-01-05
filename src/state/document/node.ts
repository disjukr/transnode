import {
  CapsuleId,
  BuiltInCapsuleNode,
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
