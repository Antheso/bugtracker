import {
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'bg-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownComponent {

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

    return window['marked'](this.text.replace(/\</g, '&lt;')).replace(/\n/g, '<br>');
  }

}
