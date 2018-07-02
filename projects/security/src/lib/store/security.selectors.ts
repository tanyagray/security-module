import { createSelector } from '@ngrx/store';
import { SecurityState } from './security.reducer';
import { createFeatureSelector } from '@ngrx/store';
import { PlexureToken } from '../models/plexure-token.model';
import * as jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { AuthHostConfig } from '../models/auth-host-config.model';

// state selector

export const securityState = createFeatureSelector<SecurityState>('security');

// property selectors

export const getAuthToken = createSelector(securityState, (state: SecurityState) => state.authToken);
export const getHostUrl = createSelector(securityState, (state: SecurityState) => state.host);
export const getMerchantIdOverride = createSelector(securityState, (state: SecurityState) => state.merchantIdOverride);

// derived selectors

export const getDecodedToken = createSelector(
    getAuthToken,
    (authToken): PlexureToken => authToken && jwtDecode(authToken.accessToken)
);

/**
 * A token can be considered valid if it exists and its expiry is in the future
 */
export const getHasValidToken = createSelector(
    getDecodedToken,
    (decodedToken): boolean => {
        if (!decodedToken) {
            return false;
        }
        const expiry = moment.unix(decodedToken.exp);
        const fiveMinutesFromNow = moment().add(5, 'minutes');
        return !!(decodedToken && expiry.isAfter(fiveMinutesFromNow))
    });

export const getHostConfig = createSelector(
  getHostUrl,
  getAuthToken,
  (host, authToken): AuthHostConfig => ({ host, authToken })
);

export const getMerchantId = createSelector(
    getMerchantIdOverride,
    getDecodedToken,
    (merchantIdOverride, decodedToken) => {

        // we can't get the merchantId if the token was malformed
        if (!decodedToken) {
            return undefined;
        }

        // you must be a platform admin to override the merchant id
        return (merchantIdOverride && decodedToken.account_profile.Role === 'platform-administrator')
            ? merchantIdOverride
            : decodedToken.tenant_profile.VMobMerchantId
    }
);
