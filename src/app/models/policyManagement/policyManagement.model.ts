export class PolicyManagement {
    endpoint: string;
    endpointType: string;
    name: string;
    description: string;
    status: string;
    rego: string;
    type:string;

    constructor(data: any) {
        data = data || {};
        this.endpoint = data.endpoint;
        this.endpointType = data.endpointType;
        this.name = data.name;
        this.description = data.description;
        this.rego = data.rego;
        this.status = data.status;
        this.type = data.type;
    }
}
