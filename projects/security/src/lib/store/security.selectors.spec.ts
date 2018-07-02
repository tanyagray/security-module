import * as Security from './security.selectors';
import * as moment from 'moment';
import { basicEncodedToken, basicDecodedToken } from 'lib/spec-helpers/tokens';

describe('Security: Selectors', () => {

    it('getDecodedToken should return undefined if there is no token', () => {
        const authToken = undefined;
        const result = Security.getDecodedToken.projector(authToken);
        expect(result).not.toBeDefined();
    });

    it('getDecodedToken should return decoded token', () => {
        const authToken = {
            accessToken: basicEncodedToken
        };
        const result = Security.getDecodedToken.projector(authToken);
        expect(result).toEqual(basicDecodedToken);
    });

    it('getHasValidToken should return false if there is no token', () => {
        const decodedToken = undefined;
        const result = Security.getHasValidToken.projector(decodedToken);
        expect(result).toBe(false);
    });

    it('getHasValidToken should return false if the token has expired', () => {
        const decodedToken = { exp: moment().unix() };
        const result = Security.getHasValidToken.projector(decodedToken);
        expect(result).toBe(false);
    });

    it('getHasValidToken should return true if the token exists and has not expired', () => {
        const decodedToken = { exp: moment().add(1, 'hours').unix() };
        const result = Security.getHasValidToken.projector(decodedToken);
        expect(result).toBe(true);
    });

});
