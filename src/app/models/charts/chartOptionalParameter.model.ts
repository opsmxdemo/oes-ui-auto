export class ChartOptions {
    legend: boolean;
    legendTitle: string;
    showLabels: boolean;
    xAxis: boolean;
    yAxis: boolean;
    showYAxisLabel: boolean;
    showXAxisLabel: boolean;
    xAxisLabel: string;
    yAxisLabel: string;
    timeline: boolean;
    tooltipDisabled: boolean;
    showGridLines: boolean;

    constructor(data: any) {
        data = data || {};
        this.legend = data.legend;
        this.legendTitle = data.legendTitle;
        this.showLabels = this.showLabels;
        this.xAxis = data.xAxis;
        this.yAxis = data.yAxis;
        this.showYAxisLabel = this.showYAxisLabel;
        this.showXAxisLabel = data.showXAxisLabel;
        this.xAxisLabel = data.xAxisLabel;
        this.yAxisLabel = this.yAxisLabel;
        this.timeline = data.timeline;
        this.tooltipDisabled = data.tooltipDisabled;
        this.showGridLines = this.showGridLines;
    }
}
