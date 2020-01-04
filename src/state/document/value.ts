import { isSubsetOf } from '../../misc/array';

export type ValueType = Value['type'];

export type Value =
  | { type: 'tn:type:on-off', data: boolean }
;

export function isSubtypeOf(a: ValueType[], b: ValueType[]): boolean {
  return isSubsetOf(a, b);
}
