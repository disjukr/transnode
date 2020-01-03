import { NodeId } from './node';

export type CapsuleId = string;
export interface Capsule {
  id: CapsuleId;
  name: string;
  nodes: NodeId[];
}

export interface CapsuleTable {
  [id: string]: Capsule;
}

export interface CapsuleDirectory {
  name: string;
  items: (CapsuleId | CapsuleDirectory)[];
}

export type CapsuleLibrary = CapsuleDirectory[];
