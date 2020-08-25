import { PipelineTemplate } from '../../pipelineTemplate/pipelineTemplate.model';
import { CloudAccount } from './cloudAccount.model';
import { DockerImageName } from './dockerImageName.model';

export class ServicePipeline {
    pipelinetemplate: string;
    //cloudAccount: CloudAccount;
    dockerImageName: DockerImageName;
    pipelineParameters:PipelineTemplate[];

    constructor(data: any) {
        data = data || {};
        this.pipelinetemplate = data.pipelinetemplate;
        //this.cloudAccount = data.cloudAccount;
        this.dockerImageName = data.dockerImageName;
        this.pipelineParameters=[];
        data.pipelineParameters.forEach(element => {
            this.pipelineParameters.push(new PipelineTemplate(element));
        });
    }
}
