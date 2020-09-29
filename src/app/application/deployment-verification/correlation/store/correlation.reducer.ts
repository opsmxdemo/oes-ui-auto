
import { Action, createReducer, on } from '@ngrx/store';
import * as CorrelationActions from './correlation.actions';
import { Observable } from 'rxjs';
//import { User } from '../deployment-verification.component';

export interface State {
    unexpectedClusters: any;
    timeSeriesData:any;
    clusterData:any;
    allMetricsData:any;
    dataLoaded:boolean;
    metrictimeSeriesData:any;
      
}

export const initialState: State = {
    unexpectedClusters: null,
    timeSeriesData:null,
    clusterData:null,
    allMetricsData:null,
    metrictimeSeriesData:null,
    dataLoaded:false,
    

}

export function CorrelationReducer(
    CorrelationState: State | undefined,
    CorrelationAction: Action) {
    return createReducer(
        initialState,
        on(CorrelationActions.loadUnxepectedClusters,
            (state,action) => ({
                ...state,
                deployementLoading: true,
                unexpectedClusters: action.unexpectedClusters,
                
            })
        ),
        on(CorrelationActions.loadLogLines,
            (state, action) => ({
                ...state,
                deployementLoading: true,
                logLines: action.logLines,
            })
        ),
        on(CorrelationActions.loadTimeseriesData,
            (state, action) => ({
                ...state,
                deployementLoading: true,
                timeSeriesData: action.timeSeriesData,
            })
        ),
        on(CorrelationActions.clusterData,
            (state, action) => ({
                ...state,
                dataLoaded: false,
                canaryId: action.canaryId,
                serviceId: action.serviceId,
                clusterId: action.clusterId,
            })
        ),
        on(CorrelationActions.loadCluterData,
            (state, action) => ({
                ...state,
                dataLoaded: true,
                clusterData: action.clusterData,
            })
        ),
        on(CorrelationActions.clusterDataLoaded,
            (state,action) => ({
                ...state,
                dataLoaded: false
            })
        ),
        on(CorrelationActions.loadallMetrics,
            (state, action) => ({
                ...state,
                deployementLoading: true,
                allMetricsData: action.allMetricsData,
            })
        ),
        on(CorrelationActions.metricloadTimeseriesData,
            (state, action) => ({
                ...state,
                deployementLoading: true,
                metrictimeSeriesData: action.metrictimeSeriesData,
            })
        )
    )(CorrelationState,CorrelationAction);
}
