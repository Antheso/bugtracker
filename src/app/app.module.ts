import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login';
import {
   HeaderComponent,
   FooterComponent,
   ThemePickerComponent,
   ErrorComponent,
   PreloaderComponent
} from './core/components';
import { TicketComponent } from './ticket';
import { IssuesComponent } from './issues';
import { RegistrationComponent } from './registration';
import { Page404Component } from './page404';
import { Page403Component } from './page403';
import { SharedModule } from './shared/shared.module';

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      HeaderComponent,
      TicketComponent,
      FooterComponent,
      ThemePickerComponent,
      IssuesComponent,
      RegistrationComponent,
      Page404Component,
      Page403Component,
      ErrorComponent,
      PreloaderComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatInputModule,
      MatButtonModule,
      ReactiveFormsModule,
      MatAutocompleteModule,
      MatTableModule,
      MatCheckboxModule,
      MatIconModule,
      HttpClientModule,
      SharedModule,
      MatSelectModule,
      NgxMatSelectSearchModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
