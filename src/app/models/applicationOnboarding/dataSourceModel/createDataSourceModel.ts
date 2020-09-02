
export class CreateDataSource {
    datasourceType: string;
    displayName:string;
    usage:string
    configurationFields:{};
    
    constructor(data: any) {
        data = data || {};
        this.datasourceType = data.datasourceType;
        this.displayName = data.displayName;
        this.usage = data.usage;
        this.configurationFields = data.configurationFields;
    }
}
