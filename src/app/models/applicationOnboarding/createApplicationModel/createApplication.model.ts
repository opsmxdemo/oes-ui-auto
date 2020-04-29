import { Service } from './servicesModel/serviceModel';
import { GroupPermission } from './groupPermissionModel/groupPermission.model';
import { Environment } from './environmentModel/environment.model';

export class CreateApplication {
    name: string;
    description: string;
    services:Service[];
    environments:Environment[];
    userGroups:GroupPermission[];

    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.description = data.description;
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
