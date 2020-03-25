import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownComponent } from './markdown';
import { SanitizerPipe } from './pipes';
import { PermissionDirective } from './directives';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MarkdownComponent,
    SanitizerPipe,
    PermissionDirective
  ],
  exports: [
    MarkdownComponent,
    SanitizerPipe,
    PermissionDirective
  ]
})
export class SharedModule { }
