import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { securityReducer } from './store/security.reducer';
import { securityStorageReducer } from './store/security.storage';
import { AuthInterceptor } from './interceptors/auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthExpiredDialogModule } from './components/auth-expired-dialog/auth-expired-dialog.module';
import { AuthGuard } from './guards/auth.guard';
import { ContextService } from './services/context.service';
import { EffectsModule } from '@ngrx/effects';
import { SecurityEffects } from './store/security.effects';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { AuthService } from './services/auth.service';
import { SecurityConfig } from './security.config';

@NgModule({
  imports: [
    CommonModule,
    AuthExpiredDialogModule,
    StoreModule.forFeature('security', securityReducer, { metaReducers: securityStorageReducer }),
    EffectsModule.forFeature([SecurityEffects])
  ],
  providers: [
    AuthGuard,
    AuthService,
    ContextService,
  ],
  declarations: [],
})
export class SecurityModule {

  static forRoot(config: SecurityConfig): ModuleWithProviders {
    return {
      ngModule: SecurityModule,
      providers: [
        { provide: SecurityConfig, useValue: config },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ]
    };
  }

  constructor (@Optional() @SkipSelf() parentModule: SecurityModule) {
    if (parentModule) {
      throw new Error(
        'SecurityModule is already loaded. Import it in the AppModule only');
    }
  }

}
