import { Capsule, CapsuleId, Socket } from './document';

export interface OnOffCapsule extends Capsule {
  id: 'tn:value:on-off';
  value: boolean;
}

export interface BuiltInCapsules {
  [capsuleId: string]: BuiltInCapsule;
}
export interface BuiltInCapsule {
  id: CapsuleId;
  inputs: Socket[];
  outputs: Socket[];
}
export const builtInCapsules: BuiltInCapsule[] = [
  {
    id: 'tn:value:on-off',
    inputs: [],
    outputs: [{
      id: 'value',
      name: 'value',
      types: ['tn:type:on-off'],
    }],
  },
  {
    id: 'tn:view:on-off',
    inputs: [{
      id: 'value',
      name: 'value',
      types: ['tn:type:on-off'],
    }],
    outputs: [],
  },
];
