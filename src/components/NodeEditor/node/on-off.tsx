import React from 'react';
import {
  BNC,
  BaseNode,
  BuiltInNodeComponents,
} from '.';

export const OnOffValueNode: BNC<'tn:on-off:value'> = ({ node }) => {
  return <BaseNode node={node}>
    <input type='checkbox' checked={node.data}/>
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
