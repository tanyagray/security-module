import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from 'lib/services/auth.service';
import { HttpRequest, HttpHeaders } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { AuthToken } from '../models/auth-token.model';
import { of as observableOf } from 'rxjs';
import { SecurityConfig } from '../security.config';
import { mockSecurityConfig } from '../spec-helpers/mock-security-config';
import { StoreModule, Store } from '@ngrx/store';
import { securityReducer } from '../store/security.reducer';
import { RootState } from '../store/store.index';

describe('Service: Auth Service', () => {

  let authService: AuthService;
  let httpMock: HttpTestingController;
  let store: Store<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ security: securityReducer }),
      ],
      providers: [
        AuthService,
        { provide: SecurityConfig, useValue: mockSecurityConfig },
      ]
    });

    authService = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
    store = TestBed.get(Store);
  });


  describe('refreshToken', () => {

    it('should throw an error if there is no token to refresh', () => {

      expect(authService.refreshToken).toThrowError('No access token set to be refreshed');

    });

    it('should return the new token when refresh was successful', (done: Function) => {

      const oldToken: AuthToken = { accessToken: 'old-token' };
      const newToken: AuthToken = { accessToken: 'new-token' };

      // subscribe to the token refresh
      authService.refreshToken(oldToken)
        .subscribe(res => {
          expect(res).toEqual(newToken);
          done();
        });

      // request token refresh
      const refreshRequest = httpMock.expectOne(AuthService.authEndpoint);
      refreshRequest.flush({ access_token: newToken });

      // verify all requests have been completed
      httpMock.verify();

    });

  });


  describe('authenticateRequest', () => {

    it('should return an observable which completes after one emit', (done: Function) => {

      const request = new HttpRequest('GET', '/test', null, {
        headers: new HttpHeaders({'Authorization': 'Bearer existing-token'})
      });

      const authenticatedRequest = authService.authenticateRequest(request);

      authenticatedRequest.subscribe(req => {
        expect(req.headers.get('Authorization')).toBe('Bearer existing-token');
        done();
      });

    });

    it('should add auth token to unauthorized request', (done: Function) => {

      const fakeToken: AuthToken = { accessToken: 'fake-token' };
      spyOn(store, 'select').and.returnValue(
        observableOf(fakeToken)
      );

      const request = new HttpRequest('GET', '/test');

      const authenticatedRequest = authService.authenticateRequest(request);

      authenticatedRequest.subscribe(req => {
        expect(req.headers.get('Authorization')).toBe('Bearer fake-token');
        done();
      });

    });


    it('should not add token to already authorized request', (done: Function) => {

      const newToken: AuthToken = { accessToken: 'new-token' };
      spyOn(store, 'select').and.returnValue(
        observableOf(newToken)
      );

      const request = new HttpRequest('GET', '/test', null, {
        headers: new HttpHeaders({'Authorization': 'Bearer existing-token'})
      });

      const authenticatedRequest = authService.authenticateRequest(request);

      authenticatedRequest.subscribe(req => {
        expect(req.headers.get('Authorization')).toBe('Bearer existing-token');
        done();
      });

    });

  });

});
