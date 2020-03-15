import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { RegistrationService } from './registration.service';

@Component({
  selector: 'bg-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements AfterViewInit, OnDestroy {

  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl('', [Validators.required, this.matchValues('password')]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required])
  });

  private subs = new Subscription();

  get emailControl(): AbstractControl {
    return this.registrationForm.get('email');
  }

  get passwordControl(): AbstractControl {
    return this.registrationForm.get('password');
  }

  get passwordRepeatControl(): AbstractControl {
    return this.registrationForm.get('passwordRepeat');
  }

  get firstNameControl(): AbstractControl {
    return this.registrationForm.get('firstName');
  }

  get lastNameControl(): AbstractControl {
    return this.registrationForm.get('firstName');
  }

  constructor(
    private router: Router,
    private registerSrv: RegistrationService
  ) { }

  ngAfterViewInit(): void {
    this.subs.add(
      this.passwordControl.valueChanges.subscribe(
        () => this.passwordRepeatControl.updateValueAndValidity()
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  register(): void {
    this.registrationForm.markAllAsTouched();

    if (this.registrationForm.invalid && (this.registrationForm.dirty || this.registrationForm.touched)) {
      return;
    }

    this.registerSrv.register(this.registrationForm.value).subscribe(() => this.router.navigateByUrl('/'));
  }

  matchValues(matchTo: string): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent && !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
          ? null
          : { isMatching: true };
    };
  }

}
