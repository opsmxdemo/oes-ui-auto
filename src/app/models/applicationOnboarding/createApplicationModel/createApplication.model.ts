import { Service } from './servicesModel/serviceModel';
import { GroupPermission } from './groupPermissionModel/groupPermission.model';
import { Environment } from './environmentModel/environment.model';

export class CreateApplication {
    name: string;
    description: string;
    services:Service[];
    environment:Environment[];
    userGroups:GroupPermission[];

    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.description = data.description;
        this.services=[];
        data.services.forEach(element => {
            this.services.push(new Service(element));
        });
        this.environment=[];
        data.environment.forEach(element => {
            this.environment.push(new Environment(element));
        });
        this.userGroups=[];
        data.userGroups.forEach(element => {
            this.userGroups.push(new GroupPermission(element));
        });
    }
}
