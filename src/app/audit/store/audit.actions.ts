import { createAction, props } from '@ngrx/store';
import { PipelineCount } from 'src/app/models/audit/pipelineCount.model';
import { AuditApplication } from 'src/app/models/audit/auditApplication.model';


// Below action related to create application
export const loadAudit = createAction('[Audit] LoadAudit');
export const loadFinalData = createAction('[Audit] LoadFinalData');
export const fetchPipelineCount = createAction('[Audit] FetchPipelineCount', props<{pipelineCount:PipelineCount}>());
export const fetchAuditApplication = createAction('[Audit] FetchAuditApplication', props<{application:AuditApplication}>());
export const errorOccured = createAction('[Audit] ErrorOccured', props<{errorMessage:string}>());
export const fetchRuningPipeline = createAction('[Audit] FetchAllPipeline', props<{allRunningPipelineData:any}>());
export const fetchAllPipeline = createAction('[Audit] FetchModifiedPipeline', props<{pipelineExist:any}>());
export const fetchFailedPipeline = createAction('[Audit] FetchFailedPipeline', props<{failedPipelineData:any}>());
export const fetchlastSuccessfulDeployments = createAction('[Audit] FetchLastSuccessfulDeployments', props<{lastSuccessfulDeployment:any}>());

//Below actions related to filters
export const postFilterData = createAction('[Audit] PostFilterData', props<{filter:any,relatedApi:string}>());
export const loadDataAfterClearFilter = createAction('[Audit] LoadDataAfterClearFilter', props<{relatedApi:string}>());
export const saveFilterCall = createAction('[Audit] SaveFilterCall', props<{saveFilterData:any,relatedApi:string}>());
export const savedFilterSuccessfully = createAction('[Audit] SavedFilterSuccessfully');

