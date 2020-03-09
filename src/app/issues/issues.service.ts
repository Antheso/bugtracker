import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from '../core/services';
import { IIssue } from './issues.component';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  public issuesList$ = new BehaviorSubject<IIssue[]>([]);

  constructor(
    private api: ApiService
  ) { }

  fetchIssues(): Observable<IIssue[]> {
    return this.api.get('api/issues').pipe(
      tap(data => this.issuesList$.next(data))
    );
  }

  deleteIssue(issueId: string): Observable<void> {
    return this.api.del(`api/issues/${issueId}`)
  }

}
