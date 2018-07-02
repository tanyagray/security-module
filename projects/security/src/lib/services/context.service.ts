import { Store } from '@ngrx/store';
import { RootState } from 'lib/store/store.index';
import * as Security from 'lib/store/security.selectors';
import { Injectable } from '@angular/core';

@Injectable()
export class ContextService {

  private _merchantId: number;

  public get merchantId(): number {
    return this._merchantId;
  }

  constructor(private store: Store<RootState>) {

    this.store.select(Security.getMerchantId)
      .subscribe(config => this._merchantId = config);

  }

}
