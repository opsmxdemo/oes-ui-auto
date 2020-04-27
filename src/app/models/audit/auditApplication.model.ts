export class AuditApplication {

    name: string;
    createdTime: string;
    cloudProviders: string;
    user: string;


    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.createdTime = data.createdTime;
        this.cloudProviders = data.cloudProviders;
        this.user = data.user;
    }
}
