import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { ContextService } from 'lib/services/context.service';
import { RootState } from 'lib/store/store.index';
import { AuthGuard } from './auth.guard';
import { UpdateHostConfigAction, AuthFailedAction } from 'lib/store/security.actions';
import { AuthHostConfig } from 'lib/models/auth-host-config.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { securityReducer } from 'lib/store/security.reducer';

describe('Guard: AuthGuard', () => {

  const mockContextService = {
    setContext: () => {}
  };

  let guard: AuthGuard;
  let store: Store<RootState>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({security: securityReducer}),
        HttpClientTestingModule,
      ],
      providers: [
        AuthGuard,
        { provide: ContextService, useValue: mockContextService },
      ]
    });

    store = TestBed.get(Store);
    guard = TestBed.get(AuthGuard);
  });

  it('should return false if there is no token', (done) => {

    const action = new AuthFailedAction();
    store.dispatch(action);

    const canActivate = guard.canActivate();

    canActivate.subscribe(res => {
      expect(res).toBe(false);
      done();
    });

  });

  it('should return true if there is a token', (done) => {

    const payload: AuthHostConfig = {
      host: 'fake-host',
      authToken: {
        accessToken: 'fake-token'
      }
    };
    const action = new UpdateHostConfigAction(payload);
    store.dispatch(action);

    const canActivate = guard.canActivate();

    canActivate.subscribe(res => {
      expect(res).toBe(true);
      done();
    });

  });

});
