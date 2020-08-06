import { Edge, Node, ClusterNode } from '@swimlane/ngx-graph';

export const nodes: Node[] = [
  {
    id: 'a1',
    label: 'multiservice_1'
  }, {
    id: 'a2',
    label: 'multiservice_2'
  }, {
    id: 'a3',
    label: 'multiservice_3'
  }, 
  {
    id: 'a4',
    label: 'multiservice_4'
  },{
    id: 'b',
    label: 'QATestEPDIx'
  }
];

export const clusters: ClusterNode[] = [

]

export const links: Edge[] = [
  {
    id: 'a',
    source: 'a1',
    target: 'b',
    label: 'is parent of'
  }, {
    id: 'b',
    source: 'a2',
    target: 'b',
    label: 'custom label'
  }, {
    id: 'c',
    source: 'a3',
    target: 'b',
    label: 'custom label'
  },
  {
    id: 'd',
    source: 'a4',
    target: 'b',
    label: 'custom label'
  },
  {
    id: 'f',
    source: 'a3',
    target: 'a1',
    label: 'custom label'
  }
];