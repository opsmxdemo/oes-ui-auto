import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-metric-analysis',
  templateUrl: './metric-analysis.component.html',
  styleUrls: ['./metric-analysis.component.less']
})
export class MetricAnalysisComponent implements OnInit {
  showGraph= false;
  size: string;
  showCommonInfo: string;
  constructor(private sharedServices: SharedService) { }

  ngOnInit(): void {
    this.size= "col-md-12";
  }


  getGraph(){
    this.showCommonInfo = 'hide';
  //  this.showGraph = true;
    this.size = "col-md-5";
  }

}
