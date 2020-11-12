import { Service } from './servicesModel/serviceModel';
import { GroupPermission } from './groupPermissionModel/groupPermission.model';
import { Environment } from './environmentModel/environment.model';

export class SaveApplication {
    name: string;
    id:number;
    description: string;
    imageSource: string;
    emailId: string;
    lastUpdatedTimestamp: string;
   

    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.id = data.id;
        this.description = data.description;
        this.imageSource = data.imageSource;
        this.emailId = data.emailId;
        this.lastUpdatedTimestamp = data.lastUpdatedTimestamp;
    }
}
