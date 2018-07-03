import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of as observableOf } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { SecurityActions, RefreshAuthToken, AuthCompleteAction, AuthFailedAction } from './security.actions';
import { AuthService } from '../services/auth.service';
import { switchMap, catchError, map, withLatestFrom } from 'rxjs/operators';
import { getAuthToken } from './security.selectors';
import { RootState } from './store.index';

@Injectable()
export class SecurityEffects {

    @Effect()
    public refreshAuthToken$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshAuthToken>(SecurityActions.RefreshAuthToken),
        withLatestFrom(this.store.select(getAuthToken)),
        switchMap(([action, oldToken]) => {
            return this.authService.refreshToken(oldToken).pipe(
                map(res => new AuthCompleteAction(res)),
                catchError(() => observableOf(new AuthFailedAction()))
            );
        })
    );

    constructor(private actions$: Actions, private store: Store<RootState>, private authService: AuthService) { }
}
