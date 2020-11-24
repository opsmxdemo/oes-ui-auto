import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ConnectorTemplateConfigService } from './connector-template-config.service';

@Component({
  selector: 'app-connector-template-config',
  templateUrl: './connector-template-config.component.html',
  styleUrls: ['./connector-template-config.component.less']
})
export class ConnectorTemplateConfigComponent implements OnInit {

  @Input() approvalGateId: any = '';

  hideVisibilityPlusIcon: any = true;
  addNewConnectorAllowed: any = false;
  newConnectorData: any = {
    accountName: "",
    connectorType: "",
    templateId: 0,
    templateName: "",
    visibilityToolConnectorId: 0,
    status: 'new',
    editMode: true
  };

  constructor(public service: ConnectorTemplateConfigService, private cd: ChangeDetectorRef) { }

  // Initiate the Connector Type section
  ngOnInit(): void {
    this.service.init(this.approvalGateId).subscribe((resp: any) => {
      if(resp[1] && resp[1].length > 0) {
        resp[1].forEach((data:any) => {
          data.status = 'edit';
          this.addNewConnector(data)
        });
      } else {
        this.addNewConnector('');
      }
      this.service.getRemainingConnectors();
    });
  }

  // Add a new Connector
  addNewConnector(data: any, fromUser = false) {
    if(!data) {
      data = Object.assign({}, this.newConnectorData);
    }
    this.service.connectorData.push(data);
    
    this.rowEdited([this.service.connectorData.length - 1, fromUser || data.status == 'new']);
    this.cd.detectChanges();
  }

  rowEdited(obj: any) {
    let index = obj[0];
    if(obj[1]) {
      this.service.connectorData.forEach((data, i) => {
        if(index != i) {
          data.editMode = false;
        }
      });
      this.hideVisibilityPlusIcon = true;
      this.service.connectorData[index].editMode = true;
    }
    else {
      this.service.connectorData[index].editMode = false;
      this.hideVisibilityPlusIcon = false;
    }
    this.service.getRemainingConnectors();
    this.service.$connecterData.next(this.service.connectorData);
  }

}