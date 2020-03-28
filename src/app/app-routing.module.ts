import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { TicketComponent, TicketResolver } from './ticket';
import { IssuesComponent, IssuesResolver } from './issues';
import { RegistrationComponent } from './registration';
import { Page404Component } from './page404';
import { Page403Component } from './page403';
import { UserGuard, LoginGuard } from './core/guards';
import { ProjectsComponent, ProjectsResolver } from './projects';
import { ProjectComponent, ProjectResolver } from './project';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/issues'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      UserGuard,
      LoginGuard
    ]
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'issues',
    component: IssuesComponent,
    resolve: [ IssuesResolver ],
    canActivate: [UserGuard]
  },
  {
    path: 'create-ticket',
    component: TicketComponent,
    resolve: [ TicketResolver, ProjectsResolver ],
    canActivate: [UserGuard]
  },
  {
    path: 'watch-ticket/:ticketId',
    component: TicketComponent,
    resolve: [ TicketResolver, ProjectsResolver ],
    canActivate: [UserGuard],
    data: {
      readonly: true
    }
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [UserGuard],
    resolve: [ProjectsResolver]
  },
  {
    path: 'create-project',
    component: ProjectComponent,
    canActivate: [UserGuard],
    resolve: [ProjectResolver]
  },
  {
    path: 'watch-project/:projectId',
    component: ProjectComponent,
    canActivate: [UserGuard],
    resolve: [ProjectResolver],
    data: {
      readonly: true
    }
  },
  {
    path: 'page-403',
    component: Page403Component,
    canActivate: [UserGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: Page404Component,
    canActivate: [UserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
