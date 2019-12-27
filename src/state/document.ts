import { useState, useMemo } from 'react';

export interface Vec2D {
  x: number;
  y: number;
}

export type NodeId = string;
export interface Node {
  id: NodeId;
  name: string;
  pos: Vec2D;
}

export interface NodeTable {
  [id: string]: Node;
}

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

export type Document = ReturnType<typeof useTransnodeDocument>;

export function useTransnodeDocument() {
  const [stageNodes, setStageNodes] = useState<NodeId[]>([]);
  const [nodeTable, setNodeTable] = useState<NodeTable>({});
  const [capsuleTable, setCapsuleTable] = useState<CapsuleTable>({});
  const [capsuleLibrary, setCapsuleLibrary] = useState<CapsuleLibrary>([]);
  const document = useMemo(() => ({
    formatVersion: 0,
    stageNodes, setStageNodes,
    nodeTable, setNodeTable,
    capsuleTable, setCapsuleTable,
    capsuleLibrary, setCapsuleLibrary,
  }), [
    stageNodes,
    nodeTable,
    capsuleTable,
    capsuleLibrary,
  ]);
  return document;
}

function ff() {
  return (Math.random() * 0xff | 0).toString(16).padStart(2, '0');
}
export function makeRandomId() {
  return [...Array(5)].map(ff).join('');
}
