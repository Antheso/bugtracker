import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from './api.service';

export interface IUser {
  firstName: string;
  userId: string;
  roleId: Roles;
}

export enum Roles {
  Guest,
  User,
  Admin
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user$ = new BehaviorSubject<IUser>(void 0);

  get user(): IUser {
    return this.user$.getValue();
  }

  constructor(
    private api: ApiService
  ) { }

  getUser(): Observable<IUser> {
    if (this.user) {
      return this.user$;
    }

    return this.fetchUser();
  }

  fetchUser(): Observable<IUser> {
    return this.api.get('api/cuser', void 0, () => of(void 0)).pipe(
      tap(user => this.user$.next(user))
    );
  }

}
