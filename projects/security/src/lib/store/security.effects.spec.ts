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
