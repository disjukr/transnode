import { useRef, useState, useEffect } from 'react';

import { Rect, emptyRect } from './geom';

export default function useBoundingClientRectRef<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [rect, setRect] = useState<Rect>(emptyRect);
  // TODO: window resize
  useEffect(() => {
    const boundingClientRect = ref.current?.getBoundingClientRect();
    if (boundingClientRect) {
      const { x, y, width: w, height: h } = boundingClientRect;
      setRect({ x, y, w, h });
    }
  }, [ref.current]);
  return [ref, rect] as const;
}
