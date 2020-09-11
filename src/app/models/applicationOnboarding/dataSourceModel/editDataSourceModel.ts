
export class EditDataSource {
    datasourceType: string;
    name:string;
    configurationFields:{};
    id:number;
    
    constructor(data: any) {
        data = data || {};
        this.datasourceType = data.datasourceType;
        this.name = data.name;
        this.id = data.id;
        this.configurationFields = data.configurationFields;
    }
}
