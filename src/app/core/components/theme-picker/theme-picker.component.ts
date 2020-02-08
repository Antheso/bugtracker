import { Component } from '@angular/core';

import { ThemeService, THEMES } from '../../services';

@Component({
  selector: 'bg-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent {

  public themes = THEMES;

  get themesList(): string[] {
    return Object.keys(THEMES);
  }

  constructor(
    private themeSrv: ThemeService
  ) { }

  selectTheme(key: string): void {
    this.themeSrv.currentTheme = key;
  }

}
