import { Action } from '@ngrx/store';
import { Menu } from 'src/app/models/layoutModel/sidenavModel/menu.model';


export enum LayoutActionTypes {
    LOADPAGE = '[Layout] LoadPage',
    SUPPORTEDFEATURES = '[Layout] Supported Features',
    SIDEBAR_FETCH = '[Layout] SideBar Fetch',
    ERROR_RESPONSE = '[Layout] Error Response',
    APPLICATIONDATA = '[Layout] Appliaction Data',
    SIDEBARTOGGLE = '[Layout] Sidebar Toggle',
    USERGROUPREFRESH = '[Layout] Usergroup Refresh',
    SERVERERROR = '[Layout] Server Error',
    APISUCCESS = '[Layout] Api Success',
    VISIBILITY = '[Layout] ApprovalInstance Count',
    // ERROR_MESSAGE = '[Layout] Error Message',
}

export class LoadPage implements Action {
    readonly type = LayoutActionTypes.LOADPAGE;
}

export class SideBarFetch implements Action {
    readonly type = LayoutActionTypes.SIDEBAR_FETCH;
    constructor(public payload: Menu) { }
}

export class ErrorResponse implements Action {
    readonly type = LayoutActionTypes.ERROR_RESPONSE;
    constructor(public payload:string){}
}

export class ApplicationData implements Action {
    readonly type = LayoutActionTypes.APPLICATIONDATA
    constructor(public payload:number){}
}

export class SideBarToggle implements Action {
    readonly type = LayoutActionTypes.SIDEBARTOGGLE;
    constructor(public payload:string){}
}

export class SupportedFeatures implements Action {
    readonly type = LayoutActionTypes.SUPPORTEDFEATURES;
    constructor(public payload: []){}
}

export class ApprovalInstanceCount implements Action {
    readonly type = LayoutActionTypes.VISIBILITY
    constructor(public payload:string){}
}

export class usergroupRefresh implements Action {
    readonly type = LayoutActionTypes.USERGROUPREFRESH;
    constructor(public payload:any){}
}

export class ServerError implements Action {
    readonly type = LayoutActionTypes.SERVERERROR;
    constructor(public payload:{
        errorMessage:string,
        index:number
    }) {}
}

export class ApiSuccess implements Action {
    readonly type = LayoutActionTypes.APISUCCESS;
    constructor(public payload:number){}
}

export type LayoutActions = LoadPage  
                        |   SupportedFeatures
                        |   SideBarFetch
                        |   ErrorResponse
                        |   ApplicationData
                        |   ApprovalInstanceCount
                        |   SideBarToggle
                        |   usergroupRefresh
                        |   ServerError
                        |   ApiSuccess;
