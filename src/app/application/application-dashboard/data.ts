import { Edge, Node, ClusterNode } from '@swimlane/ngx-graph';

export const nodes: Node[] = [
  {
    id: 'a1',
    label: 'application',
    data: {
      customColor: '#58a5cc'
    }
  },
  {
    id: 'b1',
    label: 'multiservice_1',
    data: {
      customColor: '#dc3545'
    }
  }, {
    id: 'b2',
    label: 'multiservice_2',
    data: {
      customColor: '#dc3545'
    }
  }, {
    id: 'b3',
    label: 'multiservice_3',
    data: {
      customColor: '#dc3545'
    }
  }, 
  {
    id: 'b4',
    label: 'multiservice_4',
    data: {
      customColor: '#dc3545'
    }
  }
];

export const clusters: ClusterNode[] = [

]

export const links: Edge[] = [
  {
    id: 'a',
    source: 'a1',
    target: 'b2',
    label: 'is parent of'
  }, {
    id: 'b',
    source: 'a1',
    target: 'b1',
    label: 'custom label'
  }, {
    id: 'c',
    source: 'a1',
    target: 'b3',
    label: 'custom label'
  },
  {
    id: 'd',
    source: 'a1',
    target: 'b4',
    label: 'custom label'
  }
];