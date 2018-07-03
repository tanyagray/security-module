
import { first, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import * as Security from '../store/security.selectors';
import { RootState } from '../store/store.index';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private store: Store<RootState>) { }

  public canActivate(): Observable<boolean> {

    return this.store.select(Security.getAuthToken).pipe(
      map(token => !!token),
      first()
    );

  }
}
