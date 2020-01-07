import React, { useEffect } from 'react';

import {
  NodeId,
  SocketId,
  Point,
} from '../../state/document';
import { Rect } from '../../misc/geom';
import getRelativeOffset from '../../misc/getRelativeOffset';

export type SocketRects = {
  [nodeId in NodeId]: {
    [socketId in SocketId]: Rect;
  };
};

export interface SetSocketRects {
  (socketRects: SocketRects): void;
}

export function getSocketRect(
  socketRects: SocketRects,
  { nodeId, socketId }: Point,
): Rect {
  return socketRects[nodeId][socketId];
}

export function useUpdateSocketRect(
  nodesLayerRef: React.RefObject<HTMLDivElement>,
  setSocketRects: SetSocketRects,
) {
  useEffect(() => {
    if (!nodesLayerRef.current) return;
    const socketRects: SocketRects = {};
    const socketElements: HTMLDivElement[] = Array.from(
      nodesLayerRef.current.querySelectorAll('[data-tn-socket-id]'),
    );
    for (const socketElement of socketElements) {
      const nodeId = socketElement.dataset.tnNodeId!;
      const socketId = socketElement.dataset.tnSocketId!;
      socketRects[nodeId] = socketRects[nodeId] ?? {};
      socketRects[nodeId][socketId] = {
        ...getRelativeOffset(socketElement, nodesLayerRef.current),
        w: socketElement.offsetWidth,
        h: socketElement.offsetHeight,
      };
    }
    setSocketRects(socketRects);
  });
}
