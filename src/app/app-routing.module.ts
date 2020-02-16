import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { TicketComponent, TicketResolver } from './ticket';
import { IssuesComponent, IssuesResolver } from './issues';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
