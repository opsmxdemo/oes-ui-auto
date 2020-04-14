import { PipelineTemplate } from '../../pipelineTemplate/pipelineTemplate.model';

export class ServicePipeline {
    pipelineType: string;
    cloudAccount: string;
    dockerImageName: string;
    pipelineParameter:PipelineTemplate[];

    constructor(data: any) {
        data = data || {};
        this.pipelineType = data.pipelineType;
        this.pipelineParameter=[];
        data.pipelineParameter.forEach(element => {
            this.pipelineParameter.push(new PipelineTemplate(element));
        });
    }
}
