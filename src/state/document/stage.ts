import {
  Document,
  UpdateDocument,
  builtInCapsuleNodeInitTable,
  isBuiltInCapsuleId,
  CapsuleId,
  SocketId,
  Node,
  NodeId,
} from '.';
import {
  emptyObject,
  makeRandomId,
} from './misc';

export interface Stage {
  nodes: NodeId[];
  edgeTable: EdgeTable;
}

export interface Point {
  nodeId: NodeId;
  socketId: SocketId;
}

export interface Edge {
  input: Point;
  output: Point;
}

export type EdgeTable = {
  [inputNodeId in NodeId]: {
    [inputSocketId in SocketId]: Point;
  };
};

export function getStage(document: Document, capsuleId?: CapsuleId) {
  return capsuleId ? document.capsuleTable[capsuleId].stage : document.stage;
}

/**
 * @param capsuleId 해당 `capsuleId`를 갖는 캡슐의 `stage`에 `node`를 추가합니다.
 *                  인자를 생략할 경우 최상위 `stage`에 노드를 추가합니다.
*/
export function addNode(updateDocument: UpdateDocument, node: Omit<Node, 'id'>, capsuleId?: CapsuleId) {
  const id = (node as Node).id ?? makeRandomId();
  updateDocument(document => {
    const n = isBuiltInCapsuleId(node.capsuleId) ?
      { ...node, id, ...builtInCapsuleNodeInitTable[node.capsuleId] } :
      { ...node, id };
    document.nodeTable[id] = n;
    getStage(document, capsuleId).nodes.push(id);
  });
}

export function addEdge(updateDocument: UpdateDocument, output: Point, input: Point, capsuleId?: CapsuleId) {
  updateDocument(document => {
    const edgeTable = getStage(document, capsuleId).edgeTable;
    const sockets = edgeTable[input.nodeId] ?? emptyObject;
    sockets[input.socketId] = output;
    edgeTable[input.nodeId] = sockets;
  });
}

export function* getEdges(document: Document, capsuleId?: CapsuleId) {
  const edgeTable = getStage(document, capsuleId).edgeTable;
  for (const nodeId in edgeTable) {
    const sockets = edgeTable[nodeId] ?? emptyObject;
    for (const socketId in sockets) {
      const edge: Edge = {
        output: sockets[socketId],
        input: { nodeId, socketId },
      };
      yield edge;
    }
  }
}
