
import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationAction from '../../../store/application.actions';



export interface State {

     // Metric Template variables 
     customDSAccounts:any;
     datasource : any;
     InfraDSAccounts : any;
     APMDSAccounts:any;
     APMApplicationForAccounts:any;
     INFRACookbook :any;
     metricType: any;
     applicationName : any;
     templateName : any;
     sourceType:any;
     accountName :any;
     APMCookbook:any;

}

export const initialState: State = {
    customDSAccounts : null,
    datasource : null,
    InfraDSAccounts:null,
    APMDSAccounts:null,
    APMApplicationForAccounts:null,
    INFRACookbook:null,
    metricType: null,
    applicationName : null,
    templateName : null,
    sourceType:null,
    accountName :null,
    APMCookbook: null
}

export function MetricTemplateReducer(
    metricTemplateState: State | undefined,
    metricTemplateAction: Action) {
    return createReducer(
        initialState,
        // ###  MeticTemplate screen logic start ### //         

        on(ApplicationAction.fetchAccountForCustomDataSource,
            (state,action) => ({
                ...state,
                datasource: action.datasource
            })
        ),
        on(ApplicationAction.loadAccountForCustomDataSource,
            (state,action) => ({
                ...state,
                customDSAccounts: action.customDSAccounts
            })
        ),
        on(ApplicationAction.fetchAccountForAPMDataSource,
            (state,action) => ({
                ...state,
                datasource: action.datasource
            })
        ),
        on(ApplicationAction.loadAccountForAPMDataSource,
            (state,action) => ({
                ...state,
                APMDSAccounts: action.APMDSAccounts
            })
        ),
        on(ApplicationAction.fetchAccountForInfraDataSource,
            (state,action) => ({
                ...state,
                datasource: action.datasource
            })
        ),
        on(ApplicationAction.loadAccountForInfraDataSource,
            (state,action) => ({
                ...state,
                InfraDSAccounts: action.InfraDSAccounts
            })
        ),
        on(ApplicationAction.fetchApplicationForAPMAccounts,
            (state,action) => ({
                ...state,
                sourceType: action.sourceType,
                accountName : action.account
            })
        ),
        on(ApplicationAction.loadApplicationForAPMAccounts,
            (state,action) => ({
                ...state,
                APMApplicationForAccounts: action.APMApplicationForAccounts
            })
        ),
        on(ApplicationAction.fetchInfraGenerateCookbook,
            (state,action) => ({
                ...state,
                sourceType: action.sourceType,
                accountName : action.account,
                metricType:action.metricType,
                applicationName : action.applicationName,
                templateName : action.templateName
            })
        ),
        on(ApplicationAction.loadInfraGenerateCookbook,
            (state,action) => ({
                ...state,
                INFRACookbook: action.INFRACookbook
            })
        ),
        on(ApplicationAction.fetchAPMGenerateCookbook,
            (state,action) => ({
                ...state,
                sourceType: action.sourceType,
                accountName : action.account,
                metricType:action.metricType,
                applicationName : action.applicationName,
                templateName : action.templateName
            })
        ),
        on(ApplicationAction.loadAPMGenerateCookbook,
            (state,action) => ({
                ...state,
                APMCookbook: action.APMCookbook
            })
        ),

        // ###  MeticTemplate screen logic start ### // 

    )(metricTemplateState,metricTemplateAction);
}