import {
  BaseNode,
  Node,
  Capsule,
  Socket,
} from '.';
import {
  emptyStage,
} from './misc';

export interface BuiltInCapsule extends Capsule {
  id: BuiltInCapsuleId;
  inputs: Socket[];
  outputs: Socket[];
}

export type BuiltInCapsuleId = BuiltInCapsuleNode['capsuleId'];
export type BuiltInCapsuleNode =
  | BaseNode & { capsuleId: 'tn:on-off:value', data: boolean }
  | BaseNode & { capsuleId: 'tn:on-off:view' }
;
export type BuiltInCapsuleNodeInitTable = {
  [capsuleId in BuiltInCapsuleId]: Partial<Node>;
}
export const builtInCapsuleNodeInitTable: BuiltInCapsuleNodeInitTable = {
  'tn:on-off:value': { data: false },
  'tn:on-off:view': {},
};
export const builtInCapsules: BuiltInCapsule[] = [
  {
    id: 'tn:on-off:value',
    name: 'on/off value',
    stage: emptyStage,
    inputs: [],
    outputs: [{
      id: 'value',
      name: 'value',
      types: ['tn:type:on-off'],
    }],
  },
  {
    id: 'tn:on-off:view',
    name: 'on/off view',
    stage: emptyStage,
    inputs: [{
      id: 'value',
      name: 'value',
      types: ['tn:type:on-off'],
    }],
    outputs: [],
  },
];
export const builtInCapsulesMap: Map<BuiltInCapsuleId, BuiltInCapsule> =
  new Map(builtInCapsules.map(builtInCapsule => [builtInCapsule.id, builtInCapsule]))
;

export function isBuiltInCapsuleId(id: string): id is BuiltInCapsuleId {
  return id.startsWith('tn:');
}

export function isBuiltInCapsuleNode(node: Node): node is BuiltInCapsuleNode {
  return isBuiltInCapsuleId(node.capsuleId);
}

export function isBuiltInCapsule(capsule: Capsule): capsule is BuiltInCapsule {
  return isBuiltInCapsuleId(capsule.id);
}
