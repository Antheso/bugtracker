import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';

import { ProjectService } from './project.service';
import { IUser } from '../core/services';
import { IProjectRole } from '../projects';
import { IProject } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<Observable<[ IUser[], IProjectRole[] ] | [ IProject, IUser[], IProjectRole[] ]>> {

  constructor(
    private projectSrv: ProjectService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<[ IUser[], IProjectRole[] ] | [ IProject, IUser[], IProjectRole[] ]> {
    if (route.params.projectId) {
      return forkJoin(
        this.projectSrv.fetchProject(route.params.projectId),
        this.projectSrv.fetchUsers(),
        this.projectSrv.fetchRoles()
      );
    }

    return forkJoin(
      this.projectSrv.fetchUsers(),
      this.projectSrv.fetchRoles()
    );
  }

}
