import { PipelineTemplate } from './pipelineTemplate.model';

export class Pipeline {
    name: string;
    variables:PipelineTemplate[];
    
    constructor(data: any) {
        data = data || {};
        this.name = data.name;
        this.variables=[];
        data.variables.forEach(element => {
            this.variables.push(new PipelineTemplate(element));
        });
        
    }
}
