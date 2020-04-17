
export class CloudAccount {
    name: string;
    type: string;
    providerVersion: string;

    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.type = data.type;
        this.providerVersion = data.providerVersion;
    }
}
