import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { UserService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private userSrv: UserService
  ) {}

  public canActivate(): Observable<boolean> {
    return this.userSrv.getUser().pipe(
      mapTo(true)
    );
  }

}
