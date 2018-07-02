import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthInterceptor } from 'lib/interceptors/auth-interceptor.service';
import { AuthService } from 'lib/services/auth.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { of } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';
import { AuthFailedAction, AuthCompleteAction } from 'lib/store/security.actions';
import { RootState } from 'lib/store/store.index';

describe('Service: Auth Interceptor', () => {

  const mockAuthService = {
    authEndpoint: '/auth',
    showAuthExpiredDialog: () => {},
    authenticateRequest: (req: HttpRequest<any>) => req,
    refreshToken: () => of([undefined])
  };

  let authService: AuthService;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ]
    });

    authService = TestBed.get(AuthService);
    httpClient = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);
    store = TestBed.get(Store);

  });

  it('should authenticate an unauthenticated request', () => {

    spyOn(authService, 'authenticateRequest')
      .and.callThrough();

    httpClient.get('/test').subscribe(() => {
      expect(authService.authenticateRequest).toHaveBeenCalled();
    });

  });

  /*it('should refresh token on auth error', (done: Function) => {

    httpClient.get('/test').subscribe(() => {
      expect(authService.refreshToken).toHaveBeenCalled();
      done();
    });

    // accessing a page or api call
    const expiredAuthRequest = httpMock.expectOne('/test');
    expiredAuthRequest.error(new ErrorEvent('Unauthorized Error'), { status: 401 });

    // attempting token refresh
    const refreshRequest = httpMock.expectOne('/retry');
    refreshRequest.flush({ access_token: 'new-token' });

    httpMock.verify();

  });*/

  /*it('should generate an AuthFailed action when token refresh fails', (done: Function) => {

    const authFailedAction = new AuthFailedAction();

    httpClient.get('/test')
      .subscribe(
        () => {}, // success
        () => { // error
          expect(store.dispatch).toHaveBeenCalledWith(authFailedAction);
          done();
        });

      spyOn(authService, 'refreshToken')
      .and.callFake(() => {
        return httpClient.post(AuthService.authEndpoint, {});
      });

      // accessing a page or api call
      const expiredAuthRequest = httpMock.expectOne('/test', 'Unauthenticated Request');
      expiredAuthRequest.error(new ErrorEvent('Unauthorized Error'), { status: 401 });

      // attempting token refresh
      const refreshRequest = httpMock.expectOne(AuthService.authEndpoint, 'Token Refresh Failed');
      refreshRequest.error(new ErrorEvent('Unauthorized Error'), { status: 401 });

      httpMock.verify();
  });*/

  /*it('should not generate an AuthFailed action when error is a 500', (done: Function) => {

    const authFailedAction = new AuthFailedAction();

    httpClient.get('/test')
      .subscribe(
        () => {}, // success
        () => { // error
          expect(store.dispatch).toHaveBeenCalledWith(authFailedAction);
          done();
        });

    // accessing a page or api call
    const expiredAuthRequest = httpMock.expectOne('/test', 'Request causing an Internal Server Error');
    expiredAuthRequest.error(new ErrorEvent('Internal Server Error'), { status: 500 });

    httpMock.verify();
  });*/

  /*it('should notify store of AuthComplete when auth refresh succeeds', (done: Function) => {

    httpClient.get('/test').subscribe(() => {
      expect(store.dispatch)
        .toHaveBeenCalledWith(new AuthCompleteAction({ accessToken: 'new-token' }));
      done();
    });

    spyOn(store, 'dispatch')
      .and.callThrough();

    spyOn(authService, 'refreshToken')
      .and.returnValue(of(undefined));

    spyOn(authService, 'authenticateRequest')
      .and.returnValue(new HttpRequest('GET', '/retry'));

    // accessing a page or api call
    const expiredAuthRequest = httpMock.expectOne('/test');
    expiredAuthRequest.error(new ErrorEvent('Unauthorized Error'), { status: 401 });

    // attempting token refresh
    const refreshRequest = httpMock.expectOne('/retry');
    refreshRequest.flush({ access_token: 'new-token' });

    httpMock.verify();

  });*/

});
