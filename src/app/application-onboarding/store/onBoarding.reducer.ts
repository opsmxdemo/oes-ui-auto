
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as OnboardingAction from './onBoarding.actions';
import { CreateApplication } from 'src/app/models/applicationOnboarding/createApplicationModel/createApplication.model';


export interface State {
    pipelineData: Pipeline;
    erroeMessage: string;
    editMode:boolean;
    applicationData:CreateApplication;
}

export const initialState: State = {
    pipelineData: null,
    erroeMessage:null,
    editMode:false,
    applicationData:null

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
        )
    )(onboardingState,onboardingAction);
}