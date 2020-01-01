import React, { useContext } from 'react';
import { encode, decode } from '@msgpack/msgpack';
import { Draft } from 'immer';
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

export interface Document {
  formatVersion: number;
  stageNodes: NodeId[];
  nodeTable: NodeTable;
  capsuleTable: CapsuleTable;
  capsuleLibrary: CapsuleLibrary;
}
export type UpdateDocument = (updater: (draft: Draft<Document>) => (Document | void)) => void;

export function useTransnodeDocument() {
  return useContext(transnodeDocumentContext);
}
export function useUpdateTransnodeDocument() {
  return useContext(updateTransnodeDocumentContext);
}

export const initialTransnodeDocument: Document = {
  formatVersion: 0,
  stageNodes: [],
  nodeTable: {},
  capsuleTable: {},
  capsuleLibrary: [],
};

const noop = () => {};
export const transnodeDocumentContext = React.createContext<Document>(null as any);
export const updateTransnodeDocumentContext = React.createContext<UpdateDocument>(noop);

export interface DocumentProviderProps {
  document: Document;
  updateDocument: UpdateDocument;
  children?: React.ReactNode;
}
export const DocumentProvider: React.FC<DocumentProviderProps> = ({ document, updateDocument, children }) => {
  return React.createElement(
    Providers,
    {
      providers: [
        React.createElement(transnodeDocumentContext.Provider, { value: document }),
        React.createElement(updateTransnodeDocumentContext.Provider, { value: updateDocument }),
      ],
      children,
    },
  );
};

export function clearDocument(updateDocument: UpdateDocument) {
  updateDocument(() => initialTransnodeDocument);
}

/**
 * @param capsuleId 해당 `capsuleId`를 갖는 캡슐에 `node`를 추가합니다.
 *                  인자를 생략할 경우 stage에 노드를 추가합니다.
*/
export function addNode(updateDocument: UpdateDocument, node: Omit<Node, 'id'>, capsuleId?: CapsuleId) {
  const id = (node as Node).id ?? makeRandomId();
  updateDocument(document => {
    const n = isBuiltInCapsuleId(node.capsuleId) ?
      { ...node, id, ...builtInCapsuleNodeInitTable[node.capsuleId] } :
      { ...node, id };
    document.nodeTable[id] = n;
  });
  if (capsuleId) {
    addNodeToCapsule(updateDocument, id, capsuleId);
  } else {
    addNodeToStage(updateDocument, id);
  }
}

export function addNodeToStage(updateDocument: UpdateDocument, nodeId: NodeId) {
  updateDocument(document => void document.stageNodes.push(nodeId));
}

export function addNodeToCapsule(updateDocument: UpdateDocument, nodeId: NodeId, capsuleId: CapsuleId) {
  if (isBuiltInCapsuleId(capsuleId!)) throw new Error;
  updateDocument(document => void (document.capsuleTable[capsuleId].nodes.push(nodeId)));
}

export function toMsgpack(document: Document) {
  const doc = { ...document };
  for (const key in doc) {
    const k = key as keyof Document;
    if (typeof doc[k] === 'function') delete doc[k];
  }
  return encode(doc);
}

export function loadMsgpack(updateDocument: UpdateDocument, msgpack: Uint8Array) {
  const doc = decode(msgpack) as Document;
  clearDocument(updateDocument);
  updateDocument(document => {
    document.stageNodes = doc.stageNodes;
    document.nodeTable = doc.nodeTable;
    document.capsuleTable = doc.capsuleTable;
    document.capsuleLibrary = doc.capsuleLibrary;
  });
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
