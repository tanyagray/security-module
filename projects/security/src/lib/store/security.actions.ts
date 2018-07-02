import { Action } from '@ngrx/store';
import { AuthHostConfig } from 'lib/models/auth-host-config.model';
import { AuthToken } from 'lib/models/auth-token.model';

export enum SecurityActions {
    AuthComplete = '[Security] Auth Complete',
    AuthFailed = '[Security] Auth Failed',
    RefreshAuthToken = '[Security] Refresh Token',
    UpdateHost = '[Security] Update Host Configuration',
}

export class AuthCompleteAction implements Action {
  readonly type = SecurityActions.AuthComplete;
  constructor(public payload: AuthToken) { }
}

export class AuthFailedAction implements Action {
  readonly type = SecurityActions.AuthFailed;
  constructor(public payload?: any) { }
}

export class RefreshAuthToken implements Action {
  readonly type = SecurityActions.RefreshAuthToken;
  constructor(public payload?: any) { }
}

export class UpdateHostConfigAction implements Action {
  readonly type = SecurityActions.UpdateHost;
  constructor(public payload: AuthHostConfig) { }
}

export type Actions =
  | AuthCompleteAction
  | AuthFailedAction
  | RefreshAuthToken
  | UpdateHostConfigAction;
