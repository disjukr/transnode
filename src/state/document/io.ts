import {
  isBuiltInCapsule,
} from './builtin';
import {
  Capsule,
} from './capsule';
import {
  ValueType,
} from './value';

export type SocketId = string;
export interface Socket {
  id: SocketId;
  name: string;
  types: ValueType[];
}

export function getCapsuleInputs(capsule: Capsule): Socket[] {
  if (isBuiltInCapsule(capsule)) return capsule.inputs;
  return []; // TODO
}

export function getCapsuleOutputs(capsule: Capsule): Socket[] {
  if (isBuiltInCapsule(capsule)) return capsule.outputs;
  return []; // TODO
}
