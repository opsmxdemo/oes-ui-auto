import { ServicePipeline } from './servicePipeline.model';

export class Service {
    serviceName: string;
    status: string;
    pipeline:ServicePipeline[];

    constructor(data: any) {
        data = data || {};
        this.serviceName = data.serviceName;
        this.status = data.status;
        this.pipeline=[];
        data.pipeline.forEach(element => {
            this.pipeline.push(new ServicePipeline(element));
        });
    }
}
