import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { ApiService } from '../../services';

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

  constructor(
    private cookieSrv: CookieService,
    private api: ApiService,
    private router: Router
  ) {}

  logout(event: MouseEvent): void {
    event.preventDefault();

    this.api.post('api/logout', null).subscribe(() => {
      this.cookieSrv.delete(TOKEN_KEY);
      this.router.navigateByUrl('/login');
    });
  }

}
