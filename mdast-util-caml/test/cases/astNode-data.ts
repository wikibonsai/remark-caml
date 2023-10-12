import type {
  AttrBoxDataNode,
} from '../../src/util/types';


export const attrboxDataNodeSingle: AttrBoxDataNode = {
  type: 'attrbox-data',
  data: {
    items: {
      'attrtype': [
        {
          type: 'string',
          string: 'string',
          value: 'string',
        },
      ],
    },
  },
};

export const attrboxDataNodeList: AttrBoxDataNode = {
  type: 'attrbox-data',
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
  },
};

export const attrboxDataNodeMerge1A: AttrBoxDataNode = {
  type: 'attrbox-data',
  data: {
    items: {
      'attrtype-1': [
        {
          type: 'string',
          string: 'string-a',
          value: 'string-a',
        },
      ],
    },
  },
};

export const attrboxDataNodeMerge1B: AttrBoxDataNode = {
  type: 'attrbox-data',
  data: {
    items: {
      'attrtype-1': [
        {
          type: 'string',
          string: 'string-b',
          value: 'string-b',
        },
      ],
    },
  },
};

export const attrboxDataNodeMerge2C: AttrBoxDataNode = {
  type: 'attrbox-data',
  data: {
    items: {
      'attrtype-2': [
        {
          type: 'string',
          string: 'string-c',
          value: 'string-c',
        },
      ],
    },
  },
};


export const attrboxDataNode = {
  single: attrboxDataNodeSingle,
  list: attrboxDataNodeList,
  'merge-1a': attrboxDataNodeMerge1A,
  'merge-1b': attrboxDataNodeMerge1B,
  'merge-2c': attrboxDataNodeMerge2C,
};
