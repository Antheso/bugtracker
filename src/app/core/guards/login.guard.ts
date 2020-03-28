import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { mapTo, map, tap } from 'rxjs/operators';

import { UserService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private userSrv: UserService,
    private router: Router
  ) {}

  public canActivate(): Observable<boolean> {
    return this.userSrv.getUser().pipe(
      tap(user => {
        if (user) {
          this.router.navigateByUrl('/');
        }
      }),
      map(user => !user)
    );
  }

}
