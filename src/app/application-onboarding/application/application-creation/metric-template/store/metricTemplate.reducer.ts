
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
     isLoadedAccountForCustomDataSource: boolean;
     isLoadedAccountForAPMDataSource : boolean;
     isLoadedAccountForInfraDataScource : boolean;
     isLoadedApplicationForAPM : boolean;
     isLoadedAPMCookbook : boolean;
     isLoadedInfraCookbook : boolean;
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
    APMCookbook: null,
    isLoadedAccountForCustomDataSource : false,
    isLoadedAccountForAPMDataSource : false,
    isLoadedAccountForInfraDataScource : false,
    isLoadedApplicationForAPM : false,
    isLoadedAPMCookbook : false,
    isLoadedInfraCookbook : false
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
                datasource: action.datasource,
                isLoadedAccountForCustomDataSource : false
            })
        ),
        on(ApplicationAction.loadAccountForCustomDataSource,
            (state,action) => ({
                ...state,
                customDSAccounts: action.customDSAccounts,
                isLoadedAccountForCustomDataSource : true
            })
        ),
        on(ApplicationAction.loadedAccountForCustomDataSource,
            (state) => ({
                ...state,
                isLoadedAccountForCustomDataSource: false
            })
        ),

        on(ApplicationAction.fetchAccountForAPMDataSource,
            (state,action) => ({
                ...state,
                datasource: action.datasource,
                isLoadedAccountForAPMDataSource: false
            })
        ),
        on(ApplicationAction.loadAccountForAPMDataSource,
            (state,action) => ({
                ...state,
                APMDSAccounts: action.APMDSAccounts,
                isLoadedAccountForAPMDataSource: true
            })
        ),
        on(ApplicationAction.loadedAccountForAPMDataSource,
            (state) => ({
                ...state,
                isLoadedAccountForAPMDataSource: false
            })
        ),

        on(ApplicationAction.fetchAccountForInfraDataSource,
            (state,action) => ({
                ...state,
                datasource: action.datasource,
                isLoadedAccountForInfraDataScource: false
            })
        ),
        on(ApplicationAction.loadAccountForInfraDataSource,
            (state,action) => ({
                ...state,
                InfraDSAccounts: action.InfraDSAccounts,
                isLoadedAccountForInfraDataScource: true
            })
        ),
        on(ApplicationAction.loadedAccountForInfraDataSource,
            (state) => ({
                ...state,
                isLoadedAccountForInfraDataScource: false
            })
        ),

        on(ApplicationAction.fetchApplicationForAPMAccounts,
            (state,action) => ({
                ...state,
                sourceType: action.sourceType,
                accountName : action.account,
                isLoadedApplicationForAPM: false
            })
        ),
        on(ApplicationAction.loadApplicationForAPMAccounts,
            (state,action) => ({
                ...state,
                APMApplicationForAccounts: action.APMApplicationForAccounts,
                isLoadedApplicationForAPM: true
            })
        ),
        on(ApplicationAction.loadedApplicationForAPMAccounts,
            (state) => ({
                ...state,
                isLoadedApplicationForAPM: false
            })
        ),

        on(ApplicationAction.fetchInfraGenerateCookbook,
            (state,action) => ({
                ...state,
                sourceType: action.sourceType,
                accountName : action.account,
                metricType:action.metricType,
                applicationName : action.applicationName,
                templateName : action.templateName,
                isLoadedInfraCookbook: false
            })
        ),
        on(ApplicationAction.loadInfraGenerateCookbook,
            (state,action) => ({
                ...state,
                INFRACookbook: action.INFRACookbook,
                isLoadedInfraCookbook: true
            })
        ),
        on(ApplicationAction.loadedInfraGenerateCookbook,
            (state) => ({
                ...state,
                isLoadedInfraCookbook: false
            })
        ),

        on(ApplicationAction.fetchAPMGenerateCookbook,
            (state,action) => ({
                ...state,
                sourceType: action.sourceType,
                accountName : action.account,
                metricType:action.metricType,
                applicationName : action.applicationName,
                templateName : action.templateName,
                isLoadedAPMCookbook: false
            })
        ),
        on(ApplicationAction.loadAPMGenerateCookbook,
            (state,action) => ({
                ...state,
                APMCookbook: action.APMCookbook,
                isLoadedAPMCookbook: true
            })
        ),
        on(ApplicationAction.loadedAPMGenerateCookbook,
            (state) => ({
                ...state,
                isLoadedAPMCookbook: false
            })
        ),

        // ###  MeticTemplate screen logic start ### // 

    )(metricTemplateState,metricTemplateAction);
}