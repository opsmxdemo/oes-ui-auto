
export class Visibility {
    connectorType: string;
    accountName: string;
    templateName: number; 

    constructor(data: any) {
        data = data || {};
        this.connectorType = data.connectorType;
        this.accountName = data.accountName;
        this.templateName = data.templateName;
    }
}
