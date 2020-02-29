import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'bg-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent {

  @Input() text = '';

  get compiledText(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(window['marked'](this.text));
  }

  constructor(
    private sanitizer: DomSanitizer
  ) { }

}
