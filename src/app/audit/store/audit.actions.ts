import { createAction, props } from '@ngrx/store';
import { PipelineCount } from 'src/app/models/audit/pipelineCount.model';
import { AuditApplication } from 'src/app/models/audit/auditApplication.model';


// Below action related to create application
export const loadAudit = createAction('[Audit] LoadAudit');
export const fetchPipelineCount = createAction('[Audit] FetchPipelineCount', props<{pipelineCount:PipelineCount}>());
export const fetchAuditApplication = createAction('[Audit] FetchAuditApplication', props<{application:AuditApplication}>());
export const errorOccured = createAction('[Audit] ErrorOccured', props<{errorMessage:string}>());
export const fetchAllPipeline = createAction('[Audit] FetchAllPipeline', props<{allPipelineData:any}>());