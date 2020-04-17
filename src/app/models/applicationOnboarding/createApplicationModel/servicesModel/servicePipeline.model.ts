import { PipelineTemplate } from '../../pipelineTemplate/pipelineTemplate.model';
import { CloudAccount } from './cloudAccount.model';

export class ServicePipeline {
    pipelinetemplate: string;
    cloudAccount: CloudAccount;
    dockerImageName: string;
    pipelineParameter:PipelineTemplate[];

    constructor(data: any) {
        data = data || {};
        this.pipelinetemplate = data.pipelinetemplate;
        this.cloudAccount = data.cloudAccount;
        this.dockerImageName = data.dockerImageName;
        this.pipelineParameter=[];
        data.pipelineParameter.forEach(element => {
            this.pipelineParameter.push(new PipelineTemplate(element));
        });
    }
}
