
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as OnboardingAction from './onBoarding.actions';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from 'src/app/models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from 'src/app/models/applicationOnboarding/applicationList/applicationList.model';


export interface State {
    pipelineData: Pipeline;
    erroeMessage: string;
    editMode: boolean;
    parentPage: string;
    applicationData: CreateApplication;
    cloudAccountExist: CloudAccount;
    applicationList: ApplicationList[];
    accountList: any;
    datasourceList: any;
    accountParentPage: string;
    accountDeleted: boolean;
}

export const initialState: State = {
    pipelineData: null,
    erroeMessage: null,
    editMode: false,
    parentPage: null,
    applicationData: null,
    cloudAccountExist: null,
    applicationList: null,
    accountList: null,
    datasourceList: null,
    accountParentPage: null,
    accountDeleted: false,
}

export function AppOnboardingReducer(
    onboardingState: State | undefined,
    onboardingAction: Action) {
    return createReducer(
        initialState,
        on(OnboardingAction.loadApp,
            (state, action) => ({
                ...state,
                editMode:false,
                parentPage: action.page
            })
        ),
        on(OnboardingAction.fetchPipeline,
            (state, action) => ({
                ...state,
                pipelineData: action.pipelineData
            })
        ),
        on(OnboardingAction.errorOccured,
            (state,action) => ({
                ...state,
                erroeMessage:action.errorMessage
            })
        ),
        on(OnboardingAction.enableEditMode,
            (state,action) => ({
                ...state,
                editMode:action.editMode,
                parentPage: action.page
            })    
        ),
        on(OnboardingAction.fetchAppData,
            (state,action) => ({
                ...state,
                applicationData:action.appData
            })
        ),
        on(OnboardingAction.fetchCloudAccount,
            (state,action) => ({
                ...state,
                cloudAccountExist:action.cloudAccount
            })
        ),
        on(OnboardingAction.fetchAppList,
            (state,action) => ({
                ...state,
                applicationList: action.Applist
            })
        ),
        on(OnboardingAction.appDeletedSuccessfully,
            (state,action) => ({
                ...state,
                applicationList: state.applicationList.filter((applist,index) => index !== action.index)
            })
        ),
        on(OnboardingAction.fetchAccountList,
            (state,action) => ({
                ...state,
                accountList: action.Accountlist,
            })
        ),
        on(OnboardingAction.loadAccount,
            (state, action) => ({
                ...state,
                accountParentPage: action.page
            })
        ),
        on(OnboardingAction.deleteAccount,
            (state, action) => ({
                ...state,
                accountDeleted: false
            })
        ),
        // on(OnboardingAction.accountDeleted,
        //     state => ({
        //         ...state,
        //         accountDeleted: true
        //     })
        // ),
        on(OnboardingAction.accountDeleted,
            (state,action) => ({
                ...state,
                accountList: state.accountList.filter((accountList,index) => index !== action.index)
            })
        ),
        on(OnboardingAction.disabledEditMode,
            state => ({
                ...state,
                editMode:false
            })
        ),
        on(OnboardingAction.fetchDatasourceList,
            (state,action) => ({
                ...state,
                datasourceList: action.DatasourceList,
            })
        ),
    )(onboardingState,onboardingAction);
}