import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'bg-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownComponent {

  @Input() text = '';

  get compiledText(): SafeHtml {
    if (!this.text) {
      return '';
    }

    return this.sanitizer.bypassSecurityTrustHtml(JSON.stringify(window['marked'](this.text)).replace(/\\n/g, '<br>').slice(1, -1));
  }

  constructor(
    private sanitizer: DomSanitizer
  ) { }

}
