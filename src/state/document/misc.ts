import {
  Stage,
} from '.';

export const emptyObject = {};
export const noop = () => {};

export const emptyStage: Stage = {
  nodes: [],
  edgeTable: {},
};

function ff() {
  return (Math.random() * 0x100 | 0).toString(16).padStart(2, '0');
}
export function makeRandomId() {
  return [...Array(5)].map(ff).join('');
}
