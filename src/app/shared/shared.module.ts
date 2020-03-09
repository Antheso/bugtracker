import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkdownComponent } from './markdown';
import { SanitizerPipe } from './pipes';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MarkdownComponent,
    SanitizerPipe
  ],
  exports: [
    MarkdownComponent,
    SanitizerPipe
  ]
})
export class SharedModule { }
