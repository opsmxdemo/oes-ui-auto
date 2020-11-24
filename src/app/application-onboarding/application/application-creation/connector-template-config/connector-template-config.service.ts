import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfigService } from 'src/app/services/app-config.service';
import { NotificationService } from 'src/app/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectorTemplateConfigService {

  connectorTypes: any;
  connectorData: any = [];
  approvalGateId: any;
  $connecterData = new BehaviorSubject([]);
  addNewConnectorAllowed: boolean = false;

  constructor(
    public http: HttpClient,
    public toastr: NotificationService,
    private environment: AppConfigService
  ) { }

  init(approvalGateId: any) {
    this.approvalGateId = approvalGateId;
    this.connectorData = [];
    this.connectorTypes = [];
    return forkJoin([this.getConnectorTypes(), this.getAddedConnectors()]).pipe(
      map((resp: any) => {
        this.connectorTypes = resp[0];
        // this.$connecterData.next(this.connectorData);
        return resp;
      }));
  }

  getConnectorTypes() {
    return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/toolConnectors/configuredConnectorTypes');
  }

  getAddedConnectors() {
    return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates/' + this.approvalGateId + '/toolConnectors');
  }

  deleteConnector(visibilityToolConnectorId: any) {
    return this.http.delete<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates/' + this.approvalGateId + '/toolConnectors/' + visibilityToolConnectorId);
  }

  saveConnector(data: any) {
    return this.http.put<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/approvalGates/' + this.approvalGateId + '/toolConnectors/' + data.accountName + '/template', {
      templateId: data.templateName
    });
  }

  getAccountsForToolTypes(toolTypeId: any) {
    return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/toolConnectors/connectorTypes/' + toolTypeId);
  }

  getTemplatesForToolTypes(toolTypeId: any) {
    return this.http.get<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/toolConnectors/' + toolTypeId + '/templates');
  }

  getRemainingConnectors() {
    if(this.connectorData.length == 0) {
      return this.connectorTypes;
    }
    let remainingConnectors = Object.assign([], this.connectorTypes);
    
    for(let i = remainingConnectors.length; i >= 0; i--) {
      this.connectorData.forEach((data: any) => {
        if(remainingConnectors[i] == data.connectorType) {
          remainingConnectors.splice(i, 1);
        }
      });
    }
    if(remainingConnectors.length > 0) {
      this.addNewConnectorAllowed = true;
    } else {
      this.addNewConnectorAllowed = false;
    }
    return remainingConnectors;
  }

  getTemplateDetails(id) {
    return this.http.get<any>(`${this.environment.config.endPointUrl}visibilityservice/v1/visibilityToolTemplates/${id}`)
  }

  updateTemplate(data: any) {
    return this.http.put<any>(`${this.environment.config.endPointUrl}visibilityservice/v1/visibilityToolTemplates/${data.id}`, data)
  }

  saveTemplate(data) {
    return this.http.post<any>(this.environment.config.endPointUrl + 'visibilityservice/v1/visibilityToolTemplates', data)
  }

}
