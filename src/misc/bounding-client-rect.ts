import { useRef, useState, useEffect } from 'react';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
const emptyRect: Rect = { x: 0, y: 0, width: 0, height: 0 };

export function useBoundingClientRectRef<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<Rect>(emptyRect);
  // TODO: window resize
  useEffect(() => {
    setRect(ref.current?.getBoundingClientRect() ?? emptyRect);
  }, [ref.current]);
  return [ref, rect] as const;
}
