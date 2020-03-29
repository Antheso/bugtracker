import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { UserService, IUser } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { PreloaderService } from '../preloader';

const TOKEN_KEY = 'jwt';

@Component({
  selector: 'bg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  linkSent = false;

  get userLoggedIn(): boolean {
    return this.cookieSrv.check(TOKEN_KEY);
  }

  get user(): IUser {
    return this.userSrv.user;
  }

  get username(): string {
    return this.userSrv.user && this.userSrv.user.firstName;
  }

  constructor(
    private cookieSrv: CookieService,
    private api: ApiService,
    private router: Router,
    private userSrv: UserService,
    private preloaderSrv: PreloaderService
  ) {}

  logout(event: MouseEvent): void {
    event.preventDefault();

    this.api.post('api/logout', null).subscribe(() => {
      this.userSrv.user$.next(void 0);
      this.router.navigateByUrl('/login');
    });
  }

  resendConfirmation(): void {
    this.preloaderSrv.isBusy$.next(true);
    this.api.get('api/resend-confirmation').subscribe(() => {
      this.preloaderSrv.isBusy$.next(false);
      this.linkSent = true;
    });
  }

}
