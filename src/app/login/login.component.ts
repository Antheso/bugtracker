import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../core/services';
import { PreloaderService } from '../core/components';
import { of } from 'rxjs';

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
  error = '';

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
    this.error = '';

    if (this.loginForm.invalid && (this.loginForm.dirty || this.loginForm.touched)) {
      return;
    }

    this.preloaderSrv.isBusy$.next(true);
    this.api.post('api/login', this.loginForm.value, (err) => {
      this.error = err.error;
      this.passwordControl.reset();
      return of(void 0);
    }).subscribe((resp) => {
      this.preloaderSrv.isBusy$.next(false);

      if (resp) {
        this.router.navigateByUrl('/');
      }
    });
  }

}
