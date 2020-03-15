import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../core/services';
import { IUser } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    private api: ApiService
  ) { }

  register(user: IUser): Observable<IUser> {
    return this.api.post('api/registration', user);
  }

}
