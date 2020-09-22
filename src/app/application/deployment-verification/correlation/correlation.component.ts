import { Component, OnInit, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';           // for ngx bootstrap
import {FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-correlation',
  templateUrl: './correlation.component.html',
  styleUrls: ['./correlation.component.less']
})
export class CorrelationComponent implements OnInit,OnChanges {
  @Input() canaryId: any[];
  @Input() serviceId: any[];
  @Input() serviceList: any[];
  
  config:any={
    width:"100%",
    height:400
  }
  modalRef: BsModalRef;                                                      // for modal
  dataSource:any=[]
  dummydata:any;
  showPopUpForLogs:boolean=false;                                           // for showing popup when clicked on bar chart
  zone: any;
  clusterLogs:any;
  addLogs : FormGroup;

  addnewlogdummyJson:any = [{
    "serviceId": 54,
    "startTime": 1595516400000,
    "endTime": 1595518200000,
    "clusterData": [{
        "clusterId": 1,
        "timestamps": [
          "2020-07-23T15:04:50+00:00",
          "2020-07-23T15:05:04+00:00",
          "2020-07-23T15:05:06+00:00",
          "2020-07-23T15:05:24+00:00",
          "2020-07-23T15:05:25+00:00",
          "2020-07-23T15:05:54+00:00",
          "2020-07-23T15:05:40+00:00",
          "2020-07-23T15:05:50+00:00",
          "2020-07-23T15:10:11+00:00",
          "2020-07-23T15:10:27+00:00",
          "2020-07-23T15:10:27+00:00",
          "2020-07-23T15:10:52+00:00",
          "2020-07-23T15:11:06+00:00",
          "2020-07-23T15:11:07+00:00",
          "2020-07-23T15:12:48+00:00",
          "2020-07-23T15:13:05+00:00",
          "2020-07-23T15:04:51+00:00",
          "2020-07-23T15:05:40+00:00",
          "2020-07-23T15:05:53+00:00",
          "2020-07-23T15:05:58+00:00",
          "2020-07-23T15:06:06+00:00",
          "2020-07-23T15:10:28+00:00",
          "2020-07-23T15:10:28+00:00",
          "2020-07-23T15:10:39+00:00",
          "2020-07-23T15:10:39+00:00",
          "2020-07-23T15:10:40+00:00",
          "2020-07-23T15:12:50+00:00",
          "2020-07-23T15:12:55+00:00",
          "2020-07-23T15:05:26+00:00",
          "2020-07-23T15:05:38+00:00",
          "2020-07-23T15:05:56+00:00",
          "2020-07-23T15:12:54+00:00",
          "2020-07-23T15:04:49+00:00",
          "2020-07-23T15:05:27+00:00",
          "2020-07-23T15:05:39+00:00",
          "2020-07-23T15:05:55+00:00",
          "2020-07-23T15:12:59+00:00",
          "2020-07-23T15:04:52+00:00",
          "2020-07-23T15:05:33+00:00",
          "2020-07-23T15:05:44+00:00",
          "2020-07-23T15:05:52+00:00",
          "2020-07-23T15:06:06+00:00",
          "2020-07-23T15:05:16+00:00",
          "2020-07-23T15:10:40+00:00",
          "2020-07-23T15:10:40+00:00",
          "2020-07-23T15:10:41+00:00",
          "2020-07-23T15:13:00+00:00",
          "2020-07-23T15:04:53+00:00",
          "2020-07-23T15:05:32+00:00",
          "2020-07-23T15:05:58+00:00",
          "2020-07-23T15:10:29+00:00",
          "2020-07-23T15:10:30+00:00",
          "2020-07-23T15:10:30+00:00",
          "2020-07-23T15:10:37+00:00",
          "2020-07-23T15:10:37+00:00",
          "2020-07-23T15:10:38+00:00",
          "2020-07-23T15:12:51+00:00",
          "2020-07-23T15:13:03+00:00",
          "2020-07-23T15:04:53+00:00",
          "2020-07-23T15:05:22+00:00",
          "2020-07-23T15:05:31+00:00",
          "2020-07-23T15:05:41+00:00",
          "2020-07-23T15:05:59+00:00",
          "2020-07-23T15:10:29+00:00",
          "2020-07-23T15:10:29+00:00",
          "2020-07-23T15:10:29+00:00",
          "2020-07-23T15:10:38+00:00",
          "2020-07-23T15:10:39+00:00",
          "2020-07-23T15:10:39+00:00",
          "2020-07-23T15:10:58+00:00",
          "2020-07-23T15:12:52+00:00",
          "2020-07-23T15:12:58+00:00",
          "2020-07-23T15:04:47+00:00",
          "2020-07-23T15:05:15+00:00",
          "2020-07-23T15:05:34+00:00",
          "2020-07-23T15:05:45+00:00",
          "2020-07-23T15:05:51+00:00",
          "2020-07-23T15:06:00+00:00",
          "2020-07-23T15:10:10+00:00",
          "2020-07-23T15:10:18+00:00",
          "2020-07-23T15:10:26+00:00",
          "2020-07-23T15:10:26+00:00",
          "2020-07-23T15:10:41+00:00",
          "2020-07-23T15:10:41+00:00",
          "2020-07-23T15:10:42+00:00",
          "2020-07-23T15:10:49+00:00",
          "2020-07-23T15:13:08+00:00",
          "2020-07-23T15:12:56+00:00",
          "2020-07-23T15:04:48+00:00",
          "2020-07-23T15:05:28+00:00",
          "2020-07-23T15:05:39+00:00",
          "2020-07-23T15:05:50+00:00",
          "2020-07-23T15:06:04+00:00",
          "2020-07-23T15:10:15+00:00",
          "2020-07-23T15:10:52+00:00",
          "2020-07-23T15:13:07+00:00",
          "2020-07-23T15:04:51+00:00",
          "2020-07-23T15:05:07+00:00",
          "2020-07-23T15:05:54+00:00",
          "2020-07-23T15:05:57+00:00"
        ]
      },
      {
        "clusterId": 3,
        "timestamps": [
          "2020-07-23T15:13:01+00:00",
          "2020-07-23T15:04:56+00:00",
          "2020-07-23T15:05:43+00:00",
          "2020-07-23T15:05:17+00:00",
          "2020-07-23T15:10:36+00:00",
          "2020-07-23T15:10:36+00:00",
          "2020-07-23T15:10:37+00:00",
          "2020-07-23T15:10:37+00:00",
          "2020-07-23T15:10:57+00:00",
          "2020-07-23T15:12:42+00:00"
        ]
      }
    ]
  }
]

  dummydataForTimeAnalysisComponent:any=[{
      "serviceId": 54,
      "startTime": 1595516400000,
      "endTime": 1595518200000,
      "clusterData": [{
          "clusterId": 1,
          "timestamps": [
            "2020-07-23T15:04:50+00:00",
            "2020-07-23T15:05:04+00:00",
            "2020-07-23T15:05:06+00:00",
            "2020-07-23T15:05:24+00:00",
            "2020-07-23T15:05:25+00:00",
            "2020-07-23T15:05:54+00:00",
            "2020-07-23T15:05:40+00:00",
            "2020-07-23T15:05:50+00:00",
            "2020-07-23T15:10:11+00:00",
            "2020-07-23T15:10:27+00:00",
            "2020-07-23T15:10:27+00:00",
            "2020-07-23T15:10:52+00:00",
            "2020-07-23T15:11:06+00:00",
            "2020-07-23T15:11:07+00:00",
            "2020-07-23T15:12:48+00:00",
            "2020-07-23T15:13:05+00:00",
            "2020-07-23T15:04:51+00:00",
            "2020-07-23T15:05:40+00:00",
            "2020-07-23T15:05:53+00:00",
            "2020-07-23T15:05:58+00:00",
            "2020-07-23T15:06:06+00:00",
            "2020-07-23T15:10:28+00:00",
            "2020-07-23T15:10:28+00:00",
            "2020-07-23T15:10:39+00:00",
            "2020-07-23T15:10:39+00:00",
            "2020-07-23T15:10:40+00:00",
            "2020-07-23T15:12:50+00:00",
            "2020-07-23T15:12:55+00:00",
            "2020-07-23T15:05:26+00:00",
            "2020-07-23T15:05:38+00:00",
            "2020-07-23T15:05:56+00:00",
            "2020-07-23T15:12:54+00:00",
            "2020-07-23T15:04:49+00:00",
            "2020-07-23T15:05:27+00:00",
            "2020-07-23T15:05:39+00:00",
            "2020-07-23T15:05:55+00:00",
            "2020-07-23T15:12:59+00:00",
            "2020-07-23T15:04:52+00:00",
            "2020-07-23T15:05:33+00:00",
            "2020-07-23T15:05:44+00:00",
            "2020-07-23T15:05:52+00:00",
            "2020-07-23T15:06:06+00:00",
            "2020-07-23T15:05:16+00:00",
            "2020-07-23T15:10:40+00:00",
            "2020-07-23T15:10:40+00:00",
            "2020-07-23T15:10:41+00:00",
            "2020-07-23T15:13:00+00:00",
            "2020-07-23T15:04:53+00:00",
            "2020-07-23T15:05:32+00:00",
            "2020-07-23T15:05:58+00:00",
            "2020-07-23T15:10:29+00:00",
            "2020-07-23T15:10:30+00:00",
            "2020-07-23T15:10:30+00:00",
            "2020-07-23T15:10:37+00:00",
            "2020-07-23T15:10:37+00:00",
            "2020-07-23T15:10:38+00:00",
            "2020-07-23T15:12:51+00:00",
            "2020-07-23T15:13:03+00:00",
            "2020-07-23T15:04:53+00:00",
            "2020-07-23T15:05:22+00:00",
            "2020-07-23T15:05:31+00:00",
            "2020-07-23T15:05:41+00:00",
            "2020-07-23T15:05:59+00:00",
            "2020-07-23T15:10:29+00:00",
            "2020-07-23T15:10:29+00:00",
            "2020-07-23T15:10:29+00:00",
            "2020-07-23T15:10:38+00:00",
            "2020-07-23T15:10:39+00:00",
            "2020-07-23T15:10:39+00:00",
            "2020-07-23T15:10:58+00:00",
            "2020-07-23T15:12:52+00:00",
            "2020-07-23T15:12:58+00:00",
            "2020-07-23T15:04:47+00:00",
            "2020-07-23T15:05:15+00:00",
            "2020-07-23T15:05:34+00:00",
            "2020-07-23T15:05:45+00:00",
            "2020-07-23T15:05:51+00:00",
            "2020-07-23T15:06:00+00:00",
            "2020-07-23T15:10:10+00:00",
            "2020-07-23T15:10:18+00:00",
            "2020-07-23T15:10:26+00:00",
            "2020-07-23T15:10:26+00:00",
            "2020-07-23T15:10:41+00:00",
            "2020-07-23T15:10:41+00:00",
            "2020-07-23T15:10:42+00:00",
            "2020-07-23T15:10:49+00:00",
            "2020-07-23T15:13:08+00:00",
            "2020-07-23T15:12:56+00:00",
            "2020-07-23T15:04:48+00:00",
            "2020-07-23T15:05:28+00:00",
            "2020-07-23T15:05:39+00:00",
            "2020-07-23T15:05:50+00:00",
            "2020-07-23T15:06:04+00:00",
            "2020-07-23T15:10:15+00:00",
            "2020-07-23T15:10:52+00:00",
            "2020-07-23T15:13:07+00:00",
            "2020-07-23T15:04:51+00:00",
            "2020-07-23T15:05:07+00:00",
            "2020-07-23T15:05:54+00:00",
            "2020-07-23T15:05:57+00:00"
          ]
        },
        {
          "clusterId": 3,
          "timestamps": [
            "2020-07-23T15:13:01+00:00",
            "2020-07-23T15:04:56+00:00",
            "2020-07-23T15:05:43+00:00",
            "2020-07-23T15:05:17+00:00",
            "2020-07-23T15:10:36+00:00",
            "2020-07-23T15:10:36+00:00",
            "2020-07-23T15:10:37+00:00",
            "2020-07-23T15:10:37+00:00",
            "2020-07-23T15:10:57+00:00",
            "2020-07-23T15:12:42+00:00"
          ]
        }
      ]
    },
    {
      "serviceId": 54,
      "startTime": 1595516400000,
      "endTime": 1595518200000,
      "clusterData": [{
        "clusterId": 5,
        "timestamps": [
          "2020-07-23T15:05:13+00:00",
          "2020-07-23T15:05:36+00:00",
          "2020-07-23T15:06:02+00:00",
          "2020-07-23T15:10:12+00:00",
          "2020-07-23T15:10:14+00:00",
          "2020-07-23T15:10:23+00:00",
          "2020-07-23T15:10:23+00:00",
          "2020-07-23T15:10:24+00:00",
          "2020-07-23T15:10:47+00:00",
          "2020-07-23T15:10:53+00:00",
          "2020-07-23T15:12:26+00:00",
          "2020-07-23T15:12:33+00:00",
          "2020-07-23T15:12:36+00:00"
        ]
      }]
    }
  ]
 
  
    
  
  
  dummydataForPopup:any={
    "clusterData": "Cluster information"
  }
  dummydataForAddLogsPopUp = [{
		"clusterId": 1,
		"topic": "CRITICAL ERROR",
		"description": "memory execeded java.lang.OutOfMemoryError: GC overhead limit"
	},
	{
		"clusterId": 2,
		"topic": "WARN",
		"description": "PostgreSQL: 01007 privilege_not_granted DOCUMENT 2020-07-23T15:05:00+00:00 PostgreSQL:"
	},
	{
		"clusterId": 3,
		"topic": "WARN",
		"description": "Garbage collection takes too long"
	},
	{
		"clusterId": 5,
		"topic": "WARN",
		"description": "Response is empty string. No"
	},
	{
		"clusterId": 8,
		"topic": "ERROR",
		"description": "FATAL rest call response is"
	},
	{
		"clusterId": 14,
		"topic": "WARN",
		"description": "Future versions will require Java"
	},
	{
		"clusterId": 15,
		"topic": "WARN",
		"description": "PostgreSQL: 01000 warning DOCUMENT 2020-07-23T15:05:01+00:00 PostgreSQL:"
	},
	{
		"clusterId": 16,
		"topic": "ERROR",
		"description": "PostgreSQL: 08001 sqlclient_unable_to_establish_sqlconnection DOCUMENT 2020-07-23T15:05:03+00:00 PostgreSQL:"
	},
	{
		"clusterId": 18,
		"topic": "ERROR",
		"description": "Assert : userName is missing."
	},
	{
		"clusterId": 24,
		"topic": "ERROR",
		"description": "API WarningLogs is deprecated. It"
	},
	{
		"clusterId": 26,
		"topic": "WARN",
		"description": "PostgreSQL: 0100C dynamic_result_sets_returned DOCUMENT 2020-07-23T15:05:19+00:00 PostgreSQL:"
	},
	{
		"clusterId": 27,
		"topic": "ERROR",
		"description": "PostgreSQL: 02000 no_data DOCUMENT 2020-07-23T15:10:31+00:00 PostgreSQL:"
	},
	{
		"clusterId": 28,
		"topic": "ERROR",
		"description": "PostgreSQL: 08006 connection_failure DOCUMENT 2020-07-23T15:05:56+00:00 PostgreSQL:"
	},
	{
		"clusterId": 30,
		"topic": "ERROR",
		"description": "PostgreSQL: 08000 connection_exception DOCUMENT 2020-07-23T15:05:02+00:00 PostgreSQL:"
	},
	{
		"clusterId": 31,
		"topic": "WARN",
		"description": "2020-07-23T15:10:34+00:00 PostgreSQL: 01008 implicit_zero_bit_padding DOCUMENT "
	}
]


  
  // dataSourceArray:any;
  // dataSourceAreaChart:any;                                                  // for datasource of Area chart

  // obj1:any=[{data1:"1"},{data1:"2"},{data1:"3"}]
  constructor(private modalService: BsModalService,private _formBuilder: FormBuilder) { }

  // for opening the modal 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  
  
  ngOnChanges(changes: SimpleChanges): void {
  //   this.dataSourceAreaChart= [{
  //     chart: {
  //       caption: "Yearly sales of iPhone",
  //   yaxisname: "Number of units sold",
  //   subcaption: "2007-2016",
  //   legendposition: "Right",
  //   drawanchors: "0",
  //   showvalues: "0",
  //   plottooltext: "<b>$dataValue</b> iPhones sold in $label",
  //   theme: "fusion"
  //     },
  //     data: [{
  //       label: "2007",
  //       value: "1380000"
  //     },
  //     {
  //       label: "2008",
  //       value: "1450000"
  //     },
  //     {
  //       label: "2009",
  //       value: "1610000"
  //     },
  //     {
  //       label: "2010",
  //       value: "1540000"
  //     },
  //     {
  //       label: "2011",
  //       value: "1480000"
  //     },
  //     {
  //       label: "2012",
  //       value: "1573000"
  //     },
  //     {
  //       label: "2013",
  //       value: "2232000"
  //     },
  //     {
  //       label: "2014",
  //       value: "2476000"
  //     },
  //     {
  //       label: "2015",
  //       value: "2832000"
  //     },
  //     {
  //       label: "2016",
  //       value: "3808000"
  //     }]
  //   },
  //   {
  //     chart: {
  //       caption: "Yearly sales of iPhone",
  //   yaxisname: "Number of units sold",
  //   subcaption: "2007-2016",
  //   legendposition: "Right",
  //   drawanchors: "0",
  //   showvalues: "0",
  //   plottooltext: "<b>$dataValue</b> iPhones sold in $label",
  //   theme: "fusion"
  //     },
  //     data: [{
  //       label: "2007",
  //       value: "1380000"
  //     },
  //     {
  //       label: "2008",
  //       value: "1450000"
  //     },
  //     {
  //       label: "2009",
  //       value: "1610000"
  //     },
  //     {
  //       label: "2010",
  //       value: "1540000"
  //     },
  //     {
  //       label: "2011",
  //       value: "1480000"
  //     },
  //     {
  //       label: "2012",
  //       value: "1573000"
  //     },
  //     {
  //       label: "2013",
  //       value: "2232000"
  //     },
  //     {
  //       label: "2014",
  //       value: "2476000"
  //     },
  //     {
  //       label: "2015",
  //       value: "2832000"
  //     },
  //     {
  //       label: "2016",
  //       value: "3808000"
  //     }]
  //   },
  //   {
  //     chart: {
  //       caption: "Yearly sales of iPhone",
  //   yaxisname: "Number of units sold",
  //   subcaption: "2007-2016",
  //   legendposition: "Right",
  //   drawanchors: "0",
  //   showvalues: "0",
  //   plottooltext: "<b>$dataValue</b> iPhones sold in $label",
  //   theme: "fusion"
  //     },
  //     data: [{
  //       label: "2007",
  //       value: "1380000"
  //     },
  //     {
  //       label: "2008",
  //       value: "1450000"
  //     },
  //     {
  //       label: "2009",
  //       value: "1610000"
  //     },
  //     {
  //       label: "2010",
  //       value: "1540000"
  //     },
  //     {
  //       label: "2011",
  //       value: "1480000"
  //     },
  //     {
  //       label: "2012",
  //       value: "1573000"
  //     },
  //     {
  //       label: "2013",
  //       value: "2232000"
  //     },
  //     {
  //       label: "2014",
  //       value: "2476000"
  //     },
  //     {
  //       label: "2015",
  //       value: "2832000"
  //     },
  //     {
  //       label: "2016",
  //       value: "3808000"
  //     }]
  //   }
  // ];
  //console.log(this.serviceList);
  this.dataSource=[]
  this.dummydata={
    "analysisData":[{
    "clusterId":1,
    "data": [
        {
          "label": 1599628139000,
          "value": 1
        },
        {
          "label": 1599628239000,
          "value": 2
        },
        {
          "label": 1599628339000,
          "value": 0
        },
       {
          "label": 1599628439000,
          "value": 4
        },
        {
          "label": 1599628539000,
          "value": 5
        },
        {
          "label": 1599628639000,
          "value": 6
        },
        {
          "label": 1599628739000,
          "value": 7
        },
        {
          "label": 1599628839000,
          "value": 8
        },
        {
          "label": 1599628939000,
          "value": 9
        }]
    },
    {
    "clusterId":2,
    "data": [
        {
          "label": 1599628139000,
          "value": 9
        },
        {
          "label": 1599628239000,
          "value": 8
        },
        {
          "label": 1599628339000,
          "value": 7
        },
       {
          "label": 1599628439000,
          "value": 6
        },
        {
          "label": 1599628539000,
          "value": 5
        },
        {
          "label": 1599628639000,
          "value": 4
        },
        {
          "label": 1599628739000,
          "value": 0
        },
        {
          "label": 1599628839000,
          "value": 2
        },
        {
          "label": 1599628939000,
          "value": 1
        }]
    }]

    
    }

    // making json for bar chart which shows time analysis graph
    for(let i=0;i<this.dummydata.analysisData.length;i++)
    {
    let obj =  {
      chart:{
      "numDivlines": "2",
      xaxisname: "Time",
      yaxisname: "Repetition",
      theme: "fusion"
    },
    data:[]
    }
    this.dataSource.push(obj)
    for(let j=0;j<this.dummydata.analysisData[i].data.length;j++)
    {
      var time = new Date(this.dummydata.analysisData[i].data[j].label).getHours()+ ":" + new Date(this.dummydata.analysisData[i].data[j].label).getMinutes()
      var obj1 = {
        label:time,
        value:this.dummydata.analysisData[i].data[j].value,
        tooltext:new Date(this.dummydata.analysisData[i].data[j].label).toLocaleString()+'<br><br>'+"Repetition: &nbsp;"+this.dummydata.analysisData[i].data[j].value
      }
      this.dataSource[i]['data'].push(obj1)
    }
  }

  
    
    
    
    
  
    
  }

  ngOnInit(): void {
    

      this.addLogs = new FormGroup({
        services: new FormArray([
          new FormGroup({
            name : new FormControl(),
            serviceId : new FormControl(),
            clusters: new FormArray([
              new FormGroup({
                name: new FormControl(),                      
                clusterId : new FormControl(),
                descrition : new FormControl(),
                isSelected : new FormControl(),
              })
            ])
          })
        ])
      });

    //  [{serviceId:2,clusterId;[1,2]},{serviceId:1,clusterId;[3,4]}]
        
    
  }

  // plotRollOver($event) {
    
  // }

  ClosePopUp(){
    this.showPopUpForLogs=false;
  }
  getOpen(event){
    this.showPopUpForLogs=true;
    this.clusterLogs = this.dummydataForPopup['clusterData']
  }
  //getting data from child when submit from add log is clicked.
  onSubmitPostData(addlogdata){
    this.modalService.hide()
    addlogdata.riskAnalysisId=this.canaryId
    for(let i =0;i<this.addnewlogdummyJson.length;i++)
    {
      this.dummydataForTimeAnalysisComponent.push(this.addnewlogdummyJson[i])
    }
    
    
  }
  
  
}
