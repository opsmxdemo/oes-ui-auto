import { ServicePipeline } from './servicePipeline.model';

export class Service {
    serviceName: string;
    status: string;
    pipelines:ServicePipeline[];

    constructor(data: any) {
        data = data || {};
        this.serviceName = data.serviceName;
        this.status = data.status;
        this.pipelines=[];
        data.pipelines.forEach(element => {
            this.pipelines.push(new ServicePipeline(element));
        });
    }
}
