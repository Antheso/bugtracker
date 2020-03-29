import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

const TOKEN_KEY = 'jwt';

@Component({
  selector: 'bg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  get userLoggedIn(): boolean {
    return this.cookieSrv.check(TOKEN_KEY);
  }

  get username(): string {
    return this.userSrv.user && this.userSrv.user.firstName;
  }

  constructor(
    private cookieSrv: CookieService,
    private api: ApiService,
    private router: Router,
    private userSrv: UserService
  ) {}

  logout(event: MouseEvent): void {
    event.preventDefault();

    this.api.post('api/logout', null).subscribe(() => {
      this.userSrv.user$.next(void 0);
      this.router.navigateByUrl('/login');
    });
  }

}
