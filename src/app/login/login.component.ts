import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../core/services';
import { PreloaderService } from '../core/components';

@Component({
  selector: 'bg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private router: Router,
    private api: ApiService,
    private preloaderSrv: PreloaderService
  ) { }

  login(): void {
    this.preloaderSrv.isBusy$.next(true);
    this.api.post('api/login', this.loginForm.value).subscribe(() => {
      this.preloaderSrv.isBusy$.next(false);

      this.router.navigateByUrl('/');
    });
  }

}
