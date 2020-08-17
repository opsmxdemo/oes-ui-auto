import { ServicePipeline } from './servicePipeline.model';

export class Service {
    serviceName: string;
    status: string;
    logTemp: string;
    metricTemp: string;
    pipelines:ServicePipeline[];

    constructor(data: any) {
        data = data || {};
        this.serviceName = data.serviceName;
        this.status = data.status;
        this.logTemp = data.logTemp;
        this.metricTemp = data.metricTemp;
        this.pipelines=[];
        data.pipelines.forEach(element => {
            this.pipelines.push(new ServicePipeline(element));
        });
    }
}
