
export class PipelineTemplate {
    value: string;
    id: number;
    label:string;

    constructor(data: any) {
        data = data || {};
        this.value = data.value;
        this.id = data.id;
        this.label = this.label;
    }
}
