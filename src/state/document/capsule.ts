import { createContext, useContext } from 'react';

import { Document } from '.';
import {
  builtInCapsulesMap,
  isBuiltInCapsuleId,
} from './builtin';
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

export function getCapsule(document: Document, capsuleId: CapsuleId): Capsule {
  if (isBuiltInCapsuleId(capsuleId)) {
    return builtInCapsulesMap.get(capsuleId)!;
  } else {
    return document.capsuleTable[capsuleId];
  }
}

export const capsuleContext = createContext<Capsule>(null as any);
export function useCapsule() {
  return useContext(capsuleContext);
}
