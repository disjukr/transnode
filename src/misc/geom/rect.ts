import { Point } from '.';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const emptyRect: Rect = { x: 0, y: 0, w: 0, h: 0 };

export function getTop({ x, y, w }: Rect): Point {
  return { x: x + (w / 2), y };
}

export function getLeft({ x, y, h }: Rect): Point {
  return { x, y: y + (h / 2) };
}

export function getRight({ x, y, w, h }: Rect): Point {
  return { x: x + w, y: y + (h / 2) };
}

export function getBottom({ x, y, w, h }: Rect): Point {
  return { x: x + (w / 2), y: y + h };
}
