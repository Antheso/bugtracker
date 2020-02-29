import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export type BgErrorCatch = (err: HttpErrorResponse) => Observable<any>;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public get(url: string, params: any = {}, catcher?: BgErrorCatch): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${url}`, { params }).pipe(
      catchError(err => this.errorCatch(err, catcher))
    );
  }

  public post(url: string, data: any, catcher?: BgErrorCatch): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${url}`, data).pipe(
      catchError(err => this.errorCatch(err, catcher))
    );
  }

  public patch(url: string, data: any, catcher?: BgErrorCatch): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/${url}`, data).pipe(
      catchError(err => this.errorCatch(err, catcher))
    );
  }

  public del(url: string, catcher?: BgErrorCatch): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/${url}`).pipe(
      catchError(err => this.errorCatch(err, catcher))
    );
  }

  private errorCatch(resp: HttpErrorResponse, catcher?: BgErrorCatch): Observable<any> {
    if (catcher) {
      return catcher(resp);
    }

    console.error(resp.error);
    switch (resp.status) {
      case 403:
        this.router.navigateByUrl('/login');

        return of(void 0);
      case 404:
        this.router.navigateByUrl('/page-404');

        return of(void 0);
      default:
        this.router.navigateByUrl('/page-500');

        return of(void 0);
    }
  }

}
