import { Component } from '@angular/core';

import { ErrorService } from './error.service';

@Component({
  selector: 'bg-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

  get hasError(): boolean {
    return this.errorSrv.hasError;
  }

  constructor(
    private errorSrv: ErrorService
  ) { }

}
