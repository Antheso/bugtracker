import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../core/services';
import { IFullUser } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    private api: ApiService
  ) { }

  register(user: IFullUser): Observable<IFullUser> {
    return this.api.post('api/registration', user);
  }

}
