import { AuthService } from 'lib/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, of as observableOf, throwError as _throw } from 'rxjs';
import { tap, mergeMap, catchError, first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootState } from 'lib/store/store.index';
import { RefreshAuthToken } from 'lib/store/security.actions';
import { getAuthToken } from 'lib/store/security.selectors';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private resourceRequest: HttpRequest<any>;

  constructor(private auth: AuthService, private store: Store<RootState>) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return observableOf(request).pipe(
      // add auth headers to the request
      mergeMap(req => this.auth.authenticateRequest(req)),
      // save the original request in case we have to re-auth
      tap(req => this.resourceRequest = request),
      // handle the request
      mergeMap(req => next.handle(req)),
      // catch error
      catchError(error => this.handleRequestFailure(error, next))
    );
  }


  private handleRequestFailure(error: Error, next: HttpHandler) {

    if (error instanceof HttpErrorResponse) {

      const authInvalid = error.status === 401;
      const isRefreshTokenRequest = error.url.includes(AuthService.authEndpoint);

      // handle invalid/expired auth on a resource request
      if (authInvalid && !isRefreshTokenRequest) {

        // request a token refresh
        this.store.dispatch(new RefreshAuthToken());

        // wait for new token then retry
        return this.store.select(getAuthToken).pipe(
          first(),
          mergeMap(newToken => this.auth.authenticateRequest(this.resourceRequest)),
          mergeMap(req => next.handle(req)),
          catchError(err => _throw(`token refresh failed, canceling request for ${error.url}`))
        );

      }
    }

    // non-http error
    return _throw(error);

  }


}
