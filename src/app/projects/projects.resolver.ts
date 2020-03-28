import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';

import { ProjectsService } from './projects.service';
import { ITableProject, IProjectRole } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProjectsResolver implements Resolve<Observable<[ ITableProject[], IProjectRole[] ]>> {

  constructor(
    private projectsSrv: ProjectsService
  ) {}

  resolve(): Observable<[ ITableProject[], IProjectRole[] ]> {
    return forkJoin(
      this.projectsSrv.fetchProjects(),
      this.projectsSrv.fetchRoles()
    );
  }

}
