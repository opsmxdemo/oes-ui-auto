
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as AuditAction from './audit.actions';
import { PipelineCount } from 'src/app/models/audit/pipelineCount.model';
import { TreeView } from 'src/app/models/audit/treeView.model';

export interface State {
    pipelineCount: PipelineCount;
    erroeMessage: string;
    allRunningPipelineData: any;
    allPipelineData: any;
    lastSuccessfulDeploymentData: any;
    filterData: any;
    allpolicy: any;
    treeViewData: TreeView;
    treeViewMode: boolean;
    treeViewLoading: boolean;
}

export const initialState: State = {
    pipelineCount: null,
    erroeMessage: null,
    allRunningPipelineData: null,
    allPipelineData: null,
    lastSuccessfulDeploymentData: null,
    filterData :null,
    allpolicy: null,
    treeViewData: null,
    treeViewMode: false,
    treeViewLoading:false
}

export function AuditReducer(
    auditState: State | undefined,
    auditAction: Action) {
    return createReducer(
        initialState,
        on(AuditAction.fetchPipelineCount,
            (state, action) => ({
                ...state,
                pipelineCount: action.pipelineCount,
                treeViewMode:false
            })
        ),
        on(AuditAction.errorOccured,
            (state,action) => ({
                ...state,
                erroeMessage:action.errorMessage,
                treeViewMode:false,
                treeViewLoading:false
            })
        ),
        on(AuditAction.fetchRuningPipeline,
            (state,action) => ({
                ...state,
                allRunningPipelineData: action.allRunningPipelineData,
                treeViewMode:false
            })
        ),
        on(AuditAction.fetchAllPipeline,
            (state,action) => ({
                ...state,
                allPipelineData: action.pipelineExist,
                treeViewMode:false
            })
        ),
        on(AuditAction.fetchlastSuccessfulDeployments,
            (state,action) => ({
                ...state,
                lastSuccessfulDeploymentData: action.lastSuccessfulDeployment,
                treeViewMode:false
            })
        ),
        on(AuditAction.fetchedPolicyAudit,
            (state,action) => ({
                ...state,
                allpolicy: action.policyAuditData,
                treeViewMode:false
            })
        ),
        on(AuditAction.loadTreeView,
            (state,action) => ({
                ...state,
                treeViewData: null,
                treeViewMode:true,
                treeViewLoading:true
            })
        ),
        on(AuditAction.fetchedTreeViewData,
            (state,action) => ({
                ...state,
                treeViewData: action.treeViewData,
                treeViewMode:true,
                treeViewLoading:false
            })
        )
    )(auditState,auditAction);
}