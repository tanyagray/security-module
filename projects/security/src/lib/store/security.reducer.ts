import { Actions, SecurityActions } from './security.actions';
import { AuthToken } from 'lib/models/auth-token.model';

export interface SecurityState {
  authToken?: AuthToken;
  host?: string;
  merchantIdOverride?: number;
}

export const initialState: SecurityState = {};

export function securityReducer(state = initialState, action: Actions): SecurityState {
  switch (action.type) {
    case SecurityActions.UpdateHost:
      return {
        host: action.payload.host,
        authToken: action.payload.authToken,
        merchantIdOverride: action.payload.merchantId,
      };
    case SecurityActions.AuthComplete:
      return {
        ...state,
        authToken: action.payload,
      };
    case SecurityActions.AuthFailed:
      return {
        ...state,
        authToken: undefined,
      };
    default:
      return state;
  }
}
