
export class CreateDataSource {
    datasourceType: string;
    displayName:string;
    configurationFields:{};
    
    constructor(data: any) {
        data = data || {};
        this.datasourceType = data.datasourceType;
        this.displayName = data.displayName;
        this.configurationFields = data.configurationFields;
    }
}
