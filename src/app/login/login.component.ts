import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  login(): void {
    console.log(this.loginForm.value);
    this.router.navigateByUrl('/');
  }

}
