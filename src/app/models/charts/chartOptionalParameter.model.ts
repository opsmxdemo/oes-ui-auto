import { ColorScheme } from './chartColorScheme.model';

export class ChartOptions {
    showLegend: boolean;
    legendTitle: string;
    showXAxis: boolean;
    showYAxis: boolean;
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
    isDoughnut: boolean;
    showLabels: boolean;
    maxXAxisTickLength: number;
    maxYAxisTickLength: number;
    colorScheme: ColorScheme;

    constructor(data: any) {
        data = data || {};
        this.showLegend = data.showLegend;
        this.legendTitle = data.legendTitle;
        this.showXAxis = data.showXAxis;
        this.showYAxis = data.showYAxis;
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
        this.isDoughnut = data.isDoughnut;
        this.showLabels = data.showLabels;
        this.maxXAxisTickLength = data.maxXAxisTickLength;
        this.maxYAxisTickLength = data.maxYAxisTickLength;
        this.colorScheme = data.colorScheme;
    }
}
