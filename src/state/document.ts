import React, { useState, useMemo } from 'react';
import { encode, decode } from '@msgpack/msgpack';
import Providers from 'join-react-context/lib/Providers';

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

export type ValueType =
  | 'tn:type:on-off'
;

export type SocketId = string;
export interface Socket {
  id: SocketId;
  name: string;
  types: ValueType[];
}

export interface Point {
  nodeId: NodeId;
  socketId: SocketId;
}

export interface Edge {
  a: Point;
  b: Point;
}

export type CapsuleId = string;
export interface Capsule {
  id: CapsuleId;
  name: string;
  nodes: NodeId[];
}

export interface BuiltInCapsule extends Capsule {
  id: BuiltInCapsuleId;
  inputs: Socket[];
  outputs: Socket[];
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

const noop = () => {};
export const transnodeDocumentContext = React.createContext<Document>(null as any);
export const stageNodesContext = React.createContext<NodeId[]>(null as any);
export const setStageNodesContext = React.createContext<(value: NodeId[]) => void>(noop);
export const nodeTableContext = React.createContext<NodeTable>(null as any);
export const setNodeTableContext = React.createContext<(value: NodeTable) => void>(noop);
export const capsuleTableContext = React.createContext<CapsuleTable>(null as any);
export const setCapsuleTableContext = React.createContext<(value: CapsuleTable) => void>(noop);
export const capsuleLibraryContext = React.createContext<CapsuleLibrary>(null as any);
export const setCapsuleLibraryContext = React.createContext<(value: CapsuleLibrary) => void>(noop);

export interface DocumentProviderProps {
  document: Document;
  children?: React.ReactNode;
}
export const DocumentProvider: React.FC<DocumentProviderProps> = ({ document, children }) => {
  return React.createElement(
    Providers,
    {
      providers: [
        React.createElement(transnodeDocumentContext.Provider, { value: document }),
        React.createElement(stageNodesContext.Provider, { value: document.stageNodes }),
        React.createElement(setStageNodesContext.Provider, { value: document.setStageNodes }),
        React.createElement(nodeTableContext.Provider, { value: document.nodeTable }),
        React.createElement(setNodeTableContext.Provider, { value: document.setNodeTable }),
        React.createElement(capsuleTableContext.Provider, { value: document.capsuleTable }),
        React.createElement(setCapsuleTableContext.Provider, { value: document.setCapsuleTable }),
        React.createElement(capsuleLibraryContext.Provider, { value: document.capsuleLibrary }),
        React.createElement(setCapsuleLibraryContext.Provider, { value: document.setCapsuleLibrary }),
      ],
      children,
    },
  );
};

export function clearDocument(document: Document) {
  document.setStageNodes([]);
  document.setNodeTable({});
  document.setCapsuleTable({});
  document.setCapsuleLibrary([]);
}

/**
 * @param capsuleId 해당 `capsuleId`를 갖는 캡슐에 `node`를 추가합니다.
 *                  인자를 생략할 경우 stage에 노드를 추가합니다.
*/
export function addNode(document: Document, node: Omit<Node, 'id'>, capsuleId?: CapsuleId) {
  const id = (node as Node).id ?? makeRandomId();
  const n =
    isBuiltInCapsuleId(node.capsuleId) ?
    { ...node, id, ...builtInCapsuleNodeInitTable[node.capsuleId] } :
    { ...node, id }
  ;
  document.setNodeTable({
    ...document.nodeTable,
    [id]: n,
  });
  if (capsuleId) {
    addNodeToCapsule(document, id, capsuleId);
  } else {
    addNodeToStage(document, id);
  }
}

export function addNodeToStage(document: Document, nodeId: NodeId) {
  document.setStageNodes([
    ...document.stageNodes,
    nodeId,
  ]);
}

export function addNodeToCapsule(document: Document, nodeId: NodeId, capsuleId: CapsuleId) {
  if (isBuiltInCapsuleId(capsuleId!)) throw new Error;
  const capsule = document.capsuleTable[capsuleId];
  if (!capsule) throw new Error;
  document.setCapsuleTable({
    ...document.capsuleTable,
    [capsuleId]: {
      ...capsule,
      nodes: [...capsule.nodes, nodeId],
    },
  });
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

export type BuiltInCapsuleId = BuiltInCapsuleNode['capsuleId'];
export type BuiltInCapsuleNode =
  | BaseNode & { capsuleId: 'tn:value:on-off', data: boolean }
  | BaseNode & { capsuleId: 'tn:view:on-off' }
;
type BuiltInCapsuleNodeInitTable = {
  [capsuleId in BuiltInCapsuleId]: Partial<Node>;
}
const builtInCapsuleNodeInitTable: BuiltInCapsuleNodeInitTable = {
  'tn:value:on-off': { data: false },
  'tn:view:on-off': {},
};
export const builtInCapsules: BuiltInCapsule[] = [
  {
    id: 'tn:value:on-off',
    name: 'on/off value',
    nodes: [],
    inputs: [],
    outputs: [{
      id: 'value',
      name: 'value',
      types: ['tn:type:on-off'],
    }],
  },
  {
    id: 'tn:view:on-off',
    name: 'on/off view',
    nodes: [],
    inputs: [{
      id: 'value',
      name: 'value',
      types: ['tn:type:on-off'],
    }],
    outputs: [],
  },
];

export function isBuiltInCapsuleId(id: string): id is BuiltInCapsuleId {
  return id.startsWith('tn:');
}

export function isBuiltInCapsuleNode(node: Node): node is BuiltInCapsuleNode {
  return isBuiltInCapsuleId(node.capsuleId);
}

export function isBuiltInCapsule(capsule: Capsule): capsule is BuiltInCapsule {
  return isBuiltInCapsuleId(capsule.id);
}

export function getCapsuleInputs(capsule: Capsule): Socket[] {
  if (isBuiltInCapsule(capsule)) return capsule.inputs;
  return []; // TODO
}

export function getCapsuleOutputs(capsule: Capsule): Socket[] {
  if (isBuiltInCapsule(capsule)) return capsule.outputs;
  return []; // TODO
}

function ff() {
  return (Math.random() * 0x100 | 0).toString(16).padStart(2, '0');
}
export function makeRandomId() {
  return [...Array(5)].map(ff).join('');
}
