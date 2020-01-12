import {
  Value,
} from './document';

export interface ComputedState {
  computedValueTable: ComputedValueTable;
}

export interface ComputedValueTable {
  [nodeId: string]: {
    [outputSocketId: string]: ComputedValue;
  };
}

export const initialComputedValue: ComputedValue = { phase: 'yet' };

export type ComputedValue =
  | { phase: 'yet' }
  | { phase: 'done', value: Value }
  | { phase: 'tainted', value: Value }
  | { phase: 'error' }
;
