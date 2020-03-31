import { Component, OnInit } from '@angular/core';
import { AuditService } from '../services/audit.service';
import { DatePipe} from '@angular/common';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.less'],
  providers: [DatePipe]
})
export class AuditComponent implements OnInit {

  constructor(public auditService: AuditService,
              private datePipe: DatePipe) { }

  parameters:any;
  allPipelines : any; 
  //time :any;
  
  ngOnInit(): void {
    //this.time = this.datePipe.transform(1585296026881);
    this.auditService.getAllPipelines(this.parameters).subscribe(
      (response) => {
        console.log(response);
        this.allPipelines = response;
      },
      (error) => {
        console.log(error);
      }
    )

    }

  

}

