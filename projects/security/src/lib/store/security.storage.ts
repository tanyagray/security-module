import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    rehydrate: true,
    keys: [
      'host',
      'authToken',
      'merchantIdOverride'
    ]
  })(reducer);
}

export const securityStorageReducer = [localStorageSyncReducer];
