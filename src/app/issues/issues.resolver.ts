import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IssuesService } from './issues.service';
import { IIssue } from './issues.component';

@Injectable({
  providedIn: 'root'
})
export class IssuesResolver implements Resolve<Observable<IIssue[]>> {

  constructor(
    private issuesSrv: IssuesService
  ) {}

  resolve(): Observable<IIssue[]> {
    return this.issuesSrv.fetchIssues();
  }

}
