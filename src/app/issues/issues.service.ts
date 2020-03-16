import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from '../core/services';
import { IIssue } from './issues.component';

const limit = 50;

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  public issuesList$ = new BehaviorSubject<IIssue[]>([]);

  get offset(): number {
    return this.issuesList$.getValue().length;
  }

  constructor(
    private api: ApiService
  ) { }

  fetchIssues(loadMore = false, searchQuery?: string): Observable<IIssue[]> {
    return this.api.get(`api/issues?offset=${loadMore ? this.offset : 0}&limit=${limit}${searchQuery ? '&searchQuery=' + searchQuery : ''}`).pipe(
      tap(data => this.issuesList$.next(loadMore ? [...this.issuesList$.getValue(), ...data] : data))
    );
  }

  deleteIssue(issueId: string): Observable<void> {
    return this.api.del(`api/issues/${issueId}`)
  }

}
