import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {
   MatInputModule,
   MatButtonModule,
   MatAutocompleteModule,
   MatTableModule,
   MatCheckboxModule,
   MatIconModule
} from '@angular/material';;

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login';
import {
   HeaderComponent,
   FooterComponent,
   ThemePickerComponent
} from './core/components';
import { TicketComponent } from './ticket';
import { IssuesComponent } from './issues';

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      HeaderComponent,
      TicketComponent,
      FooterComponent,
      ThemePickerComponent,
      IssuesComponent
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
      HttpClientModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
