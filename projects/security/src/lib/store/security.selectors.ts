import { createSelector, createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import * as jwtDecode_ from 'jwt-decode';
import * as moment_ from 'moment';
import { SecurityState } from 'lib/store/security.reducer';
import { PlexureToken } from 'lib/models/plexure-token.model';
import { AuthHostConfig } from 'lib/models/auth-host-config.model';
import { AuthToken } from 'lib/models/auth-token.model';

// hack to get namespace imports to work with rollup
const jwtDecode = jwtDecode_;
const moment = moment_;

// ===================
// state selector
// ===================

export const securityState: MemoizedSelector<object, SecurityState> = createFeatureSelector<SecurityState>('security');

// =======================
// property selectors
// =======================

export const getAuthToken: MemoizedSelector<object, AuthToken> = createSelector(
    securityState,
    (state: SecurityState) => state.authToken
);

export const getHostUrl: MemoizedSelector<object, string> = createSelector(
    securityState,
    (state: SecurityState) => state.host
);

export const getMerchantIdOverride: MemoizedSelector<object, number> = createSelector(
    securityState,
    (state: SecurityState) => state.merchantIdOverride
);

// ======================
// derived selectors
// ======================

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
        return !!(decodedToken && expiry.isAfter(fiveMinutesFromNow));
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
            : decodedToken.tenant_profile.VMobMerchantId;
    }
);
