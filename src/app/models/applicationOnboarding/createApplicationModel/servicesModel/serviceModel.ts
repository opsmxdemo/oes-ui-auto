import { ServicePipeline } from './servicePipeline.model';

export class Service {
    serviceName: string;
    pipeline:ServicePipeline[];

    constructor(data: any) {
        data = data || {};
        this.serviceName = data.serviceName;
        this.pipeline=[];
        data.pipeline.forEach(element => {
            this.pipeline.push(new ServicePipeline(element));
        });
    }
}
