import {
  isBuiltInCapsule,
} from './builtin';
import {
  Capsule,
} from './capsule';
import {
  NodeId,
} from './node';
import {
  ValueType,
} from './value';

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

export function getCapsuleInputs(capsule: Capsule): Socket[] {
  if (isBuiltInCapsule(capsule)) return capsule.inputs;
  return []; // TODO
}

export function getCapsuleOutputs(capsule: Capsule): Socket[] {
  if (isBuiltInCapsule(capsule)) return capsule.outputs;
  return []; // TODO
}
