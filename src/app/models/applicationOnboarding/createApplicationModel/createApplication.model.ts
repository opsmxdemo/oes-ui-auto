import { Service } from './servicesModel/serviceModel';
import { GroupPermission } from './groupPermissionModel/groupPermission.model';
import { Environment } from './environmentModel/environment.model';

export class CreateApplication {
    name: string;
    id:number;
    description: string;
    imageSource: string;
    emailId: string;
    lastUpdatedTimestamp: string;
    logTemplate: any;
    metricTemplate: any;
    services:Service[];
    environments:Environment[];
    userGroups:GroupPermission[];

    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.id = data.id;
        this.description = data.description;
        this.imageSource = data.imageSource;
        this.emailId = data.emailId;
        this.lastUpdatedTimestamp = data.lastUpdatedTimestamp;
        this.logTemplate = data.logTemplate;
        this.metricTemplate = data.metricTemplate;
        this.services=[];
        data.services.forEach(element => {
            this.services.push(new Service(element));
        });
        this.environments=[];
        data.environment.forEach(element => {
            this.environments.push(new Environment(element));
        });
        this.userGroups=[];
        data.userGroups.forEach(element => {
            this.userGroups.push(new GroupPermission(element));
        });
    }
}
