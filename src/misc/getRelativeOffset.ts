import { Point } from './geom';

export default function getRelativeOffset(
  target: HTMLElement,
  ancestor: HTMLElement = document.documentElement,
): Point {
  let x = 0, y = 0;
  let curr = target;
  while (curr && curr !== ancestor) {
    x += curr.offsetLeft;
    y += curr.offsetTop;
    curr = curr.parentElement!;
  }
  return { x, y };
}
