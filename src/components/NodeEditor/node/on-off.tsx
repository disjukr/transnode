import React from 'react';
import {
  BNC,
  BaseNode,
  BuiltInNodeComponents,
} from '.';

export const OnOffValueNode: BNC<'tn:value:on-off'> = ({ node }) => {
  return <BaseNode node={node}>
    <input type='checkbox' checked={node.data}/>
  </BaseNode>;
};

export const OnOffViewNode: BNC<'tn:view:on-off'> = ({ node }) => {
  return <BaseNode node={node}>
    <strong>on off view node</strong>
  </BaseNode>;
};

export const nodeComponents: BuiltInNodeComponents = {
  'tn:value:on-off': OnOffValueNode,
  'tn:view:on-off': OnOffViewNode,
};
