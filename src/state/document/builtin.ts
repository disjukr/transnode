import {
  BaseNode,
  Node,
  Capsule,
  Socket,
} from '.';

export interface BuiltInCapsule extends Capsule {
  id: BuiltInCapsuleId;
  inputs: Socket[];
  outputs: Socket[];
}

export type BuiltInCapsuleId = BuiltInCapsuleNode['capsuleId'];
export type BuiltInCapsuleNode =
  | BaseNode & { capsuleId: 'tn:value:on-off', data: boolean }
  | BaseNode & { capsuleId: 'tn:view:on-off' }
;
export type BuiltInCapsuleNodeInitTable = {
  [capsuleId in BuiltInCapsuleId]: Partial<Node>;
}
export const builtInCapsuleNodeInitTable: BuiltInCapsuleNodeInitTable = {
  'tn:value:on-off': { data: false },
  'tn:view:on-off': {},
};
export const builtInCapsules: BuiltInCapsule[] = [
  {
    id: 'tn:value:on-off',
    name: 'on/off value',
    stage: {
      nodes: [],
    },
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
    stage: {
      nodes: [],
    },
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
