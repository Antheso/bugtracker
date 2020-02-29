import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { TicketComponent, TicketResolver } from './ticket';
import { IssuesComponent, IssuesResolver } from './issues';
import { RegistrationComponent } from './registration';
import { Page404Component } from './page404';
import { Page500Component } from './page500';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/issues'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'issues',
    component: IssuesComponent,
    resolve: [ IssuesResolver ]
  },
  {
    path: 'create-ticket',
    component: TicketComponent,
    resolve: [ TicketResolver ]
  },
  {
    path: 'watch-ticket/:ticketId',
    component: TicketComponent,
    resolve: [ TicketResolver ],
    data: {
      readonly: true
    }
  },
  {
    path: 'page-500',
    component: Page500Component
  },
  {
    path: '**',
    pathMatch: 'full',
    component: Page404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
