import { Action } from '@ngrx/store';
import { Menu } from 'src/app/models/layoutModel/sidenavModel/menu.model';


export enum LayoutActionTypes {
    LOADPAGE = '[Layout] LoadPage',
    SIDEBAR_FETCH = '[Layout] SideBar Fetch',
    ERROR_RESPONSE = '[Layout] Error Response'
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

export type LayoutActions = LoadPage   
                        |   SideBarFetch
                        |   ErrorResponse;
