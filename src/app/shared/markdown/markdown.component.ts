import {
  Component,
  Input,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'bg-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownComponent {

  @ViewChild('container') public containerRef: ElementRef;
  private _text = '';

  @Input() set text(v: string) {
    this._text = v;
  };

  get text(): string {
    return this._text;
  }

  get compiledText(): string {
    if (!this.text) {
      return '';
    }

    return JSON.stringify(window['marked'](this.text.replace(/\</g, '&lt;'))).replace(/\\n/g, '<br>').slice(1, -1);
  }

}
