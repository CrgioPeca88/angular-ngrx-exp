// Dependencies
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, exhaustMap, tap, catchError } from 'rxjs/operators';

// Assets
import {
  AuthActionTypes, LoggedIn,
  LoggedUser, Logout,
  LoginUser, LoginUserError } from '@chat/modules/auth/actions/auth.actions';
import { AuthService } from '@chat/modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthEffects {

  constructor(
    private httpClient: HttpClient,
    private actions$: Actions,
    private authService: AuthService
  ) {}

  @Effect()
  LoginUserError$: Observable<Action> = this.actions$.pipe(
    ofType<LoginUserError>(AuthActionTypes.LoginUserError),
    tap(lue => console.log("LoginAPI error effect", lue.payload)),
    map(data => {
      return { type: 'LOGIN_API_ERROR', payload: 'Email or password incorrect' };
    })
  );

  @Effect()
  LoginUser$: Observable<Action> = this.actions$.pipe(
    ofType<LoginUser>(AuthActionTypes.LoginUser),
    tap(lue => console.log("LoginUser effect ====>", lue.payload)),
    map(lue => lue.payload),
    exhaustMap(payload => {
      return this.authService.login(payload.user).pipe(
        map(response => new LoggedUser(response)),
        catchError(error => of(new LoginUserError(error)))
      )
    })
  );

  @Effect()
  LoggedUser$: Observable<Action> = this.actions$.pipe(
    ofType<LoggedUser>(AuthActionTypes.LoggedUser),
    tap(lu => console.log("LoggedUser effect", lu.payload)),
    map(lu => {
      return { type: '', payload: lu };
    })
  );

}
