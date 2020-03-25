import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
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
    login: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get loginControl(): AbstractControl {
    return this.loginForm.get('login');
  }

  get passwordControl(): AbstractControl {
    return this.loginForm.get('password');
  }

  constructor(
    private router: Router,
    private api: ApiService,
    private preloaderSrv: PreloaderService
  ) { }

  login(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid && (this.loginForm.dirty || this.loginForm.touched)) {
      return;
    }

    this.preloaderSrv.isBusy$.next(true);
    this.api.post('api/login', this.loginForm.value).subscribe(() => {
      this.preloaderSrv.isBusy$.next(false);

      this.router.navigateByUrl('/');
    });
  }

}
