import React, { createContext, useContext } from 'react';
import { encode, decode } from '@msgpack/msgpack';
import { Draft } from 'immer';
import Providers from 'join-react-context/lib/Providers';

import {
  CapsuleTable,
  CapsuleLibrary,
} from './capsule';
import {
  NodeTable,
} from './node';
import {
  Stage,
} from './stage';
import {
  noop,
  emptyStage,
} from './misc';

export * from './builtin';
export * from './capsule';
export * from './io';
export * from './node';
export * from './stage';
export * from './value';

export interface Document {
  formatVersion: number;
  stage: Stage;
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
  stage: emptyStage,
  nodeTable: {},
  capsuleTable: {},
  capsuleLibrary: [],
};

export const transnodeDocumentContext = createContext<Document>(null as any);
export const updateTransnodeDocumentContext = createContext<UpdateDocument>(noop);

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
    document.stage = doc.stage;
    document.nodeTable = doc.nodeTable;
    document.capsuleTable = doc.capsuleTable;
    document.capsuleLibrary = doc.capsuleLibrary;
  });
}
