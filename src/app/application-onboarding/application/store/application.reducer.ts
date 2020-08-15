import { Pipeline } from '../../../models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as ApplicationAction from './application.actions';
import { CreateApplication } from '../../../models/applicationOnboarding/createApplicationModel/createApplication.model';
import { CloudAccount } from '../../../models/applicationOnboarding/createApplicationModel/servicesModel/cloudAccount.model';
import { ApplicationList } from '../../../models/applicationOnboarding/applicationList/applicationList.model';


export interface State {

    // Create Application variable
    pipelineData: Pipeline;
    erroeMessage: string;
    editMode: boolean;
    parentPage: string;
    applicationData: CreateApplication;
    applicationLoading: boolean;
    cloudAccountExist: CloudAccount;
    imageSource: string[];
    dockerImageData:any;
    callDockerImageDataAPI: boolean;
    userGropsData: string[];

    // Application List variables
    applicationList: ApplicationList[];
    appListLoading: boolean;
}

export const initialState: State = {
    pipelineData: null,
    erroeMessage: null,
    editMode: false,
    parentPage: '/setup/applications',
    applicationData: null,
    cloudAccountExist: null,
    applicationList: null,
    appListLoading: false,
    applicationLoading: false,
    imageSource: null,
    dockerImageData: null,
    callDockerImageDataAPI: true,
    userGropsData: null
}

export function ApplicationReducer(
    applicationState: State | undefined,
    applicationAction: Action) {
    return createReducer(
        initialState,
        // #### CreateApplication screen logic start ####
        on(ApplicationAction.loadApp,
            (state, action) => ({
                ...state,
                editMode:false,
                parentPage: action.page
            })
        ),
        on(ApplicationAction.fetchPipeline,
            (state, action) => ({
                ...state,
                pipelineData: action.pipelineData
            })
        ),
        on(ApplicationAction.fetchUserGrops,
            (state, action) => ({
                ...state,
                userGropsData: action.userGroupData
            })
        ),
        on(ApplicationAction.errorOccured,
            (state,action) => ({
                ...state,
                erroeMessage:action.errorMessage,
                appListLoading: false,
                applicationLoading: false
            })
        ),
        on(ApplicationAction.enableEditMode,
            (state,action) => ({
                ...state,
                editMode:action.editMode,
                parentPage: action.page,
                applicationLoading: true
            })    
        ),
        
        on(ApplicationAction.fetchAppData,
            (state,action) => ({
                ...state,
                applicationData:action.appData,
                applicationLoading: false
            })
        ),
        on(ApplicationAction.disabledEditMode,
            state => ({
                ...state,
                editMode:false
            })
        ),
        on(ApplicationAction.createApplication,
            state => ({
                ...state,
                applicationLoading:true
            })
        ),
        on(ApplicationAction.updateApplication,
            state => ({
                ...state,
                applicationLoading:true
            })
        ),
        on(ApplicationAction.dataSaved,
            state => ({
                ...state,
                applicationLoading:false
            })
        ),
        on(ApplicationAction.fetchCloudAccount,
            (state,action) => ({
                ...state,
                cloudAccountExist:action.cloudAccount
            })
        ),
        on(ApplicationAction.fetchImageSource,
            (state,action) => ({
                ...state,
                imageSource:action.imageSource
            })
        ),
        on(ApplicationAction.loadDockerImageName,
            (state,action) => ({
                ...state,
                callDockerImageDataAPI: false
            })
        ),
        on(ApplicationAction.fetchDockerImageName,
            (state,action) => ({
                ...state,
                dockerImageData: action.dockerImageData
            })
        ),
        
        // #### CreateApplication screen logic start ####//

        // ###  Applist screen logic start ### // 
        on(ApplicationAction.loadAppList,
            state => ({
                ...state,
                appListLoading:true
            })
        ),
        on(ApplicationAction.fetchAppList,
            (state,action) => ({
                ...state,
                applicationList: action.Applist,
                appListLoading:false
            })
        ),
        on(ApplicationAction.appDelete,
            state => ({
                ...state,
                appListLoading:true
            })
        ),
        on(ApplicationAction.appDeletedSuccessfully,
            (state,action) => ({
                ...state,
                applicationList: state.applicationList.filter((applist,index) => index !== action.index),
                appListLoading:false
            })
        ),
        // ###  Applist screen logic End ### // 
    )(applicationState,applicationAction);
}