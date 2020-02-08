import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { TicketComponent } from './ticket';
import { IssuesComponent } from './issues';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'issues',
    component: IssuesComponent,
  },
  {
    path: 'create-ticket',
    component: TicketComponent
  },
  {
    path: 'watch-ticket',
    component: TicketComponent,
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
