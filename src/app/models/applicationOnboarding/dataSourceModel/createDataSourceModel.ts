
export class CreateDataSource {
    datasourceType: string;
    name:string;
    configurationFields:{};
    
    constructor(data: any) {
        data = data || {};
        this.datasourceType = data.datasourceType;
        this.name = data.name;
        this.configurationFields = data.configurationFields;
    }
}
