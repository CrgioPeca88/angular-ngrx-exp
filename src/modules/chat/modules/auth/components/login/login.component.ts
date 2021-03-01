// Dependencies
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as Auth from '@chat/modules/auth/actions/auth.actions';

// Assets
import { IUser, iUserDefaultInstance } from '@core/interfaces/IUser.model';

@Component({
  selector: 'chat-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

  public user: IUser;
  public error$: any;
  public isLoading$: any;

  constructor(private store: Store<any>) {
    this.user = iUserDefaultInstance();
    this.error$ = this.store.select(state => state.auth.error);
    this.isLoading$ = this.store.select(state => state.auth.isLoading);
  }

  public login(): void {
    const clone = { user: Object.assign({}, this.user ) };
    this.store.dispatch(new Auth.LoginUser(clone));
  }

  public getCurrentState(): void {
    this.store.select(state => state.auth).subscribe(res => console.log("res state =>>>>>> ", res));
  }

}
