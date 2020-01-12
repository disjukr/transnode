import React, { useCallback } from 'react';

import {
  useUpdateTransnodeDocument,
  updateNode,
} from '../../../state/document';
import {
  BNC,
  BaseNode,
  BuiltInNodeComponents,
} from '.';

export const OnOffValueNode: BNC<'tn:on-off:value'> = ({ node }) => {
  const updateDocument = useUpdateTransnodeDocument();
  const toggle = useCallback(() => {
    updateNode(updateDocument, node, node => {
      node.data = !node.data;
    });
  }, [updateDocument, node]);
  return <BaseNode node={node}>
    <input
      type='checkbox'
      checked={node.data}
      onChange={toggle}
    />
  </BaseNode>;
};

export const OnOffViewNode: BNC<'tn:on-off:view'> = ({ node }) => {
  return <BaseNode node={node}>
    <strong>on off view node</strong>
  </BaseNode>;
};

export const nodeComponents: BuiltInNodeComponents = {
  'tn:on-off:value': OnOffValueNode,
  'tn:on-off:view': OnOffViewNode,
};
