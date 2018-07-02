import { securityReducer, SecurityState } from './security.reducer';
import { UpdateHostConfigAction, AuthCompleteAction, AuthFailedAction } from './security.actions';
import { AuthHostConfig } from 'lib/models/auth-host-config.model';
import { AuthToken } from 'lib/models/auth-token.model';

describe('Security: Reducer', () => {

    it('UpdateHostConfigAction should set the host, token and merchantOverride', () => {

        // start with this state
        const initialState: SecurityState = {};

        // create action
        const payload: AuthHostConfig = {
            host: 'fake-host',
            authToken: { accessToken: 'fake-token' },
            merchantId: 1,
        };
        const action = new UpdateHostConfigAction(payload);

        // run reducer
        const resultState = securityReducer(initialState, action);

        // test state
        expect(resultState.host).toEqual('fake-host');
        expect(resultState.authToken.accessToken).toEqual('fake-token');
        expect(resultState.merchantIdOverride).toEqual(1);

    });

    it('UpdateHostConfigAction should clear merchantOverride if none was provided', () => {

        // start with this state
        const initialState: SecurityState = {
            host: 'fake-host',
            authToken: { accessToken: 'fake-token' },
            merchantIdOverride: undefined,
        };

        // create action
        const payload: AuthHostConfig = {
            host: 'fake-host',
            authToken: { accessToken: 'fake-token' },
        };
        const action = new UpdateHostConfigAction(payload);

        // run reducer
        const resultState = securityReducer(initialState, action);

        // test state
        expect(resultState.merchantIdOverride).not.toBeDefined();

    });

    it('AuthCompleteAction should update the authToken', () => {

        // start with this state
        const initialState: SecurityState = {
            host: 'fake-host',
            authToken: { accessToken: 'fake-token' },
        };

        // create action
        const payload: AuthToken = { accessToken: 'new-token' };
        const action = new AuthCompleteAction(payload);

        // run reducer
        const resultState = securityReducer(initialState, action);

        // test state
        expect(resultState.authToken).toEqual(payload);
    });

    it('AuthFailedAction should clear the token but retain the host', () => {

        // start with this state
        const initialState: SecurityState = {
            host: 'fake-host',
            authToken: { accessToken: 'fake-token' },
        };

        // create action
        const action = new AuthFailedAction();

        // run reducer
        const resultState = securityReducer(initialState, action);

        // test state
        expect(resultState.authToken).not.toBeDefined();
        expect(resultState.host).toEqual('fake-host');

    });

});
