import { AuthToken } from './auth-token.model';

export interface AuthHostConfig {
    host: string;
    authToken: AuthToken;
    merchantId?: number;
}
