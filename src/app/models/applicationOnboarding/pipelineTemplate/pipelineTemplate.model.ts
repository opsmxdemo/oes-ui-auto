
export class PipelineTemplate {
    defaultValue: string;
    description:string
    type: string;
    name:string;
    value:string;

    constructor(data: any) {
        data = data || {};
        this.defaultValue = data.defaultValue;
        this.description = data.description;
        this.type = data.type;
        this.name = data.name;
        this.value = data.value;
    }
}
