import { Component, OnInit, Input } from '@angular/core';
import { Layout,Node, Edge , ClusterNode} from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';

interface IHierarchical {
  nodes: Node[],
  links: Edge[]
}

@Component({
  selector: 'app-network-chart',
  templateUrl: './network-chart.component.html',
  styleUrls: ['./network-chart.component.less']
})
export class NetworkChartComponent implements OnInit {

  @Input() nodes: any;
  @Input() clusters: any;
  @Input() links: any;

  @Input() view: any[];
  //@Input() chartProperty:ChartOptions;
 

layoutSettings = {
  orientation: 'TB',
  nodePadding: 15
};
//d3ForceDirected
layout: String | Layout = 'dagre';
 
 hierarchical: IHierarchical;

 // UI config
 draggingEnabled: boolean = false;
 panningEnabled = true;
 zoomEnabled = true;
 zoomSpeed = 0.1;
 minZoomLevel = 0.1;
 maxZoomLevel = 2.0;
 panOnZoom = true;
;
 autoZoom: boolean = true;
 autoCenter: boolean = true; 
 center$: Subject<boolean> = new Subject();
 zoomToFit$: Subject<boolean> = new Subject();
 
  
  constructor() { }

  ngOnInit(): void {
  }

}
