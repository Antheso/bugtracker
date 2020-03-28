import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { ProjectsService } from './projects.service';

@Component({
  selector: 'bg-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {

  displayedColumns: string[] = ['projectId', 'projectName', 'description', 'private', 'projectRoleId'];
  dataSource = new MatTableDataSource(this.projectsSrv.projects$.getValue());
  projectRoles = this.projectsSrv.projectRoles$.getValue();

  constructor(
    private router: Router,
    private projectsSrv: ProjectsService
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openProject(projectId: string): void {
    this.router.navigateByUrl(`/watch-project/${projectId}`);
  }

  getRoleNameById(id: number): string {
    const role = this.projectRoles.find(item => item.projectRoleId === id);
    return role && role.projectRoleName;
  }

}
