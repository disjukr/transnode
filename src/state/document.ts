import { useState, useMemo } from 'react';
import { encode, decode } from '@msgpack/msgpack';

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

export function clearDocument(document: Document) {
  document.setStageNodes([]);
  document.setNodeTable({});
  document.setCapsuleTable({});
  document.setCapsuleLibrary([]);
}

export function toMsgpack(document: Document) {
  const doc = { ...document };
  for (const key in doc) {
    const k = key as keyof Document;
    if (typeof doc[k] === 'function') delete doc[k];
  }
  return encode(doc);
}

export function loadMsgpack(document: Document, msgpack: Uint8Array) {
  const doc = decode(msgpack) as Document;
  document.setStageNodes(doc.stageNodes);
  document.setNodeTable(doc.nodeTable);
  document.setCapsuleTable(doc.capsuleTable);
  document.setCapsuleLibrary(doc.capsuleLibrary);
}

function ff() {
  return (Math.random() * 0x100 | 0).toString(16).padStart(2, '0');
}
export function makeRandomId() {
  return [...Array(5)].map(ff).join('');
}
