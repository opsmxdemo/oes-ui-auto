import { PipelineTemplate } from '../../pipelineTemplate/pipelineTemplate.model';
import { CloudAccount } from './cloudAccount.model';

export class ServicePipeline {
    pipelinetemplate: string;
    cloudAccount: CloudAccount;
    dockerImageName: string;
    pipelineParameters:PipelineTemplate[];

    constructor(data: any) {
        data = data || {};
        this.pipelinetemplate = data.pipelinetemplate;
        this.cloudAccount = data.cloudAccount;
        this.dockerImageName = data.dockerImageName;
        this.pipelineParameters=[];
        data.pipelineParameters.forEach(element => {
            this.pipelineParameters.push(new PipelineTemplate(element));
        });
    }
}
