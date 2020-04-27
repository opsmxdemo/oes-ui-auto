
import { Pipeline } from 'src/app/models/applicationOnboarding/pipelineTemplate/pipeline.model';
import { Action, createReducer, on } from '@ngrx/store';
import * as AuditAction from './audit.actions';
import { PipelineCount } from 'src/app/models/audit/pipelineCount.model';

export interface State {
    pipelineCount: PipelineCount;
    erroeMessage: string;
    allPipelineData: any;
}

export const initialState: State = {
    pipelineCount: null,
    erroeMessage: null,
    allPipelineData: null
}

export function AuditReducer(
    auditState: State | undefined,
    auditAction: Action) {
    return createReducer(
        initialState,
        on(AuditAction.fetchPipelineCount,
            (state, action) => ({
                ...state,
                pipelineCount: action.pipelineCount
            })
        ),
        on(AuditAction.errorOccured,
            (state,action) => ({
                ...state,
                erroeMessage:action.errorMessage
            })
        ),
        on(AuditAction.fetchAllPipeline,
            (state,action) => ({
                ...state,
                allPipelineData: action.allPipelineData
            })
        ),
    )(auditState,auditAction);
}