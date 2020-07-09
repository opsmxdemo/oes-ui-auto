import { ColorScheme } from './chartColorScheme.model';

export class ChartOptions {
    legend: boolean;
    legendTitle: string;
    xAxis: boolean;
    yAxis: boolean;
    showYAxisLabel: boolean;
    showXAxisLabel: boolean;
    xAxisLabel: string;
    yAxisLabel: string;
    timeline: boolean;
    tooltipDisabled: boolean;
    showGridLines: boolean;
    legendPosition: string;
    animations: boolean;
    gradient: boolean;
    autoScale: boolean;
    colorScheme: ColorScheme;

    constructor(data: any) {
        data = data || {};
        this.legend = data.legend;
        this.legendTitle = data.legendTitle;
        this.xAxis = data.xAxis;
        this.yAxis = data.yAxis;
        this.showYAxisLabel = data.showYAxisLabel;
        this.showXAxisLabel = data.showXAxisLabel;
        this.xAxisLabel = data.xAxisLabel;
        this.yAxisLabel = data.yAxisLabel;
        this.timeline = data.timeline;
        this.tooltipDisabled = data.tooltipDisabled;
        this.showGridLines = data.showGridLines;
        this.legendPosition = data.legendPosition;
        this.animations = data.animations;
        this.gradient = data.gradient;
        this.autoScale = data.autoScale;
        this.colorScheme = data.colorScheme;
    }
}
