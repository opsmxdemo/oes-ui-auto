import { ServicePipeline } from './servicePipeline.model';

export class Service {
    serviceName: string;
    id: string;
    logTemp: string;
    metricTemp: string;
    pipelines:ServicePipeline[];

    constructor(data: any) {
        data = data || {};
        this.serviceName = data.serviceName;
        this.id = data.id;
        this.logTemp = data.logTemp;
        this.metricTemp = data.metricTemp;
        this.pipelines=[];
        data.pipelines.forEach(element => {
            this.pipelines.push(new ServicePipeline(element));
        });
    }
}
