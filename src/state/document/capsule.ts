import { createContext, useContext } from 'react';

import {
  Document,
  Stage,
  builtInCapsulesMap,
  isBuiltInCapsuleId,
} from '.';

export type CapsuleId = string;
export interface Capsule {
  id: CapsuleId;
  name: string;
  stage: Stage;
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
