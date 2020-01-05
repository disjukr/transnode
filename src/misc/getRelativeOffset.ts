export interface Offset {
  top: number;
  left: number;
}
export default function getRelativeOffset(
  target: HTMLElement,
  ancestor: HTMLElement = document.documentElement,
) {
  let top = 0;
  let left = 0;
  let curr = target;
  while (curr && curr !== ancestor) {
    top += curr.offsetTop;
    left += curr.offsetLeft;
    curr = curr.parentElement!;
  }
  return { top, left };
}
