import { Action } from '@ngrx/store';
import { Menu } from 'src/app/models/layoutModel/sidenavModel/menu.model';


export enum LayoutActionTypes {
    LOADPAGE = '[Layout] LoadPage',
    SIDEBAR_FETCH = '[Layout] SideBar Fetch',
    ERROR_RESPONSE = '[Layout] Error Response',
    APPLICATIONDATA = '[Layout] Appliaction Data',
    SIDEBARTOGGLE = '[Layout] Sidebar Toggle',
    INSTALLATIONMODE = '[Layout] Installation Mode',
    SERVERERROR = '[Layout] Server Error',
    APISUCCESS = '[Layout] Api Success',
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

export class InstallationMode implements Action {
    readonly type = LayoutActionTypes.INSTALLATIONMODE;
    constructor(public payload:string){}
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
                        |   SideBarFetch
                        |   ErrorResponse
                        |   ApplicationData
                        |   SideBarToggle
                        |   InstallationMode
                        |   ServerError
                        |   ApiSuccess;
