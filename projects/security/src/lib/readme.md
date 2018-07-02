# Plexure Security

## SecurityModule [required]

Includes security-store and auth-interceptor.

```
// app.module.ts

import { SecurityModule } from '@plexure/security';

@NgModule({
    imports: [
        SecurityModule
    ]
})
```

### Security Store

Feature module for store. Persists auth data to localstorage.


### Auth Interceptor

Adds auth headers to each request. Attempts to re-auth if auth is expired.


## AuthGuard [optional]

Guard a route to ensure the user is authenticated before accessing.

```
// app.routing.ts

import { AuthGuard } from '@plexure/security';

const routes: Routes = [{
  path: '',
  canActivate: [AuthGuard],
  children: [
    ...
  ]
}];
```

## AuthExpired Popup [optional]

Can be used to block app from use when auth has expired.

```
// app.effects.ts

import { AuthExpiredDialogModule } from '@plexure/security';

```


