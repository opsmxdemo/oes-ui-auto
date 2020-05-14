
export class PolicyTable {
    policyName: string;
    status: number;

    constructor(data: any) {
        data = data || {};
        this.policyName = data.policyName;
        this.status = data.status;
       
    }
}
