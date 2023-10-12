import type { AttrBoxNode } from '../../src/util/types';


export const singleNode: AttrBoxNode = {
  type: 'attrbox',
  data: {
    items: {
      'attrtype': [
        {
          type: 'string',
          value: 'string',
          string: 'string',
        },
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
    },
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
        },
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [
            {
              type: 'string',
              data: {
                hName: 'span',
                hProperties: {
                  className: ['attr', 'string', 'attrtype'],
                },
              },
              children: [{
                type: 'text',
                value: 'string',
              }],
            }
          ],
        },
      ],
      data: { hName: 'dl' },
    },
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
        },
        {
          type: 'string',
          string: 'string-b',
          value: 'string-b',
        },
        {
          type: 'string',
          string: 'string-c',
          value: 'string-c',
        },
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
    },
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
        },
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [
            {
              type: 'string',
              data: {
                hName: 'span',
                hProperties: {
                  className: ['attr', 'string', 'attrtype'],
                },
              },
              children: [{
                type: 'text',
                value: 'string-a',
              }],
            }
          ],
        },
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [
            {
              type: 'string',
              data: {
                hName: 'span',
                hProperties: {
                  className: ['attr', 'string', 'attrtype'],
                },
              },
              children: [{
                type: 'text',
                value: 'string-b',
              }],
            }
          ],
        },
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [
            {
              type: 'string',
              data: {
                hName: 'span',
                hProperties: {
                  className: ['attr', 'string', 'attrtype'],
                },
              },
              children: [{
                type: 'text',
                value: 'string-c',
              }],
            }
          ],
        },
      ],
    },
  ],
};

export const mergedNodes: AttrBoxNode = {
  type: 'attrbox',
  data: {
    items: {
      'attrtype-1': [
        {
          type: 'string',
          string: 'string-a',
          value: 'string-a',
        },
        {
          type: 'string',
          string: 'string-b',
          value: 'string-b',
        },
      ],
      'attrtype-2': [
        {
          type: 'string',
          string: 'string-c',
          value: 'string-c',
        },
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
    },
    {
      type: 'attrbox-list',
      data: { hName: 'dl' },
      children: [
        {
          type: 'attr-key',
          data: { hName: 'dt' },
          children: [{
            type: 'text',
            value: 'attrtype-1',
          }],
        },
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [
            {
              type: 'string',
              data: {
                hName: 'span',
                hProperties: {
                  className: ['attr', 'string', 'attrtype-1'],
                },
              },
              children: [{
                type: 'text',
                value: 'string-a',
              }],
            }
          ],
        },
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [
            {
              type: 'string',
              data: {
                hName: 'span',
                hProperties: {
                  className: ['attr', 'string', 'attrtype-1'],
                },
              },
              children: [{
                type: 'text',
                value: 'string-b',
              }],
            }
          ],
        },
        {
          type: 'attr-key',
          data: { hName: 'dt' },
          children: [{
            type: 'text',
            value: 'attrtype-2',
          }],
        },
        {
          type: 'attr-val',
          data: { hName: 'dd' },
          children: [
            {
              type: 'string',
              data: {
                hName: 'span',
                hProperties: {
                  className: ['attr', 'string', 'attrtype-2'],
                },
              },
              children: [{
                type: 'text',
                value: 'string-c',
              }],
            }
          ],
        },
      ],
    },
  ],
};


export const attrBoxNode = {
  single: singleNode,
  list: listNodes,
  merged: mergedNodes,
};
