import type { AttrDataPrimitive } from 'micromark-extension-caml';
import type {
  AttrBoxNode,
  AttrBoxTitleNode,
  AttrBoxListNode,
  AttrKeyNode,
  AttrValNode,
} from '../../src/util/types';


export const singleNode: AttrBoxNode = {
  type: 'attrbox',
  data: {
    items: {
      'attrtype': [{
        type: 'string',
        value: 'string',
        string: 'string',
      } as AttrDataPrimitive,],
    },
    hName: 'aside',
    hProperties: {
      className: ['attrbox'],
    },
  },
  children: [
    {
      type: 'attrbox-title',
      data: {
        hName: 'span',
        hProperties: {
          className: ['attrbox-title'],
        },
      }
    } as AttrBoxTitleNode,
    {
      type: 'attrbox-list',
      children: [
        {
          type: 'attr-key',
          data: { hName: 'dt' },
          children: [{
            type: 'text',
            value: 'attrtype',
          }],
        } as AttrKeyNode,
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [{
            type: 'text',
            value: 'string',
          }],
        } as AttrValNode,
      ],
      data: { hName: 'dl' },
    } as AttrBoxListNode,
  ],
};

export const listNodes: AttrBoxNode = {
  type: 'attrbox',
  data: {
    items: {
      'attrtype': [
        {
          type: 'string',
          string: 'string-a',
          value: 'string-a',
        } as AttrDataPrimitive,
        {
          type: 'string',
          string: 'string-b',
          value: 'string-b',
        } as AttrDataPrimitive,
        {
          type: 'string',
          string: 'string-c',
          value: 'string-c',
        } as AttrDataPrimitive,
      ],
    },
    hName: 'aside',
    hProperties: {
      className: ['attrbox'],
    },
  },
  children: [
    {
      type: 'attrbox-title',
      data: {
        hName: 'span',
        hProperties: {
          className: ['attrbox-title'],
        },
      },
      children: [{
        type: 'text',
        value: 'Attributes',
      }],
    } as AttrBoxTitleNode,
    {
      type: 'attrbox-list',
      data: { hName: 'dl' },
      children: [
        {
          type: 'attr-key',
          data: { hName: 'dt' },
          children: [{
            type: 'text',
            value: 'attrtype',
          }],
        } as AttrKeyNode,
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [{
            type: 'text',
            value: 'string-a',
          }],
        },
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [{
            type: 'text',
            value: 'string-b',
          }],
        } as AttrValNode,
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [{
            type: 'text',
            value: 'string-c',
          }],
        } as AttrValNode,
      ],
    } as AttrBoxListNode,
  ],
};

export const nodeKinds = {
  'single': singleNode,
  'list': listNodes,
};
