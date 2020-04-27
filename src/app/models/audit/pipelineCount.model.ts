export class PipelineCount {

    totalSuccessfulPipelinesCount: number;
    totalPipelinesRunCount: number;
    totalCanceledPipelinesCount: number;
    totalApplicationsCount: number;
    totalPipelinesCount: number;
    totalFailedPipelinesCount: number;


    constructor(data: any) {
        data = data || {};
        this.totalSuccessfulPipelinesCount = data.totalSuccessfulPipelinesCount;
        this.totalPipelinesRunCount = data.totalPipelinesRunCount;
        this.totalCanceledPipelinesCount = data.totalCanceledPipelinesCount;
        this.totalApplicationsCount = data.totalApplicationsCount;
        this.totalPipelinesCount = data.totalPipelinesCount;
        this.totalFailedPipelinesCount = data.totalFailedPipelinesCount;
    }
}
