import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthInterceptor } from 'lib/interceptors/auth-interceptor.service';
import { AuthService } from 'lib/services/auth.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { of as observableOf } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';
import { RootState } from 'lib/store/store.index';
import { securityReducer } from 'lib/store/security.reducer';
import { RefreshAuthToken } from '../store/security.actions';

describe('Service: Auth Interceptor', () => {

  const mockAuthService = {
    showAuthExpiredDialog: () => {},
    authenticateRequest: (req: HttpRequest<any>) => observableOf(req),
    refreshToken: () => observableOf([undefined])
  };

  let authService: AuthService;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ security: securityReducer }),
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

  it('should attempt to authenticate all requests using the AuthService', () => {

    // spy on authService.authenticateRequest so we can make sure it is called
    spyOn(authService, 'authenticateRequest')
      .and.callThrough();

    // request a test endpoint
    httpClient.get('/test').subscribe(response => {
      // the fake request should complete
      expect(response).toBeTruthy();
      // the interceptor should have used the security service to auth the request
      expect(authService.authenticateRequest).toHaveBeenCalled();
    });

    // test call should return successfully
    const httpRequest = httpMock.expectOne('/test');
    httpRequest.flush({});

    // verify all requests have been completed
    httpMock.verify();

  });

  it('should refresh token and retry a request if it failed due to auth error', () => {

    // spy on store dispatch so we can see if actions are emitted
    spyOn(store, 'dispatch')
      .and.callThrough();

    // request a test endpoint
    httpClient.get('/test').subscribe(response => {
      expect(store.dispatch).toHaveBeenCalledWith(new RefreshAuthToken());
    });

    // first request, unauthorized
    const requestWithExpiredAuth = httpMock.expectOne('/test');
    requestWithExpiredAuth.error(new ErrorEvent('Unauthorized Error'), { status: 401 });

    // retry request, authorized
    const requestWithRenewedAuth = httpMock.expectOne('/test');
    requestWithRenewedAuth.flush({});

    // verify all requests have been completed
    httpMock.verify();

  });

});
