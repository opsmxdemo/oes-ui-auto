
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
    applicationData: CreateApplication;
    cloudAccountExist: CloudAccount;
    applicationList: ApplicationList[]
}

export const initialState: State = {
    pipelineData: null,
    erroeMessage: null,
    editMode: false,
    applicationData: null,
    cloudAccountExist: null,
    applicationList: null
}

export function AppOnboardingReducer(
    onboardingState: State | undefined,
    onboardingAction: Action) {
    return createReducer(
        initialState,
        on(OnboardingAction.loadApp,
            state => ({
                ...state,
                editMode:false
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
                editMode:action.editMode
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
        on(OnboardingAction.appDelete,
            (state,action) => ({
                ...state,
                applicationList: state.applicationList.filter((applist,index) => index !== action.index)
            })
        )
    )(onboardingState,onboardingAction);
}