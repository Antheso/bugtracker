import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'bg-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {

  registrationForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl('', [Validators.required, this.matchValues('password')]),
    firstName: new FormControl(''),
    lastName: new FormControl('')
  });

  constructor(
    private router: Router
  ) { }

  register(): void {
    console.log(this.registrationForm.value);
    this.router.navigateByUrl('/');
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password').value;
    let confirmPass = group.get('passwordRepeat').value;

    return pass === confirmPass ? null : { notSame: true };
  }

  matchValues(matchTo: string): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent && !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
          ? null
          : { isMatching: false };
  };
}

}
