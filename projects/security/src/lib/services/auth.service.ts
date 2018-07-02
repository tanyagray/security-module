import { AuthToken } from '../models/auth-token.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { map, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as Security from 'lib/store/security.selectors';
import { SecurityConfig } from 'lib/security.config';
import { RootState } from 'lib/store/store.index';

@Injectable()
export class AuthService {

  public static authEndpoint = '/security/authorize';

  constructor(
    private securityConfig: SecurityConfig,
    private http: HttpClient,
    private store: Store<RootState>,
  ) { }

  /**
   * Attempts to get a new token from the current token
   *
   * @returns {Observable<any>}
   * @memberof AuthService
   */
  public refreshToken(oldToken: AuthToken): Observable<AuthToken> {

    // error if no token
    if (!oldToken) {
      throw Error('No access token set to be refreshed');
    }

    // error if no client id
    if (!this.securityConfig.clientId) {
      throw Error('No client id set');
    }

    // build the auth request body
    const requestBody = {
      access_token: oldToken.accessToken,
      client_id: this.securityConfig.clientId,
      grant_type: 'access_token'
    };

    // do the request
    return this.http.post(AuthService.authEndpoint, requestBody).pipe(
      map((response: any) => response.access_token),
    );

  }


  public authenticateRequest(request: HttpRequest<any>): Observable<HttpRequest<any>> {

    return this.store.select(Security.getAuthToken).pipe(
      first(),
      map(authToken => {

        if (authToken && !request.headers.has('authorization')) {
          return request.clone({ headers: request.headers.set('Authorization', `Bearer ${authToken.accessToken}`) });
        }

        return request;
      })
    );

  }

}
